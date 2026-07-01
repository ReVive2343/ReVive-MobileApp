import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Button, Icon, Text, useTheme } from 'react-native-paper';

export interface ErrorStateProps {
  /** The error description message to show (e.g. 'Failed to load details.') */
  message: string;
  /** Optional callback to trigger a retry of the failed operation */
  onRetry?: () => void;
  /** Label for the retry button (defaults to 'Retry') */
  retryLabel?: string;
  /** Icon name (MaterialCommunityIcons) representing the error (defaults to 'alert-circle-outline') */
  icon?: string;
  /** Custom styles to apply to the container */
  style?: StyleProp<ViewStyle>;
  /** Optional custom accessibility label */
  accessibilityLabel?: string;
}

/**
 * ErrorState provides standard visual rendering for API, network, or application crashes/failures.
 * Displays a warning/alert icon, explanatory text, and an action cue to retry the operation.
 */
export const ErrorState: React.FC<ErrorStateProps> = React.memo(({
  message,
  onRetry,
  retryLabel = 'Retry',
  icon = 'alert-circle-outline',
  style,
  accessibilityLabel,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[styles.container, style]}
      accessibilityLabel={accessibilityLabel || `Error: ${message}`}
    >
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.errorContainer }]}>
        <Icon
          source={icon}
          size={48}
          color={theme.colors.error}
        />
      </View>

      <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
        Something went wrong
      </Text>

      <Text variant="bodyMedium" style={[styles.message, { color: theme.colors.onSurfaceVariant }]}>
        {message}
      </Text>

      {onRetry ? (
        <Button
          mode="contained"
          buttonColor={theme.colors.error}
          textColor={theme.colors.onError}
          onPress={onRetry}
          style={styles.button}
          accessibilityRole="button"
          accessibilityLabel={retryLabel}
        >
          {retryLabel}
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
  message: {
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    maxWidth: 280,
  },
  button: {
    borderRadius: 8,
    paddingHorizontal: 12,
  },
});

ErrorState.displayName = 'ErrorState';
