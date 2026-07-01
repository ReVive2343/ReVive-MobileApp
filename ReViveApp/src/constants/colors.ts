/**
 * ReVive Brand Color Palette and Theme Definitions
 * Centralizes all color design tokens for the application.
 * Follows semantic mapping and naming conventions suitable for React Native Paper (MD3).
 */

export const palette = {
  // Brand Primary: Eco/Trustworthy Teal
  teal50: '#F0FDFA',
  teal100: '#CCFBF1',
  teal200: '#99F6E4',
  teal300: '#5EEAD4',
  teal400: '#2DD4BF',
  teal500: '#14B8A6',
  teal600: '#0D9488', // Main Primary color
  teal700: '#0F766E',
  teal800: '#115E59',
  teal900: '#134E4A',
  teal950: '#042F2E',

  // Brand Secondary: Warm/Action Coral
  coral50: '#FFF5F5',
  coral100: '#FED7D7',
  coral200: '#FEB2B2',
  coral300: '#FC8181',
  coral400: '#F6E05E',
  coral500: '#F43F5E', // Main Secondary color
  coral600: '#E11D48',
  coral700: '#BE123C',
  coral800: '#9B2C2C',
  coral900: '#742A2A',

  // Neutrals (Grays)
  neutral50: '#F9FAFB',
  neutral100: '#F3F4F6',
  neutral200: '#E5E7EB',
  neutral300: '#D1D5DB',
  neutral400: '#9CA3AF',
  neutral500: '#6B7280',
  neutral600: '#4B5563',
  neutral700: '#374151',
  neutral800: '#1F2937',
  neutral900: '#111827',
  neutral950: '#030712',

  // Semantic Status Colors
  success50: '#ECFDF5',
  success500: '#10B981',
  success700: '#047857',

  warning50: '#FFFBEB',
  warning500: '#F59E0B',
  warning700: '#B45309',

  error50: '#FEF2F2',
  error500: '#EF4444',
  error700: '#B91C1C',

  info50: '#EFF6FF',
  info500: '#3B82F6',
  info700: '#1D4ED8',

  // Absolute Colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const Colors = {
  light: {
    // Brand roles
    primary: palette.teal600,
    onPrimary: palette.white,
    primaryContainer: palette.teal100,
    onPrimaryContainer: palette.teal900,

    secondary: palette.coral500,
    onSecondary: palette.white,
    secondaryContainer: palette.coral100,
    onSecondaryContainer: palette.coral900,

    // Layout/Surfaces
    background: palette.neutral50,
    onBackground: palette.neutral900,
    surface: palette.white,
    onSurface: palette.neutral900,
    surfaceVariant: palette.neutral100,
    onSurfaceVariant: palette.neutral600,

    // Borders and lines
    outline: palette.neutral300,
    outlineVariant: palette.neutral200,

    // Semantic status roles
    success: palette.success500,
    onSuccess: palette.white,
    successContainer: palette.success50,
    onSuccessContainer: palette.success700,

    warning: palette.warning500,
    onWarning: palette.black,
    warningContainer: palette.warning50,
    onWarningContainer: palette.warning700,

    info: palette.info500,
    onInfo: palette.white,
    infoContainer: palette.info50,
    onInfoContainer: palette.info700,

    error: palette.error500,
    onError: palette.white,
    errorContainer: palette.error50,
    onErrorContainer: palette.error700,

    // Legacy or utility helpers
    border: palette.neutral200,
    card: palette.white,
    text: palette.neutral900,
    textSecondary: palette.neutral500,
    placeholder: palette.neutral400,
    disabled: palette.neutral300,
    backdrop: 'rgba(0, 0, 0, 0.4)',
  },
  dark: {
    // Brand roles
    primary: palette.teal400,
    onPrimary: palette.neutral950,
    primaryContainer: palette.teal800,
    onPrimaryContainer: palette.teal50,

    secondary: palette.coral300,
    onSecondary: palette.neutral950,
    secondaryContainer: palette.coral800,
    onSecondaryContainer: palette.coral50,

    // Layout/Surfaces
    background: palette.neutral950,
    onBackground: palette.neutral50,
    surface: palette.neutral900,
    onSurface: palette.neutral50,
    surfaceVariant: palette.neutral800,
    onSurfaceVariant: palette.neutral300,

    // Borders and lines
    outline: palette.neutral700,
    outlineVariant: palette.neutral800,

    // Semantic status roles
    success: palette.success500,
    onSuccess: palette.neutral950,
    successContainer: 'rgba(16, 185, 129, 0.1)',
    onSuccessContainer: palette.success50,

    warning: palette.warning500,
    onWarning: palette.black,
    warningContainer: 'rgba(245, 158, 11, 0.1)',
    onWarningContainer: palette.warning50,

    info: palette.info500,
    onInfo: palette.neutral950,
    infoContainer: 'rgba(59, 130, 246, 0.1)',
    onInfoContainer: palette.info50,

    error: palette.error500,
    onError: palette.neutral950,
    errorContainer: 'rgba(239, 68, 68, 0.1)',
    onErrorContainer: palette.error50,

    // Legacy or utility helpers
    border: palette.neutral800,
    card: palette.neutral900,
    text: palette.neutral50,
    textSecondary: palette.neutral400,
    placeholder: palette.neutral500,
    disabled: palette.neutral700,
    backdrop: 'rgba(0, 0, 0, 0.6)',
  },
} as const;

export type AppColorScheme = typeof Colors.light;
