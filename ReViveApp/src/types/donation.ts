/** Donation domain model and related types */

export type DonationCondition = 'New' | 'Like New' | 'Good' | 'Fair';
export type DonationStatus = 'available' | 'requested' | 'completed';

export interface Donation {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  condition: DonationCondition;
  location: string;
  /** References User.id */
  donorId: string;
  /** Human-readable relative timestamp, e.g. "2 hours ago" */
  createdAt: string;
  imageUrls: string[];
  availability: DonationStatus;
  pickupInstructions: string;
}
