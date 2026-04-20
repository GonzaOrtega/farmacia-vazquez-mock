"use client";

import { ProductArt } from "@/components/atoms/ProductArt";
import { IconCheck, IconShield, IconTruck } from "@/components/atoms/Icon";
import { fmtPrice } from "@/lib/format";
import { getProduct } from "@/lib/data/products";
import type { CartItem } from "@/types/cart";

interface Props {
  items: CartItem[];
  subtotal: number;
  shipping: number;
}

export function OrderSummary({ items, subtotal, shipping }: Props) {
  const total = subtotal + shipping;

  return (
    <aside className="md:sticky md:top-24 self-start">
      <div className="pro-card" style={{ padding: 20 }}>
        <div className="flex items-center justify-between mb-3">
          <div className="pro-serif text-[22px]" style={{ color: "#1A1320" }}>
            Tu pedido
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: "#7A7185" }}>
            {items.length} {items.length === 1 ? "ítem" : "ítems"}
          </span>
        </div>

        <div className="pro-scroll flex flex-col gap-3" style={{ maxHeight: 320, overflowY: "auto" }}>
          {items.map((it) => {
            const p = getProduct(it.id);
            if (!p) return null;
            return (
              <div key={it.id} className="flex gap-3">
                <div
                  className="pro-img-bg grid place-items-center flex-shrink-0"
                  style={{ width: 56, height: 56, borderRadius: 10 }}
                >
                  <ProductArt kind={p.art} colorA={p.cA} colorB={p.cB} width={40} height={48} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-semibold tracking-[0.06em]" style={{ color: "#7A7185" }}>
                    {p.brand}
                  </div>
                  <div className="pro-serif text-[14px] leading-[1.2]" style={{ color: "#1A1320" }}>
                    {p.name}
                  </div>
                  <div className="text-[11px] mt-0.5" style={{ color: "#7A7185" }}>
                    {p.size} · Cantidad {it.qty}
                  </div>
                </div>
                <div className="pro-serif text-[15px] self-start" style={{ color: "#1A1320" }}>
                  {fmtPrice(p.price * it.qty)}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4" style={{ borderTop: "1px dashed var(--pro-line)" }}>
          <div className="flex gap-1.5">
            <input
              className="pro-input"
              placeholder="Código promocional"
              style={{ flex: 1, fontSize: 13 }}
            />
            <button type="button" className="pro-btn pro-btn-ghost" style={{ padding: "0 16px", fontSize: 13 }}>
              Aplicar
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-1.5 text-[13px]" style={{ color: "#4A3D54" }}>
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{fmtPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between" style={{ color: shipping === 0 ? "#046B3A" : "#4A3D54" }}>
            <span>Envío</span>
            <span>{shipping === 0 ? "Gratis" : fmtPrice(shipping)}</span>
          </div>
        </div>

        <div
          className="mt-3 pt-3 flex items-baseline justify-between"
          style={{ borderTop: "1px solid var(--pro-line)" }}
        >
          <span className="text-[14px] font-semibold" style={{ color: "#1A1320" }}>
            Total
          </span>
          <span className="pro-serif text-[28px]" style={{ color: "#1A1320" }}>
            {fmtPrice(total)}
          </span>
        </div>
        <div className="text-[11px] mt-0.5 text-right" style={{ color: "#046B3A" }}>
          o 3 cuotas de {fmtPrice(Math.round(total / 3))} sin interés
        </div>
      </div>

      <div
        className="mt-3 pro-card flex flex-col gap-2 text-[12px]"
        style={{ padding: "14px 18px", background: "#FBF7F3", color: "#4A3D54" }}
      >
        <span className="inline-flex items-center gap-2">
          <IconShield size={14} stroke="#5C1A6E" /> Pago protegido con cifrado
        </span>
        <span className="inline-flex items-center gap-2">
          <IconTruck size={14} stroke="#5C1A6E" /> Envío en 24-48 hs en San Miguel
        </span>
        <span className="inline-flex items-center gap-2">
          <IconCheck size={14} stroke="#046B3A" /> Cambios y devoluciones en 15 días
        </span>
      </div>
    </aside>
  );
}
