/** Notification domain model */

export type NotificationType = 'request' | 'system' | 'chat';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: string;
  read: boolean;
  /** Optional linked entity id, e.g. donationId or chatRoomId */
  relatedId?: string;
}
