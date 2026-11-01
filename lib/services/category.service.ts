import { isValidCategorySlugFormat } from "@/lib/category-slug";
import { prisma } from "@/lib/prisma";

export type CategoryOption = {
  slug: string;
};

export async function listCategoryOptions(): Promise<CategoryOption[]> {
  const rows = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    select: { slug: true },
  });

  return rows;
}

export async function categorySlugExists(slug: string): Promise<boolean> {
  if (!isValidCategorySlugFormat(slug)) {
    return false;
  }

  const row = await prisma.category.findUnique({
    where: { slug },
    select: { slug: true },
  });

  return Boolean(row);
}
