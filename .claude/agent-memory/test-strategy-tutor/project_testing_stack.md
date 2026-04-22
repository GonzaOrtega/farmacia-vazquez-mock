---
name: Testing stack decisions
description: Chosen tools, file conventions, and mock patterns for the Farmacia Vázquez test suite
type: project
---

## Stack

- **Vitest** (runner) + **@vitejs/plugin-react** + **jsdom** (environment)
- **@testing-library/react** + **@testing-library/dom** + **@testing-library/user-event** + **@testing-library/jest-dom**
- **vite-tsconfig-paths** — for `@/*` path alias
- Config file: `vitest.config.mts` at repo root
- Setup file: `vitest.setup.ts` at repo root

**Why jsdom over happy-dom:** Matches the official Next 16 Vitest guide exactly (`node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md`). Gonzalo approved this choice when the guide was cited.

## Config choices

- `globals: false` — explicit imports from "vitest" in every test file. No tsconfig changes needed.
- `css: false` — skip globals.css parsing; we don't assert on CSS.
- `"test": "vitest run"` script (not `"vitest"`) — exits after one pass. Better for a novice; avoids watch UI confusion.
- `"test:watch": "vitest"` — watch mode available separately.

## File location convention

**Colocated** `*.test.ts(x)` next to source — NOT a top-level `__tests__/` directory.
- Exception: Playwright E2E in `e2e/` at root (deferred).

## Mock pattern for next/navigation

**Per-test `vi.mock`**, NOT a shared export from `vitest.setup.ts`.
- Why: tests that don't use navigation don't pay mock cost; mock lives next to the tests that need it; avoids implicit coupling to setup file internals.
- Only `useRequireAuth.test.tsx` needs this mock currently.

## Exports added to useProductFilters.ts (done 2026-04-22)

`reducer`, `applyFilters`, `defaultState` are now exported. Purely additive.

## React 19 + jsdom behavior: effects run synchronously in renderHook

React 19 in the jsdom test environment flushes `useEffect` synchronously during
`renderHook()`. This means:
- You cannot observe a "before effects" window without suspending the test setup
- Pre-hydration guards cannot be unit-tested as a "moment before" — test the behavioral
  consequence instead (authenticated vs unauthenticated distinction)
- Always `await act(async () => {})` after renderHook to ensure all effects have settled

## TypeScript strict mode with act() return values

`let returned; act(() => { returned = someHook() })` types `returned` as `undefined`
in strict TS — TS cannot prove act's callback ran synchronously. Fix:
declare with the actual type: `let returned: AuthUser | undefined;`

## vi.mock hoisting and dynamic imports

`vi.mock("next/navigation", ...)` is hoisted by Vitest to the top of the file.
If you need to use the mocked module in the file body (e.g., importing the hook
that depends on it), use a top-level `await import(...)` after the vi.mock call.
Vitest supports top-level await in test files.

## Verified test counts (2026-04-22)
- lib/format.test.ts: 5 tests
- lib/data/products.test.ts: 8 tests
- components/filters/useProductFilters.test.ts: 38 tests
- components/cart/CartProvider.test.tsx: 15 tests
- components/auth/AuthProvider.test.tsx: 15 tests
- components/favorites/FavoritesProvider.test.tsx: 14 tests
- components/auth/useRequireAuth.test.tsx: 6 tests
Total: 101 tests, runtime ~1.6s
