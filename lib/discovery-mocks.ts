import {
  MOCK_CATEGORIES,
  MOCK_POPULAR_EVENTS,
} from "@/lib/constants/mock-discovery";
import type {
  DiscoveryCategory,
  DiscoveryEventCard,
} from "@/lib/types/discovery";

/**
 * Placeholder discovery data is shown only in development by default,
 * or when SHOW_DISCOVERY_MOCKS=true. Set SHOW_DISCOVERY_MOCKS=false to
 * preview empty discovery UI locally.
 */
export function shouldUseDiscoveryMocks(): boolean {
  const flag = process.env.SHOW_DISCOVERY_MOCKS;

  if (flag === "false") {
    return false;
  }

  if (flag === "true") {
    return true;
  }

  return process.env.NODE_ENV === "development";
}

export function mockCategoriesFallback(): DiscoveryCategory[] {
  return shouldUseDiscoveryMocks() ? MOCK_CATEGORIES : [];
}

export function mockPopularEventsFallback(): DiscoveryEventCard[] {
  if (!shouldUseDiscoveryMocks()) {
    return [];
  }

  return MOCK_POPULAR_EVENTS.map((event) => ({
    id: event.id,
    slug: event.slug,
    title: event.title,
    categorySlug: event.categorySlug,
    dateIso: event.dateIso,
    location: event.location,
    description: event.description,
    rsvpCount: event.rsvpCount,
    imageUrl: event.imageUrl,
  }));
}
