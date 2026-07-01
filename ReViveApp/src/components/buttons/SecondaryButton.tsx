import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';

export interface SecondaryButtonProps {
  /** Text content to display inside the button */
  children: string;
  /** Callback function when the button is pressed */
  onPress: () => void;
  /** Custom styles to apply to the button container */
  style?: StyleProp<ViewStyle>;
  /** Optional icon to display on the left side of the button */
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
 * SecondaryButton represents secondary or alternative actions in ReVive.
 * Styled using the secondary brand color (Coral) with an outlined format.
 */
export const SecondaryButton: React.FC<SecondaryButtonProps> = React.memo(({
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
      mode="outlined"
      onPress={onPress}
      style={[{ borderColor: theme.colors.secondary }, style]}
      textColor={theme.colors.secondary}
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

SecondaryButton.displayName = 'SecondaryButton';
