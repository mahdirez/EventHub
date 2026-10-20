import type { MockCategoryId } from "@/lib/constants/mock-discovery";

export type DiscoveryEventCard = {
  id: string;
  slug: string;
  title: string;
  categoryId: MockCategoryId;
  dateIso: string | null;
  location: string;
  description: string;
  rsvpCount: number;
  imageUrl: string;
};

export type DiscoveryCategory = {
  id: MockCategoryId;
  eventCount: number;
};
