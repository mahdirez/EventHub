import { prisma } from "@/lib/prisma";
import {
  mapEventRowToCard,
  publicEventSelect,
} from "@/lib/services/discovery-mappers";
import type { DiscoveryEventCard } from "@/lib/services/discovery.service";

export type MyRsvpEvent = DiscoveryEventCard & {
  inviteHref: string | null;
};

export async function getRsvpEventsForUserEmail(
  email: string | undefined,
): Promise<MyRsvpEvent[]> {
  if (!email?.trim()) {
    return [];
  }

  const emailNormalized = email.trim().toLocaleLowerCase();

  const rows = await prisma.eventRsvp.findMany({
    where: { emailNormalized },
    orderBy: { respondedAt: "desc" },
    distinct: ["eventId"],
    select: {
      event: {
        select: {
          ...publicEventSelect,
          visibility: true,
          invites: { select: { token: true } },
        },
      },
    },
  });

  return rows.map((row) => {
    const card = mapEventRowToCard(row.event);
    const inviteHref = row.event.invites?.token
      ? `/invite/${row.event.invites.token}`
      : null;

    return {
      ...card,
      inviteHref:
        row.event.visibility === "public"
          ? `/explore/${card.slug}`
          : inviteHref,
    };
  });
}
