import type { Metadata } from "next";

import { InviteRsvpContent } from "@/components/invite-rsvp-content";
import { createPageMetadata } from "@/lib/metadata";
import { getTranslations } from "@/lib/i18n/server";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  const { t } = await getTranslations();

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
    title: eventTitle ? `${t("rsvp.badge")} · ${eventTitle}` : t("rsvp.badge"),
    description: eventTitle
      ? t("rsvp.metadataFor", { title: eventTitle })
      : t("rsvp.metadataDescription"),
  });
}

export default async function InvitePage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ submitted?: string; email?: string }>;
}) {
  const { token } = await params;
  const query = await searchParams;

  return (
    <InviteRsvpContent
      token={token}
      submitted={query.submitted === "1"}
      email={query.email}
    />
  );
}
