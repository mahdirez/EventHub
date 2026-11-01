import { formatCategorySlugAsLabel } from "@/lib/category-slug";
import type { Translator } from "@/lib/i18n";

export function getCategoryLabel(t: Translator, slug: string): string {
  const key = `discovery.categories.${slug}`;
  const translated = t(key);

  if (translated === key) {
    return formatCategorySlugAsLabel(slug);
  }

  return translated;
}
