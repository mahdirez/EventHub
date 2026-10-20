"use client";

import { ChevronDownIcon } from "lucide-react";

import { UserButton } from "@neondatabase/auth/react";

export function HeaderUserMenu({ displayName }: { displayName: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] py-1 pe-2 ps-1">
      <UserButton size="icon" />
      <span className="hidden max-w-[120px] truncate text-sm font-medium text-foreground sm:inline">
        {displayName}
      </span>
      <ChevronDownIcon
        className="hidden size-3.5 text-[var(--muted-foreground)] sm:block"
        aria-hidden
      />
    </div>
  );
}
