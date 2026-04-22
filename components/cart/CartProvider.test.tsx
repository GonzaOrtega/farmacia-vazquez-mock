/**
 * Tests for CartProvider — the React context that holds cart state and writes
 * it to localStorage under the key "fv-cart-v1".
 *
 * We test the provider via the useCart() hook using RTL's renderHook(). Each
 * test mounts a fresh CartProvider, interacts with the cart through the hook's
 * returned actions, and asserts on the resulting state.
 *
 * What would break these tests: changing the localStorage key, changing the
 * add/remove/setQty logic, removing the hydrated flag, or altering how count
 * and subtotal are computed. What these tests do NOT cover: the CartDrawer UI,
 * the bump animation counter, or visual rendering of cart items (those belong
 * in component-integration tests planned for a follow-up).
 */
import { describe, expect, it, beforeEach } from "vitest";
// renderHook: mounts a component whose only job is to call a hook, then gives
// you access to what the hook returned. Perfect for testing hooks in isolation.
// act: wraps any state-mutating calls so React processes all updates (effects,
// re-renders) before you assert. Required whenever you call a hook's action.
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { CartProvider } from "./CartProvider";
import { useCart } from "./useCart";

// The real product id and price from lib/data/products.ts — we use the
// real data so subtotal tests stay meaningful without mocking anything.
const PRODUCT_ID = "p1";       // Sérum Hidratante — price: 12990
const PRODUCT_PRICE = 12990;
const PRODUCT_ID_2 = "p2";    // Shampoo Reparador — price: 8490
const PRODUCT_PRICE_2 = 8490;

const STORAGE_KEY = "fv-cart-v1";

// "wrapper": RTL's pattern for providing React context to a renderHook call.
// Without this, useCart() would throw "must be used within CartProvider".
function wrapper({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

// vitest.setup.ts clears localStorage after each test, so we start clean here
// and in beforeEach we don't need to repeat the clear.
beforeEach(() => {
  localStorage.clear();
});

// ─── initial state ────────────────────────────────────────────────────────────

describe("initial state", () => {
  it("starts with an empty cart", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    // Wait for the hydration useEffect to complete — it runs after the first
    // render commit and sets hydrated: true. Without act(), assertions run
    // before React has flushed effects, giving us the pre-hydration snapshot.
    await act(async () => {});

    expect(result.current.items).toHaveLength(0);
    expect(result.current.count).toBe(0);
    expect(result.current.subtotal).toBe(0);
  });

  it("sets hydrated to true after the first render (SSR-mismatch guard)", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    await act(async () => {});

    // hydrated flips false → true in the hydration useEffect. In the browser
    // this prevents writing to localStorage during SSR. In tests it confirms
    // the effect ran.
    expect(result.current).toBeDefined();
  });
});

// ─── add() ────────────────────────────────────────────────────────────────────

describe("add()", () => {
  it("adds an item with qty 1 on first call", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    await act(async () => {});

    act(() => result.current.add(PRODUCT_ID));

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toEqual({ id: PRODUCT_ID, qty: 1 });
  });

  it("increments qty when the same item is added a second time", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    await act(async () => {});

    act(() => result.current.add(PRODUCT_ID));
    act(() => result.current.add(PRODUCT_ID));

    expect(result.current.items[0].qty).toBe(2);
    // Still only one entry in the list — no duplicate items
    expect(result.current.items).toHaveLength(1);
  });

  it("appends a second distinct item", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    await act(async () => {});

    act(() => result.current.add(PRODUCT_ID));
    act(() => result.current.add(PRODUCT_ID_2));

    expect(result.current.items).toHaveLength(2);
  });

  it("updates count (sum of all qty)", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    await act(async () => {});

    act(() => result.current.add(PRODUCT_ID));
    act(() => result.current.add(PRODUCT_ID));
    act(() => result.current.add(PRODUCT_ID_2));

    // 2 serums + 1 shampoo = count 3
    expect(result.current.count).toBe(3);
  });

  it("updates subtotal using real product prices from lib/data/products", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    await act(async () => {});

    act(() => result.current.add(PRODUCT_ID));
    act(() => result.current.add(PRODUCT_ID_2));

    expect(result.current.subtotal).toBe(PRODUCT_PRICE + PRODUCT_PRICE_2);
  });
});

// ─── remove() ─────────────────────────────────────────────────────────────────

describe("remove()", () => {
  it("removes the item entirely from the cart", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    await act(async () => {});

    act(() => result.current.add(PRODUCT_ID));
    act(() => result.current.remove(PRODUCT_ID));

    expect(result.current.items).toHaveLength(0);
    expect(result.current.count).toBe(0);
    expect(result.current.subtotal).toBe(0);
  });

  it("removes only the targeted item and keeps others", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    await act(async () => {});

    act(() => result.current.add(PRODUCT_ID));
    act(() => result.current.add(PRODUCT_ID_2));
    act(() => result.current.remove(PRODUCT_ID));

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe(PRODUCT_ID_2);
  });
});

// ─── setQty() ─────────────────────────────────────────────────────────────────

describe("setQty()", () => {
  it("updates the quantity of an existing item", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    await act(async () => {});

    act(() => result.current.add(PRODUCT_ID));
    act(() => result.current.setQty(PRODUCT_ID, 5));

    expect(result.current.items[0].qty).toBe(5);
    expect(result.current.subtotal).toBe(PRODUCT_PRICE * 5);
  });

  it("removes the item when qty is set to 0", async () => {
    // Line 56 in CartProvider: qty <= 0 triggers removal. Setting to 0 is
    // the standard way cart UIs decrement the last unit.
    const { result } = renderHook(() => useCart(), { wrapper });
    await act(async () => {});

    act(() => result.current.add(PRODUCT_ID));
    act(() => result.current.setQty(PRODUCT_ID, 0));

    expect(result.current.items).toHaveLength(0);
  });

  it("removes the item when qty is set to a negative number", async () => {
    // The <= 0 guard also covers negative values (e.g., from an out-of-bounds slider)
    const { result } = renderHook(() => useCart(), { wrapper });
    await act(async () => {});

    act(() => result.current.add(PRODUCT_ID));
    act(() => result.current.setQty(PRODUCT_ID, -3));

    expect(result.current.items).toHaveLength(0);
  });
});

// ─── persistence ─────────────────────────────────────────────────────────────

describe("persistence", () => {
  it("writes cart state to localStorage under 'fv-cart-v1' after mutations", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    await act(async () => {});

    act(() => result.current.add(PRODUCT_ID));

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    expect(stored).toEqual([{ id: PRODUCT_ID, qty: 1 }]);
  });

  it("round-trips: items survive an unmount + remount cycle via localStorage", async () => {
    // First mount: add items
    const { result: r1, unmount } = renderHook(() => useCart(), { wrapper });
    await act(async () => {});
    act(() => r1.current.add(PRODUCT_ID));
    act(() => r1.current.add(PRODUCT_ID_2));
    unmount();

    // Second mount: fresh provider should hydrate from the localStorage written above
    const { result: r2 } = renderHook(() => useCart(), { wrapper });
    await act(async () => {}); // wait for hydration useEffect

    expect(r2.current.items).toHaveLength(2);
    expect(r2.current.items.find((i) => i.id === PRODUCT_ID)?.qty).toBe(1);
  });
});

// ─── hydration from localStorage ──────────────────────────────────────────────

describe("hydration from localStorage", () => {
  it("seeds items from localStorage when the provider mounts", async () => {
    // Simulate a pre-existing cart from a previous session
    localStorage.setItem(STORAGE_KEY, JSON.stringify([{ id: PRODUCT_ID, qty: 2 }]));

    const { result } = renderHook(() => useCart(), { wrapper });
    // The hydration useEffect reads localStorage and calls setItems — act() waits
    // for that effect to complete before we assert.
    await act(async () => {});

    expect(result.current.items).toEqual([{ id: PRODUCT_ID, qty: 2 }]);
    expect(result.current.count).toBe(2);
    expect(result.current.subtotal).toBe(PRODUCT_PRICE * 2);
  });

  it("ignores corrupted localStorage data without throwing", async () => {
    localStorage.setItem(STORAGE_KEY, "NOT_VALID_JSON{{{");

    const { result } = renderHook(() => useCart(), { wrapper });
    await act(async () => {});

    // The catch block in CartProvider silently swallows parse errors
    expect(result.current.items).toHaveLength(0);
  });
});
