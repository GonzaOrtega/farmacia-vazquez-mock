"use client";

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

const STORAGE_KEY = "fv-favorites-v1";

export interface FavoritesState {
  ids: string[];
  count: number;
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const FavoritesContext = createContext<FavoritesState | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as string[];
        if (Array.isArray(parsed)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setIds(parsed.filter((v): v is string => typeof v === "string"));
        }
      }
    } catch {
      // ignore corrupted localStorage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // ignore quota errors
    }
  }, [ids, hydrated]);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  const add = useCallback((id: string) => {
    setIds((cur) => (cur.includes(id) ? cur : [id, ...cur]));
  }, []);

  const remove = useCallback((id: string) => {
    setIds((cur) => cur.filter((x) => x !== id));
  }, []);

  const toggle = useCallback((id: string) => {
    setIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [id, ...cur]));
  }, []);

  const clear = useCallback(() => setIds([]), []);

  const value: FavoritesState = useMemo(
    () => ({ ids, count: ids.length, has, toggle, add, remove, clear }),
    [ids, has, toggle, add, remove, clear],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}
