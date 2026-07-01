import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Avatar, Button, Card, Text, useTheme } from 'react-native-paper';

export interface ProfileCardProps {
  /** Display name of the user */
  name: string;
  /** URL for the user's avatar image */
  avatarUrl?: string;
  /** Email address of the user */
  email?: string;
  /** Phone number of the user */
  phone?: string;
  /** Total number of donations completed */
  donationCount?: number;
  /** Total number of requests/claims completed */
  requestCount?: number;
  /** Callback function triggered when the card's action button is pressed */
  onActionPress?: () => void;
  /** Text label for the action button (defaults to 'View Profile') */
  actionLabel?: string;
  /** Custom styles to apply to the card container */
  style?: StyleProp<ViewStyle>;
  /** Optional custom accessibility label */
  accessibilityLabel?: string;
}

/**
 * ProfileCard displays user profiles and statistics.
 * Shows user avatar (image or initials fallback), email/phone contact information,
 * summary counts (donations and requests), and a customizable action button.
 */
export const ProfileCard: React.FC<ProfileCardProps> = React.memo(({
  name,
  avatarUrl,
  email,
  phone,
  donationCount = 0,
  requestCount = 0,
  onActionPress,
  actionLabel = 'View Profile',
  style,
  accessibilityLabel,
}) => {
  const theme = useTheme();

  // Extract initials for Avatar placeholder
  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <Card
      style={[styles.card, style]}
      accessibilityLabel={accessibilityLabel || `Profile card for ${name}`}
    >
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          {avatarUrl ? (
            <Avatar.Image
              size={64}
              source={{ uri: avatarUrl }}
              style={styles.avatar}
            />
          ) : (
            <Avatar.Text
              size={64}
              label={getInitials(name)}
              style={[styles.avatar, { backgroundColor: theme.colors.primaryContainer }]}
              labelStyle={{ color: theme.colors.onPrimaryContainer }}
            />
          )}

          <View style={styles.info}>
            <Text variant="titleLarge" style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            {email ? (
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }} numberOfLines={1}>
                ✉️ {email}
              </Text>
            ) : null}
            {phone ? (
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }} numberOfLines={1}>
                📞 {phone}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={[styles.statsContainer, { borderTopColor: theme.colors.outlineVariant }]}>
          <View style={styles.statBox}>
            <Text variant="titleMedium" style={[styles.statValue, { color: theme.colors.primary }]}>
              {donationCount}
            </Text>
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Donations
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />
          <View style={styles.statBox}>
            <Text variant="titleMedium" style={[styles.statValue, { color: theme.colors.secondary }]}>
              {requestCount}
            </Text>
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Requests
            </Text>
          </View>
        </View>

        {onActionPress ? (
          <Button
            mode="outlined"
            onPress={onActionPress}
            style={styles.button}
            accessibilityRole="button"
            accessibilityLabel={`${actionLabel} for ${name}`}
          >
            {actionLabel}
          </Button>
        ) : null}
      </Card.Content>
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    elevation: 2,
    marginVertical: 8,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    marginRight: 16,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 12,
    marginBottom: 12,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  divider: {
    width: 1,
    height: 32,
  },
  button: {
    marginTop: 4,
    borderRadius: 8,
  },
});

ProfileCard.displayName = 'ProfileCard';
