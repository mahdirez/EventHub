import { EventCard } from "@/components/design-system/event-card";
import {
  formatCompactCount,
  formatEventDate,
} from "@/lib/format-discovery";
import type { DiscoveryEventCard } from "@/lib/services/discovery.service";
import type { Translator } from "@/lib/i18n";

export function DiscoveryEventGrid({
  events,
  locale,
  t,
  favoriteEventIds,
  isAuthenticated,
  resolveHref,
}: {
  events: DiscoveryEventCard[];
  locale: string;
  t: Translator;
  favoriteEventIds: Set<string>;
  isAuthenticated: boolean;
  resolveHref?: (event: DiscoveryEventCard) => string;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard
          key={event.id}
          eventId={event.id}
          title={event.title}
          categoryId={event.categoryId}
          categoryName={t(`discovery.categories.${event.categoryId}`)}
          imageUrl={event.imageUrl}
          scheduleLabel={
            event.dateIso
              ? `${formatEventDate(event.dateIso, locale)} • ${event.location}`
              : event.location
          }
          description={event.description}
          rsvpLabel={t("discovery.rsvps", {
            count: formatCompactCount(event.rsvpCount),
          })}
          viewDetailsLabel={t("common.viewDetails")}
          href={resolveHref?.(event) ?? `/explore/${event.slug}`}
          favorited={favoriteEventIds.has(event.id)}
          isAuthenticated={isAuthenticated}
        />
      ))}
    </div>
  );
}
