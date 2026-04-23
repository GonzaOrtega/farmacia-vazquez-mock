"use client";

import { useEffect, useMemo, useReducer, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { products } from "@/lib/data/products";
import { applyFilters } from "@/lib/filters/apply";
import {
  activeFilterCount,
  defaultState,
  reducer,
} from "@/lib/filters/reducer";
import {
  parseFilterParams,
  serializeFilterParams,
} from "@/lib/filters/url";
import type { RxMode, SortKey } from "@/lib/filters/types";

// Re-exports keep existing consumers (ProductListView, FilterPanel) working
// without touching their import lines.
export {
  PRICE_MAX_DEFAULT,
  PRICE_MIN_DEFAULT,
  PRICE_STEP,
} from "@/lib/filters/types";
export type {
  FilterState,
  RxMode,
  SortKey,
} from "@/lib/filters/types";

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
