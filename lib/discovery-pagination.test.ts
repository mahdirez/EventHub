import { describe, expect, it } from "vitest";

import {
  buildExploreHref,
  getPageCount,
  parsePageParam,
} from "@/lib/discovery-pagination";

describe("discovery pagination", () => {
  it("parses page numbers safely", () => {
    expect(parsePageParam(undefined)).toBe(1);
    expect(parsePageParam("2")).toBe(2);
    expect(parsePageParam("-1")).toBe(1);
    expect(parsePageParam("abc")).toBe(1);
  });

  it("builds explore hrefs with filters", () => {
    expect(
      buildExploreHref({ q: "react", category: "technology" }, 2),
    ).toBe("/explore?q=react&category=technology&page=2");
  });

  it("calculates page counts", () => {
    expect(getPageCount(0, 12)).toBe(1);
    expect(getPageCount(13, 12)).toBe(2);
  });
});
