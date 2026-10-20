import { describe, expect, it } from "vitest";

import { slugifyEventTitle } from "@/lib/slugify";

describe("slugifyEventTitle", () => {
  it("normalizes titles to URL slugs", () => {
    expect(slugifyEventTitle("React Summit 2025")).toBe("react-summit-2025");
    expect(slugifyEventTitle("  Hello!!! World  ")).toBe("hello-world");
  });
});
