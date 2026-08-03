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

    if (!userId) {
      return actionError("You must be signed in to create an event.");
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
      },
    });

    createdId = created.id;
  } catch (error) {
    return actionError(getErrorMessage(error));
  }

  revalidatePath("/dashboard");
  redirect(
    `/events/${createdId}?success=${encodeURIComponent("Event created successfully")}`,
  );
}

export async function updateEventAction(
  eventId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await getSession();
    const userId = session.data?.user?.id;

    const parsed = parseFormData(eventFormSchema, formData);
    if (!parsed.success) {
      return parsed.state;
    }

    await requireEventOwner(eventId, userId);

    await prisma.event.update({
      where: { id: eventId },
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        location: parsed.data.location,
        eventDate: parsed.data.eventDate ? new Date(parsed.data.eventDate) : null,
      },
    });
  } catch (error) {
    return actionError(getErrorMessage(error));
  }

  revalidatePath("/dashboard");
  revalidatePath(`/events/${eventId}`);
  redirect(
    `/events/${eventId}?success=${encodeURIComponent("Event updated successfully")}`,
  );
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
  redirect(
    `/dashboard?success=${encodeURIComponent("Event deleted successfully")}`,
  );
}

export async function createInviteLinkAction(
  eventId: string,
  _prevState: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  try {
    const session = await getSession();
    const userId = session.data?.user?.id;

    await requireEventOwner(eventId, userId);

    const token = crypto.randomUUID().replace(/-/g, "");

    await prisma.eventInvite.upsert({
      where: { eventId },
      create: { eventId, token },
      update: { token },
    });

    revalidatePath(`/events/${eventId}`);
    return actionSuccess("Invite link generated successfully");
  } catch (error) {
    return actionError(getErrorMessage(error));
  }
}

export async function submitOrUpdateRsvpAction(
  token: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const parsed = parseFormData(rsvpFormSchema, formData);
    if (!parsed.success) {
      return parsed.state;
    }

    const invite = await prisma.eventInvite.findFirst({
      where: { token },
      select: {
        id: true,
        event: {
          select: { id: true },
        },
      },
    });

    if (!invite) {
      return actionError("Invite link is invalid.");
    }

    const eventId = invite.event.id;
    const emailNormalized = parsed.data.email.toLocaleLowerCase();

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
    `/invite/${token}?submitted=1&success=${encodeURIComponent("Your RSVP has been recorded")}`,
  );
}
