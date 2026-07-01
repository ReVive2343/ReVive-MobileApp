import type { Notification } from '../../types/notification';
import { mockNotifications } from '../../mock/notifications';

/**
 * NotificationService
 * Today: returns mock notifications. Later: replaces with Axios.
 */
const notificationService = {
  async getAll(): Promise<Notification[]> {
    await new Promise<void>((r) => setTimeout(r, 500));
    return mockNotifications;
  },

  async getUnreadCount(): Promise<number> {
    await new Promise<void>((r) => setTimeout(r, 200));
    return mockNotifications.filter((n) => !n.read).length;
  },
};

export default notificationService;
