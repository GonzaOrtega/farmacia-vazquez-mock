/**
 * Global test setup — runs once before every test file.
 *
 * Two responsibilities:
 * 1. Import @testing-library/jest-dom to extend Vitest's expect() with DOM
 *    matchers like toBeInTheDocument(), toHaveAttribute(), toHaveTextContent().
 * 2. After each test: unmount any React trees RTL rendered (cleanup) AND clear
 *    localStorage so provider tests don't bleed state into each other.
 *
 * localStorage.clear() is the #1 prevention for flaky provider tests —
 * CartProvider, AuthProvider, and FavoritesProvider all read from localStorage
 * on mount, so a dirty store from a previous test silently corrupts the next.
 */
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();           // unmount React trees rendered by RTL in the previous test
  localStorage.clear(); // prevent cross-test localStorage bleed between provider tests
});
