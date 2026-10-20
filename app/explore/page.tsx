import { CalendarSearchIcon } from "lucide-react";

import { DiscoverySearchForm } from "@/components/design-system/discovery-search-form";
import { PaginationBar } from "@/components/design-system/pagination-bar";
import { EmptyState } from "@/components/empty-state";
import { PageContainer } from "@/components/layout/page-container";
import { DiscoveryEventGrid } from "@/features/discovery/discovery-event-grid";
import {
  buildExploreHref,
  parsePageParam,
} from "@/lib/discovery-pagination";
import { createPageMetadata } from "@/lib/metadata";
import { getTranslations } from "@/lib/i18n/server";
import { parseExploreFilters } from "@/lib/services/discovery-filters";
import { searchPublicEventsPaginated } from "@/lib/services/discovery.service";
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
  const page = parsePageParam(query.page);
  const { t, locale } = await getTranslations();
  const [result, favoriteContext] = await Promise.all([
    searchPublicEventsPaginated(filters, page),
    getFavoriteUiContext(),
  ]);

  const previousHref =
    page > 1 ? buildExploreHref(filters, page - 1) : null;
  const nextHref =
    page < result.pageCount ? buildExploreHref(filters, page + 1) : null;

  return (
    <PageContainer className="max-w-[1440px] gap-6 sm:gap-8">
      <div className="space-y-2 border-b border-[var(--border)] pb-6">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("discovery.explorePageTitle")}
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-[0.9375rem]">
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

      {result.events.length === 0 ? (
        <EmptyState
          icon={CalendarSearchIcon}
          title={t("discovery.noEventsTitle")}
          description={t("discovery.noEventsDescription")}
        />
      ) : (
        <>
          <DiscoveryEventGrid
            events={result.events}
            locale={locale}
            t={t}
            favoriteEventIds={favoriteContext.favoriteEventIds}
            isAuthenticated={favoriteContext.isAuthenticated}
          />
          <PaginationBar
            page={result.page}
            pageCount={result.pageCount}
            previousHref={previousHref}
            nextHref={nextHref}
            previousLabel={t("discovery.pagination.previous")}
            nextLabel={t("discovery.pagination.next")}
            pageLabel={t("discovery.pagination.page", {
              page: result.page,
              total: result.pageCount,
            })}
          />
        </>
      )}
    </PageContainer>
  );
}
