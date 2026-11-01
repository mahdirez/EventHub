export const CATEGORY_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidCategorySlugFormat(slug: string): boolean {
  return CATEGORY_SLUG_PATTERN.test(slug);
}

export function formatCategorySlugAsLabel(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
