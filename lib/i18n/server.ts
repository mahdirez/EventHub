import { cookies } from "next/headers";

import {
  createTranslator,
  defaultLocale,
  getDictionary,
  localeCookieName,
  type Dictionary,
  type Locale,
  type Translator,
} from "@/lib/i18n";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(localeCookieName)?.value;

  return value === "fa" ? "fa" : defaultLocale;
}

export async function getTranslations(): Promise<{
  locale: Locale;
  dictionary: Dictionary;
  t: Translator;
}> {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);

  return {
    locale,
    dictionary,
    t: createTranslator(dictionary),
  };
}
