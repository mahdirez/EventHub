import { beforeEach, describe, expect, it, vi } from "vitest";

const findUnique = vi.fn();
const findMany = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    category: {
      findUnique,
      findMany,
    },
  },
}));

describe("category.service", () => {
  beforeEach(() => {
    findUnique.mockReset();
    findMany.mockReset();
  });

  it("categorySlugExists rejects invalid slug format", async () => {
    const { categorySlugExists } = await import("@/lib/services/category.service");

    await expect(categorySlugExists("Bad Slug")).resolves.toBe(false);
    expect(findUnique).not.toHaveBeenCalled();
  });

  it("categorySlugExists checks the database for valid slugs", async () => {
    findUnique.mockResolvedValue({ slug: "technology" });

    const { categorySlugExists } = await import("@/lib/services/category.service");

    await expect(categorySlugExists("technology")).resolves.toBe(true);
    expect(findUnique).toHaveBeenCalledWith({
      where: { slug: "technology" },
      select: { slug: true },
    });
  });

  it("listCategoryOptions returns rows ordered in query", async () => {
    findMany.mockResolvedValue([
      { slug: "music" },
      { slug: "technology" },
    ]);

    const { listCategoryOptions } = await import("@/lib/services/category.service");

    await expect(listCategoryOptions()).resolves.toEqual([
      { slug: "music" },
      { slug: "technology" },
    ]);
  });
});
