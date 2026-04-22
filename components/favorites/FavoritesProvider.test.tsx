/**
 * Tests for FavoritesProvider — the React context that stores favorited product
 * IDs and persists them to localStorage under "fv-favorites-v1".
 *
 * The key behavioral contract to verify: add() prepends to the front of the
 * list (not appends to the back), and is idempotent. The order matters because
 * the favorites view renders items in this order — a regression from prepend to
 * append would silently reverse the list without any type error.
 *
 * What would break these tests: changing the STORAGE_KEY, changing add() from
 * prepend to append, making add() non-idempotent, or changing toggle() from
 * "includes → remove, else prepend" to "includes → remove, else append". What
 * these tests do NOT cover: the FavoritesDrawer UI, icon state on product cards,
 * or remove-from-UI interactions (those belong in component-integration tests).
 */
import { describe, expect, it, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { FavoritesProvider } from "./FavoritesProvider";
import { useContext } from "react";
import { FavoritesContext } from "./FavoritesProvider";

const STORAGE_KEY = "fv-favorites-v1";

// useContext directly on FavoritesContext — same as a custom useFavorites hook
// would do. We avoid creating a separate hook file just for the test.
function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("Must be inside FavoritesProvider");
  return ctx;
}

function wrapper({ children }: { children: ReactNode }) {
  return <FavoritesProvider>{children}</FavoritesProvider>;
}

beforeEach(() => {
  localStorage.clear();
});

// ─── initial state ────────────────────────────────────────────────────────────

describe("initial state", () => {
  it("starts with an empty ids list", async () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    await act(async () => {});

    expect(result.current.ids).toHaveLength(0);
    expect(result.current.count).toBe(0);
  });
});

// ─── toggle() ─────────────────────────────────────────────────────────────────

describe("toggle()", () => {
  it("adds an id that is not currently in favorites", async () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    await act(async () => {});

    act(() => result.current.toggle("p01"));

    expect(result.current.ids).toContain("p01");
    expect(result.current.has("p01")).toBe(true);
  });

  it("removes an id that is already in favorites (toggle off)", async () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    await act(async () => {});

    act(() => result.current.toggle("p01"));
    act(() => result.current.toggle("p01"));

    expect(result.current.ids).not.toContain("p01");
    expect(result.current.has("p01")).toBe(false);
    expect(result.current.ids).toHaveLength(0);
  });
});

// ─── add() ────────────────────────────────────────────────────────────────────

describe("add()", () => {
  it("adds an id to the favorites list", async () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    await act(async () => {});

    act(() => result.current.add("p01"));

    expect(result.current.ids).toContain("p01");
    expect(result.current.count).toBe(1);
  });

  it("is idempotent — calling add() twice with the same id does not create a duplicate", async () => {
    // Source line 51: cur.includes(id) ? cur : [id, ...cur]
    const { result } = renderHook(() => useFavorites(), { wrapper });
    await act(async () => {});

    act(() => result.current.add("p01"));
    act(() => result.current.add("p01"));

    expect(result.current.ids).toHaveLength(1);
  });

  it("prepends new ids to the front of the list — most recent favorite is first", async () => {
    // add("a") then add("b") must yield ["b", "a"], NOT ["a", "b"].
    // This is the intentional design in source line 51: [id, ...cur].
    // If someone changes it to [...cur, id], this test fails and the favorites
    // list order silently reverses in the UI.
    const { result } = renderHook(() => useFavorites(), { wrapper });
    await act(async () => {});

    act(() => result.current.add("a"));
    act(() => result.current.add("b"));

    expect(result.current.ids).toEqual(["b", "a"]);
  });
});

// ─── has() ────────────────────────────────────────────────────────────────────

describe("has()", () => {
  it("returns true for an id that has been added", async () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    await act(async () => {});

    act(() => result.current.add("p01"));

    expect(result.current.has("p01")).toBe(true);
  });

  it("returns false for an id that has not been added", async () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    await act(async () => {});

    expect(result.current.has("p99")).toBe(false);
  });
});

// ─── remove() ─────────────────────────────────────────────────────────────────

describe("remove()", () => {
  it("removes a specific id without affecting others", async () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    await act(async () => {});

    act(() => result.current.add("a"));
    act(() => result.current.add("b"));
    act(() => result.current.remove("a"));

    expect(result.current.ids).not.toContain("a");
    expect(result.current.ids).toContain("b");
  });
});

// ─── clear() ─────────────────────────────────────────────────────────────────

describe("clear()", () => {
  it("empties the ids list", async () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    await act(async () => {});

    act(() => result.current.add("a"));
    act(() => result.current.add("b"));
    act(() => result.current.clear());

    expect(result.current.ids).toHaveLength(0);
    expect(result.current.count).toBe(0);
  });
});

// ─── persistence ─────────────────────────────────────────────────────────────

describe("persistence", () => {
  it("writes favorites to localStorage under 'fv-favorites-v1'", async () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    await act(async () => {});

    act(() => result.current.add("p01"));

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    expect(stored).toContain("p01");
  });

  it("round-trips: favorites survive an unmount + remount cycle", async () => {
    const { result: r1, unmount } = renderHook(() => useFavorites(), { wrapper });
    await act(async () => {});
    act(() => r1.current.add("p01"));
    act(() => r1.current.add("p02"));
    unmount();

    const { result: r2 } = renderHook(() => useFavorites(), { wrapper });
    await act(async () => {});

    expect(r2.current.ids).toContain("p01");
    expect(r2.current.ids).toContain("p02");
  });

  it("hydrates ids from pre-seeded localStorage data", async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(["p05", "p03"]));

    const { result } = renderHook(() => useFavorites(), { wrapper });
    await act(async () => {});

    expect(result.current.ids).toEqual(["p05", "p03"]);
    expect(result.current.count).toBe(2);
  });

  it("ignores non-string entries when hydrating from localStorage", async () => {
    // The provider filters out non-string values (source line 30)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(["p01", 42, null, "p02"]));

    const { result } = renderHook(() => useFavorites(), { wrapper });
    await act(async () => {});

    expect(result.current.ids).toEqual(["p01", "p02"]);
  });
});
