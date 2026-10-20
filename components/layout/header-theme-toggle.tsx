"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { HeaderIconButton } from "@/components/layout/header-icon-button";
import { useI18n } from "@/components/i18n-provider";

export function HeaderThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span
        className="inline-flex size-10 rounded-xl border border-[var(--border)] bg-[var(--surface)]"
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <HeaderIconButton
      icon={isDark ? MoonIcon : SunIcon}
      label={t("theme.toggle")}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    />
  );
}
