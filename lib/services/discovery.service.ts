import { MOCK_CATEGORIES, MOCK_POPULAR_EVENTS } from "@/lib/constants/mock-discovery";
import { PLACEHOLDER_IMAGES } from "@/lib/constants/placeholder-images";
import type { MockCategoryId } from "@/lib/constants/mock-discovery";
import { prisma } from "@/lib/prisma";

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

const categoryCoverFallback: Record<MockCategoryId, string> = {
  technology: PLACEHOLDER_IMAGES.events.technology,
  music: PLACEHOLDER_IMAGES.events.music,
  business: PLACEHOLDER_IMAGES.events.business,
  art: PLACEHOLDER_IMAGES.events.art,
  education: PLACEHOLDER_IMAGES.events.technology,
  sports: PLACEHOLDER_IMAGES.events.business,
};

function isCategoryId(value: string | null | undefined): value is MockCategoryId {
  return (
    value === "technology" ||
    value === "music" ||
    value === "business" ||
    value === "art" ||
    value === "education" ||
    value === "sports"
  );
}

export async function getDiscoveryCategories(): Promise<DiscoveryCategory[]> {
  try {
    const rows = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      select: {
        slug: true,
        events: {
          where: { visibility: "public" },
          select: { id: true },
        },
      },
    });

    if (rows.length === 0) {
      return MOCK_CATEGORIES;
    }

    const mapped: DiscoveryCategory[] = rows
      .filter((row): row is { slug: MockCategoryId; events: { id: string }[] } =>
        isCategoryId(row.slug),
      )
      .map((row) => ({
        id: row.slug,
        eventCount: row.events.length,
      }));

    return mapped.length > 0 ? mapped : MOCK_CATEGORIES;
  } catch {
    return MOCK_CATEGORIES;
  }
}

export async function getPopularDiscoveryEvents(
  limit = 4,
): Promise<DiscoveryEventCard[]> {
  try {
    const rows = await prisma.event.findMany({
      where: { visibility: "public" },
      orderBy: [{ eventDate: "asc" }, { createdAt: "desc" }],
      take: limit,
      select: {
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
      },
    });

    if (rows.length === 0) {
      return MOCK_POPULAR_EVENTS;
    }

    return rows.map((row) => {
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
        imageUrl:
          row.coverImageUrl ?? categoryCoverFallback[categoryId],
      };
    });
  } catch {
    return MOCK_POPULAR_EVENTS;
  }
}
