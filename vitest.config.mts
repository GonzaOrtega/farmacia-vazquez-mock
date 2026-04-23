/**
 * Vitest configuration for Farmacia Vázquez.
 *
 * Follows the official Next.js 16 Vitest guide exactly
 * (node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md).
 *
 * Key choices:
 * - jsdom: simulated browser DOM; matches the Next 16 guide recommendation
 *   and is more battle-tested than happy-dom for missing browser APIs.
 * - globals: false: tests must import { describe, it, expect, vi } from "vitest"
 *   explicitly. Matches the strict-TS posture of the codebase.
 * - css: false: we never assert on CSS class names or computed styles; skipping
 *   globals.css parsing avoids Tailwind v4 CSS-in-JS processing errors in tests.
 * - vite-tsconfig-paths: teaches Vitest about the @/* → ./* alias in tsconfig.json
 *   so test imports look identical to source imports.
 */
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    globals: false,
    setupFiles: ["./vitest.setup.ts"],
    css: false,
    // Keep Playwright e2e specs out of the Vitest run — they need a real
    // browser + running server, not jsdom.
    exclude: ["**/node_modules/**", "**/dist/**", "**/.next/**", "e2e/**"],
  },
});
