import { UsersIcon } from "lucide-react";
import Link from "next/link";

import { EventCardCover } from "@/components/design-system/event-card-cover";
import { EventFavoriteButton } from "@/components/design-system/event-favorite-button";
import type { MockCategoryId } from "@/lib/constants/mock-discovery";
import { categoryCoverFallback } from "@/lib/discovery-images";
import { cn } from "@/lib/utils";

const categoryBadgeStyles: Record<MockCategoryId, string> = {
  technology: "bg-sky-500/90 text-white",
  music: "bg-violet-500/90 text-white",
  business: "bg-emerald-500/90 text-white",
  art: "bg-pink-500/90 text-white",
  education: "bg-amber-500/90 text-white",
  sports: "bg-orange-500/90 text-white",
};

export function EventCard({
  eventId,
  title,
  categoryId,
  categoryName,
  imageUrl,
  scheduleLabel,
  description,
  rsvpLabel,
  viewDetailsLabel,
  href,
  favorited = false,
  isAuthenticated = false,
}: {
  eventId: string;
  title: string;
  categoryId: MockCategoryId;
  categoryName: string;
  imageUrl: string;
  scheduleLabel: string;
  description: string;
  rsvpLabel: string;
  viewDetailsLabel: string;
  href: string;
  favorited?: boolean;
  isAuthenticated?: boolean;
}) {
  const fallbackUrl = categoryCoverFallback[categoryId];

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]",
        "shadow-[var(--card-shadow)] transition-[border-color,box-shadow] duration-200",
        "hover:border-[var(--accent-muted)]/35 hover:shadow-[0_20px_40px_-24px_rgb(0_0_0_/_0.55)]",
      )}
    >
      <div className="relative">
        <EventCardCover
          imageUrl={imageUrl}
          fallbackUrl={fallbackUrl}
          title={title}
        />
        <span
          className={cn(
            "absolute start-3 top-3 rounded-lg px-2.5 py-1 text-xs font-medium",
            categoryBadgeStyles[categoryId],
          )}
        >
          {categoryName}
        </span>
        <EventFavoriteButton
          eventId={eventId}
          initialFavorited={favorited}
          isAuthenticated={isAuthenticated}
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="space-y-1.5">
          <h3 className="text-base font-semibold leading-snug text-foreground line-clamp-2">
            {title}
          </h3>
          <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
            {scheduleLabel}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
          <span
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-elevated)] text-[var(--accent-muted)]"
            aria-hidden
          >
            <UsersIcon className="size-4" />
          </span>
          <span>{rsvpLabel}</span>
        </div>
        {description ? (
          <p className="line-clamp-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
            {description}
          </p>
        ) : null}
        <Link
          href={href}
          className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)]"
        >
          {viewDetailsLabel}
          <span aria-hidden className="rtl:rotate-180">→</span>
        </Link>
      </div>
    </article>
  );
}
