"use client";

import { useEffect, useMemo, useReducer, useRef } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
  type ReadonlyURLSearchParams,
} from "next/navigation";
import { products } from "@/lib/data/products";
import type { Product } from "@/types/product";

export type SortKey = "relevance" | "price-asc" | "price-desc" | "rating" | "reviews" | "discount";
export type RxMode = "all" | "otc" | "rx";

export interface FilterState {
  cat: string;
  brands: string[];
  priceMax: number;
  ratingMin: number;
  rxMode: RxMode;
  inStock: boolean;
  onSale: boolean;
  sort: SortKey;
  query: string;
}

export const PRICE_MAX_DEFAULT = 50000;
export const PRICE_MIN_DEFAULT = 1000;
export const PRICE_STEP = 500;

type Action =
  | { type: "setCat"; cat: string }
  | { type: "toggleBrand"; brand: string }
  | { type: "setPriceMax"; value: number }
  | { type: "setRatingMin"; value: number }
  | { type: "setRxMode"; value: RxMode }
  | { type: "setInStock"; value: boolean }
  | { type: "setOnSale"; value: boolean }
  | { type: "setSort"; value: SortKey }
  | { type: "setQuery"; value: string }
  | { type: "reset" };

export function reducer(state: FilterState, action: Action): FilterState {
  switch (action.type) {
    case "setCat":
      return { ...state, cat: action.cat };
    case "toggleBrand":
      return state.brands.includes(action.brand)
        ? { ...state, brands: state.brands.filter((b) => b !== action.brand) }
        : { ...state, brands: [...state.brands, action.brand] };
    case "setPriceMax":
      return { ...state, priceMax: action.value };
    case "setRatingMin":
      return { ...state, ratingMin: action.value };
    case "setRxMode":
      return { ...state, rxMode: action.value };
    case "setInStock":
      return { ...state, inStock: action.value };
    case "setOnSale":
      return { ...state, onSale: action.value };
    case "setSort":
      return { ...state, sort: action.value };
    case "setQuery":
      return { ...state, query: action.value };
    case "reset":
      return { ...defaultState(state.cat) };
    default:
      return state;
  }
}

export function defaultState(cat: string): FilterState {
  return {
    cat,
    brands: [],
    priceMax: PRICE_MAX_DEFAULT,
    ratingMin: 0,
    rxMode: "all",
    inStock: false,
    onSale: false,
    sort: "relevance",
    query: "",
  };
}

export function activeFilterCount(f: FilterState): number {
  return (
    f.brands.length +
    (f.priceMax < PRICE_MAX_DEFAULT ? 1 : 0) +
    (f.ratingMin > 0 ? 1 : 0) +
    (f.rxMode !== "all" ? 1 : 0) +
    (f.inStock ? 1 : 0) +
    (f.onSale ? 1 : 0)
  );
}

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
  if (f.query.trim()) {
    const q = f.query.toLowerCase();
    out = out.filter(
      (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q),
    );
  }

  if (f.sort !== "relevance") out.sort(comparators[f.sort]);
  return out;
}

// ─── URL sync ─────────────────────────────────────────────────────────────────
// Pure helpers: serialize state → query string, and parse query string → partial
// state. Kept at module scope (no React) so they can be unit-tested as plain
// functions and reused by category-chip Link hrefs.

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

  return out;
}

export function useProductFilters(initialCat: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Lazy initializer: parse URL exactly once on mount. Subsequent URL changes
  // from our own router.replace must NOT re-hydrate state (that would create
  // a sync loop). React's useReducer guarantees `init` runs once.
  const [state, dispatch] = useReducer(reducer, initialCat, (cat) => ({
    ...defaultState(cat),
    ...parseFilterParams(searchParams),
  }));

  // state → URL sync, debounced 150ms so slider drags don't fire a replace per
  // pixel. Skip the first render: the URL already matches initial state by
  // construction, so replacing would be a no-op router call.
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    const qs = serializeFilterParams(state);
    const url = qs ? `${pathname}?${qs}` : pathname;
    const t = setTimeout(() => {
      router.replace(url, { scroll: false });
    }, 150);
    return () => clearTimeout(t);
  }, [state, pathname, router]);

  const result = useMemo(() => applyFilters(products, state), [state]);
  const activeCount = useMemo(() => activeFilterCount(state), [state]);

  return {
    filters: state,
    result,
    activeCount,
    setCat: (cat: string) => dispatch({ type: "setCat", cat }),
    toggleBrand: (brand: string) => dispatch({ type: "toggleBrand", brand }),
    setPriceMax: (value: number) => dispatch({ type: "setPriceMax", value }),
    setRatingMin: (value: number) => dispatch({ type: "setRatingMin", value }),
    setRxMode: (value: RxMode) => dispatch({ type: "setRxMode", value }),
    setInStock: (value: boolean) => dispatch({ type: "setInStock", value }),
    setOnSale: (value: boolean) => dispatch({ type: "setOnSale", value }),
    setSort: (value: SortKey) => dispatch({ type: "setSort", value }),
    setQuery: (value: string) => dispatch({ type: "setQuery", value }),
    reset: () => dispatch({ type: "reset" }),
  };
}
