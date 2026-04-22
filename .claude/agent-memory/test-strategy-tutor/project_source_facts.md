---
name: Source facts locked for tests
description: Verified behaviors and values from key source files, confirmed by reading source before writing the plan
type: project
---

Verified on 2026-04-22 by reading source directly. These are what test assertions must match.

## Storage keys
- Cart: `"fv-cart-v1"` (`CartProvider.tsx:7`)
- Auth: `"fv-auth-v1"` (`AuthProvider.tsx:7`)
- Favorites: `"fv-favorites-v1"` (`FavoritesProvider.tsx:5`)

## CartProvider
- `setQty(id, 0)` removes the item — condition is `qty <= 0` (`CartProvider.tsx:55-58`)
- `setQty(id, -1)` also removes (same `<= 0` branch)
- No min-qty clamping — removal is the behavior at 0 or below
- `subtotal` uses `getProduct(id).price * qty` with real product prices
- Hydration: localStorage read in first `useEffect`, sets `hydrated = true` at end
- Write guard: second `useEffect` checks `if (!hydrated) return` before writing

## AuthProvider
- Email match is case-insensitive: `.trim().toLowerCase()` (`AuthProvider.tsx:31`)
- `signup` firstName fallback: `firstName.trim() || "Invitado"` (`AuthProvider.tsx:85`)
- `logout` removes the storage key (`localStorage.removeItem(STORAGE_KEY)` when `user === null`)
- mockUser: `{firstName: "Camila", lastName: "Fernández", email: "camila.fernandez@correo.com.ar", memberSince: "Marzo 2024"}`
- Non-mockUser login: `{firstName: "Invitado", lastName: "", email: <input>, memberSince: <current month es-AR>}`
- `todayMemberLabel()` format: `"Abril de 2026"` (NOT `"Abril 2026"` — includes `" de "`). Regex to match: `/^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+ de \d{4}$/`

## FavoritesProvider
- `add` prepends: `[id, ...cur]` pattern — new items appear first in `ids`
- `add` is idempotent: `cur.includes(id) ? cur : [id, ...cur]`
- `toggle` adds if absent, removes if present

## useProductFilters
- Currently exported: `SortKey`, `RxMode`, `FilterState`, `PRICE_MAX_DEFAULT` (50000), `PRICE_MIN_DEFAULT` (1000), `PRICE_STEP` (500), `activeFilterCount`, `useProductFilters`
- NOT exported (need to add): `reducer`, `applyFilters`, `defaultState`
- `reset` action preserves `cat`: calls `defaultState(state.cat)` not `defaultState("all")`
- `inStock` filter: excludes where `stock.toLowerCase().includes("receta")` — only p11 ("Requiere receta") excluded
- `discount` sort null-safety: `(old ?? price) - price` — products with no discount sort to bottom with 0
- `toggleBrand` is a true toggle — calling twice with same brand returns to empty brands array
- `query` searches both `name` and `brand` (case-insensitive substring match)
- `relevance` sort: no-op (no sort applied, array order preserved)

## Products (lib/data/products.ts)
- Total: 12 products
- By category: dermocosmetica (3: p1, p5, p12), medicamentos (3: p4, p10, p11), capilar (2: p2, p9), maquillaje (1: p3), personal (1: p6), bebe (1: p7), perfumeria (1: p8)
- `productsByCategory("all")` returns all 12
- Key prices: p1=12990, p4=2450, p5=14900, p8=29900, p10=1890, p11=4290
- p11 has `rx: true` and `stock: "Requiere receta"` — the only rx product

## format.ts
- `fmtPrice(n)` = `"$" + n.toLocaleString("es-AR")`
- es-AR locale in Node.js/jsdom: `.` as thousands separator, `,` as decimal separator
- Confirmed outputs (locked 2026-04-22): `fmtPrice(0)` → `"$0"`, `fmtPrice(15000)` → `"$15.000"`, `fmtPrice(1234.56)` → `"$1.234,56"`, `fmtPrice(-50)` → `"$-50"`, `fmtPrice(29900)` → `"$29.900"`
- Negative numbers: `"$-50"` not `"-$50"` — current behavior regression-locked in tests

## useRequireAuth
- Redirect: `/ingresar?next=${encodeURIComponent(nextHref)}`
- For nextHref="/checkout": redirect is `/ingresar?next=%2Fcheckout`
- Hydration guard: `auth.hydrated && !auth.user` — no redirect fires before hydration
- Hook depends on `useAuth()` which reads from `AuthContext` — test wrapper needs `<AuthProvider>`
