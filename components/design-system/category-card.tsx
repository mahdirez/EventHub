import Link from "next/link";

import {
  getCategoryAccentClass,
  getCategoryIcon,
} from "@/lib/category-display";
import { cn } from "@/lib/utils";

export function CategoryCard({
  slug,
  name,
  eventsLabel,
}: {
  slug: string;
  name: string;
  eventsLabel: string;
}) {
  const Icon = getCategoryIcon(slug);

  return (
    <Link
      href={`/categories/${slug}`}
      className={cn(
        "flex h-full min-h-[7.5rem] flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4",
        "shadow-[var(--card-shadow)] transition-[border-color,background-color] duration-200",
        "hover:border-[var(--accent-muted)]/40 hover:bg-[var(--surface-elevated)]",
      )}
    >
      <span
        className={cn(
          "inline-flex size-10 shrink-0 items-center justify-center rounded-xl",
          getCategoryAccentClass(slug),
        )}
      >
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="mt-auto space-y-0.5">
        <p className="text-sm font-semibold leading-snug text-foreground">
          {name}
        </p>
        <p className="text-xs text-[var(--muted-foreground)]">{eventsLabel}</p>
      </div>
    </Link>
  );
}
