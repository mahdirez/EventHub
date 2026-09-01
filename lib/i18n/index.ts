import { en, type Dictionary } from "@/lib/i18n/locales/en";
import { fa } from "@/lib/i18n/locales/fa";

export type { Dictionary };
export type Locale = "en" | "fa";

export const locales: Locale[] = ["en", "fa"];
export const defaultLocale: Locale = "en";
export const localeCookieName = "eventhub-locale";

const dictionaries: Record<Locale, Dictionary> = {
  en,
  fa,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

type TranslateParams = Record<string, string | number>;

export function createTranslator(dictionary: Dictionary) {
  return function t(key: string, params?: TranslateParams): string {
    const value = key.split(".").reduce<unknown>((acc, part) => {
      if (acc && typeof acc === "object" && part in acc) {
        return (acc as Record<string, unknown>)[part];
      }

      return undefined;
    }, dictionary);

    if (typeof value !== "string") {
      return key;
    }

    if (!params) {
      return value;
    }

    return Object.entries(params).reduce(
      (result, [paramKey, paramValue]) =>
        result.replace(`{${paramKey}}`, String(paramValue)),
      value,
    );
  };
}

export type Translator = ReturnType<typeof createTranslator>;
