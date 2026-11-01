import { beforeEach, describe, expect, it, vi } from "vitest";

const findFirst = vi.fn();
const findUnique = vi.fn();
const create = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    event: { findFirst },
    eventInvite: { findUnique, create },
  },
}));

vi.mock("@/lib/services/category.service", () => ({
  categorySlugExists: vi.fn(),
}));

describe("event.service", () => {
  beforeEach(() => {
    findFirst.mockReset();
    findUnique.mockReset();
    create.mockReset();
  });

  it("requireEventOwner throws UNAUTHORIZED without a user", async () => {
    const { requireEventOwner } = await import("@/lib/services/event.service");

    await expect(requireEventOwner("event-id", undefined)).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  it("requireEventOwner throws NOT_FOUND when the event is missing", async () => {
    findFirst.mockResolvedValue(null);

    const { requireEventOwner } = await import("@/lib/services/event.service");

    await expect(requireEventOwner("event-id", "user-1")).rejects.toMatchObject({
      code: "NOT_FOUND",
    });
  });

  it("ensureInviteToken returns an existing token without creating", async () => {
    findUnique.mockResolvedValue({ token: "existing-token" });

    const { ensureInviteToken } = await import("@/lib/services/event.service");

    await expect(ensureInviteToken("event-id")).resolves.toBe("existing-token");
    expect(create).not.toHaveBeenCalled();
  });

  it("ensureInviteToken creates a token when missing", async () => {
    findUnique.mockResolvedValue(null);
    create.mockResolvedValue({ token: "new-token" });

    const { ensureInviteToken } = await import("@/lib/services/event.service");

    const token = await ensureInviteToken("event-id");

    expect(token).toHaveLength(32);
    expect(create).toHaveBeenCalledOnce();
  });
});
