import { MD3LightTheme, MD3DarkTheme, adaptNavigationTheme } from 'react-native-paper';
import { DefaultTheme, DarkTheme } from 'expo-router';
import { Colors } from '../constants/colors';

// Adapt React Navigation themes to React Native Paper MD3 standard
const { LightTheme: adaptedLightTheme, DarkTheme: adaptedDarkTheme } = adaptNavigationTheme({
  reactNavigationLight: DefaultTheme as any,
  reactNavigationDark: DarkTheme as any,
});

// Configure Custom Light Theme for React Native Paper & Navigation
export const AppLightTheme = {
  ...MD3LightTheme,
  ...adaptedLightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...adaptedLightTheme.colors,
    primary: Colors.light.primary,
    onPrimary: Colors.light.onPrimary,
    primaryContainer: Colors.light.primaryContainer,
    onPrimaryContainer: Colors.light.onPrimaryContainer,

    secondary: Colors.light.secondary,
    onSecondary: Colors.light.onSecondary,
    secondaryContainer: Colors.light.secondaryContainer,
    onSecondaryContainer: Colors.light.onSecondaryContainer,

    background: Colors.light.background,
    onBackground: Colors.light.onBackground,
    surface: Colors.light.surface,
    onSurface: Colors.light.onSurface,
    surfaceVariant: Colors.light.surfaceVariant,
    onSurfaceVariant: Colors.light.onSurfaceVariant,

    outline: Colors.light.outline,
    outlineVariant: Colors.light.outlineVariant,

    error: Colors.light.error,
    onError: Colors.light.onError,
    errorContainer: Colors.light.errorContainer,
    onErrorContainer: Colors.light.onErrorContainer,
  },
};

// Configure Custom Dark Theme for React Native Paper & Navigation
export const AppDarkTheme = {
  ...MD3DarkTheme,
  ...adaptedDarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...adaptedDarkTheme.colors,
    primary: Colors.dark.primary,
    onPrimary: Colors.dark.onPrimary,
    primaryContainer: Colors.dark.primaryContainer,
    onPrimaryContainer: Colors.dark.onPrimaryContainer,

    secondary: Colors.dark.secondary,
    onSecondary: Colors.dark.onSecondary,
    secondaryContainer: Colors.dark.secondaryContainer,
    onSecondaryContainer: Colors.dark.onSecondaryContainer,

    background: Colors.dark.background,
    onBackground: Colors.dark.onBackground,
    surface: Colors.dark.surface,
    onSurface: Colors.dark.onSurface,
    surfaceVariant: Colors.dark.surfaceVariant,
    onSurfaceVariant: Colors.dark.onSurfaceVariant,

    outline: Colors.dark.outline,
    outlineVariant: Colors.dark.outlineVariant,

    error: Colors.dark.error,
    onError: Colors.dark.onError,
    errorContainer: Colors.dark.errorContainer,
    onErrorContainer: Colors.dark.onErrorContainer,
  },
};

export type AppThemeType = typeof AppLightTheme;
export type AppThemeColors = typeof AppLightTheme.colors;
