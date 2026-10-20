import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function SurfaceCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--card-shadow)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
