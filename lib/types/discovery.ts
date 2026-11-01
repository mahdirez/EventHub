export type DiscoveryEventCard = {
  id: string;
  slug: string;
  title: string;
  categorySlug: string;
  dateIso: string | null;
  location: string;
  description: string;
  rsvpCount: number;
  imageUrl: string;
};

export type DiscoveryCategory = {
  slug: string;
  eventCount: number;
};
