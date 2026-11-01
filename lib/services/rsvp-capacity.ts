import { canRsvpGoing } from "@/lib/event-capacity";

import { RsvpServiceError } from "@/lib/services/rsvp.errors";

export type GoingCapacitySnapshot = {
  capacity: number | null;
  goingCount: number;
  existingStatus: string | null | undefined;
};

export function isGoingRsvpBlocked({
  capacity,
  goingCount,
  existingStatus,
}: GoingCapacitySnapshot): boolean {
  if (capacity == null) {
    return false;
  }

  return !canRsvpGoing(capacity, goingCount, existingStatus);
}

type RsvpCapacityTx = {
  eventRsvp: {
    findUnique(args: {
      where: {
        eventId_emailNormalized: {
          eventId: string;
          emailNormalized: string;
        };
      };
      select: { status: true };
    }): Promise<{ status: string } | null>;
    count(args: {
      where: { eventId: string; status: "going" };
    }): Promise<number>;
  };
  $executeRaw(
    query: TemplateStringsArray,
    ...values: unknown[]
  ): Promise<number>;
};

export async function lockEventRowForRsvp(
  tx: RsvpCapacityTx,
  eventId: string,
): Promise<void> {
  await tx.$executeRaw`SELECT id FROM events WHERE id = ${eventId}::uuid FOR UPDATE`;
}

export async function assertGoingRsvpCapacityAvailable(
  tx: RsvpCapacityTx,
  eventId: string,
  capacity: number | null,
  emailNormalized: string,
): Promise<void> {
  if (capacity == null) {
    return;
  }

  await lockEventRowForRsvp(tx, eventId);

  const existingRsvp = await tx.eventRsvp.findUnique({
    where: {
      eventId_emailNormalized: {
        eventId,
        emailNormalized,
      },
    },
    select: { status: true },
  });

  const goingCount = await tx.eventRsvp.count({
    where: { eventId, status: "going" },
  });

  if (
    isGoingRsvpBlocked({
      capacity,
      goingCount,
      existingStatus: existingRsvp?.status,
    })
  ) {
    throw new RsvpServiceError("AT_CAPACITY");
  }
}
