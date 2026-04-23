"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { IconCart, IconClose, IconFilter } from "@/components/atoms/Icon";
import { FilterDrawer } from "@/components/filters/FilterDrawer";
import { FilterPanel } from "@/components/filters/FilterPanel";
import { ShareFilterButton } from "@/components/filters/ShareFilterButton";
import { useProductFilters, PRICE_MAX_DEFAULT, type SortKey } from "@/components/filters/useProductFilters";
import { ProductGrid } from "@/components/products/ProductGrid";
import { categories, getCategory } from "@/lib/data/categories";
import { fmtPrice } from "@/lib/format";

interface Props {
  cat: string;
}

const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: "relevance", label: "Relevancia" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "rating", label: "Mejor calificados" },
  { value: "reviews", label: "Más reseñas" },
  { value: "discount", label: "Mayor descuento" },
];

export function ProductListView({ cat }: Props) {
  const f = useProductFilters(cat);
  const searchParams = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const category = getCategory(cat);
  const catName = category?.name ?? "Todos los productos";
  // Category chip hrefs carry current filters so switching categories preserves state.
  const currentQs = searchParams.toString();

  const crumbs = [
    { label: "Inicio", href: "/" },
    { label: "Productos", href: "/productos" },
    ...(cat !== "all" ? [{ label: catName }] : []),
  ];

  return (
    <>
      <div className="bg-white border-b border-[color:var(--pro-line)] px-4 py-4 md:px-12 md:py-6">
        <Breadcrumb items={crumbs} />
        <div className="flex items-end justify-between flex-wrap gap-3 mt-2">
          <div>
            <div
              className="text-[11px] font-semibold uppercase tracking-[0.08em]"
              style={{ color: "#5C1A6E" }}
            >
              {cat === "all" ? "Todo el catálogo" : "Categoría"}
            </div>
            <h1
              className="pro-serif text-[28px] md:text-[40px] leading-[1.05] tracking-[-0.02em]"
              style={{ color: "#1A1320" }}
            >
              {catName}
            </h1>
          </div>
          <div className="text-[13px]" style={{ color: "#7A7185" }}>
            {f.result.length} {f.result.length === 1 ? "producto" : "productos"}
          </div>
        </div>
      </div>

      {/* Sticky category chips */}
      <div
        className="sticky top-[60px] z-[5] bg-white border-b border-[color:var(--pro-line)] px-4 py-2.5 md:px-12 md:py-3"
      >
        <div className="pro-scroll flex gap-1.5 overflow-x-auto">
          {categories.map((c) => {
            const active = f.filters.cat === c.id;
            const base = c.id === "all" ? "/productos" : `/productos/${c.id}`;
            const href = currentQs ? `${base}?${currentQs}` : base;
            return (
              <Link
                key={c.id}
                href={href}
                className="rounded-full px-3.5 py-1.5 text-[12px] font-semibold whitespace-nowrap no-underline"
                style={{
                  background: active ? "#1A1320" : "#fff",
                  color: active ? "#fff" : "#1A1320",
                  border: active ? "1px solid #1A1320" : "1px solid var(--pro-line)",
                }}
              >
                {c.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-4 py-3 md:px-12 md:py-4">
        <div className="flex flex-wrap items-center gap-2.5 justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="pro-btn pro-btn-secondary inline-flex items-center gap-2"
              style={{ padding: "9px 16px", fontSize: 13 }}
            >
              <IconFilter size={16} />
              Filtros
              {f.activeCount > 0 && (
                <span
                  className="rounded-full text-[11px] font-bold"
                  style={{
                    background: "#5C1A6E",
                    color: "#fff",
                    padding: "0px 7px",
                  }}
                >
                  {f.activeCount}
                </span>
              )}
            </button>

            <ChipToggle
              label="En oferta"
              on={f.filters.onSale}
              onClick={() => f.setOnSale(!f.filters.onSale)}
            />
            <ChipToggle
              label="En stock"
              on={f.filters.inStock}
              onClick={() => f.setInStock(!f.filters.inStock)}
            />
            <ChipToggle
              label="Sin receta"
              on={f.filters.rxMode === "otc"}
              onClick={() => f.setRxMode(f.filters.rxMode === "otc" ? "all" : "otc")}
            />
          </div>

          <label className="flex items-center gap-2 text-[12px]" style={{ color: "#4A3D54" }}>
            Ordenar por:
            <select
              value={f.filters.sort}
              onChange={(e) => f.setSort(e.target.value as SortKey)}
              className="pro-input"
              style={{ padding: "8px 12px", fontSize: 13, width: "auto", borderRadius: 8 }}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Active filter chips */}
        {f.activeCount > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {f.filters.brands.map((b) => (
              <ActiveChip key={b} label={b} onRemove={() => f.toggleBrand(b)} />
            ))}
            {f.filters.priceMax < PRICE_MAX_DEFAULT && (
              <ActiveChip
                label={`≤ ${fmtPrice(f.filters.priceMax)}`}
                onRemove={() => f.setPriceMax(PRICE_MAX_DEFAULT)}
              />
            )}
            {f.filters.ratingMin > 0 && (
              <ActiveChip
                label={`${f.filters.ratingMin}★ o más`}
                onRemove={() => f.setRatingMin(0)}
              />
            )}
            {f.filters.rxMode !== "all" && (
              <ActiveChip
                label={f.filters.rxMode === "otc" ? "Venta libre" : "Con receta"}
                onRemove={() => f.setRxMode("all")}
              />
            )}
            <ShareFilterButton />
            <button
              type="button"
              onClick={f.reset}
              className="text-[12px] font-semibold ml-1"
              style={{ color: "#5C1A6E", background: "transparent", border: "none", cursor: "pointer" }}
            >
              Limpiar todo
            </button>
          </div>
        )}
      </div>

      {/* Grid or empty */}
      <div className="px-4 pb-10 md:px-12 md:pb-16">
        {f.result.length === 0 ? (
          <ListEmpty onReset={f.reset} />
        ) : (
          <ProductGrid items={f.result} columns="2-3" />
        )}
      </div>

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onApply={() => setDrawerOpen(false)}
        onReset={f.reset}
        resultCount={f.result.length}
      >
        <FilterPanel
          filters={f.filters}
          activeCount={f.activeCount}
          toggleBrand={f.toggleBrand}
          setPriceMax={f.setPriceMax}
          setRatingMin={f.setRatingMin}
          setRxMode={f.setRxMode}
          setInStock={f.setInStock}
          setOnSale={f.setOnSale}
          reset={f.reset}
        />
      </FilterDrawer>
    </>
  );
}

function ChipToggle({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full text-[12px] font-semibold cursor-pointer"
      style={{
        padding: "8px 14px",
        background: on ? "#5C1A6E" : "#fff",
        color: on ? "#fff" : "#1A1320",
        border: on ? "1px solid #5C1A6E" : "1px solid var(--pro-line)",
      }}
    >
      {label}
    </button>
  );
}

function ActiveChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full text-[11px] font-semibold"
      style={{
        padding: "4px 4px 4px 10px",
        background: "#1A1320",
        color: "#fff",
      }}
    >
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Quitar filtro ${label}`}
        className="grid place-items-center rounded-full cursor-pointer"
        style={{
          width: 18,
          height: 18,
          background: "rgba(255,255,255,0.12)",
          border: "none",
          color: "#fff",
        }}
      >
        <IconClose size={10} />
      </button>
    </span>
  );
}

function ListEmpty({ onReset }: { onReset: () => void }) {
  return (
    <div
      className="rounded-[14px] text-center py-12"
      style={{ background: "#FBF7F3" }}
    >
      <div
        className="mx-auto grid place-items-center rounded-full"
        style={{ width: 60, height: 60, background: "#F4EEF7", color: "#5C1A6E" }}
      >
        <IconCart size={24} />
      </div>
      <div className="pro-serif text-[24px] mt-3" style={{ color: "#1A1320" }}>
        No encontramos productos
      </div>
      <div className="text-[13px] mt-1.5" style={{ color: "#4A3D54" }}>
        Probá ajustando los filtros o buscá en otra categoría.
      </div>
      <button
        type="button"
        onClick={onReset}
        className="pro-btn pro-btn-primary mt-5"
      >
        Limpiar filtros
      </button>
    </div>
  );
}
