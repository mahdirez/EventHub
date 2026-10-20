import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  actionLabel,
  actionHref,
  className,
}: {
  title: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <h2 className="text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent-muted)] hover:text-[var(--accent)]"
        >
          {actionLabel}
          <ArrowRightIcon className="size-3.5 rtl:rotate-180" aria-hidden />
        </Link>
      ) : null}
    </div>
  );
}
