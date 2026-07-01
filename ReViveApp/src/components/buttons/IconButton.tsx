import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { IconButton as PaperIconButton } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';

export interface IconButtonProps {
  /** Icon name or element to render */
  icon: IconSource;
  /** Callback function when the button is pressed */
  onPress: () => void;
  /** Custom styles to apply to the button container */
  style?: StyleProp<ViewStyle>;
  /** Specific size of the icon (defaults to RNP standard) */
  size?: number;
  /** Background styling container mode of the icon button */
  mode?: 'contained' | 'outlined' | 'contained-tonal' | 'default';
  /** If true, disables user interaction and dims the appearance */
  disabled?: boolean;
  /** Custom icon color */
  iconColor?: string;
  /** Custom background color */
  containerColor?: string;
  /** Mandatory accessibility label describing the button action for screen readers */
  accessibilityLabel: string;
}

/**
 * IconButton provides compact, icon-only button actions.
 * Wraps React Native Paper's IconButton for consistent design tokens and accessibility.
 */
export const IconButton: React.FC<IconButtonProps> = React.memo(({
  icon,
  onPress,
  style,
  size,
  mode = 'default',
  disabled = false,
  iconColor,
  containerColor,
  accessibilityLabel,
}) => {
  return (
    <PaperIconButton
      icon={icon}
      mode={mode === 'default' ? undefined : mode}
      size={size}
      onPress={onPress}
      disabled={disabled}
      iconColor={iconColor}
      containerColor={containerColor}
      style={style}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={accessibilityLabel}
    />
  );
});

IconButton.displayName = 'IconButton';
