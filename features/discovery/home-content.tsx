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

export async function HomeContent() {
  const { t, locale } = await getTranslations();
  const [categories, popularEvents] = await Promise.all([
    getDiscoveryCategories(),
    getPopularDiscoveryEvents(),
  ]);

  return (
    <div className="flex flex-col gap-10 pb-12">
      <section className="relative mx-4 overflow-hidden rounded-3xl border border-[var(--border)] sm:mx-6">
        <div className="relative min-h-[min(520px,72vh)]">
          <Image
            src={PLACEHOLDER_IMAGES.hero}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#050a14]/95 via-[#050a14]/70 to-[#050a14]/25"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#050a14] via-transparent to-[#050a14]/30"
            aria-hidden
          />
          <div className="relative flex h-full flex-col justify-end gap-6 p-6 pb-8 sm:p-10 lg:max-w-3xl">
            <span
              className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--border)] bg-black/25 px-3 py-1 text-xs font-medium text-[var(--muted-foreground)] backdrop-blur-sm"
            >
              <SparklesIcon className="size-3.5 text-[var(--hero-highlight)]" />
              {t("discovery.welcomeBadge")}
            </span>
            <div className="space-y-3">
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
                {t("discovery.heroTitle1")}
                <br />
                <span className="text-gradient-hero">
                  {t("discovery.heroTitle2")}
                </span>
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
                {t("discovery.heroDescription")}
              </p>
            </div>
          </div>
        </div>
        <div className="relative z-10 -mt-6 px-4 pb-6 sm:px-8 sm:pb-8">
          <HeroSearch />
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1440px] space-y-10 px-4 sm:px-6">
        <section className="space-y-5">
          <SectionHeading
            title={t("discovery.exploreCategories")}
            actionLabel={t("discovery.viewAllCategories")}
            actionHref="/categories"
          />
          <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <section className="space-y-5">
            <SectionHeading
              title={t("discovery.popularEvents")}
              actionLabel={t("discovery.viewAllEvents")}
              actionHref="/explore"
            />
            <div className="grid gap-5 sm:grid-cols-2">
              {popularEvents.map((event) => (
                <EventCard
                  key={event.id}
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
                />
              ))}
            </div>
          </section>

          <div className="flex flex-col gap-5">
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
          </div>
        </div>

        <section className="flex flex-col gap-4 border-t border-[var(--border)] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-foreground">
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
