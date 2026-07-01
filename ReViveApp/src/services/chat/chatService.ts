import type { ChatPreview } from '../../types/chat';
import type { User } from '../../types/user';
import { mockChats } from '../../mock/chats';
import { mockUsers } from '../../mock/users';

/**
 * ChatService
 * Today: returns mock chat previews. Later: replaces with Axios + Socket.IO.
 */
const chatService = {
  async getAll(): Promise<ChatPreview[]> {
    await new Promise<void>((r) => setTimeout(r, 500));
    return mockChats;
  },

  /** Resolves participant User from a ChatPreview */
  getParticipant(participantId: string): User | undefined {
    return mockUsers.find((u) => u.id === participantId);
  },
};

export default chatService;
