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
  parseFilterParams,
  serializeFilterParams,
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

// ─── serializeFilterParams ────────────────────────────────────────────────────
//
// serializeFilterParams turns a FilterState into a URL query string, omitting
// any field that equals its default. This is what keeps URLs clean — only the
// filters the user actually set show up. The returned string has no leading "?".
//
// What would break these tests: changing a default value (would require the
// omission rule to update), renaming a URL key, or adding a new synced field
// without teaching serialize about it.

describe("serializeFilterParams", () => {
  it("returns empty string for the default state (no filters active)", () => {
    expect(serializeFilterParams(base())).toBe("");
  });

  it("serializes brands as a comma-joined list under the 'brands' key", () => {
    const qs = serializeFilterParams(base({ brands: ["Bayer", "Genomma"] }));
    expect(qs).toBe("brands=Bayer%2CGenomma");
  });

  it("serializes priceMax only when below PRICE_MAX_DEFAULT", () => {
    expect(serializeFilterParams(base({ priceMax: 15000 }))).toBe("priceMax=15000");
    // At default → omitted
    expect(serializeFilterParams(base({ priceMax: PRICE_MAX_DEFAULT }))).toBe("");
  });

  it("serializes ratingMin only when above 0", () => {
    expect(serializeFilterParams(base({ ratingMin: 4 }))).toBe("ratingMin=4");
    expect(serializeFilterParams(base({ ratingMin: 0 }))).toBe("");
  });

  it("serializes rxMode only when not 'all'", () => {
    expect(serializeFilterParams(base({ rxMode: "otc" }))).toBe("rxMode=otc");
    expect(serializeFilterParams(base({ rxMode: "all" }))).toBe("");
  });

  it("serializes inStock and onSale as presence flags (value '1')", () => {
    expect(serializeFilterParams(base({ inStock: true }))).toBe("inStock=1");
    expect(serializeFilterParams(base({ onSale: true }))).toBe("onSale=1");
    // false → omitted entirely
    expect(serializeFilterParams(base({ inStock: false, onSale: false }))).toBe("");
  });

  it("serializes sort only when not 'relevance'", () => {
    expect(serializeFilterParams(base({ sort: "price-asc" }))).toBe("sort=price-asc");
    expect(serializeFilterParams(base({ sort: "relevance" }))).toBe("");
  });

  it("composes multiple fields in a single query string", () => {
    const qs = serializeFilterParams(base({
      brands: ["Bayer"],
      priceMax: 20000,
      rxMode: "otc",
      onSale: true,
      sort: "price-asc",
    }));
    // URLSearchParams preserves insertion order, which mirrors the order we set them in source.
    expect(qs).toBe("brands=Bayer&priceMax=20000&rxMode=otc&onSale=1&sort=price-asc");
  });

  it("does not include cat or query in the output", () => {
    // cat lives in the URL path (/productos/[cat]); query has no UI binding.
    const qs = serializeFilterParams(base({ cat: "capilar", query: "ibuprofeno" }));
    expect(qs).toBe("");
  });
});

// ─── parseFilterParams ────────────────────────────────────────────────────────
//
// parseFilterParams reads a URLSearchParams and returns a Partial<FilterState>
// containing only the keys it recognized. Anything malformed (NaN, out of range,
// unknown enum variant) is silently dropped so a garbage URL never crashes the
// page — it just falls back to defaults for the affected fields.
//
// What would break these tests: tightening or loosening the validation rules,
// renaming a URL key, or changing what counts as "out of range."

describe("parseFilterParams", () => {
  it("returns an empty object when no recognized keys are present", () => {
    expect(parseFilterParams(new URLSearchParams(""))).toEqual({});
  });

  it("parses comma-separated brands, trimming whitespace and dropping empty entries", () => {
    const result = parseFilterParams(new URLSearchParams("brands=Bayer,Genomma , ,Roche"));
    expect(result.brands).toEqual(["Bayer", "Genomma", "Roche"]);
  });

  it("parses priceMax when within [PRICE_MIN_DEFAULT, PRICE_MAX_DEFAULT]", () => {
    expect(parseFilterParams(new URLSearchParams("priceMax=15000"))).toEqual({
      priceMax: 15000,
    });
  });

  it("drops priceMax outside the allowed range (no field on the result)", () => {
    expect(parseFilterParams(new URLSearchParams("priceMax=999"))).toEqual({});
    expect(parseFilterParams(new URLSearchParams("priceMax=9999999"))).toEqual({});
    expect(parseFilterParams(new URLSearchParams("priceMax=abc"))).toEqual({});
  });

  it("parses ratingMin when in (0, 5]", () => {
    expect(parseFilterParams(new URLSearchParams("ratingMin=4.5"))).toEqual({
      ratingMin: 4.5,
    });
    // Out of range or garbage → dropped
    expect(parseFilterParams(new URLSearchParams("ratingMin=0"))).toEqual({});
    expect(parseFilterParams(new URLSearchParams("ratingMin=6"))).toEqual({});
    expect(parseFilterParams(new URLSearchParams("ratingMin=xyz"))).toEqual({});
  });

  it("parses rxMode only for the three allowed values", () => {
    expect(parseFilterParams(new URLSearchParams("rxMode=otc"))).toEqual({ rxMode: "otc" });
    expect(parseFilterParams(new URLSearchParams("rxMode=rx"))).toEqual({ rxMode: "rx" });
    expect(parseFilterParams(new URLSearchParams("rxMode=all"))).toEqual({ rxMode: "all" });
    // Unknown variant → dropped
    expect(parseFilterParams(new URLSearchParams("rxMode=bogus"))).toEqual({});
  });

  it("parses inStock=1 and onSale=1 as booleans; any other value is dropped", () => {
    expect(parseFilterParams(new URLSearchParams("inStock=1&onSale=1"))).toEqual({
      inStock: true,
      onSale: true,
    });
    // Only the literal "1" is accepted — "true", "yes", etc. are dropped
    expect(parseFilterParams(new URLSearchParams("inStock=true"))).toEqual({});
  });

  it("parses sort only for known SortKey values", () => {
    expect(parseFilterParams(new URLSearchParams("sort=price-asc"))).toEqual({
      sort: "price-asc",
    });
    expect(parseFilterParams(new URLSearchParams("sort=bogus"))).toEqual({});
  });

  it("ignores unknown keys entirely (no crash, no noise in the result)", () => {
    expect(parseFilterParams(new URLSearchParams("utm_source=campaign&ref=friend"))).toEqual({});
  });
});

// ─── round-trip ───────────────────────────────────────────────────────────────
//
// The round-trip test is the single most valuable check: parse ∘ serialize
// must be the identity on synced fields. If either helper drifts, this catches
// it immediately. It's also how we verify that the two functions agree on
// encodings (comma for brands, "1" for booleans, etc.) without having to
// duplicate those conventions in the assertions.

describe("parseFilterParams ∘ serializeFilterParams is identity on synced fields", () => {
  it("restores a composite state (brands + priceMax + rxMode + onSale + sort) exactly", () => {
    const state = base({
      brands: ["Bayer", "Genomma"],
      priceMax: 20000,
      ratingMin: 4,
      rxMode: "otc",
      inStock: true,
      onSale: true,
      sort: "price-asc",
    });
    const roundTripped = parseFilterParams(new URLSearchParams(serializeFilterParams(state)));
    // Restricted to the seven synced fields — cat and query are intentionally excluded.
    expect(roundTripped).toEqual({
      brands: ["Bayer", "Genomma"],
      priceMax: 20000,
      ratingMin: 4,
      rxMode: "otc",
      inStock: true,
      onSale: true,
      sort: "price-asc",
    });
  });

  it("returns an empty object when round-tripping the default state", () => {
    const roundTripped = parseFilterParams(new URLSearchParams(serializeFilterParams(base())));
    expect(roundTripped).toEqual({});
  });
});
