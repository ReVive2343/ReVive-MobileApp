/**
 * ReVive Expo Router Navigation Routes
 * Centralizes all routes in the application for type-safe linking.
 */

export const ROUTES = {
  // Root / Main Screens
  INDEX: '/',
  EXPLORE: '/explore',

  // Authentication Flow
  AUTH: {
    ROOT: '/(auth)',
    LOGIN: '/(auth)/login',
    REGISTER: '/(auth)/register',
    FORGOT_PASSWORD: '/(auth)/forgot-password',
    RESET_PASSWORD: '/(auth)/reset-password',
  },

  // Main Tab Navigation (if configured with tabs)
  TABS: {
    ROOT: '/(tabs)',
    EXPLORE: '/(tabs)/explore',
    MY_DONATIONS: '/(tabs)/my-donations',
    REQUESTS: '/(tabs)/requests',
    NOTIFICATIONS: '/(tabs)/notifications',
    PROFILE: '/(tabs)/profile',
  },

  // Donation-related Flow
  DONATION: {
    ROOT: '/donation',
    CREATE: '/donation/create',
    // Dynamic Routes helper functions
    DETAILS: (id: string | number) => `/donation/${id}` as const,
    EDIT: (id: string | number) => `/donation/edit/${id}` as const,
  },

  // Chat/Messaging Flow
  CHAT: {
    ROOT: '/chat',
    LIST: '/chat/list',
    // Dynamic Route helper function
    ROOM: (id: string | number) => `/chat/${id}` as const,
  },

  // Notification Screen Flow
  NOTIFICATION: {
    ROOT: '/notification',
    LIST: '/notification/list',
  },

  // Profile Screen Flow
  PROFILE: {
    ROOT: '/profile',
    // Dynamic Route helper function
    VIEW: (id: string | number) => `/profile/${id}` as const,
    EDIT: '/profile/edit',
  },

  // Settings Flow
  SETTINGS: {
    ROOT: '/settings',
    GENERAL: '/settings/general',
    NOTIFICATIONS: '/settings/notifications',
    HELP: '/settings/help',
    ABOUT: '/settings/about',
  },
} as const;

export type AppRoutes = typeof ROUTES;
export type RoutePath = string;
