"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

export function UpcomingFilterTabs({
  labels,
}: {
  labels: { all: string; week: string; month: string };
}) {
  const searchParams = useSearchParams();
  const current = searchParams.get("upcoming") ?? "all";

  const tabs = [
    { id: "all", label: labels.all },
    { id: "week", label: labels.week },
    { id: "month", label: labels.month },
  ] as const;

  return (
    <div className="inline-flex rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1">
      {tabs.map((tab) => {
        const active = current === tab.id;
        return (
          <Link
            key={tab.id}
            href={tab.id === "all" ? "/" : `/?upcoming=${tab.id}`}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition",
              active
                ? "bg-[var(--accent)] text-white"
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
