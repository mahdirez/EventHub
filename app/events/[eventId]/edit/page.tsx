import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { EventForm } from "@/components/event-form";
import { updateEventAction } from "@/lib/actions/events";
import { getSession } from "@/lib/auth/server";
import { createPageMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ eventId: string }>;
}): Promise<Metadata> {
  const { eventId } = await params;

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { title: true },
  });

  return createPageMetadata({
    title: event ? `Edit ${event.title}` : "Edit event",
    description: "Update your event title, date, location, and details.",
  });
}

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const session = await getSession();

  if (!session.data) {
    redirect("/auth/sign-in");
  }

  const event = await prisma.event.findFirst({
    where: {
      id: eventId,
      ownerUserId: session.data.user.id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      location: true,
      eventDate: true,
      capacity: true,
    },
  });

  if (!event) {
    notFound();
  }

  const updateAction = updateEventAction.bind(null, event.id);

  return (
    <EventForm
      title="Edit event"
      submitLabel="Save changes"
      pendingLabel="Saving..."
      cancelHref={`/events/${event.id}`}
      action={updateAction}
      defaultValues={{
        title: event.title,
        description: event.description,
        location: event.location,
        eventDate: event.eventDate,
        capacity: event.capacity,
      }}
    />
  );
}
