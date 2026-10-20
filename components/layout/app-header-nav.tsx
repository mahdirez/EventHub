"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useI18n } from "@/components/i18n-provider";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", key: "explore" as const },
  { href: "/categories", key: "categories" as const },
  { href: "/my-events", key: "myEvents" as const },
  { href: "/dashboard", key: "dashboard" as const },
];

export function AppHeaderNav() {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <nav className="hidden items-center gap-8 lg:flex">
      {links.map((link) => {
        const active =
          link.href === "/"
            ? pathname === "/"
            : pathname === link.href || pathname.startsWith(`${link.href}/`);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "relative text-sm font-medium transition",
              active
                ? "text-foreground"
                : "text-[var(--muted-foreground)] hover:text-foreground",
            )}
          >
            {t(`nav.${link.key}`)}
            {active ? (
              <span
                className="absolute -bottom-2 inset-x-0 mx-auto h-0.5 w-full max-w-[48px] rounded-full bg-[var(--accent)]/70"
                aria-hidden
              />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
