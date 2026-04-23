/**
 * Tests for serializeFilterParams / parseFilterParams in lib/filters/url.ts.
 *
 * These two are the full round-trip between FilterState and the URL query
 * string. `serialize` omits any field at its default (clean URLs); `parse`
 * is strict — malformed or out-of-range values are silently dropped so a
 * hand-typed URL never crashes the page, it just falls back to defaults.
 *
 * The final round-trip test locks `parse ∘ serialize = identity` on every
 * synced field — the cheapest way to catch encoding drift.
 *
 * What would break these tests: renaming a URL key, tightening/loosening
 * validation, or changing how booleans are encoded.
 */
import { describe, expect, it } from "vitest";
import { parseFilterParams, serializeFilterParams } from "./url";
import { defaultState } from "./reducer";
import type { FilterState } from "./types";
import { PRICE_MAX_DEFAULT } from "./types";

function base(overrides: Partial<FilterState> = {}): FilterState {
  return { ...defaultState("all"), ...overrides };
}

// ─── serializeFilterParams ────────────────────────────────────────────────────

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
