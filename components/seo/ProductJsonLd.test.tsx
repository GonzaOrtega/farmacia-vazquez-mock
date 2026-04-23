/**
 * Tests for ProductJsonLd in components/seo/ProductJsonLd.tsx.
 *
 * The component renders a single <script type="application/ld+json"> tag
 * containing a schema.org Product payload. The tests render it, pull the
 * script innerHTML, JSON.parse it, and assert the resulting object matches
 * what Google's rich-results panel expects.
 *
 * What would break these tests: renaming a top-level schema.org key,
 * dropping the currency code, or changing how we map stock strings to the
 * availability enum.
 */
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ProductJsonLd } from "./ProductJsonLd";
import type { Product } from "@/types/product";

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: "p1",
    cat: "dermocosmetica",
    name: "Test Product",
    brand: "TEST BRAND",
    price: 12990,
    old: null,
    art: "bottle",
    cA: "#fff",
    cB: "#000",
    tag: null,
    rating: 4.8,
    reviews: 124,
    rx: false,
    stock: "En stock",
    size: "30 ml",
    short: "A test product for verification.",
    ...overrides,
  };
}

function payload(product: Product): Record<string, unknown> {
  const { container } = render(<ProductJsonLd product={product} />);
  const script = container.querySelector('script[type="application/ld+json"]');
  expect(script).not.toBeNull();
  // innerHTML is what ends up in the actual DOM; the escape pass is applied here.
  return JSON.parse(script!.innerHTML) as Record<string, unknown>;
}

describe("ProductJsonLd", () => {
  it("emits the schema.org context and Product type", () => {
    const json = payload(makeProduct());
    expect(json["@context"]).toBe("https://schema.org");
    expect(json["@type"]).toBe("Product");
  });

  it("includes name, description, image, and brand fields", () => {
    const product = makeProduct();
    const json = payload(product);
    expect(json.name).toBe(product.name);
    expect(json.description).toBe(product.short);
    expect(json.image).toContain(`/producto/${product.id}/opengraph-image`);
    expect(json.brand).toEqual({ "@type": "Brand", name: product.brand });
  });

  it("falls back to a generic description when product.short is missing", () => {
    const json = payload(makeProduct({ short: undefined }));
    expect(json.description).toContain("Test Product");
    expect(json.description).toContain("TEST BRAND");
  });

  it("serializes the offer with ARS currency and the canonical URL", () => {
    const json = payload(makeProduct({ price: 9900 }));
    const offers = json.offers as Record<string, unknown>;
    expect(offers["@type"]).toBe("Offer");
    expect(offers.priceCurrency).toBe("ARS");
    expect(offers.price).toBe("9900");
    expect(offers.url).toContain("/producto/p1");
  });

  it("serializes aggregateRating from rating + reviews", () => {
    const json = payload(makeProduct({ rating: 4.5, reviews: 42 }));
    expect(json.aggregateRating).toEqual({
      "@type": "AggregateRating",
      ratingValue: "4.5",
      reviewCount: "42",
    });
  });

  it("maps 'En stock' to InStock availability", () => {
    const json = payload(makeProduct({ stock: "En stock" }));
    const offers = json.offers as Record<string, unknown>;
    expect(offers.availability).toBe("https://schema.org/InStock");
  });

  it("maps 'Últimas 3' to LimitedAvailability", () => {
    const json = payload(makeProduct({ stock: "Últimas 3" }));
    const offers = json.offers as Record<string, unknown>;
    expect(offers.availability).toBe("https://schema.org/LimitedAvailability");
  });

  it("maps 'Agotado' to OutOfStock", () => {
    const json = payload(makeProduct({ stock: "Agotado" }));
    const offers = json.offers as Record<string, unknown>;
    expect(offers.availability).toBe("https://schema.org/OutOfStock");
  });

  it("keeps rx products as InStock (prescription-required ≠ unavailable)", () => {
    const json = payload(makeProduct({ stock: "Requiere receta", rx: true }));
    const offers = json.offers as Record<string, unknown>;
    expect(offers.availability).toBe("https://schema.org/InStock");
  });
});
