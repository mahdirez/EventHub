import { CalendarDaysIcon } from "lucide-react";

import { PrimaryButton } from "@/components/design-system/primary-button";
import { OrganizerEventCard } from "@/components/design-system/organizer-event-card";
import { SurfaceCard } from "@/components/design-system/surface-card";
import { EmptyState } from "./empty-state";
import { OrganizerPageHeader } from "@/components/layout/organizer-page-header";
import type { RsvpStatus as PrismaRsvpStatus } from "@/app/generated/prisma/enums";
import { formatEventSchedule } from "@/lib/copy";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "@/lib/i18n/server";

export function countByStatus(rsvps: { status: PrismaRsvpStatus }[]) {
  let goingCount = 0;
  let maybeCount = 0;
  let notGoingCount = 0;
  for (const r of rsvps) {
    if (r.status === "going") goingCount += 1;
    else if (r.status === "maybe") maybeCount += 1;
    else if (r.status === "not_going") notGoingCount += 1;
  }
  return { goingCount, maybeCount, notGoingCount };
}

export async function DashboardContent({ userId }: { userId: string }) {
  const { t, dictionary } = await getTranslations();

  const rows = await prisma.event.findMany({
    where: {
      ownerUserId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      eventDate: true,
      location: true,
      city: true,
      visibility: true,
      slug: true,
      rsvps: { select: { status: true } },
    },
  });

  const events = rows.map((row) => {
    const counts = countByStatus(row.rsvps);
    const locationLabel = row.city ?? row.location;
    return {
      id: row.id,
      title: row.title,
      eventDate: row.eventDate ? row.eventDate.toISOString() : null,
      location: locationLabel,
      visibility: row.visibility,
      slug: row.slug,
      ...counts,
    };
  });

  return (
    <div className="flex flex-1 flex-col gap-8">
      <OrganizerPageHeader
        title={t("dashboard.title")}
        description={t("dashboard.description")}
        actions={
          <PrimaryButton href="/events/new" showArrow={false}>
            {t("common.createEvent")}
          </PrimaryButton>
        }
      />

      {events.length === 0 ? (
        <SurfaceCard>
          <EmptyState
            icon={CalendarDaysIcon}
            title={t("dashboard.emptyTitle")}
            description={t("dashboard.emptyDescription")}
            action={
              <PrimaryButton href="/events/new" showArrow={false}>
                {t("dashboard.createFirstEvent")}
              </PrimaryButton>
            }
          />
        </SurfaceCard>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {events.map((event) => (
            <OrganizerEventCard
              key={event.id}
              title={event.title}
              scheduleLabel={formatEventSchedule(
                event.eventDate,
                dictionary.common.noDateSet,
                event.location,
              )}
              visibilityLabel={
                event.visibility === "public"
                  ? t("event.form.visibilityPublic")
                  : t("event.form.visibilityPrivate")
              }
              goingLabel={t("badges.going", { count: event.goingCount })}
              maybeLabel={t("badges.maybe", { count: event.maybeCount })}
              notGoingLabel={t("badges.notGoing", { count: event.notGoingCount })}
              viewDetailsLabel={t("common.viewDetails")}
              href={`/events/${event.id}`}
              publicHref={
                event.visibility === "public" && event.slug
                  ? `/explore/${event.slug}`
                  : null
              }
              viewPublicLabel={t("event.viewPublicPage")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
