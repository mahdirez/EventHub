import Link from "next/link";

import { SurfaceCard } from "@/components/design-system/surface-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function OrganizerEventCard({
  title,
  scheduleLabel,
  visibilityLabel,
  goingLabel,
  maybeLabel,
  notGoingLabel,
  viewDetailsLabel,
  href,
  publicHref,
  viewPublicLabel,
}: {
  title: string;
  scheduleLabel: string;
  visibilityLabel: string;
  goingLabel: string;
  maybeLabel: string;
  notGoingLabel: string;
  viewDetailsLabel: string;
  href: string;
  publicHref?: string | null;
  viewPublicLabel?: string;
}) {
  return (
    <SurfaceCard className="flex h-full flex-col p-5">
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold leading-snug text-foreground">
            {title}
          </h3>
          <Badge variant="secondary" className="shrink-0">
            {visibilityLabel}
          </Badge>
        </div>
        <p className="text-sm text-[var(--muted-foreground)]">{scheduleLabel}</p>
        <div className="flex flex-wrap gap-2 text-xs">
          <Badge variant="outline">{goingLabel}</Badge>
          <Badge variant="outline">{maybeLabel}</Badge>
          <Badge variant="outline">{notGoingLabel}</Badge>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button asChild size="sm">
          <Link href={href}>{viewDetailsLabel}</Link>
        </Button>
        {publicHref && viewPublicLabel ? (
          <Button asChild size="sm" variant="outline">
            <Link href={publicHref}>{viewPublicLabel}</Link>
          </Button>
        ) : null}
      </div>
    </SurfaceCard>
  );
}
