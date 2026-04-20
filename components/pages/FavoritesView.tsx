"use client";

import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { IconArrow, IconHeart } from "@/components/atoms/Icon";
import { ProductGrid } from "@/components/products/ProductGrid";
import { useFavorites } from "@/components/favorites/useFavorites";
import { getProduct } from "@/lib/data/products";
import type { Product } from "@/types/product";

const crumbs = [
  { label: "Inicio", href: "/" },
  { label: "Favoritos" },
];

export function FavoritesView() {
  const fav = useFavorites();

  const items: Product[] = fav.ids
    .map((id) => getProduct(id))
    .filter((p): p is Product => p !== undefined);

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
              Tu lista
            </div>
            <h1
              className="pro-serif text-[28px] md:text-[40px] leading-[1.05] tracking-[-0.02em]"
              style={{ color: "#1A1320" }}
            >
              Tus favoritos
            </h1>
            <div className="text-[13px] mt-1" style={{ color: "#7A7185" }}>
              {items.length === 0
                ? "Todavía no guardaste nada"
                : `${items.length} ${items.length === 1 ? "producto guardado" : "productos guardados"}`}
            </div>
          </div>
          {items.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm("¿Querés vaciar tu lista de favoritos?")) fav.clear();
              }}
              className="pro-btn pro-btn-ghost"
              style={{ fontSize: 13 }}
            >
              Vaciar lista
            </button>
          )}
        </div>
      </div>

      <div className="px-4 py-8 md:px-12 md:py-12">
        {items.length === 0 ? <FavoritesEmpty /> : <ProductGrid items={items} columns="2-4" />}
      </div>
    </>
  );
}

function FavoritesEmpty() {
  return (
    <div
      className="rounded-[16px] text-center mx-auto"
      style={{ background: "#FBF7F3", padding: "64px 24px", maxWidth: 560 }}
    >
      <div
        className="mx-auto grid place-items-center rounded-full"
        style={{ width: 68, height: 68, background: "#F4EEF7", color: "#C2185B" }}
      >
        <IconHeart size={28} stroke="#C2185B" />
      </div>
      <div className="pro-serif text-[28px] md:text-[32px] mt-4 leading-[1.1]" style={{ color: "#1A1320" }}>
        Todavía no guardaste nada
      </div>
      <p className="text-[14px] md:text-[15px] mt-2" style={{ color: "#4A3D54", maxWidth: 420, margin: "8px auto 0" }}>
        Tocá el corazón en cualquier producto para sumarlo a tu lista. Lo vas a encontrar siempre acá.
      </p>
      <Link href="/productos" className="pro-btn pro-btn-primary mt-6 inline-flex no-underline">
        Explorar productos <IconArrow size={16} />
      </Link>
    </div>
  );
}
