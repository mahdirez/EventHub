import { describe, expect, it } from "vitest";

import {
  formatCategorySlugAsLabel,
  isValidCategorySlugFormat,
} from "@/lib/category-slug";
import { getCategoryLabel } from "@/lib/category-label";
import { createTranslator, getDictionary } from "@/lib/i18n";

describe("isValidCategorySlugFormat", () => {
  it("accepts lowercase hyphenated slugs", () => {
    expect(isValidCategorySlugFormat("technology")).toBe(true);
    expect(isValidCategorySlugFormat("art-and-culture")).toBe(true);
  });

  it("rejects invalid slug shapes", () => {
    expect(isValidCategorySlugFormat("Art")).toBe(false);
    expect(isValidCategorySlugFormat("bad slug")).toBe(false);
  });
});

describe("getCategoryLabel", () => {
  const t = createTranslator(getDictionary("en"));

  it("uses dictionary labels for seeded categories", () => {
    expect(getCategoryLabel(t, "technology")).toBe("Technology");
  });

  it("formats unknown slugs when no dictionary entry exists", () => {
    expect(getCategoryLabel(t, "open-air")).toBe("Open Air");
    expect(formatCategorySlugAsLabel("open-air")).toBe("Open Air");
  });
});
