import { buildEventWriteData } from "@/lib/services/event-organizer.service";
import type { EventFormInput } from "@/lib/validations/event";
import { prisma } from "@/lib/prisma";

export class EventServiceError extends Error {
  readonly code: "UNAUTHORIZED" | "NOT_FOUND";

  constructor(code: "UNAUTHORIZED" | "NOT_FOUND") {
    super(code);
    this.code = code;
  }
}

export async function requireEventOwner(eventId: string, userId: string | undefined) {
  if (!userId) {
    throw new EventServiceError("UNAUTHORIZED");
  }

  const event = await prisma.event.findFirst({
    where: { id: eventId, ownerUserId: userId },
    select: { id: true },
  });

  if (!event) {
    throw new EventServiceError("NOT_FOUND");
  }

  return event;
}

export async function createEventForOwner(userId: string, input: EventFormInput) {
  const writeData = await buildEventWriteData(input);

  return prisma.event.create({
    data: {
      ownerUserId: userId,
      ...writeData,
    },
    select: { id: true },
  });
}

export async function assertCapacityAllowsUpdate(
  eventId: string,
  capacity: number | null,
) {
  if (capacity == null) {
    return;
  }

  const goingCount = await prisma.eventRsvp.count({
    where: { eventId, status: "going" },
  });

  if (capacity < goingCount) {
    return goingCount;
  }

  return null;
}

export async function updateEventForOwner(
  eventId: string,
  input: EventFormInput,
) {
  const writeData = await buildEventWriteData(input, { excludeEventId: eventId });

  await prisma.event.update({
    where: { id: eventId },
    data: writeData,
  });
}

export async function deleteEventForOwner(eventId: string) {
  await prisma.event.delete({
    where: { id: eventId },
  });
}

export async function upsertInviteToken(eventId: string) {
  const token = crypto.randomUUID().replace(/-/g, "");

  await prisma.eventInvite.upsert({
    where: { eventId },
    create: { eventId, token },
    update: { token },
  });

  return token;
}
