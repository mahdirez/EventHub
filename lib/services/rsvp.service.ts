import type { RsvpFormInput } from "@/lib/validations/rsvp";
import { prisma } from "@/lib/prisma";
import { assertGoingRsvpCapacityAvailable } from "@/lib/services/rsvp-capacity";
import { RsvpServiceError } from "@/lib/services/rsvp.errors";

export { RsvpServiceError } from "@/lib/services/rsvp.errors";
export type { RsvpServiceErrorCode } from "@/lib/services/rsvp.errors";

export async function submitRsvpForInviteToken(
  token: string,
  input: RsvpFormInput,
) {
  return prisma.$transaction(async (tx) => {
    const invite = await tx.eventInvite.findFirst({
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
      await assertGoingRsvpCapacityAvailable(
        tx,
        eventId,
        invite.event.capacity,
        emailNormalized,
      );
    }

    await tx.eventRsvp.upsert({
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
  });
}
