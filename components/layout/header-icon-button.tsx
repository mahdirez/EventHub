"use client";

import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function HeaderIconButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-xl border border-[var(--border)]",
        "bg-[var(--surface)] text-[var(--muted-foreground)] transition hover:text-foreground",
      )}
    >
      <Icon className="size-4" aria-hidden />
    </button>
  );
}
