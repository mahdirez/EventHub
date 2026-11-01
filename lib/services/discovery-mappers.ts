import { getCategoryCoverFallback } from "@/lib/category-display";
import { resolveDiscoveryImageUrl } from "@/lib/discovery-images";
import type { DiscoveryEventCard } from "@/lib/services/discovery.service";

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
  const categorySlug = row.categorySlug ?? "technology";
  const goingCount = row.rsvps.filter((r) => r.status === "going").length;
  const maybeCount = row.rsvps.filter((r) => r.status === "maybe").length;

  return {
    id: row.id,
    slug: row.slug ?? row.id,
    title: row.title,
    categorySlug,
    dateIso: row.eventDate?.toISOString() ?? null,
    location: row.city ?? row.location ?? "",
    description: row.description ?? "",
    rsvpCount: goingCount + maybeCount,
    imageUrl: resolveDiscoveryImageUrl(row.coverImageUrl, categorySlug),
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

export { getCategoryCoverFallback };
