# Farmacia Vázquez — Mock e-commerce

A production-ready Next.js 16 port of the Farmacia Vázquez Landing PRO design — a Spanish-language pharmacy e-commerce site for a neighborhood shop in San Miguel, Buenos Aires.

Built from a Claude Design handoff bundle. The original was a static HTML prototype with side-by-side mobile/desktop frames on a design canvas; this port is a real responsive website.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **TypeScript** (strict)
- **Tailwind CSS v4** (CSS-first `@theme` config)
- **bun** (package manager + runner)

## Getting started

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | What it does |
| --- | --- |
| `bun run dev` | Start dev server with Turbopack on port 3000 |
| `bun run build` | Production build (static prerender of all routes) |
| `bun run start` | Serve the production build |
| `bun run lint` | ESLint with `next/core-web-vitals` |
| `bun run typecheck` | `tsc --noEmit` |

## Routes

| Path | What it renders |
| --- | --- |
| `/` | Landing: Hero, trust bar, categories, conditions, featured products, 6-banner promo carousel, Rx upload, brand strip, staff, footer |
| `/productos` | Full catalog with filters |
| `/productos/[cat]` | Category-filtered list (`medicamentos`, `dermocosmetica`, `perfumeria`, `capilar`, `maquillaje`, `personal`, `bebe`) |
| `/producto/[id]` | Product detail with gallery, variants, buy block, tabs (desktop) / accordion (mobile), reviews, related |

All 24 pages are statically prerendered at build time.

## Project structure

```
app/                       # App Router routes
  layout.tsx               # Root layout (fonts + cart provider)
  page.tsx                 # Landing
  productos/page.tsx
  productos/[cat]/page.tsx
  producto/[id]/page.tsx
  not-found.tsx
  globals.css              # Design tokens + utility classes
components/
  atoms/                   # Icon, Logo, ProductArt, SectionHead
  cart/                    # CartProvider + useCart + CartDrawer
  layout/                  # Header, Footer, MobileTabBar, Breadcrumb
  sections/                # Landing sections (Hero, Promo carousel, ...)
  products/                # ProductCard, ProductCardLink, ProductGrid
  filters/                 # FilterPanel, FilterDrawer, useProductFilters
  detail/                  # Gallery, BuyBlock, Tabs, Reviews, Related, MobileBuyBar
  pages/                   # ProductListView, ProductDetailView
lib/
  data/                    # products, categories, conditions, brands, staff, reviews, promoBanners
  format.ts
types/                     # Product, Cart types
```

## Design system

All design tokens live in `app/globals.css` under `@theme`:

- Primary purple `#5C1A6E`
- Pharmacy green `#00A651`
- Ink `#1A1320`
- Cream `#FBF7F3`

Typography: **Instrument Serif** (display) + **Inter** (body), wired with `next/font/google`. Composed utility classes (`pro-btn`, `pro-card`, `pro-chip`, `pro-serif`, `pro-dots`, `pro-img-bg`, etc.) are ported from the original `pro-styles.css` and used compositionally with Tailwind utilities.

## State management

- **Cart**: React Context (`CartProvider`) with `localStorage` persistence under the key `fv-cart-v1`. Hydrated in `useEffect` to avoid SSR mismatch.
- **Filters**: `useReducer` in `ProductListView` — URL params not wired (follow-up).

## Placeholder content

Product images and staff photos are SVG illustrations rendered inline, not photography. Swap in:

- Real product photos → replace `<ProductArt>` calls with `<Image src=... />` in `components/products/ProductCard.tsx`, `components/detail/Gallery.tsx`, etc.
- Real staff portraits → replace the stylized `<svg>` in `components/sections/Staff.tsx`.

## Push to GitHub

The project is already a git repo. Two ways to create the GitHub remote:

### Option A — GitHub CLI (fastest)

```bash
gh auth login                                  # if not authenticated
gh repo create farmacia-vazquez-mock \
  --public \
  --source=. \
  --remote=origin \
  --push
```

Swap `--public` for `--private` if you want a private repo.

### Option B — Web UI fallback

1. Create an empty repo at https://github.com/new named `farmacia-vazquez-mock` (no README, no .gitignore, no license — the local repo already has those).
2. Copy the SSH or HTTPS URL GitHub shows you, then:

```bash
git remote add origin git@github.com:<your-user>/farmacia-vazquez-mock.git
git branch -M main
git push -u origin main
```

## What's out of scope

The following are intentionally not included — each is a clean, orthogonal add-on:

- Auth, real checkout, payment gateway
- Database — product data is static in `lib/data/products.ts` (12 products, 8 categories)
- URL-synced filter state on `/productos`
- Real product and staff photography
- "Editorial" detail layout and "sidebar" list layout (alternate variants from the original Tweaks panel)
- Tests (Vitest + Playwright would fit cleanly)
- i18n (everything is Spanish — Argentine voseo)

## Attribution

Ported from a Claude Design handoff bundle authored on claude.ai/design. Brand and copy are fictional for demonstration purposes.
