import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Appbar } from 'react-native-paper';

export interface HeaderAction {
  /** Icon name (MaterialCommunityIcons) to render */
  icon: string;
  /** Callback triggered when action item is pressed */
  onPress: () => void;
  /** Accessible label describing the button action */
  accessibilityLabel: string;
  /** If true, disables action interaction */
  disabled?: boolean;
}

export interface HeaderProps {
  /** Main title text shown in the header */
  title: string;
  /** Optional smaller description text shown beneath the title */
  subtitle?: string;
  /** Callback function that enables and handles the back button click */
  onBackPress?: () => void;
  /** Optional custom action buttons rendered on the right side of the header */
  actions?: HeaderAction[];
  /** Custom styles to apply to the Appbar.Header container */
  style?: StyleProp<ViewStyle>;
  /** Optional accessibility label for the back button */
  backAccessibilityLabel?: string;
}

/**
 * Header is a reusable navigation bar component mapping to React Native Paper's Appbar.
 * Configures back-navigation icons, screen titles, and action items in a consistent format.
 */
export const Header: React.FC<HeaderProps> = React.memo(({
  title,
  subtitle,
  onBackPress,
  actions = [],
  style,
  backAccessibilityLabel = 'Go back',
}) => {
  return (
    <Appbar.Header style={style} elevated>
      {onBackPress ? (
        <Appbar.BackAction
          onPress={onBackPress}
          accessibilityLabel={backAccessibilityLabel}
        />
      ) : null}
      
      <Appbar.Content
        title={title}
        subtitle={subtitle}
        accessibilityRole="header"
      />

      {actions.map((action, index) => (
        <Appbar.Action
          key={`${action.icon}-${index}`}
          icon={action.icon}
          onPress={action.onPress}
          disabled={action.disabled}
          accessibilityLabel={action.accessibilityLabel}
        />
      ))}
    </Appbar.Header>
  );
});

Header.displayName = 'Header';
