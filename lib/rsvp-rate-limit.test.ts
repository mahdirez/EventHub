import { afterEach, describe, expect, it } from "vitest";

import {
  checkRsvpRateLimit,
  resetRsvpRateLimitStoreForTests,
  rsvpRateLimitConfig,
} from "@/lib/rsvp-rate-limit";

describe("checkRsvpRateLimit", () => {
  afterEach(() => {
    resetRsvpRateLimitStoreForTests();
  });

  it("allows submissions under the per-IP limit", () => {
    const now = Date.now();

    for (let i = 0; i < rsvpRateLimitConfig.maxPerIp; i += 1) {
      expect(
        checkRsvpRateLimit("1.2.3.4", `token-${i}`, now).allowed,
      ).toBe(true);
    }
  });

  it("blocks when the per-IP limit is exceeded", () => {
    const now = Date.now();
    const token = "invite-token-b";

    for (let i = 0; i < rsvpRateLimitConfig.maxPerIp; i += 1) {
      checkRsvpRateLimit("5.6.7.8", token, now);
    }

    expect(checkRsvpRateLimit("5.6.7.8", token, now)).toEqual({
      allowed: false,
      reason: "ip",
    });
  });

  it("blocks when the per-token limit is exceeded", () => {
    const now = Date.now();
    const token = "shared-token";

    for (let i = 0; i < rsvpRateLimitConfig.maxPerToken; i += 1) {
      checkRsvpRateLimit(`10.0.0.${i + 1}`, token, now);
    }

    expect(checkRsvpRateLimit("10.0.0.99", token, now)).toEqual({
      allowed: false,
      reason: "token",
    });
  });
});
