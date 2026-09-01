"use client";

import Link from "next/link";

import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { useI18n } from "@/components/i18n-provider";
import { UserButton } from "@neondatabase/auth/react";

export function SiteHeader() {
  const { t } = useI18n();

  return (
    <header className="border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-sm font-semibold tracking-wide">
          {t("site.name")}
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/dashboard"
            className="text-sm text-[var(--muted-foreground)]"
          >
            {t("common.dashboard")}
          </Link>
          <LanguageSwitcher />
          <ThemeToggle />
          <UserButton size="icon" />
        </nav>
      </div>
    </header>
  );
}
