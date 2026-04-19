"use client";

import { useEffect } from "react";
import { ProductArt } from "@/components/atoms/ProductArt";
import { IconArrow, IconCart, IconClose, IconMinus, IconPlus } from "@/components/atoms/Icon";
import { getProduct } from "@/lib/data/products";
import { fmtPrice } from "@/lib/format";
import { useCart } from "./useCart";

export function CartDrawer() {
  const cart = useCart();

  useEffect(() => {
    if (!cart.open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cart.setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [cart]);

  if (!cart.open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        onClick={() => cart.setOpen(false)}
        style={{ position: "absolute", inset: 0, background: "rgba(26,19,32,0.4)", backdropFilter: "blur(2px)" }}
        aria-hidden
      />
      <div
        role="dialog"
        aria-label="Carrito"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(400px, 92%)",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          animation: "pro-rise .3s ease",
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--pro-line)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#7A7185",
                fontWeight: 600,
                letterSpacing: 0.08,
                textTransform: "uppercase",
              }}
            >
              Tu pedido
            </div>
            <div className="pro-serif" style={{ fontSize: 24, color: "#1A1320" }}>
              Carrito ({cart.count})
            </div>
          </div>
          <button
            onClick={() => cart.setOpen(false)}
            aria-label="Cerrar carrito"
            style={{
              background: "#F4EEF7",
              border: "none",
              width: 34,
              height: 34,
              borderRadius: 999,
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
              color: "#5C1A6E",
            }}
          >
            <IconClose size={16} />
          </button>
        </div>

        <div className="pro-scroll" style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          {cart.items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#7A7185" }}>
              <div
                style={{
                  width: 60,
                  height: 60,
                  background: "#F4EEF7",
                  borderRadius: 999,
                  display: "inline-grid",
                  placeItems: "center",
                  color: "#5C1A6E",
                  marginBottom: 14,
                }}
              >
                <IconCart size={24} />
              </div>
              <div className="pro-serif" style={{ color: "#1A1320", fontSize: 20, marginBottom: 4 }}>
                Tu carrito está vacío
              </div>
              <div style={{ fontSize: 13 }}>Agregá productos para empezar</div>
            </div>
          ) : (
            cart.items.map((it) => {
              const p = getProduct(it.id);
              if (!p) return null;
              return (
                <div
                  key={it.id}
                  style={{
                    display: "flex",
                    gap: 14,
                    padding: "14px 0",
                    borderBottom: "1px solid var(--pro-line-2)",
                  }}
                >
                  <div
                    className="pro-img-bg"
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 10,
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <ProductArt kind={p.art} colorA={p.cA} colorB={p.cB} brand="" name="" size="" width={52} height={66} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: "#7A7185", fontWeight: 600, letterSpacing: 0.05 }}>
                      {p.brand}
                    </div>
                    <div className="pro-serif" style={{ fontSize: 15, color: "#1A1320" }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: 11, color: "#7A7185" }}>{p.size}</div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 8,
                      }}
                    >
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          border: "1px solid var(--pro-line)",
                          borderRadius: 999,
                          padding: 2,
                        }}
                      >
                        <button
                          onClick={() => cart.setQty(it.id, it.qty - 1)}
                          aria-label="Restar"
                          style={{
                            background: "transparent",
                            border: "none",
                            width: 24,
                            height: 24,
                            cursor: "pointer",
                            display: "grid",
                            placeItems: "center",
                            color: "#4A3D54",
                          }}
                        >
                          <IconMinus size={12} />
                        </button>
                        <span style={{ minWidth: 20, textAlign: "center", fontSize: 13, fontWeight: 600 }}>
                          {it.qty}
                        </span>
                        <button
                          onClick={() => cart.setQty(it.id, it.qty + 1)}
                          aria-label="Sumar"
                          style={{
                            background: "transparent",
                            border: "none",
                            width: 24,
                            height: 24,
                            cursor: "pointer",
                            display: "grid",
                            placeItems: "center",
                            color: "#4A3D54",
                          }}
                        >
                          <IconPlus size={12} />
                        </button>
                      </div>
                      <div className="pro-serif" style={{ fontSize: 16, color: "#1A1320" }}>
                        {fmtPrice(p.price * it.qty)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cart.items.length > 0 && (
          <div style={{ borderTop: "1px solid var(--pro-line)", padding: 20, background: "#FBF7F3" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#4A3D54", marginBottom: 6 }}>
              <span>Subtotal</span>
              <span>{fmtPrice(cart.subtotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#046B3A", marginBottom: 10 }}>
              <span>Envío</span>
              <span>Gratis</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 12,
                paddingTop: 10,
                borderTop: "1px dashed var(--pro-line)",
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600 }}>Total</span>
              <span className="pro-serif" style={{ fontSize: 26, color: "#1A1320" }}>
                {fmtPrice(cart.subtotal)}
              </span>
            </div>
            <div style={{ fontSize: 11, color: "#046B3A", marginBottom: 14 }}>
              o 3 cuotas de {fmtPrice(Math.round(cart.subtotal / 3))} sin interés
            </div>
            <button className="pro-btn pro-btn-primary" style={{ width: "100%", padding: "14px" }}>
              Finalizar compra <IconArrow size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
