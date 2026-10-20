"use client";

import { ChevronDownIcon, GlobeIcon } from "lucide-react";

import { useI18n } from "@/components/i18n-provider";
import type { Locale } from "@/lib/i18n";

const localeLabels: Record<Locale, string> = {
  en: "EN",
  fa: "FA",
};

export function HeaderLanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  function toggleLocale() {
    setLocale(locale === "en" ? "fa" : "en");
  }

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={t("language.switch")}
      className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-medium text-foreground transition hover:bg-[var(--surface-elevated)]"
    >
      <GlobeIcon className="size-4 text-[var(--muted-foreground)]" />
      {localeLabels[locale]}
      <ChevronDownIcon className="size-3.5 text-[var(--muted-foreground)]" />
    </button>
  );
}
