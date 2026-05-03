import type { Product } from "@/types/product";
import { matchesQuery } from "@/lib/search/match";
import type { FilterState, SortKey } from "./types";

const comparators: Record<Exclude<SortKey, "relevance">, (a: Product, b: Product) => number> = {
  "price-asc":  (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  "rating":     (a, b) => b.rating - a.rating,
  "reviews":    (a, b) => b.reviews - a.reviews,
  "discount":   (a, b) => ((b.old ?? b.price) - b.price) - ((a.old ?? a.price) - a.price),
};

export function applyFilters(list: Product[], f: FilterState): Product[] {
  let out = list.slice();
  if (f.cat !== "all") out = out.filter((p) => p.cat === f.cat);
  if (f.brands.length) out = out.filter((p) => f.brands.includes(p.brand));
  out = out.filter((p) => p.price <= f.priceMax);
  if (f.ratingMin > 0) out = out.filter((p) => p.rating >= f.ratingMin);
  if (f.rxMode === "otc") out = out.filter((p) => !p.rx);
  if (f.rxMode === "rx") out = out.filter((p) => p.rx);
  if (f.onSale) out = out.filter((p) => p.old != null);
  if (f.inStock) out = out.filter((p) => !p.stock.toLowerCase().includes("receta"));
  if (f.query.trim()) out = out.filter((p) => matchesQuery(p, f.query));

  if (f.sort !== "relevance") out.sort(comparators[f.sort]);
  return out;
}
