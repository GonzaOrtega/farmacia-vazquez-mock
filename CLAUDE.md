# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## This is NOT the Next.js you know

Next.js **16** has breaking changes — APIs, conventions, and file structure may differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

The same warning lives in `AGENTS.md` (read by other tools). Keep these two in sync if you edit either.

## Commands

Package manager is **bun**.

| Command | What it does |
| --- | --- |
| `bun install` | Install deps |
| `bun run dev` | Dev server with Turbopack on :3000 |
| `bun run build` | Production build — **every route is statically prerendered** |
| `bun run start` | Serve the production build |
| `bun run lint` | ESLint (flat config, `next/core-web-vitals` + `next/typescript`) |
| `bun run typecheck` | `tsc --noEmit` (strict) |

No test runner is wired up.

## Architecture

- **App Router + full static prerender.** Every dynamic route declares `generateStaticParams`; there is no runtime server logic and no data source beyond static TS modules in `lib/data/` (12 products, 8 categories, plus brands/conditions/reviews/staff/promoBanners). Adding a "real" backend means introducing a data layer — don't assume one exists.
- **Next 16 async `params`.** Dynamic pages receive `params: Promise<{…}>` and must `await` it. See `app/producto/[id]/page.tsx` and `app/productos/[cat]/page.tsx`. Don't regress to the sync form.
- **Server-first, client where needed.** `app/layout.tsx` and the product-detail page are server components. `CartProvider`, `ProductListView`, and anything interactive are `"use client"`. Preserve this boundary.
- **Route → view shell split.** `app/**/page.tsx` files stay thin — they resolve params and delegate to shared shells in `components/pages/` (`ProductListView`, `ProductDetailView`). Put logic in the shell, not the route.
- **Cart state.** React Context in `components/cart/CartProvider.tsx`, persisted to `localStorage` under key `fv-cart-v1`. A `hydrated` flag gates the first write to avoid SSR mismatch. Cart items are `{id, qty}` only — price/metadata is resolved at read time via `getProduct(id)` from `lib/data/products.ts`.
- **Filters.** Local `useReducer` in `components/filters/useProductFilters.ts`. **Not URL-synced on purpose** (see `README.md` "What's out of scope") — don't "fix" casually.
- **Mobile vs desktop.** CSS-driven via Tailwind `md:hidden` / `hidden md:block`, not UA sniffing. The detail page renders *both* trees (`MobileHero`+`MobileAccordion`+`ReviewsMobile` vs `Gallery`+`DetailTabs`+`Reviews`) and lets the viewport pick.

## Design system

- **Tailwind v4, CSS-first config.** Tokens live in `app/globals.css` under `@theme { … }`. **There is no `tailwind.config.*`** — don't create one. CSS variables under `:root` mirror the tokens for inline use like `style={{ color: "var(--pro-primary)" }}`.
- **`pro-*` utility classes** (`pro-btn` / `pro-btn-primary` / `pro-btn-secondary` / `pro-btn-ghost`, `pro-card`, `pro-chip`, `pro-serif`, `pro-input`, `pro-img-bg`, `pro-dots`, `pro-rise`, `pro-bump`, `pro-scroll`, `pro-range`) are defined in `globals.css` and composed with Tailwind utilities. Reuse these instead of rolling equivalents.
- **Fonts.** Inter (body) + Instrument Serif (display) loaded via `next/font/google` in `app/layout.tsx` as `--font-inter` / `--font-instrument-serif`. Use `.pro-serif` for display type, not a raw `font-family`.
- **Path alias.** `@/*` → project root (`tsconfig.json`). Use `@/components/...`, `@/lib/...`, `@/types/...`.

## Language & voice

UI copy is Spanish, **Argentine voseo** ("aplicá", "dejá", "tu farmacia"). New copy should match that register. The brand is fictional.

## Out of scope

See `README.md` § "What's out of scope" — auth, real checkout, database, URL-synced filters, real photography, tests, and i18n are all deliberately absent. Don't scaffold them without explicit ask.
