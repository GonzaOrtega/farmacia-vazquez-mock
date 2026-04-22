/**
 * Tests for lib/data/products.ts — getProduct and productsByCategory.
 *
 * Both functions are pure: they read a static 12-item array and return data.
 * No mocking needed. Tests use real product IDs and real category strings
 * from the dataset so that a data-file rename or typo is immediately visible.
 *
 * What would break these tests: changing a product id, removing a product,
 * changing the "all" sentinel to a different string, or filtering by a field
 * other than .cat. What these tests do NOT cover: individual product field
 * values beyond id/cat (those belong to integration or snapshot tests if ever
 * added).
 */
import { describe, expect, it } from "vitest";
import { getProduct, productsByCategory, products } from "./products";

describe("getProduct", () => {
  it("returns the product whose id matches", () => {
    const p = getProduct("p1");
    // We assert on id specifically — not the whole object — so the test
    // doesn't become a change-detector for every field.
    expect(p).toBeDefined();
    expect(p!.id).toBe("p1");
  });

  it("returns undefined for an id that does not exist", () => {
    expect(getProduct("nonexistent")).toBeUndefined();
  });

  it("returns a product with expected shape (has name, price, cat)", () => {
    const p = getProduct("p1");
    expect(p).toMatchObject({
      name: "Sérum Hidratante",
      cat: "dermocosmetica",
      price: 12990,
    });
  });
});

describe("productsByCategory", () => {
  it("returns all products when cat is 'all'", () => {
    const result = productsByCategory("all");
    // The static dataset has exactly 12 products — locking this prevents
    // accidental deletions going unnoticed.
    expect(result).toHaveLength(products.length);
    expect(result.length).toBe(12);
  });

  it("returns only the products whose cat matches", () => {
    const result = productsByCategory("dermocosmetica");
    // Every returned item must have the requested category.
    expect(result.every((p) => p.cat === "dermocosmetica")).toBe(true);
  });

  it("returns 3 dermocosmetica products (p1, p5, p12)", () => {
    // Regression-lock: if a product is recategorized, this count changes.
    const result = productsByCategory("dermocosmetica");
    expect(result).toHaveLength(3);
  });

  it("returns 3 medicamentos products (p4, p10, p11)", () => {
    const result = productsByCategory("medicamentos");
    expect(result).toHaveLength(3);
  });

  it("returns an empty array for a category that does not exist", () => {
    expect(productsByCategory("nonexistent")).toHaveLength(0);
  });

  it("returns only capilar products — none from other categories", () => {
    const result = productsByCategory("capilar");
    const nonCapilar = result.filter((p) => p.cat !== "capilar");
    expect(nonCapilar).toHaveLength(0);
  });
});
