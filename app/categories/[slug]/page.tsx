import { CalendarSearchIcon } from "lucide-react";
import { notFound } from "next/navigation";

import { PaginationBar } from "@/components/design-system/pagination-bar";
import { EmptyState } from "@/components/empty-state";
import { PageContainer } from "@/components/layout/page-container";
import { DiscoveryEventGrid } from "@/features/discovery/discovery-event-grid";
import {
  buildCategoryHref,
  parsePageParam,
} from "@/lib/discovery-pagination";
import { createPageMetadata } from "@/lib/metadata";
import { getTranslations } from "@/lib/i18n/server";
import { isCategoryId } from "@/lib/services/discovery-mappers";
import {
  categoryExists,
  searchPublicEventsPaginated,
} from "@/lib/services/discovery.service";
import { getFavoriteUiContext } from "@/lib/services/favorites.service";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { t } = await getTranslations();

  return createPageMetadata({
    title: isCategoryId(slug)
      ? t(`discovery.categories.${slug}`)
      : t("discovery.categoriesPageTitle"),
    description: t("discovery.categoriesPageDescription"),
  });
}

export default async function CategoryDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const page = parsePageParam(query.page);
  const { t, locale } = await getTranslations();

  if (!isCategoryId(slug) || !(await categoryExists(slug))) {
    notFound();
  }

  const [result, favoriteContext] = await Promise.all([
    searchPublicEventsPaginated({ category: slug }, page),
    getFavoriteUiContext(),
  ]);

  const previousHref = page > 1 ? buildCategoryHref(slug, page - 1) : null;
  const nextHref =
    page < result.pageCount ? buildCategoryHref(slug, page + 1) : null;

  return (
    <PageContainer className="max-w-[1440px] gap-8">
      <h1 className="text-3xl font-semibold tracking-tight">
        {t(`discovery.categories.${slug}`)}
      </h1>
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
