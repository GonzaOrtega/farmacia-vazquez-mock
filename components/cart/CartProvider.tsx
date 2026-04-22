"use client";

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { getProduct } from "@/lib/data/products";
import type { CartItem, CartState } from "@/types/cart";

const STORAGE_KEY = "fv-cart-v1";

export const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR-safe localStorage hydration
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // ignore corrupted localStorage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore quota errors
    }
  }, [items, hydrated]);

  const add = useCallback((id: string) => {
    setItems((cur) => {
      const found = cur.find((i) => i.id === id);
      return found
        ? cur.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))
        : [...cur, { id, qty: 1 }];
    });
    setBump((b) => b + 1);
  }, []);

  const remove = useCallback((id: string) => {
    setItems((cur) => cur.filter((i) => i.id !== id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((cur) =>
      qty <= 0 ? cur.filter((i) => i.id !== id) : cur.map((i) => (i.id === id ? { ...i, qty } : i)),
    );
  }, []);

  const { count, subtotal } = useMemo(() => {
    let c = 0;
    let s = 0;
    for (const it of items) {
      c += it.qty;
      const p = getProduct(it.id);
      if (p) s += p.price * it.qty;
    }
    return { count: c, subtotal: s };
  }, [items]);

  const value: CartState = useMemo(
    () => ({ items, count, subtotal, open, bump, add, remove, setQty, setOpen }),
    [items, count, subtotal, open, bump, add, remove, setQty],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
