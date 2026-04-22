"use client";

import { useMemo, useReducer } from "react";
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

export function useProductFilters(initialCat: string) {
  const [state, dispatch] = useReducer(reducer, initialCat, defaultState);

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
