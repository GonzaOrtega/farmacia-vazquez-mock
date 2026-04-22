/**
 * Tests for AuthProvider — the React context that holds auth state and persists
 * it to localStorage under the key "fv-auth-v1".
 *
 * The provider has three operations: login (email → AuthUser), signup (form
 * data → AuthUser), and logout (clears user). The login function has two
 * branches: if the email matches mockUser (case-insensitive), it returns the
 * seed user from lib/data/account.ts; otherwise it synthesizes a guest user
 * whose memberSince comes from the current date formatted as "Mes de YYYY".
 *
 * What would break these tests: changing the STORAGE_KEY, changing the
 * case-insensitive email match, changing the firstName fallback string, or
 * altering how todayMemberLabel formats dates. What these tests do NOT cover:
 * the LoginView UI flow, form validation, or redirect behavior after login
 * (those belong in component-integration tests).
 */
import { describe, expect, it, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { AuthProvider } from "./AuthProvider";
import { useAuth } from "./useAuth";
import { mockUser } from "@/lib/data/account";
import type { AuthUser } from "@/types/user";

const STORAGE_KEY = "fv-auth-v1";

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

beforeEach(() => {
  localStorage.clear();
});

// ─── initial state ────────────────────────────────────────────────────────────

describe("initial state", () => {
  it("starts with user null and hydrated false, then hydrated becomes true", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    // After the hydration useEffect resolves, hydrated flips to true even
    // when there is no stored user.
    await act(async () => {});

    expect(result.current.user).toBeNull();
    expect(result.current.hydrated).toBe(true);
  });
});

// ─── login() ─────────────────────────────────────────────────────────────────

describe("login()", () => {
  it("returns mockUser data when the email matches the seed account", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});

    // Capture the return value from the synchronous login() call inside act().
    // We declare with the correct type so TS strict mode is satisfied.
    let returned: AuthUser | undefined;
    act(() => {
      returned = result.current.login(mockUser.email);
    });

    expect(returned).toMatchObject({
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      email: mockUser.email,
      memberSince: mockUser.memberSince,
    });
    expect(result.current.user?.email).toBe(mockUser.email);
  });

  it("is case-insensitive on the email — uppercase input still resolves to mockUser", async () => {
    // Source line 31: email.trim().toLowerCase() === mockUser.email.toLowerCase()
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});

    let returned: AuthUser | undefined;
    act(() => {
      returned = result.current.login(mockUser.email.toUpperCase());
    });

    expect(returned?.firstName).toBe(mockUser.firstName);
  });

  it("synthesizes a guest user for any unknown email", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});

    let returned: AuthUser | undefined;
    act(() => {
      returned = result.current.login("invitado@ejemplo.com");
    });

    expect(returned?.firstName).toBe("Invitado");
    expect(returned?.email).toBe("invitado@ejemplo.com");
    // memberSince comes from todayMemberLabel() — a Spanish "Mes de YYYY" string.
    // toLocaleDateString("es-AR", { month: "long", year: "numeric" }) produces
    // e.g. "abril de 2026"; the .replace capitalises the first letter → "Abril de 2026".
    // We assert on shape (regex) rather than a hardcoded value so this test
    // does not break when the month rolls over.
    expect(returned?.memberSince).toMatch(/^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+ de \d{4}$/);
  });

  it("sets user in context after login", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});

    act(() => result.current.login("nuevo@usuario.com"));

    expect(result.current.user).not.toBeNull();
    expect(result.current.user?.email).toBe("nuevo@usuario.com");
  });
});

// ─── signup() ─────────────────────────────────────────────────────────────────

describe("signup()", () => {
  it("creates a user from provided input", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});

    let returned: AuthUser | undefined;
    act(() => {
      returned = result.current.signup({
        firstName: "Ada",
        lastName: "Lovelace",
        email: "ada@example.com",
      });
    });

    expect(returned).toMatchObject({
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
    });
    expect(result.current.user?.firstName).toBe("Ada");
  });

  it("uses 'Invitado' as firstName when the provided name is empty string", async () => {
    // Source line 85: firstName.trim() || "Invitado"
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});

    let returned: AuthUser | undefined;
    act(() => {
      returned = result.current.signup({ firstName: "", lastName: "Doe", email: "x@y.com" });
    });

    expect(returned?.firstName).toBe("Invitado");
  });

  it("uses 'Invitado' as firstName when the provided name is whitespace only", async () => {
    // trim() turns "   " into "" — the || "Invitado" fallback must fire
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});

    let returned: AuthUser | undefined;
    act(() => {
      returned = result.current.signup({ firstName: "   ", lastName: "Doe", email: "x@y.com" });
    });

    expect(returned?.firstName).toBe("Invitado");
  });

  it("assigns a Spanish memberSince label (Mes de YYYY) derived from today's date", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});

    let returned: AuthUser | undefined;
    act(() => {
      returned = result.current.signup({ firstName: "Ada", lastName: "", email: "a@b.com" });
    });

    // Same "Mes de YYYY" format as todayMemberLabel() above
    expect(returned?.memberSince).toMatch(/^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+ de \d{4}$/);
  });
});

// ─── logout() ─────────────────────────────────────────────────────────────────

describe("logout()", () => {
  it("sets user to null", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});

    act(() => result.current.login(mockUser.email));
    act(() => result.current.logout());

    expect(result.current.user).toBeNull();
  });

  it("removes the stored key from localStorage on logout", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});

    act(() => result.current.login(mockUser.email));
    act(() => result.current.logout());

    // Source line 71: localStorage.removeItem(STORAGE_KEY) when user is null
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});

// ─── persistence ─────────────────────────────────────────────────────────────

describe("persistence", () => {
  it("writes user to localStorage after login", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});

    act(() => result.current.login(mockUser.email));

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    expect(stored?.email).toBe(mockUser.email);
  });

  it("round-trips: logged-in user survives an unmount + remount cycle", async () => {
    const { result: r1, unmount } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});
    act(() => r1.current.login(mockUser.email));
    unmount();

    const { result: r2 } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});

    expect(r2.current.user?.email).toBe(mockUser.email);
  });

  it("hydrates user from localStorage when the provider mounts with pre-seeded data", async () => {
    const seeded = {
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      memberSince: "Marzo 2024",
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));

    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});

    expect(result.current.user?.email).toBe("ada@example.com");
    expect(result.current.user?.firstName).toBe("Ada");
  });

  it("ignores corrupted localStorage without throwing", async () => {
    localStorage.setItem(STORAGE_KEY, "NOT_VALID_JSON{{{");

    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});

    expect(result.current.user).toBeNull();
    expect(result.current.hydrated).toBe(true);
  });
});
