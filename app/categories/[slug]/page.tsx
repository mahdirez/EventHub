import { notFound } from "next/navigation";

import { EventCard } from "@/components/design-system/event-card";
import { PageContainer } from "@/components/layout/page-container";
import {
  MOCK_CATEGORIES,
  MOCK_POPULAR_EVENTS,
  type MockCategoryId,
} from "@/lib/constants/mock-discovery";
import {
  formatCompactCount,
  formatEventDate,
} from "@/lib/format-discovery";
import { createPageMetadata } from "@/lib/metadata";
import { getTranslations } from "@/lib/i18n/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { t } = await getTranslations();
  const category = MOCK_CATEGORIES.find((row) => row.id === slug);

  return createPageMetadata({
    title: category
      ? t(`discovery.categories.${category.id}`)
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
  const category = MOCK_CATEGORIES.find((row) => row.id === slug);
  const { t, locale } = await getTranslations();

  if (!category) {
    notFound();
  }

  const events = MOCK_POPULAR_EVENTS.filter(
    (event) => event.categoryId === (slug as MockCategoryId),
  );

  return (
    <PageContainer className="max-w-[1440px] gap-8">
      <h1 className="text-3xl font-semibold tracking-tight">
        {t(`discovery.categories.${category.id}`)}
      </h1>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard
            key={event.id}
            title={event.title}
            categoryId={event.categoryId}
            categoryName={t(`discovery.categories.${event.categoryId}`)}
            imageUrl={event.imageUrl}
            scheduleLabel={`${formatEventDate(event.dateIso, locale)} • ${event.location}`}
            description={event.description}
            rsvpLabel={t("discovery.rsvps", {
              count: formatCompactCount(event.rsvpCount),
            })}
            viewDetailsLabel={t("common.viewDetails")}
            href={`/explore/${event.slug}`}
          />
        ))}
      </div>
    </PageContainer>
  );
}
