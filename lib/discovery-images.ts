import type { MockCategoryId } from "@/lib/constants/mock-discovery";
import { PLACEHOLDER_IMAGES } from "@/lib/constants/placeholder-images";

const ALLOWED_IMAGE_HOSTS = new Set(["images.unsplash.com"]);

export const categoryCoverFallback: Record<MockCategoryId, string> = {
  technology: PLACEHOLDER_IMAGES.events.technology,
  music: PLACEHOLDER_IMAGES.events.music,
  business: PLACEHOLDER_IMAGES.events.business,
  art: PLACEHOLDER_IMAGES.events.art,
  education: PLACEHOLDER_IMAGES.events.education,
  sports: PLACEHOLDER_IMAGES.events.sports,
};

export function resolveDiscoveryImageUrl(
  url: string | null | undefined,
  categoryId: MockCategoryId,
): string {
  const fallback = categoryCoverFallback[categoryId];

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
