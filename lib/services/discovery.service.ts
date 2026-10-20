import { MOCK_CATEGORIES, MOCK_POPULAR_EVENTS } from "@/lib/constants/mock-discovery";
import type { MockCategoryId } from "@/lib/constants/mock-discovery";
import { prisma } from "@/lib/prisma";
import {
  buildPublicEventWhere,
  type ExploreFilters,
  publicEventSlugWhere,
} from "@/lib/services/discovery-filters";
import {
  isCategoryId,
  mapEventRowToCard,
  publicEventSelect,
} from "@/lib/services/discovery-mappers";

import type {
  DiscoveryCategory,
  DiscoveryEventCard,
} from "@/lib/types/discovery";

export type { DiscoveryCategory, DiscoveryEventCard };

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

export async function categoryExists(slug: string): Promise<boolean> {
  if (!isCategoryId(slug)) {
    return false;
  }

  try {
    const row = await prisma.category.findUnique({
      where: { slug },
      select: { slug: true },
    });
    return Boolean(row);
  } catch {
    return isCategoryId(slug);
  }
}

export async function searchPublicEvents(
  filters: ExploreFilters,
): Promise<DiscoveryEventCard[]> {
  const rows = await prisma.event.findMany({
    where: buildPublicEventWhere(filters),
    orderBy: [{ eventDate: "asc" }, { createdAt: "desc" }],
    select: publicEventSelect,
  });

  return rows.map(mapEventRowToCard);
}

export async function getPublicEventBySlug(
  slug: string,
): Promise<DiscoveryEventCard | null> {
  const row = await prisma.event.findFirst({
    where: publicEventSlugWhere(slug),
    select: publicEventSelect,
  });

  if (!row) {
    return null;
  }

  return mapEventRowToCard(row);
}

export async function getPopularDiscoveryEvents(
  limit = 4,
): Promise<DiscoveryEventCard[]> {
  try {
    const rows = await prisma.event.findMany({
      where: { visibility: "public" },
      orderBy: [{ eventDate: "asc" }, { createdAt: "desc" }],
      take: limit,
      select: publicEventSelect,
    });

    if (rows.length === 0) {
      return MOCK_POPULAR_EVENTS;
    }

    return rows.map(mapEventRowToCard);
  } catch {
    return MOCK_POPULAR_EVENTS;
  }
}
