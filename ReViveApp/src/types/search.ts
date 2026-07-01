/** Search history domain model */

export interface SearchHistory {
  id: string;
  query: string;
  /** Unix timestamp in ms */
  timestamp: number;
}
