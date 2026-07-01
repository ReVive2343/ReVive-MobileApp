import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';

export interface LoadingProps {
  /** Optional descriptive text to show beneath the spinner */
  text?: string;
  /** Size of the spinner (defaults to 'large') */
  size?: 'small' | 'large' | number;
  /** Custom spinner color (defaults to primary theme color) */
  color?: string;
  /** If true, renders a full-screen modal overlay with a semi-transparent backdrop */
  overlay?: boolean;
  /** Custom styles to apply to the container view */
  style?: StyleProp<ViewStyle>;
  /** Optional custom accessibility label */
  accessibilityLabel?: string;
}

/**
 * Loading displays a themed activity spinner.
 * Supports inline centering or a full-screen absolute backdrop overlay.
 */
export const Loading: React.FC<LoadingProps> = React.memo(({
  text,
  size = 'large',
  color,
  overlay = false,
  style,
  accessibilityLabel,
}) => {
  const theme = useTheme();
  const spinnerColor = color || theme.colors.primary;

  const content = (
    <View style={[styles.innerContainer, !overlay && style]}>
      <ActivityIndicator
        size={size}
        color={spinnerColor}
        accessibilityRole="progressbar"
        accessibilityLabel={accessibilityLabel || text || 'Loading'}
      />
      {text ? (
        <Text
          variant="bodyMedium"
          style={[styles.text, { color: theme.colors.onSurfaceVariant }]}
        >
          {text}
        </Text>
      ) : null}
    </View>
  );

  if (overlay) {
    return (
      <View
        style={[
          styles.overlayContainer,
          { backgroundColor: theme.colors.backdrop || 'rgba(0,0,0,0.4)' },
          style,
        ]}
      >
        {content}
      </View>
    );
  }

  return <View style={styles.center}>{content}</View>;
});

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 8,
  },
  text: {
    marginTop: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});

Loading.displayName = 'Loading';
