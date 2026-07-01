import React from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Button, Card, Chip, Text, useTheme } from 'react-native-paper';

export interface DonationCardProps {
  /** The title of the donation item */
  title: string;
  /** Brief description of the item */
  description?: string;
  /** Image URL of the item */
  imageUrl?: string;
  /** Condition of the item (e.g., 'Like New', 'Good', 'Fair') */
  condition: string;
  /** Location or distance (e.g., 'Brooklyn, NY' or '1.5 miles away') */
  location: string;
  /** Name of the donor user */
  donorName: string;
  /** Timestamp or relative date (e.g., '2 hours ago') */
  createdAt: string;
  /** Callback function triggered when the card body is pressed */
  onPress: () => void;
  /** Callback function triggered when the primary card button is pressed */
  onActionPress?: () => void;
  /** Text label for the card action button (defaults to 'Request') */
  actionLabel?: string;
  /** Custom styles to apply to the card container */
  style?: StyleProp<ViewStyle>;
  /** Optional custom accessibility label */
  accessibilityLabel?: string;
}

/**
 * DonationCard displays reusable item postings in a rich card format.
 * Features an item image, condition chip, title, description preview, distance/location, and request trigger.
 */
export const DonationCard: React.FC<DonationCardProps> = React.memo(({
  title,
  description,
  imageUrl,
  condition,
  location,
  donorName,
  createdAt,
  onPress,
  onActionPress,
  actionLabel = 'Request',
  style,
  accessibilityLabel,
}) => {
  const theme = useTheme();

  return (
    <Card
      style={[styles.card, style]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || `${title} donation card, condition: ${condition}, location: ${location}`}
    >
      {imageUrl ? (
        <Card.Cover
          source={{ uri: imageUrl }}
          style={styles.cover}
          accessibilityLabel={`${title} image`}
        />
      ) : (
        <View style={[styles.placeholderCover, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
            No Image Available
          </Text>
        </View>
      )}

      <Card.Content style={styles.content}>
        <View style={styles.headerRow}>
          <Chip
            mode="flat"
            compact
            style={[styles.chip, { backgroundColor: theme.colors.primaryContainer }]}
            textStyle={[styles.chipText, { color: theme.colors.onPrimaryContainer }]}
          >
            {condition}
          </Chip>
          <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {createdAt}
          </Text>
        </View>

        <Text variant="titleMedium" style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        {description ? (
          <Text variant="bodyMedium" numberOfLines={2} style={styles.description}>
            {description}
          </Text>
        ) : null}

        <View style={styles.footerRow}>
          <View style={styles.metaCol}>
            <Text variant="labelSmall" numberOfLines={1} style={{ color: theme.colors.onSurfaceVariant }}>
              📍 {location}
            </Text>
            <Text variant="labelSmall" numberOfLines={1} style={{ color: theme.colors.onSurfaceVariant }}>
              👤 By {donorName}
            </Text>
          </View>

          {onActionPress ? (
            <Button
              mode="contained-tonal"
              compact
              onPress={(e) => {
                e.stopPropagation(); // Prevent card onPress from firing
                onActionPress();
              }}
              style={styles.actionButton}
              labelStyle={styles.actionButtonLabel}
              accessibilityLabel={`${actionLabel} ${title}`}
            >
              {actionLabel}
            </Button>
          ) : null}
        </View>
      </Card.Content>
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  cover: {
    height: 160,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  placeholderCover: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chip: {
    borderRadius: 6,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 10,
    fontWeight: 'bold',
    lineHeight: 14,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    marginBottom: 12,
    lineHeight: 18,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 4,
  },
  metaCol: {
    flex: 1,
    gap: 4,
    marginRight: 8,
  },
  actionButton: {
    borderRadius: 8,
  },
  actionButtonLabel: {
    fontSize: 12,
    paddingHorizontal: 4,
  },
});

DonationCard.displayName = 'DonationCard';
