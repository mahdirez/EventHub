import { CalendarDaysIcon } from "lucide-react";

import { PaginationBar } from "@/components/design-system/pagination-bar";
import { PrimaryButton } from "@/components/design-system/primary-button";
import { OrganizerEventCard } from "@/components/design-system/organizer-event-card";
import { SurfaceCard } from "@/components/design-system/surface-card";
import { EmptyState } from "./empty-state";
import { OrganizerPageHeader } from "@/components/layout/organizer-page-header";
import { countByStatus } from "@/lib/event-rsvp-stats";
import { formatEventSchedule } from "@/lib/copy";
import { prisma } from "@/lib/prisma";
import {
  buildDashboardHref,
  getPageCount,
  ORGANIZER_PAGE_SIZE,
} from "@/lib/discovery-pagination";
import { getTranslations } from "@/lib/i18n/server";

export async function DashboardContent({
  userId,
  page = 1,
}: {
  userId: string;
  page?: number;
}) {
  const { t, dictionary } = await getTranslations();
  const safePage = Math.max(1, page);
  const where = { ownerUserId: userId };

  const [total, rows] = await prisma.$transaction([
    prisma.event.count({ where }),
    prisma.event.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    skip: (safePage - 1) * ORGANIZER_PAGE_SIZE,
    take: ORGANIZER_PAGE_SIZE,
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
  }),
  ]);

  const pageCount = getPageCount(total, ORGANIZER_PAGE_SIZE);

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
        <>
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
        <PaginationBar
          page={safePage}
          pageCount={pageCount}
          previousHref={safePage > 1 ? buildDashboardHref(safePage - 1) : null}
          nextHref={
            safePage < pageCount ? buildDashboardHref(safePage + 1) : null
          }
          previousLabel={t("discovery.pagination.previous")}
          nextLabel={t("discovery.pagination.next")}
          pageLabel={t("discovery.pagination.page", {
            page: safePage,
            total: pageCount,
          })}
        />
        </>
      )}
    </div>
  );
}
