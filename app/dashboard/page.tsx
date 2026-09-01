import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/server";
import { DashboardContent } from "@/components/dashboard-content";
import { createPageMetadata } from "@/lib/metadata";
import { getTranslations } from "@/lib/i18n/server";

export async function generateMetadata() {
  const { t } = await getTranslations();

  return createPageMetadata({
    title: t("common.dashboard"),
    description: t("dashboard.metadataDescription"),
  });
}

export default async function DashboardPage() {
  const session = await getSession();
  const userId = session.data?.user?.id;

  if (!userId) {
    redirect("/auth");
  }

  return <DashboardContent userId={userId} />;
}
