import type { Product } from "@/types/product";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://farmacia-vazquez.example";

/**
 * Map our free-text Spanish stock strings to schema.org availability enum
 * values. Google uses this for the "Availability" line in rich results.
 *
 *   "En stock"       → InStock
 *   "Últimas 3"      → LimitedAvailability
 *   "Requiere receta"→ InStock (the product IS available; it just needs a Rx)
 *   "Agotado"        → OutOfStock (handled defensively; not in current data)
 */
function availability(stock: string): string {
  const s = stock.toLowerCase();
  if (s.includes("agotado") || s.includes("sin stock")) {
    return "https://schema.org/OutOfStock";
  }
  if (s.includes("últim") || s.includes("pocas")) {
    return "https://schema.org/LimitedAvailability";
  }
  return "https://schema.org/InStock";
}

export function ProductJsonLd({ product }: { product: Product }) {
  const url = `${SITE_URL}/producto/${product.id}`;
  const image = `${SITE_URL}/producto/${product.id}/opengraph-image`;
  const description =
    product.short ?? `${product.name} de ${product.brand} en Farmacia Vázquez.`;

  const payload = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description,
    image,
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "ARS",
      price: product.price.toString(),
      availability: availability(product.stock),
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating.toString(),
      reviewCount: product.reviews.toString(),
    },
  };

  // Replace "<" with its escaped form so any stray "</script>" or "<!--" in
  // product copy can't break out of the JSON-LD context. Belt-and-suspenders.
  const json = JSON.stringify(payload).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
