import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Keyboard, Pressable, StyleSheet, View } from 'react-native';
import { Snackbar, Text, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { SearchInput } from '@/components/forms';
import { DonationCard } from '@/components/cards';
import { EmptyState } from '@/components/common';
import { Loading } from '@/components/common/Loading';

import { ROUTES } from '@/constants/routes';
import { mockRecentSearches } from '@/mock/searches';
import { donationService } from '@/services';
import type { Donation } from '@/types/donation';
import type { SearchHistory } from '@/types/search';

const RECENT_SEARCHES_KEY = 'revive_recent_searches_v1';

function clampRecentSearches(items: SearchHistory[], max = 8): SearchHistory[] {
  return items
    .slice()
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, max);
}

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

export default function SearchScreen() {
  const theme = useTheme();
  const router = useRouter();

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);

  const [recentSearches, setRecentSearches] = useState<SearchHistory[]>([]);
  const [recentLoading, setRecentLoading] = useState(true);

  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const snackbarText = useMemo(() => 'Searching…', []);

  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const loadRecentSearches = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (!raw) {
        setRecentSearches(mockRecentSearches);
        return;
      }
      const parsed = JSON.parse(raw) as SearchHistory[];
      setRecentSearches(clampRecentSearches(parsed));
    } catch {
      setRecentSearches(mockRecentSearches);
    } finally {
      if (isMounted.current) setRecentLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecentSearches();
  }, [loadRecentSearches]);

  const persistRecentSearches = useCallback(async (next: SearchHistory[]) => {
    const clamped = clampRecentSearches(next);
    setRecentSearches(clamped);
    try {
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(clamped));
    } catch {
      // no-op; recent search persistence is non-critical.
    }
  }, []);

  const addToRecentSearches = useCallback(
    async (q: string) => {
      const trimmed = q.trim();
      if (!trimmed) return;

      const nextItem: SearchHistory = {
        id: `rs_${trimmed}_${Date.now()}`,
        query: trimmed,
        timestamp: Date.now(),
      };

      const merged = [
        ...recentSearches.filter((s) => s.query.toLowerCase() !== trimmed.toLowerCase()),
        nextItem,
      ];
      await persistRecentSearches(merged);
    },
    [persistRecentSearches, recentSearches],
  );

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const q = debouncedQuery.trim();
      setErrorMessage(null);

      if (!q) {
        setDonations([]);
        return;
      }

      setLoading(true);
      setSnackbarVisible(true);

      try {
        const results = await donationService.search(q);
        if (cancelled || !isMounted.current) return;
        setDonations(results);
        await addToRecentSearches(q);
      } catch {
        if (cancelled || !isMounted.current) return;
        setDonations([]);
        setErrorMessage('Failed to load search results.');
      } finally {
        if (cancelled || !isMounted.current) return;
        setLoading(false);
        setSnackbarVisible(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [addToRecentSearches, debouncedQuery]);

  const emptyState = (
    <EmptyState
      title={errorMessage ? 'Something went wrong' : 'No donations found'}
      description={
        errorMessage
          ? errorMessage
          : query.trim()
            ? 'Try a different search term.'
            : 'Search for donations or pick from your recent searches.'
      }
      icon={errorMessage ? 'alert-circle-outline' : undefined}
    />
  );

  const renderRecentSearch = ({ item }: { item: SearchHistory }) => {
    return (
      <Pressable
style={[styles.recentChip, { backgroundColor: theme.colors.surfaceVariant }] }
        onPress={() => {
          Keyboard.dismiss();
          setQuery(item.query);
        }}
        accessibilityRole="button"
        accessibilityLabel={`Recent search: ${item.query}`}
      >
        <Text variant="labelLarge" style={{ color: theme.colors.onSurface }}>
          {item.query}
        </Text>
      </Pressable>
    );
  };

  const donationList = (
    <FlatList
      data={donations}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      keyboardShouldPersistTaps="handled"
      renderItem={({ item }) => {
        return (
          <DonationCard
            title={item.title}
            description={item.description}
            imageUrl={item.imageUrls[0]}
            condition={item.condition}
            location={item.location}
            donorName={donationService.getDonorName(item.donorId)}
            createdAt={item.createdAt}
onPress={() => router.push(`/donation/${item.id}` as unknown as never)}
          />
        );
      }}
      ListFooterComponent={<View style={{ height: 24 }} />}
    />
  );

  return (
    <SafeAreaWrapper>
      <ScreenContainer scrollable>
        <View style={styles.container}>
          <SearchInput value={query} onChangeText={setQuery} />

          {query.trim().length === 0 ? (
            <View style={styles.section}>
              <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                Recent searches
              </Text>
              {recentLoading ? (
                <Loading text="Loading recent searches…" />
              ) : (
                <FlatList
                  data={recentSearches}
                  keyExtractor={(item) => item.id}
                  renderItem={renderRecentSearch}
                  horizontal
                  contentContainerStyle={styles.recentRow}
                  showsHorizontalScrollIndicator={false}
                />
              )}

              <Text
                variant="bodyMedium"
                style={[styles.sectionHint, { color: theme.colors.onSurfaceVariant }]}
              >
                Type to filter donations.
              </Text>
            </View>
          ) : null}

          {loading ? (
            <Loading text="Searching donations…" />
          ) : donations.length > 0 ? (
            donationList
          ) : (
            // If query is set and no results -> show empty state.
            // If query is empty -> emptyState is not needed (recent searches section handles it).
            query.trim().length > 0 ? emptyState : null
          )}

          <Snackbar
            visible={snackbarVisible}
            onDismiss={() => setSnackbarVisible(false)}
            duration={500}
          >
            {snackbarText}
          </Snackbar>
        </View>
      </ScreenContainer>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 12,
  },
  sectionHint: {
    marginTop: 12,
    lineHeight: 18,
  },
  recentRow: {
    paddingVertical: 4,
  },
  recentChip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingTop: 8,
  },
});

