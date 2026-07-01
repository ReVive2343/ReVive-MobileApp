import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Button, Icon, Text, useTheme } from 'react-native-paper';

export interface EmptyStateProps {
  /** Main heading label (e.g. 'No Donations Found') */
  title: string;
  /** Sub-text details explaining the state (e.g. 'Be the first to post a donation item!') */
  description: string;
  /** Icon name (MaterialCommunityIcons) to display (defaults to 'dropbox') */
  icon?: string;
  /** Text label for the action button */
  actionLabel?: string;
  /** Callback function when the action button is pressed */
  onActionPress?: () => void;
  /** Custom styles to apply to the container */
  style?: StyleProp<ViewStyle>;
  /** Optional custom accessibility label */
  accessibilityLabel?: string;
}

/**
 * EmptyState displays placeholder illustrations and action cues when lists or searches return empty.
 */
export const EmptyState: React.FC<EmptyStateProps> = React.memo(({
  title,
  description,
  icon = 'dropbox',
  actionLabel,
  onActionPress,
  style,
  accessibilityLabel,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[styles.container, style]}
      accessibilityLabel={accessibilityLabel || `${title}. ${description}`}
    >
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
        <Icon
          source={icon}
          size={48}
          color={theme.colors.onSurfaceVariant}
        />
      </View>

      <Text
        variant="titleMedium"
        style={[styles.title, { color: theme.colors.onSurface }]}
      >
        {title}
      </Text>

      <Text
        variant="bodyMedium"
        style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
      >
        {description}
      </Text>

      {actionLabel && onActionPress ? (
        <Button
          mode="contained"
          onPress={onActionPress}
          style={styles.button}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
          {actionLabel}
        </Button>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    textAlign: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    maxWidth: 280,
  },
  button: {
    borderRadius: 8,
    paddingHorizontal: 8,
  },
});

EmptyState.displayName = 'EmptyState';
