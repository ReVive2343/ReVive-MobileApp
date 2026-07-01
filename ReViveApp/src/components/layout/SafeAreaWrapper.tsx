import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';

export interface SafeAreaWrapperProps {
  /** Components to render inside the safe boundaries */
  children: React.ReactNode;
  /** Active boundaries to respect (defaults to ['top', 'bottom']) */
  edges?: Edge[];
  /** Custom styles to apply to the Safe Area container */
  style?: StyleProp<ViewStyle>;
}

const DEFAULT_EDGES: Edge[] = ['top', 'bottom'];

/**
 * SafeAreaWrapper ensures content resides within hardware-safe boundaries (avoiding notches, status bars, and home indicators).
 * Uses react-native-safe-area-context.
 */
export const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = React.memo(({
  children,
  edges = DEFAULT_EDGES,
  style,
}) => {
  const theme = useTheme();

  return (
    <SafeAreaView
      edges={edges}
      style={[
        styles.safeArea,
        { backgroundColor: theme.colors.background },
        style,
      ]}
    >
      {children}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});

SafeAreaWrapper.displayName = 'SafeAreaWrapper';
