import { PageContainer } from "@/components/layout/page-container";
import { MyEventsContent } from "@/features/discovery/my-events-content";
import { createPageMetadata } from "@/lib/metadata";
import { getTranslations } from "@/lib/i18n/server";

export async function generateMetadata() {
  const { t } = await getTranslations();

  return createPageMetadata({
    title: t("discovery.myEventsPageTitle"),
    description: t("discovery.myEventsPageDescription"),
  });
}

export default async function MyEventsPage() {
  const { t } = await getTranslations();

  return (
    <PageContainer className="max-w-[1440px] gap-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          {t("discovery.myEventsPageTitle")}
        </h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          {t("discovery.myEventsPageDescription")}
        </p>
      </div>
      <MyEventsContent />
    </PageContainer>
  );
}
