"use client";

import { useContext } from "react";
import { CartContext } from "./CartProvider";
import type { CartState } from "@/types/cart";

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
