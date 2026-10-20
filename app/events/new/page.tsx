import { EventForm } from "@/components/event-form";
import { PageContainer } from "@/components/layout/page-container";
import { createEventAction } from "@/lib/actions/events";
import { createPageMetadata } from "@/lib/metadata";
import { getTranslations } from "@/lib/i18n/server";

export async function generateMetadata() {
  const { t } = await getTranslations();

  return createPageMetadata({
    title: t("event.createTitle"),
    description: t("event.metadata.createDescription"),
  });
}

export default async function NewEventPage() {
  const { t } = await getTranslations();

  return (
    <PageContainer>
      <EventForm
        title={t("event.createTitle")}
        submitLabel={t("common.createEvent")}
        pendingLabel={t("event.creating")}
        cancelHref="/dashboard"
        action={createEventAction}
      />
    </PageContainer>
  );
}
