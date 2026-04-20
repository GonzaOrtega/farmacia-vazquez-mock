"use client";

import { ProductArt } from "@/components/atoms/ProductArt";
import { IconArrow, IconTruck } from "@/components/atoms/Icon";
import { fmtPrice } from "@/lib/format";
import { fmtDate, statusColors, statusLabel } from "@/lib/data/account";
import { getProduct } from "@/lib/data/products";
import type { OrderSummary } from "@/types/user";

interface Props {
  order: OrderSummary;
}

export function OrderCard({ order }: Props) {
  const color = statusColors(order.status);
  const totalUnits = order.lines.reduce((n, l) => n + l.qty, 0);

  return (
    <article className="pro-card" style={{ padding: 18 }}>
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: "#7A7185" }}>
            Pedido #{order.id}
          </div>
          <div className="pro-serif text-[20px] md:text-[22px] mt-0.5" style={{ color: "#1A1320" }}>
            Realizado el {fmtDate(order.placedAt)}
          </div>
        </div>
        <span
          className="inline-flex items-center gap-1.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.06em]"
          style={{ padding: "5px 11px", background: color.bg, color: color.fg }}
        >
          <span style={{ width: 6, height: 6, background: "currentColor", borderRadius: 999 }} />
          {statusLabel(order.status)}
        </span>
      </header>

      <div className="mt-4 flex items-center gap-2 flex-wrap">
        {order.lines.map((l) => {
          const p = getProduct(l.productId);
          if (!p) return null;
          return (
            <div
              key={l.productId}
              className="pro-img-bg grid place-items-center"
              style={{ width: 54, height: 54, borderRadius: 10 }}
              title={`${p.name} × ${l.qty}`}
            >
              <ProductArt kind={p.art} colorA={p.cA} colorB={p.cB} width={38} height={48} />
            </div>
          );
        })}
        <div className="text-[12px] ml-1" style={{ color: "#7A7185" }}>
          {totalUnits} {totalUnits === 1 ? "producto" : "productos"}
        </div>
      </div>

      {order.status === "en-camino" && order.eta && (
        <div
          className="mt-4 rounded-[10px] flex items-center gap-2.5 text-[13px]"
          style={{ padding: "10px 12px", background: "#EAF2F9", color: "#1A4E8E" }}
        >
          <IconTruck size={16} stroke="#1A4E8E" />
          Llega aproximadamente el <strong className="font-semibold">{fmtDate(order.eta)}</strong>
        </div>
      )}

      <footer className="mt-4 flex items-end justify-between gap-3 flex-wrap pt-3 border-t border-dashed" style={{ borderColor: "var(--pro-line)" }}>
        <div>
          <div className="text-[11px]" style={{ color: "#7A7185" }}>
            Total abonado
          </div>
          <div className="pro-serif text-[24px]" style={{ color: "#1A1320" }}>
            {fmtPrice(order.total)}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button type="button" className="pro-btn pro-btn-ghost" style={{ fontSize: 12, padding: "8px 14px" }}>
            Ver detalle <IconArrow size={14} />
          </button>
          {order.status === "entregado" && (
            <button type="button" className="pro-btn pro-btn-secondary" style={{ fontSize: 12, padding: "8px 14px" }}>
              Volver a comprar
            </button>
          )}
        </div>
      </footer>
    </article>
  );
}
