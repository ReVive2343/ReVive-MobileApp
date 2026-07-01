import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Divider as PaperDivider } from 'react-native-paper';

export interface DividerProps {
  /** Optional vertical margin spacing around the divider (defaults to 8) */
  marginVertical?: number;
  /** Optional horizontal margin spacing around the divider (defaults to 0) */
  marginHorizontal?: number;
  /** Whether the divider should have increased thickness/weight */
  bold?: boolean;
  /** Custom styles to apply to the divider */
  style?: StyleProp<ViewStyle>;
}

/**
 * Divider renders a visual separator line with customizable margins.
 * Wraps React Native Paper's Divider.
 */
export const Divider: React.FC<DividerProps> = React.memo(({
  marginVertical = 8,
  marginHorizontal = 0,
  bold = false,
  style,
}) => {
  return (
    <PaperDivider
      bold={bold}
      style={[
        {
          marginVertical,
          marginHorizontal,
        },
        style,
      ]}
    />
  );
});

Divider.displayName = 'Divider';
