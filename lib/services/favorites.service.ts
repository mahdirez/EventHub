import { getSession } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import {
  mapEventRowToCard,
  publicEventSelect,
} from "@/lib/services/discovery-mappers";
import type { DiscoveryEventCard } from "@/lib/services/discovery.service";

export async function getFavoriteEventIds(
  userId: string | undefined,
): Promise<Set<string>> {
  if (!userId) {
    return new Set();
  }

  const rows = await prisma.eventFavorite.findMany({
    where: { userId },
    select: { eventId: true },
  });

  return new Set(rows.map((row) => row.eventId));
}

export async function getFavoriteEventsForUser(
  userId: string,
): Promise<DiscoveryEventCard[]> {
  const rows = await prisma.eventFavorite.findMany({
    where: {
      userId,
      event: { visibility: "public" },
    },
    orderBy: { createdAt: "desc" },
    select: {
      event: {
        select: publicEventSelect,
      },
    },
  });

  return rows.map((row) => mapEventRowToCard(row.event));
}

export async function getFavoriteUiContext() {
  const session = await getSession();
  const userId = session.data?.user?.id;
  const favoriteEventIds = await getFavoriteEventIds(userId);

  return {
    userId,
    isAuthenticated: Boolean(userId),
    favoriteEventIds,
  };
}
