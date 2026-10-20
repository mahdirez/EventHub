import { CalendarSearchIcon } from "lucide-react";

import { DiscoverySearchForm } from "@/components/design-system/discovery-search-form";
import { EmptyState } from "@/components/empty-state";
import { PageContainer } from "@/components/layout/page-container";
import { DiscoveryEventGrid } from "@/features/discovery/discovery-event-grid";
import { createPageMetadata } from "@/lib/metadata";
import { getTranslations } from "@/lib/i18n/server";
import { parseExploreFilters } from "@/lib/services/discovery-filters";
import { searchPublicEvents } from "@/lib/services/discovery.service";
import { getFavoriteUiContext } from "@/lib/services/favorites.service";

export async function generateMetadata() {
  const { t } = await getTranslations();

  return createPageMetadata({
    title: t("discovery.explorePageTitle"),
    description: t("discovery.explorePageDescription"),
  });
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const filters = parseExploreFilters(query);
  const { t, locale } = await getTranslations();
  const [events, favoriteContext] = await Promise.all([
    searchPublicEvents(filters),
    getFavoriteUiContext(),
  ]);

  return (
    <PageContainer className="max-w-[1440px] gap-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          {t("discovery.explorePageTitle")}
        </h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          {t("discovery.explorePageDescription")}
        </p>
      </div>

      <DiscoverySearchForm
        defaultValues={{
          q: filters.q,
          date: filters.date,
          location: filters.location,
          category: filters.category,
        }}
      />

      {events.length === 0 ? (
        <EmptyState
          icon={CalendarSearchIcon}
          title={t("discovery.noEventsTitle")}
          description={t("discovery.noEventsDescription")}
        />
      ) : (
        <DiscoveryEventGrid
          events={events}
          locale={locale}
          t={t}
          favoriteEventIds={favoriteContext.favoriteEventIds}
          isAuthenticated={favoriteContext.isAuthenticated}
        />
      )}
    </PageContainer>
  );
}
