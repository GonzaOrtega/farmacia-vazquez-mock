import type { Product } from "@/types/product";

export function matchesQuery(product: Product, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    product.name.toLowerCase().includes(q) ||
    product.brand.toLowerCase().includes(q)
  );
}

export function searchProducts(
  products: Product[],
  query: string,
  limit?: number,
): Product[] {
  if (!query.trim()) return [];
  const matches = products.filter((p) => matchesQuery(p, query));
  return limit === undefined ? matches : matches.slice(0, limit);
}
