"use client";

import { useState } from "react";
import {
  IconCart,
  IconCheck,
  IconHeart,
  IconMinus,
  IconPlus,
  IconRx,
  IconStar,
  IconTruck,
} from "@/components/atoms/Icon";
import { useCart } from "@/components/cart/useCart";
import { fmtPrice } from "@/lib/format";
import type { Product } from "@/types/product";

interface Props {
  p: Product;
}

export function BuyBlock({ p }: Props) {
  const cart = useCart();
  const [qty, setQty] = useState(1);
  const [variant, setVariant] = useState(0);
  const [added, setAdded] = useState(false);

  const v = p.variants?.[variant] ?? { size: p.size, price: p.price };
  const discount = p.old ? Math.round(((p.old - p.price) / p.old) * 100) : 0;

  const add = () => {
    for (let i = 0; i < qty; i++) cart.add(p.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const lowStock = p.stock.toLowerCase().includes("última");

  return (
    <div>
      <div
        className="flex items-center gap-1.5 text-[13px] mb-3.5"
        style={{ color: "#4A3D54" }}
      >
        <div className="inline-flex gap-px">
          {[1, 2, 3, 4, 5].map((i) => (
            <IconStar
              key={i}
              size={14}
              stroke={i <= Math.round(p.rating) ? "#B45309" : "#D8D2DC"}
              fill={i <= Math.round(p.rating) ? "#B45309" : "#D8D2DC"}
            />
          ))}
        </div>
        <span className="font-semibold" style={{ color: "#1A1320" }}>
          {p.rating}
        </span>
        <a href="#reviews" className="underline" style={{ color: "#5C1A6E" }}>
          {p.reviews} reseñas
        </a>
      </div>

      <div className="flex items-baseline gap-3 flex-wrap">
        <div
          className="pro-serif text-[44px] leading-none tracking-[-0.02em]"
          style={{ color: "#1A1320" }}
        >
          {fmtPrice(v.price)}
        </div>
        {p.old && (
          <>
            <div className="text-[16px] line-through" style={{ color: "#7A7185" }}>
              {fmtPrice(p.old)}
            </div>
            <span
              className="pro-promo-pill"
              style={{ background: "#FBEAF0", color: "#C2185B" }}
            >
              -{discount}%
            </span>
          </>
        )}
      </div>
      <div className="text-[13px] mt-1.5 font-medium" style={{ color: "#046B3A" }}>
        o 3 cuotas de {fmtPrice(Math.round(v.price / 3))} sin interés
      </div>
      <div className="text-[12px] mt-0.5" style={{ color: "#7A7185" }}>
        Precio con transferencia o débito: {fmtPrice(Math.round(v.price * 0.9))}
      </div>

      <div
        className="inline-flex items-center gap-1.5 mt-3.5 rounded text-[12px] font-semibold"
        style={{
          padding: "4px 10px",
          background: lowStock ? "#FBEAF0" : "#E8F6EE",
          color: lowStock ? "#C2185B" : "#046B3A",
        }}
      >
        <span
          style={{ width: 6, height: 6, background: "currentColor", borderRadius: 999 }}
        />
        {p.stock}
      </div>

      {p.variants && p.variants.length > 1 && (
        <div className="mt-5">
          <div
            className="text-[11px] font-bold uppercase tracking-[0.08em] mb-2"
            style={{ color: "#1A1320" }}
          >
            Presentación
          </div>
          <div className="flex gap-2 flex-wrap">
            {p.variants.map((vv, i) => {
              const on = i === variant;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setVariant(i)}
                  className="text-left cursor-pointer"
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: on ? "2px solid #1A1320" : "1px solid var(--pro-line)",
                    background: "#fff",
                    minWidth: 110,
                  }}
                >
                  <div className="text-[13px] font-semibold" style={{ color: "#1A1320" }}>
                    {vv.size}
                  </div>
                  <div className="text-[12px] mt-0.5" style={{ color: "#7A7185" }}>
                    {fmtPrice(vv.price)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {p.rx && (
        <div
          className="mt-5 flex gap-3 items-start rounded-[10px]"
          style={{ padding: 14, background: "#EAF2F9", border: "1px solid #CDE0F1" }}
        >
          <div
            className="grid place-items-center flex-shrink-0"
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: "#1A4E8E",
              color: "#fff",
            }}
          >
            <IconRx size={18} stroke="#fff" />
          </div>
          <div className="flex-1">
            <div
              className="text-[13px] font-semibold mb-0.5"
              style={{ color: "#1A4E8E" }}
            >
              Producto con receta
            </div>
            <div
              className="text-[12px] mb-2"
              style={{ color: "#1A4E8E", opacity: 0.9 }}
            >
              Subí la foto o PDF de tu receta y nuestra farmacéutica la valida en minutos.
            </div>
            <button
              type="button"
              className="pro-btn"
              style={{
                background: "#1A4E8E",
                color: "#fff",
                border: "none",
                padding: "8px 14px",
                fontSize: 12,
              }}
            >
              Subir receta
            </button>
          </div>
        </div>
      )}

      <div className="mt-5 flex gap-2.5 items-stretch">
        <div
          className="inline-flex items-center rounded-[10px]"
          style={{ border: "1px solid var(--pro-line)", background: "#fff" }}
        >
          <button
            type="button"
            onClick={() => setQty(Math.max(1, qty - 1))}
            aria-label="Restar"
            className="cursor-pointer"
            style={{ width: 40, height: 48, background: "transparent", border: "none", color: "#1A1320" }}
          >
            <IconMinus size={14} />
          </button>
          <span
            className="text-[15px] font-semibold text-center"
            style={{ width: 32, color: "#1A1320" }}
          >
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty(qty + 1)}
            aria-label="Sumar"
            className="cursor-pointer"
            style={{ width: 40, height: 48, background: "transparent", border: "none", color: "#1A1320" }}
          >
            <IconPlus size={14} />
          </button>
        </div>
        <button
          type="button"
          onClick={add}
          className="pro-btn flex-1 inline-flex items-center justify-center gap-2"
          style={{
            background: added ? "#E8F6EE" : "#1A1320",
            color: added ? "#046B3A" : "#fff",
            border: "none",
            fontSize: 14,
            fontWeight: 600,
            padding: "0 20px",
          }}
        >
          {added ? (
            <>
              <IconCheck size={16} /> Agregado al carrito
            </>
          ) : (
            <>
              <IconCart size={16} /> Agregar al carrito
            </>
          )}
        </button>
      </div>
      <button type="button" className="pro-btn pro-btn-secondary mt-2 w-full">
        <IconHeart size={14} /> Guardar en favoritos
      </button>

      <div
        className="mt-5 rounded-[10px]"
        style={{ padding: 14, background: "#FBF7F3", border: "1px solid var(--pro-line-2)" }}
      >
        <div className="flex items-center gap-2 mb-2.5">
          <IconTruck size={16} stroke="#5C1A6E" />
          <div className="text-[13px] font-semibold" style={{ color: "#1A1320" }}>
            Envío y retiro
          </div>
        </div>
        <div className="flex gap-1.5">
          <input
            className="pro-input"
            placeholder="Tu código postal"
            style={{ flex: 1, padding: "10px 12px", fontSize: 13 }}
          />
          <button type="button" className="pro-btn pro-btn-secondary" style={{ padding: "0 14px" }}>
            Calcular
          </button>
        </div>
        <div
          className="flex gap-3.5 mt-2.5 flex-wrap text-[12px]"
          style={{ color: "#4A3D54" }}
        >
          <span className="inline-flex items-center gap-1">
            <IconCheck size={12} stroke="#046B3A" /> Envío gratis desde $20.000
          </span>
          <span className="inline-flex items-center gap-1">
            <IconCheck size={12} stroke="#046B3A" /> Retiro gratis en sucursal
          </span>
        </div>
      </div>
    </div>
  );
}

export function Benefits({ p }: { p: Product }) {
  if (!p.benefits?.length) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-3.5">
      {p.benefits.map((b, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1.5 rounded-full text-[12px] font-medium"
          style={{ padding: "6px 11px", background: "#F4EEF7", color: "#5C1A6E" }}
        >
          <IconCheck size={12} stroke="#5C1A6E" /> {b}
        </span>
      ))}
    </div>
  );
}
