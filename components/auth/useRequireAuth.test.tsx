/**
 * Tests for useRequireAuth — a hook that redirects unauthenticated users to
 * /ingresar?next=<encoded-path> using Next.js router.replace().
 *
 * Because this hook calls useRouter() from "next/navigation", we use vi.mock()
 * to replace the entire "next/navigation" module with a fake. This is necessary
 * because "next/navigation" only works inside the Next.js runtime; in Vitest's
 * jsdom environment it would throw. The fake gives us a spy on router.replace
 * that we can inspect after the hook runs.
 *
 * Important: the redirect only fires when auth.hydrated === true AND auth.user
 * === null. Before hydration completes, the hook must NOT redirect — otherwise
 * every page briefly redirects on first render (SSR mismatch).
 *
 * What would break these tests: changing the redirect path format, removing the
 * hydration guard, or changing encodeURIComponent to a different encoding scheme.
 * What these tests do NOT cover: the UI rendered by pages that call this hook,
 * or the login form behavior after redirect.
 */
import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { AuthProvider } from "./AuthProvider";
import { mockUser } from "@/lib/data/account";

// vi.mock: replaces a module with a factory function. Vitest hoists these calls
// to the top of the file so the mock is in place before any imports resolve.
// We return a minimal fake of "next/navigation" — only the parts useRequireAuth
// needs (useRouter with a replace spy).
const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock,
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

// Deferred import: we import the hook AFTER vi.mock() so it picks up the mocked
// next/navigation. A top-level import would be hoisted above the mock.
const { useRequireAuth } = await import("./useRequireAuth");

const STORAGE_KEY = "fv-auth-v1";

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

beforeEach(() => {
  localStorage.clear();
  // Reset the spy between tests so call counts don't accumulate.
  // vi.fn(): creates a mock function (spy) that records every call made to it.
  replaceMock.mockReset();
});

// ─── unauthenticated user ─────────────────────────────────────────────────────

describe("unauthenticated user", () => {
  it("calls router.replace with the encoded redirect URL when user is null after hydration", async () => {
    const { } = renderHook(() => useRequireAuth("/checkout"), { wrapper });
    // Wait for AuthProvider's hydration useEffect to run (sets hydrated: true),
    // which unblocks the hook's own effect that checks auth.hydrated && !auth.user.
    await act(async () => {});

    expect(replaceMock).toHaveBeenCalledOnce();
    // encodeURIComponent("/checkout") → "%2Fcheckout"
    expect(replaceMock).toHaveBeenCalledWith("/ingresar?next=%2Fcheckout");
  });

  it("encodes the next path correctly for a nested route", async () => {
    renderHook(() => useRequireAuth("/cuenta/pedidos"), { wrapper });
    await act(async () => {});

    expect(replaceMock).toHaveBeenCalledWith(
      `/ingresar?next=${encodeURIComponent("/cuenta/pedidos")}`
    );
  });
});

// ─── authenticated user ───────────────────────────────────────────────────────

describe("authenticated user", () => {
  it("does NOT call router.replace when a valid user is in localStorage", async () => {
    // Seed a logged-in user before mounting — simulates a returning visitor.
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: mockUser.email,
        memberSince: mockUser.memberSince,
      })
    );

    renderHook(() => useRequireAuth("/checkout"), { wrapper });
    await act(async () => {});

    expect(replaceMock).not.toHaveBeenCalled();
  });
});

// ─── the guard is the unauthenticated/authenticated distinction ───────────────
// Note on pre-hydration: React 19 flushes all effects synchronously in the jsdom
// test environment, so the moment before hydration is not observable as a
// distinct window in a unit test. The meaningful observable behavior of the
// hydration guard is instead tested via the authenticated/unauthenticated split
// above: when a user IS hydrated from localStorage, no redirect happens —
// that's the guard working as intended.
//
// This describe block adds a complementary check: the hook returns auth state
// so the calling page can render a loading state or gate content.

describe("return value", () => {
  it("returns the auth state from AuthProvider so the page can use it", async () => {
    const { result } = renderHook(() => useRequireAuth("/checkout"), { wrapper });
    await act(async () => {});

    // The hook returns the full auth object — pages use auth.user and auth.hydrated
    // to decide what to render while redirect is pending.
    expect(result.current).toHaveProperty("user");
    expect(result.current).toHaveProperty("hydrated");
    expect(result.current).toHaveProperty("login");
  });

  it("returns user from context when a valid user is seeded in localStorage", async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: mockUser.email,
        memberSince: mockUser.memberSince,
      })
    );

    const { result } = renderHook(() => useRequireAuth("/checkout"), { wrapper });
    await act(async () => {});

    expect(result.current.user?.email).toBe(mockUser.email);
  });
});
