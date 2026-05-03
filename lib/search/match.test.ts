/**
 * Tests for matchesQuery / searchProducts in lib/search/match.ts.
 *
 * matchesQuery is the predicate shared between applyFilters (catalog grid)
 * and HeaderSearch (typeahead dropdown). Empty / whitespace queries are a
 * no-op match so applyFilters can call it unconditionally; the dropdown
 * uses searchProducts which deliberately returns [] for empty input — an
 * empty header search should not list everything in stock.
 *
 * What would break these tests: adding accent normalization, expanding the
 * matchable fields, changing the empty-query semantics.
 */
import { describe, expect, it } from "vitest";
import { matchesQuery, searchProducts } from "./match";
import { products } from "@/lib/data/products";
import type { Product } from "@/types/product";

function fixture(overrides: Partial<Product> = {}): Product {
  return {
    id: "x",
    cat: "medicamentos",
    name: "Ibuprofeno 400mg",
    brand: "GENÉRICO",
    price: 1000,
    old: null,
    art: "box",
    cA: "#fff",
    cB: "#000",
    tag: null,
    rating: 4,
    reviews: 0,
    rx: false,
    stock: "En stock",
    size: "20 comp",
    ...overrides,
  };
}

describe("matchesQuery", () => {
  it("returns true for empty / whitespace query (no-op match)", () => {
    const p = fixture();
    expect(matchesQuery(p, "")).toBe(true);
    expect(matchesQuery(p, "   ")).toBe(true);
  });

  it("matches against product name (case-insensitive)", () => {
    const p = fixture({ name: "Sérum Hidratante" });
    expect(matchesQuery(p, "sérum")).toBe(true);
    expect(matchesQuery(p, "SÉRUM")).toBe(true);
    expect(matchesQuery(p, "hidrat")).toBe(true);
  });

  it("matches against brand name (case-insensitive)", () => {
    const p = fixture({ brand: "VÁZQUEZ LAB" });
    expect(matchesQuery(p, "vázquez")).toBe(true);
    expect(matchesQuery(p, "lab")).toBe(true);
  });

  it("does not match when neither name nor brand contains the query", () => {
    const p = fixture({ name: "Crema Corporal", brand: "HIDRABODY" });
    expect(matchesQuery(p, "ibuprofeno")).toBe(false);
  });

  it("does not normalize accents — 'serum' does not match 'Sérum'", () => {
    // Documented limitation: substring is byte-wise after lowercasing. If/when
    // the catalog grows past ~50 items this is the first thing to revisit.
    const p = fixture({ name: "Sérum Hidratante" });
    expect(matchesQuery(p, "serum")).toBe(false);
  });
});

describe("searchProducts", () => {
  it("returns [] for an empty / whitespace query", () => {
    expect(searchProducts(products, "")).toEqual([]);
    expect(searchProducts(products, "   ")).toEqual([]);
  });

  it("returns every match when no limit is provided", () => {
    const result = searchProducts(products, "GENÉRICO");
    expect(result.length).toBeGreaterThan(1);
    expect(result.every((p) => p.brand === "GENÉRICO")).toBe(true);
  });

  it("caps the result list to `limit` items", () => {
    const all = searchProducts(products, "GENÉRICO");
    const capped = searchProducts(products, "GENÉRICO", 1);
    expect(capped).toHaveLength(1);
    expect(capped[0]).toEqual(all[0]);
  });

  it("returns [] when nothing matches", () => {
    expect(searchProducts(products, "xyznonexistent", 6)).toEqual([]);
  });
});
