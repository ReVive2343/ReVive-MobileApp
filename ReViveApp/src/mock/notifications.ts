import type { Notification } from '../types/notification';

export const mockNotifications: Notification[] = [
  {
    id: 'not_1',
    title: 'Donation Request',
    message: 'John Smith requested your Vintage Leather Jacket.',
    type: 'request',
    createdAt: '10 minutes ago',
    read: false,
    relatedId: 'don_4',
  },
  {
    id: 'not_2',
    title: 'New Message',
    message: 'Alice Johnson sent you a message: "Is the textbook still available?"',
    type: 'chat',
    createdAt: '1 hour ago',
    read: false,
    relatedId: 'chat_1',
  },
  {
    id: 'not_3',
    title: 'System Update',
    message: 'Welcome to ReVive! Start donating and sharing items today.',
    type: 'system',
    createdAt: '2 days ago',
    read: true,
  },
];
