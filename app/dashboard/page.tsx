import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/server";
import { DashboardContent } from "@/components/dashboard-content";
import { PageContainer } from "@/components/layout/page-container";
import { parsePageParam } from "@/lib/discovery-pagination";
import { createPageMetadata } from "@/lib/metadata";
import { getTranslations } from "@/lib/i18n/server";

export async function generateMetadata() {
  const { t } = await getTranslations();

  return createPageMetadata({
    title: t("common.dashboard"),
    description: t("dashboard.metadataDescription"),
  });
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getSession();
  const userId = session.data?.user?.id;
  const query = await searchParams;

  if (!userId) {
    redirect("/auth");
  }

  return (
    <PageContainer className="max-w-[1440px] gap-8">
      <DashboardContent
        userId={userId}
        page={parsePageParam(query.page)}
      />
    </PageContainer>
  );
}
