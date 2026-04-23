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
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["app/**", "components/**", "lib/**"],
      exclude: [
        "**/*.test.*",
        "**/*.spec.*",
        "**/*.d.ts",
        "app/**/layout.tsx",
        "app/**/opengraph-image.tsx",
        "app/**/twitter-image.tsx",
        "app/sitemap.ts",
        "app/robots.ts",
      ],
      // Thresholds track the current baseline (Dec 2025: ~47/39/37/47).
      // Purpose: prevent *regression* of covered code — not to drive the
      // number higher. Tighten as new test surfaces land (next plan:
      // ProductCard, section layouts, FilterPanel). Loose branches is
      // expected — we have many short-circuit guards that would need
      // contrived tests to exercise both arms.
      thresholds: {
        statements: 45,
        branches: 35,
        functions: 35,
        lines: 45,
      },
    },
  },
});
