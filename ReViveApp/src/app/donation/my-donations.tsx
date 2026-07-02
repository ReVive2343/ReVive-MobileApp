import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Snackbar, Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SegmentedButtons } from 'react-native-paper';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { Header } from '@/components/layout/Header';
import { DonationCard } from '@/components/cards';
import { EmptyState } from '@/components/common/EmptyState';
import { Loading } from '@/components/common/Loading';
import { ROUTES } from '@/constants/routes';
import { donationService } from '@/services';
import type { Donation } from '@/types/donation';

type DonationTabKey = 'available' | 'requested' | 'completed';

type SnackbarState = { visible: boolean; message: string };

type DonationLikeStatus = Donation['availability'];

const TAB_OPTIONS: Array<{ key: DonationTabKey; label: string }> = [
  { key: 'available', label: 'Available' },
  { key: 'requested', label: 'Requested' },
  { key: 'completed', label: 'Completed' },
];

function getTabKeyFromAvailability(status: DonationLikeStatus): DonationTabKey {
  switch (status) {
    case 'available':
      return 'available';
    case 'requested':
      return 'requested';
    case 'completed':
      return 'completed';
    default:
      return 'available';
  }
}

function normalizeDonationList(data: Donation[]): Donation[] {
  return Array.isArray(data) ? data : [];
}

export default function MyDonationsScreen() {
  const theme = useTheme();
  const router = useRouter();

  const [tab, setTab] = useState<DonationTabKey>('available');

  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [snackbar, setSnackbar] = useState<SnackbarState>({ visible: false, message: '' });

  // NOTE: donationService.getByDonor expects a donorId.
  // This app currently has no accessible "current user id" API in the allowed inspection surface.
  // We therefore use a safe fallback donorId to avoid introducing new architecture.
  const donorIdFallback = 'user_1';

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadMyDonations = useCallback(async (silent?: boolean) => {
    try {
      if (!silent) {
        setLoading(true);
      }

      const result = await donationService.getByDonor(donorIdFallback);
      if (!mountedRef.current) return;

      setDonations(normalizeDonationList(result));
    } catch {
      if (!mountedRef.current) return;
      setDonations([]);
    } finally {
      if (!mountedRef.current) return;
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMyDonations();
  }, [loadMyDonations]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadMyDonations(true);
    } finally {
      if (mountedRef.current) setRefreshing(false);
    }
  }, [loadMyDonations]);

  const tabbedDonations = useMemo(() => {
    return donations.filter((d) => getTabKeyFromAvailability(d.availability) === tab);
  }, [donations, tab]);

  const disabledFeatureAction = useCallback((label: string) => {
    setSnackbar({ visible: true, message: `${label} - This feature will be enabled after backend integration.` });
  }, []);

  const renderCard = useCallback(
    (item: Donation) => {
      const donorName = donationService.getDonorName(item.donorId);
      const imageUrl = item.imageUrls?.[0];

      const commonProps = {
        title: item.title,
        description: item.description,
        imageUrl,
        condition: item.condition,
        location: item.location,
        donorName,
        createdAt: item.createdAt,
        onPress: () => router.push(ROUTES.DONATION.DETAILS(item.id) as never),

      };

      if (tab === 'available') {
        return (
          <DonationCard
            {...commonProps}
            actionLabel="Requested"
            onActionPress={() => disabledFeatureAction('Mark as Requested')}
          />
        );
      }

      if (tab === 'requested') {
        return (
          <DonationCard
            {...commonProps}
            actionLabel="Completed"
            onActionPress={() => disabledFeatureAction('Mark as Completed')}
          />
        );
      }

      // completed
      return (
        <DonationCard
          {...commonProps}
          // Disable action for completed items (View Details via card press)
        />
      );
    },
    [disabledFeatureAction, router, tab],
  );

  const tabButtons = useMemo(() => {
    return TAB_OPTIONS.map((opt) => ({
      value: opt.key,
      label: opt.label,
    }));
  }, []);

  const emptyState = useMemo(() => {
    const label = TAB_OPTIONS.find((o) => o.key === tab)?.label ?? 'Donations';
    return (
      <EmptyState
        title={`No ${label.toLowerCase()} donations`}
        description="You don’t have any items in this category yet."
        icon="dropbox"
      />
    );
  }, [tab]);

  const content = useMemo(() => {
    if (loading) return <Loading text="Loading your donations…" />;

    if (tabbedDonations.length === 0) return emptyState;

    return (
      <ScrollView contentContainerStyle={styles.listContent}>
        {tabbedDonations.map((item) => (
          <View key={item.id}>{renderCard(item)}</View>
        ))}
        <View style={{ height: 24 }} />
      </ScrollView>
    );
  }, [emptyState, loading, renderCard, tabbedDonations]);

  return (
    <SafeAreaWrapper>
      <ScreenContainer scrollable>
        <View style={styles.container}>
          <Header title="My Donations" subtitle="Manage your posted items" />

          <View style={styles.segmentWrapper}>
            <SegmentedButtons
              value={tab}
              onValueChange={(v) => setTab(v as DonationTabKey)}
              buttons={tabButtons}
            />
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollInner}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          >
            {content}
          </ScrollView>

          <Snackbar
            visible={snackbar.visible}
            duration={4000}
            onDismiss={() => setSnackbar((s) => ({ ...s, visible: false }))}
          >
            {snackbar.message}
          </Snackbar>
        </View>
      </ScreenContainer>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  segmentWrapper: {
    marginTop: 12,
  },
  scroll: {
    flex: 1,
    marginTop: 8,
  },
  scrollInner: {
    flexGrow: 1,
    paddingBottom: 12,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 16,
  },
});

