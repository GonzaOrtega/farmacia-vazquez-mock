"use client";

import { useState } from "react";
import { IconCart, IconCheck } from "@/components/atoms/Icon";
import { useCart } from "@/components/cart/useCart";
import { fmtPrice } from "@/lib/format";
import type { Product } from "@/types/product";

export function MobileBuyBar({ p }: { p: Product }) {
  const cart = useCart();
  const [added, setAdded] = useState(false);

  const add = () => {
    cart.add(p.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  };

  return (
    <div
      className="md:hidden sticky bottom-0 left-0 right-0 z-[20] bg-white flex gap-2.5 items-center"
      style={{ borderTop: "1px solid var(--pro-line)", padding: 12 }}
    >
      <div className="flex-1">
        <div className="pro-serif text-[20px] leading-none" style={{ color: "#1A1320" }}>
          {fmtPrice(p.price)}
        </div>
        <div className="text-[11px] mt-0.5 font-medium" style={{ color: "#046B3A" }}>
          3 × {fmtPrice(Math.round(p.price / 3))} sin interés
        </div>
      </div>
      <button
        type="button"
        onClick={add}
        className="pro-btn inline-flex items-center justify-center gap-1.5"
        style={{
          flex: 1.2,
          background: added ? "#E8F6EE" : "#1A1320",
          color: added ? "#046B3A" : "#fff",
          border: "none",
          padding: "12px 16px",
          fontSize: 13,
        }}
      >
        {added ? (
          <>
            <IconCheck size={14} /> Agregado
          </>
        ) : (
          <>
            <IconCart size={14} /> Agregar
          </>
        )}
      </button>
    </div>
  );
}
