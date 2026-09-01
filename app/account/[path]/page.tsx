import type { Metadata } from "next";
import { AccountView, accountViewPaths } from "@neondatabase/auth/react";

import { createPageMetadata, getAccountPageTitle } from "@/lib/metadata";
import { getTranslations } from "@/lib/i18n/server";

export function generateStaticParams() {
  return Object.values(accountViewPaths).map((path) => ({ path }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ path: string }>;
}): Promise<Metadata> {
  const { path } = await params;
  const { t } = await getTranslations();

  return createPageMetadata({
    title: getAccountPageTitle(path, t),
    description: t("account.description"),
  });
}

export default async function AccountPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;

  return (
    <main className="container p-4 md-p-6">
      <AccountView path={path} />
    </main>
  );
}
