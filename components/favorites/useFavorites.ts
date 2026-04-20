"use client";

import { useContext } from "react";
import { FavoritesContext, type FavoritesState } from "./FavoritesProvider";

export function useFavorites(): FavoritesState {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within <FavoritesProvider>");
  return ctx;
}
