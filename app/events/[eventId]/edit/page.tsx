import { notFound, redirect } from "next/navigation";

import { EventForm } from "@/components/event-form";
import { updateEventAction } from "@/lib/actions/events";
import { getSession } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

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
    },
  });

  if (!event) {
    notFound();
  }

  const updateAction = updateEventAction.bind(null, event.id);

  return (
    <EventForm
      title="Edit Event"
      submitLabel="Save changes"
      pendingLabel="Saving..."
      cancelHref={`/events/${event.id}`}
      action={updateAction}
      defaultValues={{
        title: event.title,
        description: event.description,
        location: event.location,
        eventDate: event.eventDate,
      }}
    />
  );
}
