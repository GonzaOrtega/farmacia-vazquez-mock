/**
 * renderWithProviders — integration-test helper that mounts a component
 * inside all three context providers (Auth, Favorites, Cart) the app uses
 * in production.
 *
 * Pass a `seed` object to pre-populate the localStorage keys each provider
 * hydrates from on first render — cart items, signed-in user, favorite ids.
 * This matches how the real app bootstraps state, so tests exercise the
 * same hydration path users hit on a page refresh.
 *
 * The providers are ordered so that downstream ones (CartProvider)
 * can freely read from upstream ones (AuthProvider, FavoritesProvider).
 */
import { render, type RenderOptions } from "@testing-library/react";
import type { ReactNode } from "react";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { CartProvider } from "@/components/cart/CartProvider";
import { FavoritesProvider } from "@/components/favorites/FavoritesProvider";
import type { CartItem } from "@/types/cart";
import type { AuthUser } from "@/types/user";

export interface ProviderSeed {
  cart?: CartItem[];
  auth?: AuthUser;
  favorites?: string[];
}

export function seedStorage(seed: ProviderSeed = {}): void {
  if (seed.cart) localStorage.setItem("fv-cart-v1", JSON.stringify(seed.cart));
  if (seed.auth) localStorage.setItem("fv-auth-v1", JSON.stringify(seed.auth));
  if (seed.favorites) {
    localStorage.setItem("fv-favorites-v1", JSON.stringify(seed.favorites));
  }
}

export function renderWithProviders(
  ui: ReactNode,
  seed: ProviderSeed = {},
  options?: Omit<RenderOptions, "wrapper">,
) {
  seedStorage(seed);
  return render(
    <AuthProvider>
      <FavoritesProvider>
        <CartProvider>{ui}</CartProvider>
      </FavoritesProvider>
    </AuthProvider>,
    options,
  );
}
