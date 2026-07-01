import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';

export interface PrimaryButtonProps {
  /** Text content or custom components to display inside the button */
  children: string;
  /** Callback function when the button is pressed */
  onPress: () => void;
  /** Custom styles to apply to the button container */
  style?: StyleProp<ViewStyle>;
  /** Optional icon to display on the left (or right) side of the button */
  icon?: IconSource;
  /** If true, displays a loading spinner instead of the button text */
  loading?: boolean;
  /** If true, disables user interaction and dims the button appearance */
  disabled?: boolean;
  /** Layout mode of the button text (defaults to uppercase for MD3 buttons) */
  uppercase?: boolean;
  /** Optional custom accessibility label for screen readers */
  accessibilityLabel?: string;
}

/**
 * PrimaryButton is the primary action component in ReVive.
 * Styled using the primary theme color (Teal) with a contained format.
 */
export const PrimaryButton: React.FC<PrimaryButtonProps> = React.memo(({
  children,
  onPress,
  style,
  icon,
  loading = false,
  disabled = false,
  uppercase = false,
  accessibilityLabel,
}) => {
  const theme = useTheme();

  return (
    <Button
      mode="contained"
      onPress={onPress}
      style={style}
      buttonColor={theme.colors.primary}
      textColor={theme.colors.onPrimary}
      icon={icon}
      loading={loading}
      disabled={disabled || loading}
      uppercase={uppercase}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      accessibilityLabel={accessibilityLabel || children}
    >
      {children}
    </Button>
  );
});

PrimaryButton.displayName = 'PrimaryButton';
