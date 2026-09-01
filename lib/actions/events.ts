"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  type ActionState,
  actionError,
  actionSuccess,
  getErrorMessage,
} from "@/lib/action-state";
import { eventFormSchema } from "@/lib/validations/event";
import { parseFormData } from "@/lib/validations/parse-form-data";
import { rsvpFormSchema } from "@/lib/validations/rsvp";
import { canRsvpGoing } from "@/lib/event-capacity";
import { getTranslations } from "@/lib/i18n/server";
import { getSession } from "../auth/server";
import { prisma } from "../prisma";

async function requireEventOwner(eventId: string, userId: string | undefined) {
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const event = await prisma.event.findFirst({
    where: { id: eventId, ownerUserId: userId },
    select: { id: true },
  });

  if (!event) {
    throw new Error("Event not found");
  }

  return event;
}

export async function createEventAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let createdId: string;

  try {
    const session = await getSession();
    const userId = session.data?.user?.id;
    const { t } = await getTranslations();

    if (!userId) {
      return actionError(t("actions.signInRequired"));
    }

    const parsed = parseFormData(eventFormSchema, formData);
    if (!parsed.success) {
      return parsed.state;
    }

    const created = await prisma.event.create({
      data: {
        ownerUserId: userId,
        title: parsed.data.title,
        description: parsed.data.description,
        location: parsed.data.location,
        eventDate: parsed.data.eventDate ? new Date(parsed.data.eventDate) : null,
        capacity: parsed.data.capacity,
      },
    });

    createdId = created.id;
  } catch (error) {
    return actionError(getErrorMessage(error));
  }

  revalidatePath("/dashboard");
  redirect(`/events/${createdId}`);
}

export async function updateEventAction(
  eventId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await getSession();
    const userId = session.data?.user?.id;
    const { t } = await getTranslations();

    const parsed = parseFormData(eventFormSchema, formData);
    if (!parsed.success) {
      return parsed.state;
    }

    await requireEventOwner(eventId, userId);

    if (parsed.data.capacity != null) {
      const goingCount = await prisma.eventRsvp.count({
        where: { eventId, status: "going" },
      });

      if (parsed.data.capacity < goingCount) {
        return actionError(
          t("actions.capacityTooLow", { count: goingCount }),
        );
      }
    }

    await prisma.event.update({
      where: { id: eventId },
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        location: parsed.data.location,
        eventDate: parsed.data.eventDate ? new Date(parsed.data.eventDate) : null,
        capacity: parsed.data.capacity,
      },
    });
  } catch (error) {
    return actionError(getErrorMessage(error));
  }

  revalidatePath("/dashboard");
  revalidatePath(`/events/${eventId}`);
  redirect(`/events/${eventId}`);
}

export async function deleteEventAction(
  eventId: string,
  _prevState: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  try {
    const session = await getSession();
    const userId = session.data?.user?.id;

    await requireEventOwner(eventId, userId);

    await prisma.event.delete({
      where: { id: eventId },
    });
  } catch (error) {
    return actionError(getErrorMessage(error));
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function createInviteLinkAction(
  eventId: string,
  _prevState: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  try {
    const session = await getSession();
    const userId = session.data?.user?.id;
    const { t } = await getTranslations();

    await requireEventOwner(eventId, userId);

    const token = crypto.randomUUID().replace(/-/g, "");

    await prisma.eventInvite.upsert({
      where: { eventId },
      create: { eventId, token },
      update: { token },
    });

    revalidatePath(`/events/${eventId}`);
    return actionSuccess(t("toast.inviteGenerated"));
  } catch (error) {
    return actionError(getErrorMessage(error));
  }
}

export async function submitOrUpdateRsvpAction(
  token: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let submittedEmail: string;

  try {
    const parsed = parseFormData(rsvpFormSchema, formData);
    const { t } = await getTranslations();
    if (!parsed.success) {
      return parsed.state;
    }

    submittedEmail = parsed.data.email;

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
      return actionError(t("actions.inviteInvalid"));
    }

    const eventId = invite.event.id;
    const emailNormalized = parsed.data.email.toLocaleLowerCase();

    if (parsed.data.status === "going") {
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
        return actionError(t("actions.atCapacity"));
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
        name: parsed.data.name,
        email: parsed.data.email,
        emailNormalized,
        status: parsed.data.status,
      },
      update: {
        name: parsed.data.name,
        status: parsed.data.status,
        respondedAt: new Date(),
      },
    });
  } catch (error) {
    return actionError(getErrorMessage(error));
  }

  redirect(
    `/invite/${token}?submitted=1&email=${encodeURIComponent(submittedEmail)}`,
  );
}
