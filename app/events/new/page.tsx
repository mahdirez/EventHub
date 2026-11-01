import { EventForm } from "@/components/event-form";
import { OrganizerPageHeader } from "@/components/layout/organizer-page-header";
import { PageContainer } from "@/components/layout/page-container";
import { createEventAction } from "@/lib/actions/events";
import { createPageMetadata } from "@/lib/metadata";
import { getTranslations } from "@/lib/i18n/server";
import { listCategoryOptions } from "@/lib/services/category.service";

export async function generateMetadata() {
  const { t } = await getTranslations();

  return createPageMetadata({
    title: t("event.createTitle"),
    description: t("event.metadata.createDescription"),
  });
}

export default async function NewEventPage() {
  const { t } = await getTranslations();
  const categories = await listCategoryOptions();

  return (
    <PageContainer className="max-w-[1440px] gap-8">
      <OrganizerPageHeader
        title={t("event.createTitle")}
        description={t("event.metadata.createDescription")}
      />
      <EventForm
        categories={categories}
        submitLabel={t("common.createEvent")}
        pendingLabel={t("event.creating")}
        cancelHref="/dashboard"
        action={createEventAction}
      />
    </PageContainer>
  );
}
