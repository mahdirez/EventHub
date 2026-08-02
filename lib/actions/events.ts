"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  type ActionState,
  actionError,
  actionSuccess,
  getErrorMessage,
} from "@/lib/action-state";
import { getSession } from "../auth/server";
import { prisma } from "../prisma";
import { RsvpStatus } from "@/app/generated/prisma/enums";

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

function parseEventForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (title.length < 3 || title.length > 120) {
    throw new Error("Title must be between 3 and 120 characters");
  }
  const description = String(formData.get("description") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const eventDate = String(formData.get("eventDate") ?? "").trim();

  return {
    title,
    description: description.length ? description.slice(0, 2000) : null,
    location: location.length ? location.slice(0, 200) : null,
    eventDate: eventDate.length ? eventDate : null,
  };
}

const RSVP_STATUSES = ["going", "maybe", "not_going"] as const;

function isRsvpStatus(s: string): s is RsvpStatus {
  return (RSVP_STATUSES as readonly string[]).includes(s);
}

function parseRsvp(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 2 || name.length > 120) {
    throw new Error("Name must be between 2 and 120 characters.");
  }

  const email = String(formData.get("email") ?? "").trim();
  if (email.length < 3 || email.length > 320) {
    throw new Error("Please enter a valid email.");
  }

  const status = String(formData.get("status") ?? "").trim();
  if (!isRsvpStatus(status)) {
    throw new Error("Invalid RSVP status.");
  }

  return { name, email, status };
}

export async function createEventAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let createdId: string;

  try {
    const session = await getSession();
    const userId = session.data?.user?.id;
    const input = parseEventForm(formData);

    if (!userId) {
      return actionError("You must be signed in to create an event.");
    }

    const created = await prisma.event.create({
      data: {
        ownerUserId: userId,
        title: input.title,
        description: input.description,
        location: input.location,
        eventDate: input.eventDate ? new Date(input.eventDate) : null,
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
    const input = parseEventForm(formData);

    await requireEventOwner(eventId, userId);

    await prisma.event.update({
      where: { id: eventId },
      data: {
        title: input.title,
        description: input.description,
        location: input.location,
        eventDate: input.eventDate ? new Date(input.eventDate) : null,
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
    const input = parseRsvp(formData);

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
    const emailNormalized = input.email.toLocaleLowerCase();

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
        status: input.status as RsvpStatus,
      },
      update: {
        name: input.name,
        status: input.status,
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
