import type { ChatPreview } from '../types/chat';

export const mockChats: ChatPreview[] = [
  {
    id: 'chat_1',
    participantId: 'user_2',
    lastMessage: 'Hi Jane, is the dining table still available?',
    lastMessageTime: '30 mins ago',
    unreadCount: 2,
  },
  {
    id: 'chat_2',
    participantId: 'user_3',
    lastMessage: 'I can pick it up tomorrow around 5 PM.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
  },
  {
    id: 'chat_3',
    participantId: 'user_4',
    lastMessage: 'Thank you so much for the winter coat! It fits great.',
    lastMessageTime: '4 days ago',
    unreadCount: 0,
  },
];
