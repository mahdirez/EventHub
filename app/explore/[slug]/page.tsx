import { notFound } from "next/navigation";

import { PageContainer } from "@/components/layout/page-container";
import { MOCK_POPULAR_EVENTS } from "@/lib/constants/mock-discovery";
import { createPageMetadata } from "@/lib/metadata";
import { getTranslations } from "@/lib/i18n/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = MOCK_POPULAR_EVENTS.find((row) => row.slug === slug);
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
  const event = MOCK_POPULAR_EVENTS.find((row) => row.slug === slug);
  const { t } = await getTranslations();

  if (!event) {
    notFound();
  }

  return (
    <PageContainer className="max-w-3xl">
      <article className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">{event.title}</h1>
        <p className="text-sm text-[var(--muted-foreground)]">{event.location}</p>
        <p className="leading-relaxed text-[var(--muted-foreground)]">
          {event.description}
        </p>
        <p className="text-sm text-[var(--muted-foreground)]">
          {t("discovery.rsvps", {
            count: String(event.rsvpCount),
          })}
        </p>
      </article>
    </PageContainer>
  );
}
