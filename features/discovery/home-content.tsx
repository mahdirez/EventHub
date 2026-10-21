import { SparklesIcon } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";

import { CategoryCard } from "@/components/design-system/category-card";
import { CreateEventSidebar } from "@/components/design-system/create-event-sidebar";
import { EventCard } from "@/components/design-system/event-card";
import { HeroSearch } from "@/components/design-system/hero-search";
import { PromoCard } from "@/components/design-system/promo-card";
import { SectionHeading } from "@/components/design-system/section-heading";
import { UpcomingFilterTabs } from "@/components/design-system/upcoming-filter-tabs";
import { PLACEHOLDER_IMAGES } from "@/lib/constants/placeholder-images";
import {
  formatCompactCount,
  formatEventDate,
} from "@/lib/format-discovery";
import { getTranslations } from "@/lib/i18n/server";
import {
  getDiscoveryCategories,
  getPopularDiscoveryEvents,
} from "@/lib/services/discovery.service";
import { getFavoriteUiContext } from "@/lib/services/favorites.service";

export async function HomeContent() {
  const { t, locale } = await getTranslations();
  const [categories, popularEvents, favoriteContext] = await Promise.all([
    getDiscoveryCategories(),
    getPopularDiscoveryEvents(),
    getFavoriteUiContext(),
  ]);

  const pageGutter = "mx-auto w-full max-w-[1440px] px-4 sm:px-6";

  return (
    <div className="flex flex-col gap-8 pb-10 sm:gap-10 sm:pb-12">
      <section className="flex flex-col gap-4 sm:gap-5">
        <div
          className="relative min-h-[min(280px,46vh)] w-full sm:min-h-[min(320px,50vh)]"
        >
          <Image
            src={PLACEHOLDER_IMAGES.hero}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div
            className="absolute inset-0 from-[var(--background)]/95 via-[var(--background)]/45 to-transparent ltr:bg-gradient-to-r rtl:bg-gradient-to-l"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-[var(--background)]/20"
            aria-hidden
          />
          <div
            className={`relative flex h-full min-h-[inherit] flex-col justify-end gap-4 pb-2 sm:gap-5 sm:pb-3 ${pageGutter}`}
          >
            <div className="w-full max-w-2xl">
              <span
                className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/80 px-3 py-1 text-xs font-medium text-[var(--muted-foreground)] backdrop-blur-sm"
              >
                <SparklesIcon className="size-3.5 text-[var(--accent)]" />
                {t("discovery.welcomeBadge")}
              </span>
              <div className="mt-4 space-y-2 sm:mt-5 sm:space-y-3">
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[2.5rem]">
                  {t("discovery.heroTitle1")}
                  <br />
                  <span className="text-[var(--accent)]">
                    {t("discovery.heroTitle2")}
                  </span>
                </h1>
                <p className="max-w-lg text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-[0.9375rem]">
                  {t("discovery.heroDescription")}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className={pageGutter}>
          <HeroSearch />
        </div>
      </section>

      <div className={`${pageGutter} flex flex-col gap-8 sm:gap-10`}>
        <section className="space-y-4">
          <SectionHeading
            title={t("discovery.exploreCategories")}
            actionLabel={t("discovery.viewAllCategories")}
            actionHref="/categories"
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                id={category.id}
                name={t(`discovery.categories.${category.id}`)}
                eventsLabel={t("discovery.eventsCount", {
                  count: category.eventCount,
                })}
              />
            ))}
          </div>
        </section>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
          <section className="min-w-0 space-y-4">
            <SectionHeading
              title={t("discovery.popularEvents")}
              actionLabel={t("discovery.viewAllEvents")}
              actionHref="/explore"
            />
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
              {popularEvents.map((event) => (
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
                  href={`/explore/${event.slug}`}
                  favorited={favoriteContext.favoriteEventIds.has(event.id)}
                  isAuthenticated={favoriteContext.isAuthenticated}
                />
              ))}
            </div>
          </section>

          <aside className="flex flex-col gap-4 lg:sticky lg:top-[5.5rem] lg:gap-5">
            <CreateEventSidebar
              title={t("discovery.createCard.title")}
              description={t("discovery.createCard.description")}
              ctaLabel={t("discovery.createCard.cta")}
              features={{
                registration: t("discovery.createCard.featureRegistration"),
                invite: t("discovery.createCard.featureInvite"),
                track: t("discovery.createCard.featureTrack"),
              }}
            />
            <PromoCard
              title={t("discovery.promo.title")}
              description={t("discovery.promo.description")}
              ctaLabel={t("discovery.promo.cta")}
            />
          </aside>
        </div>

        <section
          className="flex flex-col gap-4 border-t border-[var(--border)] pt-6 sm:flex-row sm:items-center sm:justify-between sm:pt-8"
        >
          <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            {t("discovery.upcomingEvents")}
          </h2>
          <Suspense fallback={null}>
            <UpcomingFilterTabs
              labels={{
                all: t("discovery.filters.all"),
                week: t("discovery.filters.week"),
                month: t("discovery.filters.month"),
              }}
            />
          </Suspense>
        </section>
      </div>
    </div>
  );
}
