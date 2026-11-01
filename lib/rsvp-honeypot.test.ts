import { describe, expect, it } from "vitest";

import { RSVP_HONEYPOT_FIELD, isRsvpHoneypotFilled } from "@/lib/rsvp-honeypot";

describe("isRsvpHoneypotFilled", () => {
  it("returns false when the honeypot field is empty or missing", () => {
    expect(isRsvpHoneypotFilled(new FormData())).toBe(false);

    const empty = new FormData();
    empty.set(RSVP_HONEYPOT_FIELD, "");
    expect(isRsvpHoneypotFilled(empty)).toBe(false);
  });

  it("returns true when the honeypot field has content", () => {
    const filled = new FormData();
    filled.set(RSVP_HONEYPOT_FIELD, "https://spam.example");
    expect(isRsvpHoneypotFilled(filled)).toBe(true);
  });
});
