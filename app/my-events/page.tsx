import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
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
  const { t } = await getTranslations();
  const session = await getSession();

  return (
    <PageContainer className="max-w-2xl">
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">
          {t("discovery.myEventsPageTitle")}
        </h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          {t("discovery.myEventsPageDescription")}
        </p>
        {!session.data ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <p className="text-sm text-[var(--muted-foreground)]">
              {t("discovery.myEventsEmpty")}
            </p>
            <Button asChild className="mt-4">
              <Link href="/auth/sign-in">{t("auth.signIn")}</Link>
            </Button>
          </div>
        ) : (
          <p className="text-sm text-[var(--muted-foreground)]">
            {t("discovery.myEventsEmpty")}
          </p>
        )}
      </div>
    </PageContainer>
  );
}
