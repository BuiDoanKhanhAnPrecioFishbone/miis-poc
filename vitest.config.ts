import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * T-001 — unit tests, documented.
 *
 * The suite is deliberately confined to `lib/domain/` and `lib/mock/`. That is
 * not a shortcut, it is the architecture paying off: CLAUDE.md's first
 * structural rule is that `lib/domain/` imports nothing — no React, no Next, no
 * data access — so the business rules are plain functions over plain values and
 * need no environment to test. Everything above that layer is a server
 * component rendering what those functions return, and is covered by the
 * accessibility and overflow sweeps instead.
 *
 * No jsdom, no test renderer, no mocks. A test that needs an elaborate harness
 * is usually telling you the code under it is in the wrong place.
 */
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  test: {
    include: ["lib/**/*.test.ts"],
    environment: "node",
  },
});
