import type { Metadata } from "next";
import { AccountView, accountViewPaths } from "@neondatabase/auth/react";

import { createPageMetadata, getAccountPageTitle } from "@/lib/metadata";

export function generateStaticParams() {
  return Object.values(accountViewPaths).map((path) => ({ path }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ path: string }>;
}): Promise<Metadata> {
  const { path } = await params;

  return createPageMetadata({
    title: getAccountPageTitle(path),
    description: "Manage your EventHub account settings and security.",
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
