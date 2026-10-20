import type { Prisma } from "@/app/generated/prisma/client";
import type { MockCategoryId } from "@/lib/constants/mock-discovery";
import { isCategoryId } from "@/lib/services/discovery-mappers";

export type ExploreDateFilter = "week" | "month";

export type ExploreFilters = {
  q?: string;
  category?: MockCategoryId;
  location?: string;
  date?: ExploreDateFilter;
};

export function parseExploreFilters(
  searchParams: Record<string, string | string[] | undefined>,
): ExploreFilters {
  const q = pickString(searchParams.q)?.trim();
  const location = pickString(searchParams.location)?.trim();
  const categoryRaw = pickString(searchParams.category);
  const dateRaw = pickString(searchParams.date);

  const filters: ExploreFilters = {};
  if (q) filters.q = q;
  if (location) filters.location = location;
  if (categoryRaw && isCategoryId(categoryRaw)) {
    filters.category = categoryRaw;
  }
  if (dateRaw === "week" || dateRaw === "month") {
    filters.date = dateRaw;
  }

  return filters;
}

function pickString(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function buildPublicEventWhere(
  filters: ExploreFilters,
): Prisma.EventWhereInput {
  const now = new Date();
  const conditions: Prisma.EventWhereInput[] = [{ visibility: "public" }];

  if (filters.q) {
    conditions.push({
      OR: [
        { title: { contains: filters.q, mode: "insensitive" } },
        { description: { contains: filters.q, mode: "insensitive" } },
        { location: { contains: filters.q, mode: "insensitive" } },
        { city: { contains: filters.q, mode: "insensitive" } },
      ],
    });
  }

  if (filters.category) {
    conditions.push({ categorySlug: filters.category });
  }

  if (filters.location) {
    conditions.push({
      OR: [
        { city: { contains: filters.location, mode: "insensitive" } },
        { location: { contains: filters.location, mode: "insensitive" } },
      ],
    });
  }

  if (filters.date) {
    const end = new Date(now);
    end.setDate(end.getDate() + (filters.date === "week" ? 7 : 30));
    conditions.push({
      eventDate: {
        gte: now,
        lte: end,
      },
    });
  }

  return { AND: conditions };
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function publicEventSlugWhere(slug: string): Prisma.EventWhereInput {
  const or: Prisma.EventWhereInput[] = [{ slug }];
  if (UUID_PATTERN.test(slug)) {
    or.push({ id: slug });
  }

  return {
    visibility: "public",
    OR: or,
  };
}
