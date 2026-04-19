"use client";

import { useState } from "react";
import { IconMinus, IconPlus } from "@/components/atoms/Icon";
import { brands } from "@/lib/data/brands";
import { fmtPrice } from "@/lib/format";
import {
  PRICE_MAX_DEFAULT,
  PRICE_MIN_DEFAULT,
  PRICE_STEP,
  type FilterState,
  type RxMode,
} from "./useProductFilters";

interface Props {
  filters: FilterState;
  activeCount: number;
  toggleBrand: (b: string) => void;
  setPriceMax: (v: number) => void;
  setRatingMin: (v: number) => void;
  setRxMode: (v: RxMode) => void;
  setInStock: (v: boolean) => void;
  setOnSale: (v: boolean) => void;
  reset: () => void;
}

export function FilterPanel(p: Props) {
  return (
    <div className="flex flex-col gap-0">
      <div className="flex items-center justify-between pb-3">
        <div
          className="pro-serif text-[20px]"
          style={{ color: "#1A1320" }}
        >
          Filtros
        </div>
        {p.activeCount > 0 && (
          <button
            type="button"
            onClick={p.reset}
            className="text-[12px] font-semibold"
            style={{ color: "#5C1A6E", background: "transparent", border: "none", cursor: "pointer" }}
          >
            Limpiar
          </button>
        )}
      </div>

      <FilterGroup title="Precio" defaultOpen>
        <div className="flex items-center justify-between text-[12px] mb-2" style={{ color: "#4A3D54" }}>
          <span>{fmtPrice(0)}</span>
          <span className="font-semibold">≤ {fmtPrice(p.filters.priceMax)}</span>
        </div>
        <input
          type="range"
          className="pro-range"
          min={PRICE_MIN_DEFAULT}
          max={PRICE_MAX_DEFAULT}
          step={PRICE_STEP}
          value={p.filters.priceMax}
          onChange={(e) => p.setPriceMax(Number(e.target.value))}
        />
      </FilterGroup>

      <FilterGroup title="Marca" defaultOpen>
        <div className="flex flex-col gap-1.5">
          {brands.map((b) => (
            <label key={b} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input
                type="checkbox"
                checked={p.filters.brands.includes(b)}
                onChange={() => p.toggleBrand(b)}
                className="accent-[color:var(--pro-primary)]"
              />
              <span>{b}</span>
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Calificación">
        {[0, 3, 4].map((r) => (
          <label key={r} className="flex items-center gap-2 text-[13px] cursor-pointer py-1">
            <input
              type="radio"
              name="rating"
              checked={p.filters.ratingMin === r}
              onChange={() => p.setRatingMin(r)}
              className="accent-[color:var(--pro-primary)]"
            />
            <span>{r === 0 ? "Todas" : `${"★".repeat(r)} o más`}</span>
          </label>
        ))}
      </FilterGroup>

      <FilterGroup title="Receta">
        {(
          [
            ["all", "Todos"],
            ["otc", "Venta libre (OTC)"],
            ["rx", "Con receta (Rx)"],
          ] as const
        ).map(([v, label]) => (
          <label key={v} className="flex items-center gap-2 text-[13px] cursor-pointer py-1">
            <input
              type="radio"
              name="rx"
              checked={p.filters.rxMode === v}
              onChange={() => p.setRxMode(v)}
              className="accent-[color:var(--pro-primary)]"
            />
            <span>{label}</span>
          </label>
        ))}
      </FilterGroup>

      <FilterGroup title="Otros">
        <label className="flex items-center gap-2 text-[13px] cursor-pointer py-1">
          <input
            type="checkbox"
            checked={p.filters.onSale}
            onChange={(e) => p.setOnSale(e.target.checked)}
            className="accent-[color:var(--pro-primary)]"
          />
          <span>En oferta</span>
        </label>
        <label className="flex items-center gap-2 text-[13px] cursor-pointer py-1">
          <input
            type="checkbox"
            checked={p.filters.inStock}
            onChange={(e) => p.setInStock(e.target.checked)}
            className="accent-[color:var(--pro-primary)]"
          />
          <span>Solo en stock</span>
        </label>
      </FilterGroup>
    </div>
  );
}

function FilterGroup({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      className="border-t py-3"
      style={{ borderColor: "var(--pro-line)" }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-1 cursor-pointer"
        style={{ background: "transparent", border: "none" }}
      >
        <span
          className="text-[11px] font-bold uppercase tracking-[0.08em]"
          style={{ color: "#4A3D54" }}
        >
          {title}
        </span>
        {open ? <IconMinus size={14} /> : <IconPlus size={14} />}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}
