import { describe, expect, it } from "vitest";

import { canRsvpGoing, isEventAtCapacity } from "@/lib/event-capacity";

describe("event capacity", () => {
  it("treats unlimited capacity as never full", () => {
    expect(isEventAtCapacity(null, 100)).toBe(false);
    expect(canRsvpGoing(null, 100, undefined)).toBe(true);
  });

  it("blocks new going RSVPs at capacity", () => {
    expect(isEventAtCapacity(10, 10)).toBe(true);
    expect(canRsvpGoing(10, 10, undefined)).toBe(false);
    expect(canRsvpGoing(10, 10, "maybe")).toBe(false);
  });

  it("allows existing going guests to keep going", () => {
    expect(canRsvpGoing(10, 10, "going")).toBe(true);
  });
});
