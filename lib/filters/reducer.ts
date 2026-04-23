import {
  PRICE_MAX_DEFAULT,
  type FilterState,
  type RxMode,
  type SortKey,
} from "./types";

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
