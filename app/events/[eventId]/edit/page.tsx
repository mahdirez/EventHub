import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { EventForm } from "@/components/event-form";
import { OrganizerPageHeader } from "@/components/layout/organizer-page-header";
import { PageContainer } from "@/components/layout/page-container";
import { updateEventAction } from "@/lib/actions/events";
import { getSession } from "@/lib/auth/server";
import { createPageMetadata } from "@/lib/metadata";
import { getTranslations } from "@/lib/i18n/server";
import { prisma } from "@/lib/prisma";

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
    title: event ? `${t("event.editTitle")} · ${event.title}` : t("event.editTitle"),
    description: t("event.metadata.editDescription"),
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
      visibility: true,
      categorySlug: true,
      coverImageUrl: true,
      city: true,
      slug: true,
    },
  });

  if (!event) {
    notFound();
  }

  const updateAction = updateEventAction.bind(null, event.id);
  const { t } = await getTranslations();

  return (
    <PageContainer className="max-w-[1440px] gap-8">
      <OrganizerPageHeader
        title={t("event.editTitle")}
        description={t("event.metadata.editDescription")}
      />
      <EventForm
      submitLabel={t("common.saveChanges")}
      pendingLabel={t("event.saving")}
      cancelHref={`/events/${event.id}`}
      action={updateAction}
      defaultValues={{
        title: event.title,
        description: event.description,
        location: event.location,
        eventDate: event.eventDate,
        capacity: event.capacity,
        visibility: event.visibility,
        categorySlug: event.categorySlug,
        coverImageUrl: event.coverImageUrl,
        city: event.city,
        slug: event.slug,
      }}
    />
    </PageContainer>
  );
}
