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

export function AppHeaderMobileNav() {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <nav
      className="flex gap-2 overflow-x-auto border-b border-[var(--border)] px-4 py-2 lg:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label="Main"
    >
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
              "shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition",
              active
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--surface)] text-[var(--muted-foreground)] hover:text-foreground",
            )}
          >
            {t(`nav.${link.key}`)}
          </Link>
        );
      })}
    </nav>
  );
}
