import { buildEventWriteData, type EventWriteData } from "@/lib/services/event-organizer.service";
import { categorySlugExists } from "@/lib/services/category.service";
import type { EventFormInput } from "@/lib/validations/event";
import { prisma } from "@/lib/prisma";

export class EventServiceError extends Error {
  readonly code: "UNAUTHORIZED" | "NOT_FOUND" | "INVALID_CATEGORY";

  constructor(code: "UNAUTHORIZED" | "NOT_FOUND" | "INVALID_CATEGORY") {
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

async function assertCategorySlugForWrite(
  visibility: EventWriteData["visibility"],
  categorySlug: string | null,
) {
  if (visibility !== "public" || !categorySlug) {
    return;
  }

  if (!(await categorySlugExists(categorySlug))) {
    throw new EventServiceError("INVALID_CATEGORY");
  }
}

export async function createEventForOwner(userId: string, input: EventFormInput) {
  const writeData = await buildEventWriteData(input);

  await assertCategorySlugForWrite(writeData.visibility, writeData.categorySlug);

  const created = await prisma.event.create({
    data: {
      ownerUserId: userId,
      ...writeData,
    },
    select: { id: true },
  });

  if (writeData.visibility === "public") {
    await ensureInviteToken(created.id);
  }

  return created;
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

  await assertCategorySlugForWrite(writeData.visibility, writeData.categorySlug);

  await prisma.event.update({
    where: { id: eventId },
    data: writeData,
  });

  if (writeData.visibility === "public") {
    await ensureInviteToken(eventId);
  }
}

export async function deleteEventForOwner(eventId: string) {
  await prisma.event.delete({
    where: { id: eventId },
  });
}

export async function ensureInviteToken(eventId: string): Promise<string> {
  const existing = await prisma.eventInvite.findUnique({
    where: { eventId },
    select: { token: true },
  });

  if (existing) {
    return existing.token;
  }

  const token = crypto.randomUUID().replace(/-/g, "");

  await prisma.eventInvite.create({
    data: { eventId, token },
  });

  return token;
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
