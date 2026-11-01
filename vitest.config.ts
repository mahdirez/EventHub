import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
    env: {
      DATABASE_URL: "postgresql://test:test@localhost:5432/eventhub_test",
      NEON_AUTH_BASE_URL: "https://example.com/auth",
      NEON_AUTH_COOKIE_SECRET: "test-neon-auth-cookie-secret-min-32-chars",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
