/**
 * Tests for the reducer, defaultState, and activeFilterCount in
 * lib/filters/reducer.ts.
 *
 * These are pure functions — input → output, no React — so each test runs in
 * <1ms and covers all 10 reducer actions plus the 4 counting rules in a flat
 * structure that reads top-to-bottom.
 *
 * What would break these tests: changing an action type name, changing what
 * reset preserves, or modifying which fields count toward activeFilterCount.
 */
import { describe, expect, it } from "vitest";
import { activeFilterCount, defaultState, reducer } from "./reducer";
import { PRICE_MAX_DEFAULT, type FilterState } from "./types";

// "fixture": a helper that builds a baseline state so individual tests only
// override the fields they care about — keeps tests short and focused.
function base(overrides: Partial<FilterState> = {}): FilterState {
  return { ...defaultState("all"), ...overrides };
}

// ─── reducer ────────────────────────────────────────────────────────────────

describe("reducer — setCat", () => {
  it("updates the cat field", () => {
    const next = reducer(base(), { type: "setCat", cat: "vitaminas" });
    expect(next.cat).toBe("vitaminas");
  });

  it("does not mutate other fields", () => {
    const prev = base({ brands: ["GENÉRICO"] });
    const next = reducer(prev, { type: "setCat", cat: "capilar" });
    expect(next.brands).toEqual(["GENÉRICO"]);
  });
});

describe("reducer — toggleBrand", () => {
  it("adds a brand that is not yet in the list", () => {
    const next = reducer(base(), { type: "toggleBrand", brand: "GENÉRICO" });
    expect(next.brands).toContain("GENÉRICO");
  });

  it("removes a brand that is already in the list (toggle off)", () => {
    const prev = base({ brands: ["GENÉRICO", "CAPILAR PRO"] });
    const next = reducer(prev, { type: "toggleBrand", brand: "GENÉRICO" });
    expect(next.brands).not.toContain("GENÉRICO");
    // Other brands are preserved
    expect(next.brands).toContain("CAPILAR PRO");
  });
});

describe("reducer — setPriceMax", () => {
  it("updates priceMax to the given value", () => {
    const next = reducer(base(), { type: "setPriceMax", value: 10000 });
    expect(next.priceMax).toBe(10000);
  });
});

describe("reducer — setRatingMin", () => {
  it("updates ratingMin to the given value", () => {
    const next = reducer(base(), { type: "setRatingMin", value: 4.5 });
    expect(next.ratingMin).toBe(4.5);
  });
});

describe("reducer — setRxMode", () => {
  it("updates rxMode", () => {
    const next = reducer(base(), { type: "setRxMode", value: "rx" });
    expect(next.rxMode).toBe("rx");
  });
});

describe("reducer — setInStock", () => {
  it("sets inStock to true", () => {
    const next = reducer(base(), { type: "setInStock", value: true });
    expect(next.inStock).toBe(true);
  });
});

describe("reducer — setOnSale", () => {
  it("sets onSale to true", () => {
    const next = reducer(base(), { type: "setOnSale", value: true });
    expect(next.onSale).toBe(true);
  });
});

describe("reducer — setSort", () => {
  it("updates the sort key", () => {
    const next = reducer(base(), { type: "setSort", value: "price-asc" });
    expect(next.sort).toBe("price-asc");
  });
});

describe("reducer — setQuery", () => {
  it("updates the search query string", () => {
    const next = reducer(base(), { type: "setQuery", value: "ibuprofeno" });
    expect(next.query).toBe("ibuprofeno");
  });
});

describe("reducer — reset", () => {
  it("clears all filters back to defaults", () => {
    const dirty = base({
      brands: ["GENÉRICO"],
      priceMax: 5000,
      ratingMin: 4,
      rxMode: "otc",
      inStock: true,
      onSale: true,
      sort: "price-asc",
      query: "ibuprofeno",
    });
    const next = reducer(dirty, { type: "reset" });
    expect(next.brands).toEqual([]);
    expect(next.priceMax).toBe(PRICE_MAX_DEFAULT);
    expect(next.ratingMin).toBe(0);
    expect(next.rxMode).toBe("all");
    expect(next.inStock).toBe(false);
    expect(next.onSale).toBe(false);
    expect(next.sort).toBe("relevance");
    expect(next.query).toBe("");
  });

  it("preserves the current cat after reset — category is not a filter to clear", () => {
    // This is an intentional design decision (defaultState(state.cat) inside reset).
    // Resetting filters while browsing "capilar" should keep you in "capilar".
    const state = base({ cat: "capilar", brands: ["CAPILAR PRO"], priceMax: 5000 });
    const next = reducer(state, { type: "reset" });
    expect(next.cat).toBe("capilar");
  });
});

// ─── activeFilterCount ────────────────────────────────────────────────────────

describe("activeFilterCount", () => {
  it("returns 0 for the default state (no active filters)", () => {
    // cat, query, and sort are explicitly NOT counted — they're navigation, not filters
    expect(activeFilterCount(base())).toBe(0);
  });

  it("returns 1 when exactly one filter is active", () => {
    expect(activeFilterCount(base({ ratingMin: 4 }))).toBe(1);
  });

  it("counts each active filter dimension independently", () => {
    // Each of the 6 filter dimensions contributes exactly 1 to the count:
    // brands (per entry), priceMax < default, ratingMin > 0, rxMode ≠ all, inStock, onSale
    const state = base({
      brands: ["GENÉRICO", "CAPILAR PRO"], // contributes 2 (one per brand)
      priceMax: 10000,                     // contributes 1 (below PRICE_MAX_DEFAULT)
      ratingMin: 4.5,                      // contributes 1
      rxMode: "otc",                       // contributes 1
      inStock: true,                       // contributes 1
      onSale: true,                        // contributes 1
    });
    expect(activeFilterCount(state)).toBe(7);
  });

  it("does not count cat, query, or sort as active filters", () => {
    // These are navigation/search fields, not the filter panel chip count
    const state = base({ cat: "capilar", query: "shampoo", sort: "price-asc" });
    expect(activeFilterCount(state)).toBe(0);
  });
});
