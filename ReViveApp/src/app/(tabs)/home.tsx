import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, RefreshControl, ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { Avatar, Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { SearchInput } from '@/components/forms/SearchInput';
import { CategoryCard } from '@/components/cards/CategoryCard';
import { DonationCard } from '@/components/cards/DonationCard';
import { Loading } from '@/components/common/Loading';
import { EmptyState } from '@/components/common/EmptyState';
import { mockDonations } from '@/mock/donations';
import { mockCategories } from '@/mock/categories';
import { currentUser } from '@/mock/users';
import { ROUTES } from '@/constants/routes';

/**
 * Home Screen
 * Displays welcome messages, categories, featured/latest donations, and handles search redirection.
 */
export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();

  // Screen States
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [featuredDonations, setFeaturedDonations] = useState<typeof mockDonations>([]);
  const [latestDonations, setLatestDonations] = useState<typeof mockDonations>([]);

  // Simulate loading data
  const loadData = async (showSpinner = true) => {
    if (showSpinner) setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Filter out completed items for main feed to only show available ones
      const availableDonations = mockDonations.filter(d => d.availability === 'available');
      
      // Set featured donations (first 3) and latest (remaining)
      setFeaturedDonations(availableDonations.slice(0, 3));
      setLatestDonations(availableDonations.slice(3));
    } catch (error) {
      console.error('Home Screen: Failed to load donations', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadData(false);
  }, []);

  const handleSearchFocus = () => {
    // Redirect to search screen
    router.push('/search');
  };

  const handleCategoryPress = (categoryId: string) => {
    router.push({
      pathname: '/categories',
      params: { categoryId }
    });
  };

  const handleDonationPress = (id: string) => {
    // Navigate to dynamic details page
    // Using string template `/donation/${id}` matching routes constant path structure
    router.push(`/donation/${id}`);
  };

  if (isLoading) {
    return (
      <SafeAreaWrapper>
        <Loading text="Loading your feed..." />
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper style={styles.safeArea}>
      <ScreenContainer style={styles.container} avoidKeyboard={false}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome Header */}
          <View style={styles.welcomeSection}>
            <View style={styles.welcomeTextContainer}>
              <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
                Hello,
              </Text>
              <Text variant="headlineSmall" style={[styles.userName, { color: theme.colors.onSurface }]}>
                {currentUser.name} 👋
              </Text>
            </View>
            {currentUser.avatarUrl ? (
              <Avatar.Image size={48} source={{ uri: currentUser.avatarUrl }} />
            ) : (
              <Avatar.Text size={48} label={currentUser.name[0]} />
            )}
          </View>

          {/* Search Bar Redirect Pressable */}
          <Pressable onPress={handleSearchFocus} style={styles.searchPressable}>
            <View pointerEvents="none">
              <SearchInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search donation items..."
              />
            </View>
          </Pressable>

          {/* Categories Horizontal Scroll */}
          <View style={styles.sectionHeader}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Categories
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {mockCategories.map((item) => (
              <CategoryCard
                key={item.id}
                label={item.name}
                icon={item.icon}
                onPress={() => handleCategoryPress(item.id)}
              />
            ))}
          </ScrollView>

          {/* Featured Section */}
          {featuredDonations.length > 0 ? (
            <View>
              <View style={styles.sectionHeader}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Featured Donations
                </Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.featuredScroll}
              >
                {featuredDonations.map((item) => (
                  <DonationCard
                    key={item.id}
                    title={item.title}
                    description={item.description}
                    imageUrl={item.imageUrls[0]}
                    condition={item.condition}
                    location={item.location}
                    donorName="ReVive User" // anonymous view mapping
                    createdAt={item.createdAt}
                    onPress={() => handleDonationPress(item.id)}
                    style={styles.featuredCard}
                  />
                ))}
              </ScrollView>
            </View>
          ) : null}

          {/* Latest Section */}
          <View style={styles.sectionHeader}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Latest Items
            </Text>
          </View>

          {latestDonations.length === 0 ? (
            <EmptyState
              title="No items found"
              description="Check back later or pull down to refresh the feed!"
              icon="dropbox"
              actionLabel="Refresh Feed"
              onActionPress={onRefresh}
            />
          ) : (
            <View style={styles.latestList}>
              {latestDonations.map((item) => (
                <DonationCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  imageUrl={item.imageUrls[0]}
                  condition={item.condition}
                  location={item.location}
                  donorName="ReVive User"
                  createdAt={item.createdAt}
                  onPress={() => handleDonationPress(item.id)}
                  onActionPress={() => handleDonationPress(item.id)}
                  actionLabel="Details"
                />
              ))}
            </View>
          )}
        </ScrollView>
      </ScreenContainer>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 16,
  },
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  welcomeTextContainer: {
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
  },
  searchPressable: {
    marginBottom: 16,
  },
  sectionHeader: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  categoriesScroll: {
    paddingRight: 16,
    paddingBottom: 8,
  },
  featuredScroll: {
    paddingRight: 16,
    paddingBottom: 8,
  },
  featuredCard: {
    width: 280,
    marginRight: 12,
    marginVertical: 4,
  },
  latestList: {
    paddingBottom: 24,
  },
});
