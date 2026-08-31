import type { Metadata } from "next";
import { EventDetailContent } from "@/components/event-detail-content";
import { getSession } from "@/lib/auth/server";
import { createPageMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

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
    title: event?.title ?? "Event details",
    description: event
      ? `Manage invite links and RSVPs for ${event.title}.`
      : "View event details, invite links, and attendee responses.",
  });
}

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  const session = await getSession();

  if (!session.data) {
    redirect("/auth/sign-in");
  }

  return <EventDetailContent userId={session.data.user.id} eventId={eventId} />;
}
