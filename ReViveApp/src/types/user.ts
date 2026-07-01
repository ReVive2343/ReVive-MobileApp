/** User domain model */

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  donationCount: number;
  requestCount: number;
  rating?: number;
}
