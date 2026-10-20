import type { MockCategoryId } from "@/lib/constants/mock-discovery";
import {
  categoryCoverFallback,
  resolveDiscoveryImageUrl,
} from "@/lib/discovery-images";
import type { DiscoveryEventCard } from "@/lib/services/discovery.service";

export { categoryCoverFallback };

export function isCategoryId(
  value: string | null | undefined,
): value is MockCategoryId {
  return (
    value === "technology" ||
    value === "music" ||
    value === "business" ||
    value === "art" ||
    value === "education" ||
    value === "sports"
  );
}

type EventRow = {
  id: string;
  slug: string | null;
  title: string;
  description: string | null;
  location: string | null;
  city: string | null;
  eventDate: Date | null;
  categorySlug: string | null;
  coverImageUrl: string | null;
  rsvps: { status: string }[];
};

export function mapEventRowToCard(row: EventRow): DiscoveryEventCard {
  const categoryId = isCategoryId(row.categorySlug)
    ? row.categorySlug
    : "technology";
  const goingCount = row.rsvps.filter((r) => r.status === "going").length;
  const maybeCount = row.rsvps.filter((r) => r.status === "maybe").length;

  return {
    id: row.id,
    slug: row.slug ?? row.id,
    title: row.title,
    categoryId,
    dateIso: row.eventDate?.toISOString() ?? null,
    location: row.city ?? row.location ?? "",
    description: row.description ?? "",
    rsvpCount: goingCount + maybeCount,
    imageUrl: resolveDiscoveryImageUrl(row.coverImageUrl, categoryId),
  };
}

export const publicEventSelect = {
  id: true,
  slug: true,
  title: true,
  description: true,
  location: true,
  city: true,
  eventDate: true,
  categorySlug: true,
  coverImageUrl: true,
  rsvps: { select: { status: true } },
} as const;
