import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-10 text-center",
        className,
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-[var(--muted)]">
        <Icon className="size-5 text-[var(--muted-foreground)]" />
      </div>
      <div className="space-y-1.5">
        <p className="font-medium">{title}</p>
        <p className="mx-auto max-w-sm text-sm text-[var(--muted-foreground)]">
          {description}
        </p>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
