import type { ExploreFilters } from "@/lib/services/discovery-filters";

export const DISCOVERY_PAGE_SIZE = 12;
export const ORGANIZER_PAGE_SIZE = 8;

export function parsePageParam(
  value: string | string[] | undefined,
): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return Math.floor(parsed);
}

export function getPageCount(total: number, pageSize: number): number {
  if (total <= 0) {
    return 1;
  }

  return Math.ceil(total / pageSize);
}

export function buildExploreHref(
  filters: ExploreFilters,
  page: number,
): string {
  const params = new URLSearchParams();

  if (filters.q) params.set("q", filters.q);
  if (filters.location) params.set("location", filters.location);
  if (filters.category) params.set("category", filters.category);
  if (filters.date) params.set("date", filters.date);
  if (page > 1) params.set("page", String(page));

  const query = params.toString();
  return query ? `/explore?${query}` : "/explore";
}

export function buildCategoryHref(slug: string, page: number): string {
  if (page <= 1) {
    return `/categories/${slug}`;
  }

  return `/categories/${slug}?page=${page}`;
}

export function buildDashboardHref(page: number): string {
  if (page <= 1) {
    return "/dashboard";
  }

  return `/dashboard?page=${page}`;
}
