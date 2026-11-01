"use client";

import { DiscoverySearchForm } from "@/components/design-system/discovery-search-form";

export function HeroSearch({
  categoryOptions,
}: {
  categoryOptions: { slug: string }[];
}) {
  return <DiscoverySearchForm categoryOptions={categoryOptions} />;
}
