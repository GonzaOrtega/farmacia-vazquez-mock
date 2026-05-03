import type { ReadonlyURLSearchParams } from "next/navigation";
import {
  PRICE_MAX_DEFAULT,
  PRICE_MIN_DEFAULT,
  type FilterState,
  type RxMode,
  type SortKey,
} from "./types";

const SORT_KEYS: readonly SortKey[] = [
  "relevance",
  "price-asc",
  "price-desc",
  "rating",
  "reviews",
  "discount",
];
const RX_MODES: readonly RxMode[] = ["all", "otc", "rx"];

export function serializeFilterParams(f: FilterState): string {
  const sp = new URLSearchParams();
  if (f.brands.length) sp.set("brands", f.brands.join(","));
  if (f.priceMax < PRICE_MAX_DEFAULT) sp.set("priceMax", String(f.priceMax));
  if (f.ratingMin > 0) sp.set("ratingMin", String(f.ratingMin));
  if (f.rxMode !== "all") sp.set("rxMode", f.rxMode);
  if (f.inStock) sp.set("inStock", "1");
  if (f.onSale) sp.set("onSale", "1");
  if (f.sort !== "relevance") sp.set("sort", f.sort);
  const q = f.query.trim();
  if (q) sp.set("q", q);
  return sp.toString();
}

export function parseFilterParams(
  sp: URLSearchParams | ReadonlyURLSearchParams,
): Partial<FilterState> {
  const out: Partial<FilterState> = {};

  const brands = sp.get("brands");
  if (brands) {
    const list = brands.split(",").map((s) => s.trim()).filter(Boolean);
    if (list.length) out.brands = list;
  }

  const priceMax = Number(sp.get("priceMax"));
  if (
    Number.isFinite(priceMax) &&
    priceMax >= PRICE_MIN_DEFAULT &&
    priceMax <= PRICE_MAX_DEFAULT
  ) {
    out.priceMax = priceMax;
  }

  const ratingMin = Number(sp.get("ratingMin"));
  if (Number.isFinite(ratingMin) && ratingMin > 0 && ratingMin <= 5) {
    out.ratingMin = ratingMin;
  }

  const rxMode = sp.get("rxMode");
  if (rxMode && (RX_MODES as readonly string[]).includes(rxMode)) {
    out.rxMode = rxMode as RxMode;
  }

  if (sp.get("inStock") === "1") out.inStock = true;
  if (sp.get("onSale") === "1") out.onSale = true;

  const sort = sp.get("sort");
  if (sort && (SORT_KEYS as readonly string[]).includes(sort)) {
    out.sort = sort as SortKey;
  }

  const q = sp.get("q");
  if (q && q.trim()) out.query = q.trim();

  return out;
}
