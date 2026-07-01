import type { Donation } from '../../types/donation';
import { mockDonations } from '../../mock/donations';
import { mockUsers } from '../../mock/users';

/**
 * DonationService
 * Today: resolves mock data after a simulated delay.
 * Later: replace mock imports with Axios calls — screens remain unchanged.
 */
const donationService = {
  /** Fetch all available donations */
  async getAll(): Promise<Donation[]> {
    await new Promise<void>((r) => setTimeout(r, 800));
    return mockDonations;
  },

  /** Fetch donations with 'available' status for the public feed */
  async getAvailable(): Promise<Donation[]> {
    await new Promise<void>((r) => setTimeout(r, 800));
    return mockDonations.filter((d) => d.availability === 'available');
  },

  /** Fetch a single donation by id */
  async getById(id: string): Promise<Donation | undefined> {
    await new Promise<void>((r) => setTimeout(r, 600));
    return mockDonations.find((d) => d.id === id);
  },

  /** Filter donations by category */
  async getByCategory(categoryId: string): Promise<Donation[]> {
    await new Promise<void>((r) => setTimeout(r, 700));
    return mockDonations.filter(
      (d) => d.categoryId === categoryId && d.availability === 'available',
    );
  },

  /** Search donations by query string (title / description) */
  async search(query: string): Promise<Donation[]> {
    await new Promise<void>((r) => setTimeout(r, 600));
    const lower = query.toLowerCase();
    return mockDonations.filter(
      (d) =>
        d.availability === 'available' &&
        (d.title.toLowerCase().includes(lower) ||
          d.description.toLowerCase().includes(lower)),
    );
  },

  /** Get donations posted by a specific user */
  async getByDonor(donorId: string): Promise<Donation[]> {
    await new Promise<void>((r) => setTimeout(r, 700));
    return mockDonations.filter((d) => d.donorId === donorId);
  },

  /**
   * Mock submit of a new donation.
   * Returns a fake created donation with a generated id.
   */
  async create(
    data: Omit<Donation, 'id' | 'createdAt' | 'availability'>,
  ): Promise<Donation> {
    await new Promise<void>((r) => setTimeout(r, 1200));
    const newDonation: Donation = {
      ...data,
      id: `don_${Date.now()}`,
      createdAt: 'Just now',
      availability: 'available',
    };
    return newDonation;
  },

  /** Resolve donor display name from donorId */
  getDonorName(donorId: string): string {
    return mockUsers.find((u) => u.id === donorId)?.name ?? 'ReVive User';
  },

  /** Resolve donor object from donorId */
  getDonor(donorId: string) {
    return mockUsers.find((u) => u.id === donorId);
  },
};

export default donationService;
