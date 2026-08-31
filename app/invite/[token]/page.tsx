import type { Metadata } from "next";

import { InviteRsvpContent } from "@/components/invite-rsvp-content";
import { createPageMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;

  const invite = await prisma.eventInvite.findFirst({
    where: { token },
    select: {
      event: {
        select: { title: true },
      },
    },
  });

  const eventTitle = invite?.event.title;

  return createPageMetadata({
    title: eventTitle ? `RSVP · ${eventTitle}` : "RSVP",
    description: eventTitle
      ? `Respond to ${eventTitle} on EventHub.`
      : "Submit your RSVP for this event.",
  });
}

export default async function InvitePage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ submitted?: string }>;
}) {
  const { token } = await params;
  const query = await searchParams;

  return (
    <InviteRsvpContent token={token} submitted={query.submitted === "1"} />
  );
}
