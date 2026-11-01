import { describe, expect, it, vi } from "vitest";

import {
  assertGoingRsvpCapacityAvailable,
  isGoingRsvpBlocked,
} from "@/lib/services/rsvp-capacity";

describe("isGoingRsvpBlocked", () => {
  it("allows going when capacity has room", () => {
    expect(
      isGoingRsvpBlocked({
        capacity: 2,
        goingCount: 1,
        existingStatus: undefined,
      }),
    ).toBe(false);
  });

  it("blocks a new going RSVP when capacity is full", () => {
    expect(
      isGoingRsvpBlocked({
        capacity: 1,
        goingCount: 1,
        existingStatus: undefined,
      }),
    ).toBe(true);
  });

  it("allows an existing going guest to stay going at capacity", () => {
    expect(
      isGoingRsvpBlocked({
        capacity: 1,
        goingCount: 1,
        existingStatus: "going",
      }),
    ).toBe(false);
  });
});

describe("assertGoingRsvpCapacityAvailable", () => {
  const eventId = "00000000-0000-4000-8000-000000000001";

  function createTx(goingCount: number, existingStatus: string | null) {
    return {
      eventRsvp: {
        findUnique: vi.fn().mockResolvedValue(
          existingStatus ? { status: existingStatus } : null,
        ),
        count: vi.fn().mockResolvedValue(goingCount),
      },
      $executeRaw: vi.fn().mockResolvedValue(1),
    };
  }

  it("throws AT_CAPACITY for a second newcomer when capacity is 1", async () => {
    const tx = createTx(1, null);

    await expect(
      assertGoingRsvpCapacityAvailable(
        tx,
        eventId,
        1,
        "second@example.com",
      ),
    ).rejects.toMatchObject({ code: "AT_CAPACITY" });

    expect(tx.$executeRaw).toHaveBeenCalled();
  });

  it("allows the first going RSVP when capacity is 1", async () => {
    const tx = createTx(0, null);

    await expect(
      assertGoingRsvpCapacityAvailable(
        tx,
        eventId,
        1,
        "first@example.com",
      ),
    ).resolves.toBeUndefined();
  });

  it("skips locking when capacity is unlimited", async () => {
    const tx = createTx(999, null);

    await expect(
      assertGoingRsvpCapacityAvailable(
        tx,
        eventId,
        null,
        "any@example.com",
      ),
    ).resolves.toBeUndefined();

    expect(tx.$executeRaw).not.toHaveBeenCalled();
    expect(tx.eventRsvp.count).not.toHaveBeenCalled();
  });
});
