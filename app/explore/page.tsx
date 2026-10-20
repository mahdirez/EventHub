import { EventCard } from "@/components/design-system/event-card";
import { PageContainer } from "@/components/layout/page-container";
import { MOCK_POPULAR_EVENTS } from "@/lib/constants/mock-discovery";
import {
  formatCompactCount,
  formatEventDate,
} from "@/lib/format-discovery";
import { createPageMetadata } from "@/lib/metadata";
import { getTranslations } from "@/lib/i18n/server";

export async function generateMetadata() {
  const { t } = await getTranslations();

  return createPageMetadata({
    title: t("discovery.explorePageTitle"),
    description: t("discovery.explorePageDescription"),
  });
}

export default async function ExplorePage() {
  const { t, locale } = await getTranslations();

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
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_POPULAR_EVENTS.map((event) => (
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
