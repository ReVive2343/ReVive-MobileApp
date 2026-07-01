import type { User } from '../types/user';

export const mockUsers: User[] = [
  {
    id: 'user_1',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '+1 (555) 123-4567',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    donationCount: 14,
    requestCount: 3,
    rating: 4.8,
  },
  {
    id: 'user_2',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 987-6543',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    donationCount: 5,
    requestCount: 12,
    rating: 4.5,
  },
  {
    id: 'user_3',
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    phone: '+1 (555) 234-5678',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    donationCount: 22,
    requestCount: 0,
    rating: 4.9,
  },
  {
    id: 'user_4',
    name: 'Bob Miller',
    email: 'bob.m@example.com',
    phone: '+1 (555) 876-5432',
    donationCount: 0,
    requestCount: 8,
    rating: 4.2,
  },
];

/** The currently authenticated user (mock — will come from auth context in production) */
export const currentUser: User = mockUsers[0];
