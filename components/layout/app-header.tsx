import { CalendarDaysIcon, SearchIcon } from "lucide-react";
import Link from "next/link";

import { AppHeaderNav } from "@/components/layout/app-header-nav";
import { HeaderLanguageSwitcher } from "@/components/layout/header-language-switcher";
import { HeaderThemeToggle } from "@/components/layout/header-theme-toggle";
import { HeaderUserMenu } from "@/components/layout/header-user-menu";
import { getSession } from "@/lib/auth/server";
import { getTranslations } from "@/lib/i18n/server";

export async function AppHeader() {
  const { t } = await getTranslations();
  const session = await getSession();
  const user = session.data?.user;
  const displayName =
    user?.name?.trim() ||
    user?.email?.split("@")[0] ||
    t("nav.guest");

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span
              className="inline-flex size-9 items-center justify-center rounded-xl bg-[var(--accent)] text-white shadow-[0_8px_24px_-8px_rgb(59_130_246_/_0.8)]"
            >
              <CalendarDaysIcon className="size-5" aria-hidden />
            </span>
            <span className="text-base font-semibold tracking-tight text-foreground">
              {t("site.name")}
            </span>
          </Link>
          <AppHeaderNav />
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/explore"
            aria-label={t("discovery.search")}
            className="hidden size-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--muted-foreground)] transition hover:text-foreground sm:inline-flex"
          >
            <SearchIcon className="size-4" aria-hidden />
          </Link>
          <HeaderThemeToggle />
          <HeaderLanguageSwitcher />
          {user ? (
            <HeaderUserMenu displayName={displayName} />
          ) : (
            <Link
              href="/auth/sign-in"
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-foreground"
            >
              {t("auth.signIn")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
