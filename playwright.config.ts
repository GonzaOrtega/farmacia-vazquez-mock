import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for Farmacia Vázquez.
 *
 * E2E runs against the *production* build (`bun run start`) so what's tested
 * matches what users see, not the dev-server behavior. The `webServer` block
 * reuses an already-running server when present so you can iterate with
 * `bun run start` in one terminal and `bun run test:e2e` in another.
 *
 * Single browser (Chromium headless) keeps the suite fast and deterministic.
 * Expand to webkit/firefox later only if a browser-specific bug appears.
 */
export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["html"], ["github"]] : [["list"]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "bun run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
