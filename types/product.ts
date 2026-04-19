export type ProductArt = "bottle" | "tube" | "box" | "jar" | "round";

export interface ProductVariant {
  size: string;
  price: number;
}

export interface Product {
  id: string;
  cat: string;
  name: string;
  brand: string;
  price: number;
  old: number | null;
  art: ProductArt;
  cA: string;
  cB: string;
  tag: string | null;
  rating: number;
  reviews: number;
  rx: boolean;
  stock: string;
  size: string;
  short?: string;
  long?: string;
  ingredients?: string[];
  howTo?: string;
  benefits?: string[];
  variants?: ProductVariant[];
  warnings?: string;
}

export interface Review {
  id: number;
  name: string;
  rating: number;
  date: string;
  verified: boolean;
  title: string;
  body: string;
}

export interface Category {
  id: string;
  name: string;
  desc: string;
}

export interface Condition {
  id: string;
  title: string;
  sub: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  bg: string;
  accent: string;
}
