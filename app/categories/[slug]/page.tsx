import { CalendarSearchIcon } from "lucide-react";
import { notFound } from "next/navigation";

import { EmptyState } from "@/components/empty-state";
import { PageContainer } from "@/components/layout/page-container";
import { DiscoveryEventGrid } from "@/features/discovery/discovery-event-grid";
import { createPageMetadata } from "@/lib/metadata";
import { getTranslations } from "@/lib/i18n/server";
import { isCategoryId } from "@/lib/services/discovery-mappers";
import {
  categoryExists,
  searchPublicEvents,
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
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { t, locale } = await getTranslations();

  if (!isCategoryId(slug) || !(await categoryExists(slug))) {
    notFound();
  }

  const [events, favoriteContext] = await Promise.all([
    searchPublicEvents({ category: slug }),
    getFavoriteUiContext(),
  ]);

  return (
    <PageContainer className="max-w-[1440px] gap-8">
      <h1 className="text-3xl font-semibold tracking-tight">
        {t(`discovery.categories.${slug}`)}
      </h1>
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
