import { redirect } from "next/navigation";

import { PageContainer } from "@/components/layout/page-container";
import { MyEventsContent } from "@/features/discovery/my-events-content";
import { getSession } from "@/lib/auth/server";
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
  const session = await getSession();
  const user = session.data?.user;
  const { t } = await getTranslations();

  if (!user?.id) {
    redirect("/auth/sign-in");
  }

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
      <MyEventsContent userId={user.id} userEmail={user.email} />
    </PageContainer>
  );
}
