import {
  mockCategoriesFallback,
  mockPopularEventsFallback,
  shouldUseDiscoveryMocks,
} from "@/lib/discovery-mocks";
import { ensureInviteToken } from "@/lib/services/event.service";
import { categorySlugExists } from "@/lib/services/category.service";
import { prisma } from "@/lib/prisma";
import {
  buildPublicEventWhere,
  type ExploreFilters,
  publicEventSlugWhere,
} from "@/lib/services/discovery-filters";
import {
  DISCOVERY_PAGE_SIZE,
  getPageCount,
} from "@/lib/discovery-pagination";
import {
  mapEventRowToCard,
  publicEventSelect,
} from "@/lib/services/discovery-mappers";

import type {
  DiscoveryCategory,
  DiscoveryEventCard,
} from "@/lib/types/discovery";

export type { DiscoveryCategory, DiscoveryEventCard };

export type PaginatedDiscoveryEvents = {
  events: DiscoveryEventCard[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

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
      return mockCategoriesFallback();
    }

    return rows.map((row) => ({
      slug: row.slug,
      eventCount: row.events.length,
    }));
  } catch {
    return mockCategoriesFallback();
  }
}

export async function categoryExists(slug: string): Promise<boolean> {
  try {
    return categorySlugExists(slug);
  } catch {
    return shouldUseDiscoveryMocks();
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

export async function searchPublicEventsPaginated(
  filters: ExploreFilters,
  page: number,
  pageSize = DISCOVERY_PAGE_SIZE,
): Promise<PaginatedDiscoveryEvents> {
  const where = buildPublicEventWhere(filters);
  const safePage = Math.max(1, page);

  const [total, rows] = await prisma.$transaction([
    prisma.event.count({ where }),
    prisma.event.findMany({
      where,
      orderBy: [{ eventDate: "asc" }, { createdAt: "desc" }],
      skip: (safePage - 1) * pageSize,
      take: pageSize,
      select: publicEventSelect,
    }),
  ]);

  return {
    events: rows.map(mapEventRowToCard),
    total,
    page: safePage,
    pageSize,
    pageCount: getPageCount(total, pageSize),
  };
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

export type PublicEventPageContext = {
  event: DiscoveryEventCard;
  inviteToken: string;
};

export async function getPublicEventPageContext(
  slug: string,
): Promise<PublicEventPageContext | null> {
  const event = await getPublicEventBySlug(slug);
  if (!event) {
    return null;
  }

  const inviteToken = await ensureInviteToken(event.id);

  return { event, inviteToken };
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
      return mockPopularEventsFallback();
    }

    return rows.map(mapEventRowToCard);
  } catch {
    return mockPopularEventsFallback();
  }
}
