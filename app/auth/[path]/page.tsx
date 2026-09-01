import type { Metadata } from "next";
import { AuthView } from "@neondatabase/auth/react";

import { createPageMetadata, getAuthPageTitle } from "@/lib/metadata";
import { getTranslations } from "@/lib/i18n/server";

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ path: string }>;
}): Promise<Metadata> {
  const { path } = await params;
  const { t } = await getTranslations();

  return createPageMetadata({
    title: getAuthPageTitle(path, t),
    description: t("auth.description"),
  });
}

export default async function AuthPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;
  return (
    <main className="container mx-auto flex grow flex-col items-center justify-center gap-3 self-center p-4 md:p-6">
      <AuthView path={path} />
    </main>
  );
}
