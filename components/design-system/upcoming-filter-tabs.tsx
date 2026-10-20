"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

export function UpcomingFilterTabs({
  labels,
}: {
  labels: { all: string; week: string; month: string };
}) {
  const searchParams = useSearchParams();
  const current = searchParams.get("date") ?? "all";

  const tabs = [
    { id: "all", label: labels.all, href: "/explore" },
    { id: "week", label: labels.week, href: "/explore?date=week" },
    { id: "month", label: labels.month, href: "/explore?date=month" },
  ] as const;

  const pathname = usePathname();

  function isTabActive(tabId: typeof tabs[number]["id"]) {
    if (tabId === "all") {
      return (
        pathname === "/" ||
        (pathname === "/explore" && current === "all")
      );
    }

    return pathname === "/explore" && current === tabId;
  }

  return (
    <div
      className="inline-flex max-w-full flex-wrap rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1"
    >
      {tabs.map((tab) => {
        const active = isTabActive(tab.id);
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition",
              active
                ? "bg-[var(--surface-elevated)] text-foreground ring-1 ring-[var(--accent)]/25"
                : "text-[var(--muted-foreground)] hover:text-foreground",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
