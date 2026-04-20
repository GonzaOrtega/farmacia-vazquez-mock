"use client";

import { useState } from "react";
import { ProductArt } from "@/components/atoms/ProductArt";
import { IconCheck, IconHeart, IconPlus, IconRx, IconStar } from "@/components/atoms/Icon";
import { fmtPrice } from "@/lib/format";
import { useCart } from "@/components/cart/useCart";
import { useFavorites } from "@/components/favorites/useFavorites";
import type { Product } from "@/types/product";

interface Props {
  p: Product;
}

export function ProductCard({ p }: Props) {
  const cart = useCart();
  const favs = useFavorites();
  const fav = favs.has(p.id);
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    cart.add(p.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 700);
  };

  const toggleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    favs.toggle(p.id);
  };

  return (
    <div
      className="pro-card flex flex-col gap-2.5 relative overflow-hidden"
      style={{ padding: 14 }}
    >
      {p.tag && (
        <div className="absolute top-3 left-3 z-[2]">
          <span
            className="pro-promo-pill"
            style={{
              background: p.tag === "NUEVO" ? "#E8F6EE" : "#FBEAF0",
              color: p.tag === "NUEVO" ? "#046B3A" : "#C2185B",
            }}
          >
            {p.tag}
          </span>
        </div>
      )}
      <button
        type="button"
        onClick={toggleFav}
        aria-label="Favorito"
        className="absolute top-2.5 right-2.5 z-[2] grid place-items-center cursor-pointer"
        style={{
          background: "#fff",
          color: fav ? "#C2185B" : "#7A7185",
          border: "1px solid var(--pro-line)",
          width: 30,
          height: 30,
          borderRadius: 999,
        }}
      >
        <IconHeart size={14} fill={fav ? "#C2185B" : "none"} stroke={fav ? "#C2185B" : "#7A7185"} />
      </button>

      <div className="pro-img-bg rounded-[10px] grid place-items-center" style={{ aspectRatio: "1/1" }}>
        <ProductArt
          kind={p.art}
          colorA={p.cA}
          colorB={p.cB}
          brand={p.brand.split(" ")[0]}
          name={p.name.split(" ")[0]}
          size={p.size}
          width={100}
          height={130}
        />
      </div>

      <div>
        <div
          className="text-[10px] font-semibold tracking-[0.06em]"
          style={{ color: "#7A7185" }}
        >
          {p.brand}
        </div>
        <div
          className="pro-serif text-[15px] md:text-[17px] mt-0.5 leading-[1.2]"
          style={{ color: "#1A1320" }}
        >
          {p.name}
        </div>
        <div className="text-[11px] mt-0.5" style={{ color: "#7A7185" }}>
          {p.size}
        </div>
        <div
          className="flex items-center gap-1 mt-1.5 text-[11px]"
          style={{ color: "#4A3D54" }}
        >
          <IconStar size={12} stroke="#B45309" fill="#B45309" />
          <span className="font-semibold">{p.rating}</span>
          <span style={{ color: "#7A7185" }}>({p.reviews})</span>
        </div>
        <div className="flex items-baseline gap-2 mt-2.5">
          <div
            className="pro-serif text-[19px] md:text-[22px]"
            style={{ color: "#1A1320", fontWeight: 400 }}
          >
            {fmtPrice(p.price)}
          </div>
          {p.old && (
            <div
              className="text-[12px] line-through"
              style={{ color: "#7A7185" }}
            >
              {fmtPrice(p.old)}
            </div>
          )}
        </div>
        <div
          className="text-[11px] mt-0.5 font-medium"
          style={{ color: "#046B3A" }}
        >
          o 3 × {fmtPrice(Math.round(p.price / 3))} sin interés
        </div>
        {p.rx && (
          <div
            className="mt-2 inline-flex items-center gap-1 rounded text-[10px] font-semibold"
            style={{
              padding: "3px 8px",
              background: "#EAF2F9",
              color: "#1A4E8E",
            }}
          >
            <IconRx size={11} stroke="#1A4E8E" /> Requiere receta
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="pro-btn"
        style={{
          background: added ? "#E8F6EE" : "#1A1320",
          color: added ? "#046B3A" : "#fff",
          padding: "10px 14px",
          fontSize: 13,
          border: "none",
        }}
      >
        {added ? (
          <>
            <IconCheck size={14} /> Agregado
          </>
        ) : (
          <>
            <IconPlus size={14} /> Agregar al carrito
          </>
        )}
      </button>
    </div>
  );
}
