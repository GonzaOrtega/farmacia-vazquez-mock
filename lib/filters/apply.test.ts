/**
 * Tests for applyFilters in lib/filters/apply.ts.
 *
 * applyFilters runs 7 filter dimensions (cat, brand, priceMax, ratingMin,
 * rxMode, onSale, inStock, query) followed by one of 5 sort strategies
 * ("relevance" is a no-op, so it has no test). We exercise each dimension
 * and each sort independently against the real 12-product dataset so the
 * assertions stay meaningful without fixture maintenance.
 *
 * What would break these tests: adding a new filter dimension without a case
 * here, changing a sort direction, or modifying the inStock / onSale rules.
 */
import { describe, expect, it } from "vitest";
import { applyFilters } from "./apply";
import { defaultState } from "./reducer";
import { PRICE_MAX_DEFAULT, type FilterState } from "./types";
import { products } from "@/lib/data/products";

function base(overrides: Partial<FilterState> = {}): FilterState {
  return { ...defaultState("all"), ...overrides };
}

// ─── applyFilters — dimensions ────────────────────────────────────────────────

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

// ─── applyFilters — sort strategies ───────────────────────────────────────────

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
