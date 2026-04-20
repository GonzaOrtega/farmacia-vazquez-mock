"use client";

import Link from "next/link";
import { ProductArt } from "@/components/atoms/ProductArt";
import { IconArrow, IconCheck, IconTruck } from "@/components/atoms/Icon";
import { fmtPrice } from "@/lib/format";
import { getProduct } from "@/lib/data/products";
import type { CartItem } from "@/types/cart";

interface Props {
  orderId: string;
  eta: string;
  items: CartItem[];
  total: number;
}

export function CheckoutSuccess({ orderId, eta, items, total }: Props) {
  return (
    <section className="mx-auto" style={{ maxWidth: 720 }}>
      <div className="text-center">
        <span
          className="grid place-items-center rounded-full mx-auto pro-rise"
          style={{ width: 76, height: 76, background: "#E8F6EE", color: "#046B3A" }}
        >
          <IconCheck size={36} stroke="#046B3A" sw={2.2} />
        </span>
        <div
          className="pro-rise text-[11px] font-semibold uppercase tracking-[0.08em] mt-4"
          style={{ color: "#046B3A" }}
        >
          Compra confirmada
        </div>
        <h1
          className="pro-rise pro-serif text-[40px] md:text-[56px] leading-[1.05] tracking-[-0.02em] mt-2"
          style={{ color: "#1A1320" }}
        >
          ¡Gracias por tu compra!
        </h1>
        <p className="pro-rise text-[15px] mt-3" style={{ color: "#4A3D54" }}>
          Pedido <strong style={{ color: "#1A1320" }}>#{orderId}</strong>. Te mandamos el detalle por email.
        </p>
      </div>

      <div
        className="pro-card pro-rise mt-8 flex items-center gap-4"
        style={{ padding: 18, background: "#EAF2F9", border: "1px solid #CDE0F1" }}
      >
        <span className="grid place-items-center rounded-full flex-shrink-0" style={{ width: 42, height: 42, background: "#1A4E8E", color: "#fff" }}>
          <IconTruck size={20} stroke="#fff" />
        </span>
        <div className="flex-1">
          <div className="text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: "#1A4E8E" }}>
            Llega aproximadamente
          </div>
          <div className="pro-serif text-[22px]" style={{ color: "#1A4E8E" }}>
            {eta}
          </div>
        </div>
      </div>

      <div className="pro-card pro-rise mt-4" style={{ padding: 20 }}>
        <div className="pro-serif text-[20px] mb-3" style={{ color: "#1A1320" }}>
          Resumen
        </div>
        <div className="flex flex-col gap-3">
          {items.map((it) => {
            const p = getProduct(it.id);
            if (!p) return null;
            return (
              <div key={it.id} className="flex items-center gap-3">
                <div className="pro-img-bg grid place-items-center flex-shrink-0" style={{ width: 48, height: 48, borderRadius: 10 }}>
                  <ProductArt kind={p.art} colorA={p.cA} colorB={p.cB} width={36} height={44} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="pro-serif text-[14px] leading-[1.2]" style={{ color: "#1A1320" }}>
                    {p.name}
                  </div>
                  <div className="text-[11px]" style={{ color: "#7A7185" }}>
                    {p.brand} · {p.size} · × {it.qty}
                  </div>
                </div>
                <div className="pro-serif text-[15px]" style={{ color: "#1A1320" }}>
                  {fmtPrice(p.price * it.qty)}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 flex items-baseline justify-between" style={{ borderTop: "1px solid var(--pro-line)" }}>
          <span className="text-[14px] font-semibold" style={{ color: "#1A1320" }}>
            Total abonado
          </span>
          <span className="pro-serif text-[26px]" style={{ color: "#1A1320" }}>
            {fmtPrice(total)}
          </span>
        </div>
      </div>

      <div className="pro-rise mt-8 flex gap-3 flex-wrap justify-center">
        <Link href="/productos" className="pro-btn pro-btn-primary no-underline inline-flex">
          Seguir comprando <IconArrow size={16} />
        </Link>
        <Link href="/cuenta" className="pro-btn pro-btn-secondary no-underline inline-flex">
          Ir a mis pedidos
        </Link>
      </div>
    </section>
  );
}
