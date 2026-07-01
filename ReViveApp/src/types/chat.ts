/** Chat preview domain model */

export interface ChatPreview {
  id: string;
  /** References User.id */
  participantId: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}
