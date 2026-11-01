import { CalendarHeartIcon, HeartIcon } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { SectionHeading } from "@/components/design-system/section-heading";
import { Button } from "@/components/ui/button";
import { DiscoveryEventGrid } from "@/features/discovery/discovery-event-grid";
import {
  getFavoriteEventsForUser,
  getFavoriteUiContext,
} from "@/lib/services/favorites.service";
import { getRsvpEventsForUserEmail } from "@/lib/services/my-events.service";
import { getTranslations } from "@/lib/i18n/server";

type MyEventsContentProps = {
  userId: string;
  userEmail: string | undefined;
};

export async function MyEventsContent({
  userId,
  userEmail,
}: MyEventsContentProps) {
  const { t, locale } = await getTranslations();

  const [favorites, rsvpEvents, favoriteContext] = await Promise.all([
    getFavoriteEventsForUser(userId),
    getRsvpEventsForUserEmail(userEmail),
    getFavoriteUiContext(),
  ]);

  const hasAny = favorites.length > 0 || rsvpEvents.length > 0;

  if (!hasAny) {
    return (
      <EmptyState
        icon={CalendarHeartIcon}
        title={t("discovery.myEventsEmptyTitle")}
        description={t("discovery.myEventsEmptyDescription")}
        action={
          <Button asChild>
            <Link href="/explore">{t("discovery.promo.cta")}</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {favorites.length > 0 ? (
        <section className="space-y-5">
          <SectionHeading
            title={t("discovery.myEventsSaved")}
            actionLabel={t("discovery.viewAllEvents")}
            actionHref="/explore"
          />
          <DiscoveryEventGrid
            events={favorites}
            locale={locale}
            t={t}
            favoriteEventIds={favoriteContext.favoriteEventIds}
            isAuthenticated={favoriteContext.isAuthenticated}
          />
        </section>
      ) : null}

      {rsvpEvents.length > 0 ? (
        <section className="space-y-5">
          <SectionHeading title={t("discovery.myEventsRsvps")} />
          <DiscoveryEventGrid
            events={rsvpEvents}
            locale={locale}
            t={t}
            favoriteEventIds={favoriteContext.favoriteEventIds}
            isAuthenticated={favoriteContext.isAuthenticated}
            resolveHref={(event) => {
              const rsvp = rsvpEvents.find((row) => row.id === event.id);
              return rsvp?.inviteHref ?? `/explore/${event.slug}`;
            }}
          />
        </section>
      ) : null}

      {favorites.length === 0 && rsvpEvents.length > 0 ? (
        <p className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
          <HeartIcon className="size-4" aria-hidden />
          {t("discovery.myEventsSaveHint")}
        </p>
      ) : null}
    </div>
  );
}
