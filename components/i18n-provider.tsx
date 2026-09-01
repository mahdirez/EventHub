"use client";

import { createContext, useContext, useMemo } from "react";
import { useRouter } from "next/navigation";

import {
  createTranslator,
  localeCookieName,
  type Dictionary,
  type Locale,
  type Translator,
} from "@/lib/i18n";

type I18nContextValue = {
  locale: Locale;
  dictionary: Dictionary;
  t: Translator;
  setLocale: (locale: Locale) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

type I18nProviderProps = {
  locale: Locale;
  dictionary: Dictionary;
  children: React.ReactNode;
};

export function I18nProvider({ locale, dictionary, children }: I18nProviderProps) {
  const router = useRouter();

  const value = useMemo<I18nContextValue>(() => {
    return {
      locale,
      dictionary,
      t: createTranslator(dictionary),
      setLocale(nextLocale: Locale) {
        document.cookie = `${localeCookieName}=${nextLocale};path=/;max-age=31536000;sameSite=lax`;
        router.refresh();
      },
    };
  }, [dictionary, locale, router]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }

  return context;
}
