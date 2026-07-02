import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Keyboard, Pressable, RefreshControl, StyleSheet, View } from 'react-native';

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
  const [refreshing, setRefreshing] = useState(false);

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
        setRecentSearches([]);
        return;
      }
      const parsed = JSON.parse(raw) as SearchHistory[];
      setRecentSearches(clampRecentSearches(parsed));
    } catch {
      setRecentSearches([]);
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

  const runSearch = useCallback(
    async (nextQuery: string, options?: { silent?: boolean }) => {
      const q = nextQuery.trim();
      setErrorMessage(null);

      if (!q) {
        setDonations([]);
        return;
      }

      const silent = options?.silent ?? false;

      if (!silent) {
        setLoading(true);
        setSnackbarVisible(true);
      }

      try {
        const results = await donationService.search(q);
        if (!isMounted.current) return;
        setDonations(results);
        // Only store non-empty queries.
        await addToRecentSearches(q);
      } catch {
        if (!isMounted.current) return;
        setDonations([]);
        setErrorMessage('Failed to load search results.');
      } finally {
        if (!isMounted.current) return;
        if (!silent) {
          setLoading(false);
          setSnackbarVisible(false);
        }
      }
    },
    [addToRecentSearches],
  );

  useEffect(() => {
    runSearch(debouncedQuery);
  }, [debouncedQuery, runSearch]);


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

  const clearRecentSearches = useCallback(async () => {
    setRecentSearches([]);
    try {
      await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // no-op
    }
  }, []);

  const onRefresh = useCallback(async () => {
    const q = query.trim();
    if (!q) {
      // Nothing to refresh when there is no query.
      return;
    }
    setRefreshing(true);
    try {
      await runSearch(q, { silent: true });
    } finally {
      if (isMounted.current) setRefreshing(false);
    }
  }, [query, runSearch]);

  const donationList = (
    <FlatList
      data={donations}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      keyboardShouldPersistTaps="handled"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
            onPress={() => router.push(ROUTES.DONATION.DETAILS(item.id) as any)}
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
                <>
                  {recentSearches.length > 0 ? (
                    <View style={styles.recentHeaderRow}>
                      <Text
                        variant="bodyMedium"
                        style={[styles.sectionHint, { color: theme.colors.onSurfaceVariant, marginTop: 0 }]}
                      >
                        Recent searches
                      </Text>
                      <Pressable
                        onPress={clearRecentSearches}
                        accessibilityRole="button"
                        accessibilityLabel="Clear all recent searches"
                      >
                        <Text
                          variant="labelLarge"
                          style={{ color: theme.colors.primary, fontWeight: '700' }}
                        >
                          Clear All
                        </Text>
                      </Pressable>
                    </View>
                  ) : (
                    <Text
                      variant="bodyMedium"
                      style={[styles.sectionHint, { color: theme.colors.onSurfaceVariant }]}
                    >
                      No recent searches yet.
                    </Text>
                  )}

                  {recentSearches.length > 0 ? (
                    <FlatList
                      data={recentSearches}
                      keyExtractor={(item) => item.id}
                      renderItem={renderRecentSearch}
                      horizontal
                      contentContainerStyle={styles.recentRow}
                      showsHorizontalScrollIndicator={false}
                    />
                  ) : null}
                </>
              )}

              {recentSearches.length > 0 ? (
                <Text
                  variant="bodyMedium"
                  style={[styles.sectionHint, { color: theme.colors.onSurfaceVariant }]}
                >
                  Type to filter donations.
                </Text>
              ) : null}

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
  recentHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 0,
    marginBottom: 10,
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

