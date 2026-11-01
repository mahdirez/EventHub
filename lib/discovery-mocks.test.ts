import { afterEach, describe, expect, it, vi } from "vitest";

describe("shouldUseDiscoveryMocks", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns true in development by default", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("SHOW_DISCOVERY_MOCKS", "");

    const { shouldUseDiscoveryMocks } = await import("@/lib/discovery-mocks");
    expect(shouldUseDiscoveryMocks()).toBe(true);
  });

  it("returns false in production by default", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("SHOW_DISCOVERY_MOCKS", "");

    vi.resetModules();
    const { shouldUseDiscoveryMocks } = await import("@/lib/discovery-mocks");
    expect(shouldUseDiscoveryMocks()).toBe(false);
  });

  it("respects SHOW_DISCOVERY_MOCKS=true in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("SHOW_DISCOVERY_MOCKS", "true");

    vi.resetModules();
    const { shouldUseDiscoveryMocks } = await import("@/lib/discovery-mocks");
    expect(shouldUseDiscoveryMocks()).toBe(true);
  });

  it("respects SHOW_DISCOVERY_MOCKS=false in development", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("SHOW_DISCOVERY_MOCKS", "false");

    vi.resetModules();
    const { shouldUseDiscoveryMocks } = await import("@/lib/discovery-mocks");
    expect(shouldUseDiscoveryMocks()).toBe(false);
  });
});
