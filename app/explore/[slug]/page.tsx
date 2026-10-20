import Image from "next/image";
import { notFound } from "next/navigation";

import { PageContainer } from "@/components/layout/page-container";
import {
  formatCompactCount,
  formatEventDate,
} from "@/lib/format-discovery";
import { createPageMetadata } from "@/lib/metadata";
import { getTranslations } from "@/lib/i18n/server";
import { getPublicEventBySlug } from "@/lib/services/discovery.service";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getPublicEventBySlug(slug);
  const { t } = await getTranslations();

  return createPageMetadata({
    title: event?.title ?? t("common.viewDetails"),
    description: event?.description ?? t("discovery.explorePageDescription"),
  });
}

export default async function ExploreEventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getPublicEventBySlug(slug);
  const { t, locale } = await getTranslations();

  if (!event) {
    notFound();
  }

  const scheduleLabel = event.dateIso
    ? `${formatEventDate(event.dateIso, locale)} • ${event.location}`
    : event.location;

  return (
    <PageContainer className="max-w-4xl gap-8">
      <article className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--card-shadow)]">
        <div className="relative aspect-[21/9] w-full">
          <Image
            src={event.imageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
            priority
          />
        </div>
        <div className="space-y-4 p-6 sm:p-8">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent-muted)]">
              {t(`discovery.categories.${event.categoryId}`)}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              {event.title}
            </h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              {scheduleLabel}
            </p>
          </div>
          {event.description ? (
            <p className="leading-relaxed text-[var(--muted-foreground)]">
              {event.description}
            </p>
          ) : null}
          <p className="text-sm text-[var(--muted-foreground)]">
            {t("discovery.rsvps", {
              count: formatCompactCount(event.rsvpCount),
            })}
          </p>
        </div>
      </article>
    </PageContainer>
  );
}
