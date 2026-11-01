import { beforeEach, describe, expect, it, vi } from "vitest";

const transaction = vi.fn();
const assertGoingRsvpCapacityAvailable = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: transaction,
  },
}));

vi.mock("@/lib/services/rsvp-capacity", () => ({
  assertGoingRsvpCapacityAvailable,
}));

describe("submitRsvpForInviteToken", () => {
  beforeEach(() => {
    transaction.mockReset();
    assertGoingRsvpCapacityAvailable.mockReset();
  });

  it("throws INVITE_INVALID when the token is unknown", async () => {
    transaction.mockImplementation(async (callback) =>
      callback({
        eventInvite: {
          findFirst: vi.fn().mockResolvedValue(null),
        },
        eventRsvp: {
          upsert: vi.fn(),
        },
      }),
    );

    const { submitRsvpForInviteToken } = await import(
      "@/lib/services/rsvp.service"
    );

    await expect(
      submitRsvpForInviteToken("missing-token", {
        name: "Ada",
        email: "ada@example.com",
        status: "going",
      }),
    ).rejects.toMatchObject({ code: "INVITE_INVALID" });
  });

  it("upserts RSVP data for a valid invite token", async () => {
    const upsert = vi.fn().mockResolvedValue(undefined);

    transaction.mockImplementation(async (callback) =>
      callback({
        eventInvite: {
          findFirst: vi.fn().mockResolvedValue({
            id: "invite-1",
            event: { id: "event-1", capacity: 10 },
          }),
        },
        eventRsvp: { upsert },
      }),
    );

    const { submitRsvpForInviteToken } = await import("@/lib/services/rsvp.service");

    await expect(
      submitRsvpForInviteToken("valid-token", {
        name: "Ada Lovelace",
        email: "Ada@Example.com",
        status: "maybe",
      }),
    ).resolves.toBe("Ada@Example.com");

    expect(assertGoingRsvpCapacityAvailable).not.toHaveBeenCalled();
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          emailNormalized: "ada@example.com",
          status: "maybe",
        }),
      }),
    );
  });

  it("checks capacity before creating a going RSVP", async () => {
    const upsert = vi.fn().mockResolvedValue(undefined);

    transaction.mockImplementation(async (callback) =>
      callback({
        eventInvite: {
          findFirst: vi.fn().mockResolvedValue({
            id: "invite-1",
            event: { id: "event-1", capacity: 1 },
          }),
        },
        eventRsvp: { upsert },
      }),
    );

    const { submitRsvpForInviteToken } = await import("@/lib/services/rsvp.service");

    await submitRsvpForInviteToken("valid-token", {
      name: "Ada",
      email: "ada@example.com",
      status: "going",
    });

    expect(assertGoingRsvpCapacityAvailable).toHaveBeenCalledWith(
      expect.anything(),
      "event-1",
      1,
      "ada@example.com",
    );
  });
});
