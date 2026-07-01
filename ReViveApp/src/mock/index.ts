/**
 * Mock Data Barrel
 * Re-exports all mock data from a single entry point.
 * Usage: import { mockDonations, mockCategories } from '@/mock';
 */
export { mockDonations }         from './donations';
export { mockCategories }        from './categories';
export { mockUsers, currentUser } from './users';
export { mockNotifications }     from './notifications';
export { mockChats }             from './chats';
export { mockRecentSearches, mockPopularSearches } from './searches';
