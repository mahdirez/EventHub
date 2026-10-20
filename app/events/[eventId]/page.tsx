import type { Metadata } from "next";
import { EventDetailContent } from "@/components/event-detail-content";
import { PageContainer } from "@/components/layout/page-container";
import { getSession } from "@/lib/auth/server";
import { createPageMetadata } from "@/lib/metadata";
import { getTranslations } from "@/lib/i18n/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ eventId: string }>;
}): Promise<Metadata> {
  const { eventId } = await params;
  const { t } = await getTranslations();

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { title: true },
  });

  return createPageMetadata({
    title: event?.title ?? t("common.viewDetails"),
    description: event
      ? t("event.metadata.detailsFor", { title: event.title })
      : t("event.metadata.detailsDescription"),
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

  return (
    <PageContainer className="max-w-[1440px] gap-8">
      <EventDetailContent userId={session.data.user.id} eventId={eventId} />
    </PageContainer>
  );
}
