"use client";

import { LanguagesIcon } from "lucide-react";

import { useI18n } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";

const localeLabels: Record<Locale, string> = {
  en: "EN",
  fa: "FA",
};

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  function toggleLocale() {
    setLocale(locale === "en" ? "fa" : "en");
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      aria-label={t("language.switch")}
      title={locale === "en" ? t("language.fa") : t("language.en")}
      onClick={toggleLocale}
    >
      <LanguagesIcon />
      {localeLabels[locale === "en" ? "fa" : "en"]}
    </Button>
  );
}
