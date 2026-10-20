import Link from "next/link";

import { cn } from "@/lib/utils";

export function PaginationBar({
  page,
  pageCount,
  previousHref,
  nextHref,
  previousLabel,
  nextLabel,
  pageLabel,
}: {
  page: number;
  pageCount: number;
  previousHref: string | null;
  nextHref: string | null;
  previousLabel: string;
  nextLabel: string;
  pageLabel: string;
}) {
  if (pageCount <= 1) {
    return null;
  }

  return (
    <nav
      className="flex flex-col items-center justify-between gap-3 border-t border-[var(--border)] pt-6 sm:flex-row"
      aria-label="Pagination"
    >
      <p className="text-sm text-[var(--muted-foreground)]">{pageLabel}</p>
      <div className="flex items-center gap-2">
        {previousHref ? (
          <Link
            href={previousHref}
            className={cn(
              "inline-flex h-9 items-center rounded-xl border border-[var(--border)]",
              "bg-[var(--surface)] px-3 text-sm font-medium transition hover:bg-[var(--surface-elevated)]",
            )}
          >
            {previousLabel}
          </Link>
        ) : (
          <span
            className="inline-flex h-9 cursor-not-allowed items-center rounded-xl border border-[var(--border)] px-3 text-sm text-[var(--muted-foreground)] opacity-50"
            aria-disabled
          >
            {previousLabel}
          </span>
        )}
        {nextHref ? (
          <Link
            href={nextHref}
            className={cn(
              "inline-flex h-9 items-center rounded-xl border border-[var(--border)]",
              "bg-[var(--surface)] px-3 text-sm font-medium transition hover:bg-[var(--surface-elevated)]",
            )}
          >
            {nextLabel}
          </Link>
        ) : (
          <span
            className="inline-flex h-9 cursor-not-allowed items-center rounded-xl border border-[var(--border)] px-3 text-sm text-[var(--muted-foreground)] opacity-50"
            aria-disabled
          >
            {nextLabel}
          </span>
        )}
      </div>
    </nav>
  );
}
