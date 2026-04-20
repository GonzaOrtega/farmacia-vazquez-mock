"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { IconArrow, IconCart } from "@/components/atoms/Icon";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { CheckoutSuccess } from "@/components/checkout/CheckoutSuccess";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { useCart } from "@/components/cart/useCart";
import type { CartItem } from "@/types/cart";

const crumbs = [
  { label: "Inicio", href: "/" },
  { label: "Carrito" },
  { label: "Finalizar compra" },
];

const FREE_SHIPPING_THRESHOLD = 20000;
const FLAT_SHIPPING = 1200;

function makeOrderId() {
  const n = Math.floor(Math.random() * 900) + 100;
  const year = new Date().getFullYear();
  return `FV-${year}-${String(n).padStart(5, "0")}`;
}

function etaLabel() {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toLocaleDateString("es-AR", { weekday: "long", day: "2-digit", month: "long" });
}

export function CheckoutView() {
  const cart = useCart();
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<null | {
    orderId: string;
    items: CartItem[];
    total: number;
    eta: string;
  }>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const shipping = success ? 0 : cart.subtotal >= FREE_SHIPPING_THRESHOLD || cart.subtotal === 0 ? 0 : FLAT_SHIPPING;

  const handleSubmit = () => {
    if (cart.items.length === 0) return;
    setSubmitting(true);
    const snapshot: CartItem[] = cart.items.map((i) => ({ ...i }));
    const total = cart.subtotal + shipping;
    const orderId = makeOrderId();
    const eta = etaLabel();

    window.setTimeout(() => {
      for (const it of snapshot) cart.remove(it.id);
      setSuccess({ orderId, items: snapshot, total, eta });
      setSubmitting(false);
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    }, 600);
  };

  const isEmpty = mounted && cart.items.length === 0 && !success;

  return (
    <>
      <div className="bg-white border-b border-[color:var(--pro-line)] px-4 py-4 md:px-12 md:py-6">
        <Breadcrumb items={crumbs} />
        <div className="mt-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: "#5C1A6E" }}>
            {success ? "Pedido confirmado" : "Checkout"}
          </div>
          <h1 className="pro-serif text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em]" style={{ color: "#1A1320" }}>
            {success ? "¡Listo!" : "Finalizá tu compra"}
          </h1>
          {!success && (
            <p className="text-[14px] md:text-[15px] mt-1.5" style={{ color: "#4A3D54" }}>
              Revisá tus datos y confirmá el pedido. Te avisamos por email cuando salga a reparto.
            </p>
          )}
        </div>
      </div>

      <div className="px-4 py-6 md:px-12 md:py-10">
        {success ? (
          <CheckoutSuccess orderId={success.orderId} eta={success.eta} items={success.items} total={success.total} />
        ) : isEmpty ? (
          <CheckoutEmpty />
        ) : !mounted ? (
          <div className="text-center py-16 text-[14px]" style={{ color: "#7A7185" }}>
            Cargando tu carrito…
          </div>
        ) : (
          <div className="grid gap-6 md:gap-8 md:grid-cols-[1.35fr_1fr] items-start">
            <CheckoutForm onSubmit={handleSubmit} submitting={submitting} />
            <OrderSummary items={cart.items} subtotal={cart.subtotal} shipping={shipping} />
          </div>
        )}
      </div>
    </>
  );
}

function CheckoutEmpty() {
  return (
    <div
      className="rounded-[16px] text-center mx-auto"
      style={{ background: "#FBF7F3", padding: "64px 24px", maxWidth: 560 }}
    >
      <div
        className="mx-auto grid place-items-center rounded-full"
        style={{ width: 68, height: 68, background: "#F4EEF7", color: "#5C1A6E" }}
      >
        <IconCart size={28} stroke="#5C1A6E" />
      </div>
      <div className="pro-serif text-[28px] md:text-[32px] mt-4 leading-[1.1]" style={{ color: "#1A1320" }}>
        No hay nada para pagar
      </div>
      <p className="text-[14px] md:text-[15px] mt-2" style={{ color: "#4A3D54", maxWidth: 420, margin: "8px auto 0" }}>
        Agregá productos a tu carrito y volvé cuando estés listo para finalizar la compra.
      </p>
      <Link href="/productos" className="pro-btn pro-btn-primary mt-6 inline-flex no-underline">
        Ver el catálogo <IconArrow size={16} />
      </Link>
    </div>
  );
}
