import type { SearchHistory } from '../types/search';

export const mockRecentSearches: SearchHistory[] = [
  { id: 'sec_1', query: 'sofa',         timestamp: Date.now() - 3_600_000 },
  { id: 'sec_2', query: 'physics book', timestamp: Date.now() - 7_200_000 },
  { id: 'sec_3', query: 'jacket',       timestamp: Date.now() - 14_400_000 },
];

export const mockPopularSearches: string[] = [
  'table', 'bicycle', 'monitor', 'drill', 'clothes', 'books',
];
