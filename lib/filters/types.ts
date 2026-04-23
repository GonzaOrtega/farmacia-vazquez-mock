export type SortKey =
  | "relevance"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "reviews"
  | "discount";

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
