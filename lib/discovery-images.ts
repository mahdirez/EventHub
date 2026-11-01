import { getCategoryCoverFallback } from "@/lib/category-display";
import { PLACEHOLDER_IMAGES } from "@/lib/constants/placeholder-images";

const ALLOWED_IMAGE_HOSTS = new Set(["images.unsplash.com"]);

export function resolveDiscoveryImageUrl(
  url: string | null | undefined,
  categorySlug: string,
): string {
  const fallback = getCategoryCoverFallback(categorySlug);

  if (!url?.trim()) {
    return fallback;
  }

  try {
    const parsed = new URL(url.trim());
    if (
      parsed.protocol === "https:" &&
      ALLOWED_IMAGE_HOSTS.has(parsed.hostname)
    ) {
      return url.trim();
    }
  } catch {
    // ignore invalid URLs
  }

  return fallback;
}

export { PLACEHOLDER_IMAGES };
