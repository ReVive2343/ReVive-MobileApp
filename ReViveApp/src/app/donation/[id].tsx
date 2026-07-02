import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, RefreshControl, ScrollView, Share, StyleSheet, View } from 'react-native';
import { Button, Snackbar, Text, useTheme } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { Loading } from '@/components/common/Loading';
import { EmptyState } from '@/components/common/EmptyState';
import { donationService } from '@/services';
import type { Donation } from '@/types/donation';

type SnackbarState = { visible: boolean; message: string };

type DonationIdParam = string | string[] | undefined;

function normalizeDonationId(param: DonationIdParam): string | null {
  if (!param) return null;
  if (Array.isArray(param)) return param[0] ?? null;
  return param;
}

export default function DonationDetailsScreen() {
  const theme = useTheme();
  const router = useRouter();

  const params = useLocalSearchParams();
  const donationId = normalizeDonationId(params.id as DonationIdParam);

  const [donation, setDonation] = useState<Donation | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [snackbar, setSnackbar] = useState<SnackbarState>({ visible: false, message: '' });

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadDonation = useCallback(async (silent?: boolean) => {
    if (!donationId) {
      setErrorMessage('Donation not found.');
      setDonation(null);
      setLoading(false);
      return;
    }

    if (!silent) {
      setLoading(true);
      setErrorMessage(null);
    }

    try {
      const result = await donationService.getById(donationId);
      if (!mountedRef.current) return;

      if (!result) {
        setDonation(null);
        setErrorMessage('Donation not found.');
      } else {
        setDonation(result);
        setErrorMessage(null);
      }
    } catch {
      if (!mountedRef.current) return;
      setDonation(null);
      setErrorMessage('Failed to load donation details.');
    } finally {
      if (!mountedRef.current) return;
      if (!silent) setLoading(false);
    }
  }, [donationId]);

  useEffect(() => {
    loadDonation();
  }, [loadDonation]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadDonation(true);
    } finally {
      if (mountedRef.current) setRefreshing(false);
    }
  }, [loadDonation]);

  const images = useMemo(() => {
    if (!donation?.imageUrls?.length) return [];
    return donation.imageUrls.filter(Boolean);
  }, [donation]);

  const donorName = useMemo(() => {
    if (!donation) return '';
    return donationService.getDonorName(donation.donorId);
  }, [donation]);

  const mainImage = images[0];

  const headerHeight = useMemo(() => Math.min(320, Math.max(220, Dimensions.get('window').width * 0.72)), []);

  const onRequestDonation = useCallback(() => {
    // Temporary UI-only behavior until requestService exists.
    setSnackbar({ visible: true, message: 'Donation request submitted (mock).' });
  }, []);

  const onShare = useCallback(async () => {
    if (!donation) return;

    const shareText = `${donation.title} - ${donation.description}`;
    try {
      await Share.share({ message: shareText });
      setSnackbar({ visible: true, message: 'Shared successfully.' });
    } catch {
      setSnackbar({ visible: true, message: 'Unable to share.' });
    }
  }, [donation]);

  const onReport = useCallback(() => {
    // Temporary UI-only behavior.
    setSnackbar({ visible: true, message: 'Report received (mock).' });
  }, []);

  const content = useMemo(() => {
    if (loading) {
      return <Loading text="Loading donation…" />;
    }

    if (errorMessage || !donation) {
      return (
        <EmptyState
          title={errorMessage ? 'Something went wrong' : 'Donation not found'}
          description={errorMessage ? errorMessage : 'This donation may have been removed.'}
          icon={errorMessage ? 'alert-circle-outline' : undefined}
        />
      );
    }

    return (
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        keyboardShouldPersistTaps="handled"
      >
        {mainImage ? (
          <View style={[styles.hero, { height: headerHeight }]}> 
            <Image
              source={{ uri: mainImage }}
              style={styles.heroImage}
              contentFit="cover"
              transition={300}
              accessibilityLabel="Donation image"
            />
          </View>
        ) : null}

        {images.length > 1 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbRow}>
            {images.map((uri, idx) => (
              <Image
                key={`${donation.id}_thumb_${idx}`}
                source={{ uri }}
                style={styles.thumb}
                contentFit="cover"
                accessibilityLabel={`Donation image ${idx + 1}`}
              />
            ))}
          </ScrollView>
        ) : null}

        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.title}>
            {donation.title}
          </Text>

          <Text variant="bodyMedium" style={[styles.subtleText, { marginTop: 10 }]}> 
            {donation.description}
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <Text variant="labelSmall" style={styles.metaLabel}>
                Condition
              </Text>
              <Text variant="bodyMedium" style={styles.metaValue}>
                {donation.condition}
              </Text>
            </View>

            <View style={styles.metaItem}>
              <Text variant="labelSmall" style={styles.metaLabel}>
                Availability
              </Text>
              <Text variant="bodyMedium" style={styles.metaValue}>
                {donation.availability}
              </Text>
            </View>
          </View>

          <Text variant="labelSmall" style={[styles.metaLabel, { marginTop: 16 }]}>
            Pickup location
          </Text>
          <Text variant="bodyMedium" style={styles.metaValue}>
            {donation.location}
          </Text>

          <Text variant="labelSmall" style={[styles.metaLabel, { marginTop: 16 }]}>
            Pickup instructions
          </Text>
          <Text variant="bodyMedium" style={styles.metaValue}>
            {donation.pickupInstructions}
          </Text>
        </View>

        <View style={styles.section}>
          <Text variant="labelSmall" style={styles.metaLabel}>
            Posted
          </Text>
          <Text variant="bodyMedium" style={styles.metaValue}>
            {donation.createdAt}
          </Text>

          <Text variant="labelSmall" style={[styles.metaLabel, { marginTop: 16 }]}>
            Donor
          </Text>
          <Text variant="bodyMedium" style={styles.metaValue}>
            {donorName}
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={onRequestDonation}
            disabled={donation.availability !== 'available'}
            accessibilityLabel="Request donation"
            style={styles.actionButton}
          >
            Request Donation
          </Button>

          <View style={styles.secondaryRow}>
            <Button
              mode="outlined"
              onPress={onShare}
              accessibilityLabel="Share donation"
              style={styles.actionButtonSecondary}
            >
              Share
            </Button>

            <Button
              mode="outlined"
              onPress={onReport}
              accessibilityLabel="Report donation"
              style={styles.actionButtonSecondary}
            >
              Report
            </Button>
          </View>
        </View>

        <View style={{ height: 28 }} />
      </ScrollView>
    );
  }, [
    donation,
    donorName,
    errorMessage,
    headerHeight,
    images,
    loading,
    mainImage,
    refreshing,
    onRefresh,
    onReport,
    onRequestDonation,
    onShare,
  ]);

  return (
    <SafeAreaWrapper>
      <ScreenContainer scrollable={false}>
        <View style={styles.container}>
          {content}
          <Snackbar
            visible={snackbar.visible}
            duration={2500}
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
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    flexGrow: 1,
    backgroundColor: 'transparent',
  },
  hero: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 14,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  thumbRow: {
    marginBottom: 12,
  },
  thumb: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 10,
    overflow: 'hidden',
  },
  section: {
    marginBottom: 14,
  },
  title: {
    fontWeight: '900',
  },
  subtleText: {
    lineHeight: 20,
  },
  metaGrid: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  metaItem: {
    flex: 1,
    minWidth: 140,
  },
  metaLabel: {
    fontWeight: '700',
    opacity: 0.8,
  },
  metaValue: {
    marginTop: 6,
    lineHeight: 20,
  },
  actions: {
    marginTop: 8,
  },
  actionButton: {
    borderRadius: 10,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  actionButtonSecondary: {
    flex: 1,
    borderRadius: 10,
  },
});

