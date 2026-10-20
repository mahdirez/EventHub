import { describe, expect, it } from "vitest";

import {
  buildPublicEventWhere,
  parseExploreFilters,
} from "@/lib/services/discovery-filters";

describe("parseExploreFilters", () => {
  it("parses search params", () => {
    expect(
      parseExploreFilters({
        q: "react",
        category: "technology",
        location: "Tehran",
        date: "week",
      }),
    ).toEqual({
      q: "react",
      category: "technology",
      location: "Tehran",
      date: "week",
    });
  });

  it("ignores invalid category and date values", () => {
    expect(
      parseExploreFilters({
        category: "invalid",
        date: "year",
      }),
    ).toEqual({});
  });
});

describe("buildPublicEventWhere", () => {
  it("always scopes to public events", () => {
    const where = buildPublicEventWhere({});
    expect(where).toEqual({
      AND: [{ visibility: "public" }],
    });
  });

  it("adds text search OR clauses", () => {
    const where = buildPublicEventWhere({ q: "music" });
    const and = where.AND as object[];
    expect(and).toHaveLength(2);
    expect(and[1]).toEqual({
      OR: [
        { title: { contains: "music", mode: "insensitive" } },
        { description: { contains: "music", mode: "insensitive" } },
        { location: { contains: "music", mode: "insensitive" } },
        { city: { contains: "music", mode: "insensitive" } },
      ],
    });
  });
});
