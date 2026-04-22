/**
 * Tests for the reducer, defaultState, applyFilters, and activeFilterCount
 * in components/filters/useProductFilters.ts.
 *
 * These functions were intentionally exported (purely additive change) so we
 * can test them as plain functions — input → output — without spinning up React.
 * That makes each test fast (<1ms) and lets us cover all 10 reducer actions and
 * all 7 filtering dimensions plus 5 sort strategies in a readable flat structure.
 *
 * The hook itself (useProductFilters) is not tested here because it is just
 * useReducer(reducer, …) + useMemo(applyFilters) — testing it would duplicate
 * what these tests already cover while adding React lifecycle noise.
 *
 * What would break these tests: changing action types, modifying the default
 * PRICE_MAX_DEFAULT, changing which fields activeFilterCount counts, or altering
 * sort order direction. What these tests do NOT cover: the hook's dispatch
 * integration or React re-render behavior (that belongs in component-integration
 * tests in a follow-up plan).
 */
import { describe, expect, it } from "vitest";
import {
  reducer,
  defaultState,
  applyFilters,
  activeFilterCount,
  PRICE_MAX_DEFAULT,
} from "./useProductFilters";
import { products } from "@/lib/data/products";
import type { FilterState } from "./useProductFilters";

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
    // This is an intentional design decision (line 61 of source: defaultState(state.cat)).
    // Resetting filters while browsing "capilar" should keep you in "capilar".
    const state = base({ cat: "capilar", brands: ["CAPILAR PRO"], priceMax: 5000 });
    const next = reducer(state, { type: "reset" });
    expect(next.cat).toBe("capilar");
  });
});

// ─── applyFilters ─────────────────────────────────────────────────────────────

describe("applyFilters — category filter", () => {
  it("returns all products when cat is 'all'", () => {
    const result = applyFilters(products, base({ cat: "all" }));
    expect(result).toHaveLength(products.length);
  });

  it("returns only medicamentos products when cat is 'medicamentos'", () => {
    const result = applyFilters(products, base({ cat: "medicamentos" }));
    expect(result.every((p) => p.cat === "medicamentos")).toBe(true);
  });
});

describe("applyFilters — brand filter", () => {
  it("returns only products whose brand is in the selected brands list", () => {
    const result = applyFilters(products, base({ brands: ["GENÉRICO"] }));
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.brand === "GENÉRICO")).toBe(true);
  });

  it("returns all products when no brand is selected", () => {
    const result = applyFilters(products, base({ brands: [] }));
    expect(result).toHaveLength(products.length);
  });
});

describe("applyFilters — priceMax filter", () => {
  it("excludes products priced above priceMax", () => {
    // All products in the dataset are priced above 1000, so setting priceMax = 5000
    // filters out anything more expensive than that.
    const result = applyFilters(products, base({ priceMax: 5000 }));
    expect(result.every((p) => p.price <= 5000)).toBe(true);
    // And we lose at least the expensive ones (e.g. Eau de Parfum at 29900)
    expect(result.length).toBeLessThan(products.length);
  });

  it("returns all products when priceMax is at PRICE_MAX_DEFAULT (no effective filter)", () => {
    const result = applyFilters(products, base({ priceMax: PRICE_MAX_DEFAULT }));
    expect(result).toHaveLength(products.length);
  });
});

describe("applyFilters — ratingMin filter", () => {
  it("returns only products rated >= ratingMin", () => {
    const result = applyFilters(products, base({ ratingMin: 4.9 }));
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.rating >= 4.9)).toBe(true);
  });
});

describe("applyFilters — rxMode filter", () => {
  it("'otc' mode excludes products that require a prescription (rx: true)", () => {
    const result = applyFilters(products, base({ rxMode: "otc" }));
    // p11 (Amoxicilina) is rx: true — it must be excluded
    expect(result.some((p) => p.id === "p11")).toBe(false);
    expect(result.every((p) => !p.rx)).toBe(true);
  });

  it("'rx' mode returns only products that require a prescription", () => {
    const result = applyFilters(products, base({ rxMode: "rx" }));
    // Only p11 is rx: true in the dataset
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("p11");
  });

  it("'all' mode does not filter by prescription status", () => {
    const result = applyFilters(products, base({ rxMode: "all" }));
    expect(result).toHaveLength(products.length);
  });
});

describe("applyFilters — onSale filter", () => {
  it("returns only products with a non-null old price when onSale is true", () => {
    const result = applyFilters(products, base({ onSale: true }));
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.old != null)).toBe(true);
  });
});

describe("applyFilters — inStock filter", () => {
  it("excludes products whose stock string contains 'receta' when inStock is true", () => {
    // p11 (Amoxicilina) has stock: "Requiere receta" — it must be excluded
    const result = applyFilters(products, base({ inStock: true }));
    expect(result.some((p) => p.id === "p11")).toBe(false);
    // The remaining items should not have "receta" in their stock string
    expect(result.every((p) => !p.stock.toLowerCase().includes("receta"))).toBe(true);
  });
});

describe("applyFilters — query filter", () => {
  it("matches against product name (case-insensitive)", () => {
    const result = applyFilters(products, base({ query: "SÉRUM" }));
    expect(result.some((p) => p.name.toLowerCase().includes("sérum"))).toBe(true);
  });

  it("matches against brand name (case-insensitive)", () => {
    const result = applyFilters(products, base({ query: "vázquez" }));
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.brand.toLowerCase().includes("vázquez"))).toBe(true);
  });

  it("returns empty array when query matches nothing", () => {
    const result = applyFilters(products, base({ query: "xyznonexistent" }));
    expect(result).toHaveLength(0);
  });
});

// ─── sort strategies ──────────────────────────────────────────────────────────

describe("applyFilters — sort: price-asc", () => {
  it("puts the cheapest product first", () => {
    const result = applyFilters(products, base({ sort: "price-asc" }));
    const prices = result.map((p) => p.price);
    // The first price must be the minimum of the whole dataset
    expect(prices[0]).toBe(Math.min(...prices));
  });
});

describe("applyFilters — sort: price-desc", () => {
  it("puts the most expensive product first", () => {
    const result = applyFilters(products, base({ sort: "price-desc" }));
    const prices = result.map((p) => p.price);
    expect(prices[0]).toBe(Math.max(...prices));
  });
});

describe("applyFilters — sort: rating", () => {
  it("puts the highest-rated product first", () => {
    const result = applyFilters(products, base({ sort: "rating" }));
    const ratings = result.map((p) => p.rating);
    expect(ratings[0]).toBe(Math.max(...ratings));
  });
});

describe("applyFilters — sort: reviews", () => {
  it("puts the product with the most reviews first", () => {
    const result = applyFilters(products, base({ sort: "reviews" }));
    const reviewCounts = result.map((p) => p.reviews);
    expect(reviewCounts[0]).toBe(Math.max(...reviewCounts));
  });
});

describe("applyFilters — sort: discount", () => {
  it("puts the product with the highest absolute discount first", () => {
    const result = applyFilters(products, base({ sort: "discount" }));
    // Discount = (old ?? price) - price; we only care about items with old != null
    const discounts = result.map((p) => (p.old ?? p.price) - p.price);
    expect(discounts[0]).toBe(Math.max(...discounts));
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
