import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

export interface ScreenContainerProps {
  /** Sub-elements/components to render inside the container */
  children: React.ReactNode;
  /** If true, embeds children within a ScrollView instead of a static View */
  scrollable?: boolean;
  /** Inner padding applied around the container content (defaults to 16) */
  padding?: number;
  /** Custom styles to apply to the outermost container View */
  style?: StyleProp<ViewStyle>;
  /** Custom styles to apply to the content container (especially useful when scrollable) */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /** Keyboard tap persistence behavior for the ScrollView */
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
  /** Keyboard avoiding view behavior offset */
  keyboardVerticalOffset?: number;
  /** If true, wraps screen in KeyboardAvoidingView (defaults to true) */
  avoidKeyboard?: boolean;
}

/**
 * ScreenContainer is the top-level container for all application screen views.
 * Integrates theme backgrounds, keyboard avoidance, and options for scrollable layouts.
 */
export const ScreenContainer: React.FC<ScreenContainerProps> = React.memo(({
  children,
  scrollable = false,
  padding = 16,
  style,
  contentContainerStyle,
  keyboardShouldPersistTaps = 'handled',
  keyboardVerticalOffset = Platform.select({ ios: 0, android: 80 }) ?? 0,
  avoidKeyboard = true,
}) => {
  const theme = useTheme();

  const containerStyle = [
    styles.container,
    { backgroundColor: theme.colors.background },
    style,
  ];

  const contentStyles = [
    styles.content,
    { padding },
    contentContainerStyle,
  ];

  const renderContent = () => {
    if (scrollable) {
      return (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={contentStyles}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        >
          {children}
        </ScrollView>
      );
    }
    return <View style={[styles.staticView, contentStyles]}>{children}</View>;
  };

  if (avoidKeyboard) {
    return (
      <KeyboardAvoidingView
        style={containerStyle}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        {renderContent()}
      </KeyboardAvoidingView>
    );
  }

  return <View style={containerStyle}>{renderContent()}</View>;
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  staticView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
});

ScreenContainer.displayName = 'ScreenContainer';
