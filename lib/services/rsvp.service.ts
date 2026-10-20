import { canRsvpGoing } from "@/lib/event-capacity";
import type { RsvpFormInput } from "@/lib/validations/rsvp";
import { prisma } from "@/lib/prisma";

export type RsvpServiceErrorCode =
  | "INVITE_INVALID"
  | "AT_CAPACITY";

export class RsvpServiceError extends Error {
  readonly code: RsvpServiceErrorCode;

  constructor(code: RsvpServiceErrorCode) {
    super(code);
    this.code = code;
  }
}

export async function submitRsvpForInviteToken(
  token: string,
  input: RsvpFormInput,
) {
  const invite = await prisma.eventInvite.findFirst({
    where: { token },
    select: {
      id: true,
      event: {
        select: { id: true, capacity: true },
      },
    },
  });

  if (!invite) {
    throw new RsvpServiceError("INVITE_INVALID");
  }

  const eventId = invite.event.id;
  const emailNormalized = input.email.toLocaleLowerCase();

  if (input.status === "going") {
    const existingRsvp = await prisma.eventRsvp.findUnique({
      where: {
        eventId_emailNormalized: {
          eventId,
          emailNormalized,
        },
      },
      select: { status: true },
    });

    const goingCount = await prisma.eventRsvp.count({
      where: { eventId, status: "going" },
    });

    if (
      !canRsvpGoing(
        invite.event.capacity,
        goingCount,
        existingRsvp?.status,
      )
    ) {
      throw new RsvpServiceError("AT_CAPACITY");
    }
  }

  await prisma.eventRsvp.upsert({
    where: {
      eventId_emailNormalized: {
        eventId,
        emailNormalized,
      },
    },
    create: {
      eventId,
      inviteId: invite.id,
      name: input.name,
      email: input.email,
      emailNormalized,
      status: input.status,
    },
    update: {
      name: input.name,
      status: input.status,
      respondedAt: new Date(),
    },
  });

  return input.email;
}
