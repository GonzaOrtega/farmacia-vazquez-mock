"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/atoms/Logo";
import {
  IconCart,
  IconClock,
  IconHeart,
  IconMenu,
  IconPin,
  IconSearch,
  IconTruck,
  IconUser,
} from "@/components/atoms/Icon";
import { categories } from "@/lib/data/categories";
import { useCart } from "@/components/cart/useCart";

export function Header() {
  const cart = useCart();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 bg-white">
      {/* Desktop top strip */}
      <div
        className="hidden md:flex bg-[#1A1320] text-white text-xs py-2 px-12 items-center justify-between"
        style={{ letterSpacing: 0.1 }}
      >
        <div className="flex items-center gap-6">
          <span className="inline-flex items-center gap-1.5">
            <IconTruck size={13} /> Envío gratis en San Miguel sobre $15.000
          </span>
          <span className="inline-flex items-center gap-1.5 opacity-70">
            <IconClock size={13} /> Abierto · 9 a 21 hs
          </span>
        </div>
        <div className="flex items-center gap-3.5 opacity-80">
          <span className="inline-flex items-center gap-1.5">
            <IconPin size={13} /> Av. Balbín 4702, San Miguel
          </span>
          <span>|</span>
          <span className="cursor-pointer">Ayuda</span>
          <span className="cursor-pointer">Seguimiento de pedido</span>
        </div>
      </div>

      {/* Mobile top strip */}
      <div className="md:hidden bg-[#1A1320] text-white text-[11px] py-1.5 px-4 text-center">
        Envío gratis en San Miguel sobre $15.000
      </div>

      {/* Desktop main nav */}
      <div className="hidden md:flex items-center gap-7 px-12 py-[18px] border-b border-[color:var(--pro-line)]">
        <Link href="/" className="no-underline">
          <Logo size="md" />
        </Link>
        <div className="relative flex-1 max-w-[640px]">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--pro-muted)]">
            <IconSearch size={18} />
          </div>
          <input
            placeholder="Buscá por medicamento, marca o condición — ej. ibuprofeno, protector solar…"
            className="pro-input"
            style={{ paddingLeft: 46, paddingRight: 120, borderRadius: 999, background: "#FAFAFB" }}
          />
          <button
            type="button"
            className="pro-btn pro-btn-primary absolute top-1 right-1"
            style={{ padding: "8px 18px", fontSize: 13 }}
          >
            Buscar
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="pro-btn pro-btn-ghost flex-col gap-0.5"
            style={{ padding: "10px 14px", fontSize: 11 }}
          >
            <IconUser size={18} />
            <span className="text-[10px] font-medium">Mi cuenta</span>
          </button>
          <button
            type="button"
            className="pro-btn pro-btn-ghost flex-col gap-0.5"
            style={{ padding: "10px 14px", fontSize: 11 }}
          >
            <IconHeart size={18} />
            <span className="text-[10px] font-medium">Favoritos</span>
          </button>
          <button
            type="button"
            onClick={() => cart.setOpen(true)}
            className="pro-btn pro-btn-primary"
            style={{ padding: "10px 18px" }}
          >
            <span key={cart.bump} className={cart.bump ? "pro-bump" : ""} style={{ display: "inline-flex" }}>
              <IconCart size={18} />
            </span>
            Carrito
            {cart.count > 0 && (
              <span
                style={{
                  background: "#CDDC39",
                  color: "#1A1320",
                  padding: "1px 8px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {cart.count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Desktop category nav */}
      <nav
        className="hidden md:flex gap-6 px-12 border-b border-[color:var(--pro-line)] overflow-x-auto pro-scroll"
      >
        {categories.map((c) => (
          <Link
            key={c.id}
            href={c.id === "all" ? "/productos" : `/productos/${c.id}`}
            className="py-3.5 text-[13px] font-semibold text-[color:var(--pro-ink-2)] hover:text-[color:var(--pro-primary)] whitespace-nowrap border-b-2 border-transparent hover:border-[color:var(--pro-primary)]"
          >
            {c.name}
          </Link>
        ))}
      </nav>

      {/* Mobile nav row */}
      <div className="md:hidden flex items-center gap-2.5 px-4 py-3 border-b border-[color:var(--pro-line)]">
        <button
          type="button"
          onClick={() => setMobileNavOpen((v) => !v)}
          aria-label="Menú"
          className="bg-transparent border-none cursor-pointer text-[color:var(--pro-ink)]"
        >
          <IconMenu size={22} />
        </button>
        <div className="flex-1 flex justify-center">
          <Link href="/" className="no-underline">
            <Logo size="sm" />
          </Link>
        </div>
        <button
          type="button"
          aria-label="Favoritos"
          className="bg-transparent border-none cursor-pointer text-[color:var(--pro-ink)]"
        >
          <IconHeart size={20} />
        </button>
        <button
          type="button"
          onClick={() => cart.setOpen(true)}
          aria-label="Carrito"
          className="bg-transparent border-none cursor-pointer text-[color:var(--pro-ink)] relative"
        >
          <span key={cart.bump} className={cart.bump ? "pro-bump" : ""} style={{ display: "inline-flex" }}>
            <IconCart size={20} />
          </span>
          {cart.count > 0 && (
            <span
              style={{
                position: "absolute",
                top: -4,
                right: -6,
                background: "#5C1A6E",
                color: "#fff",
                fontSize: 10,
                padding: "1px 5px",
                borderRadius: 999,
                fontWeight: 700,
              }}
            >
              {cart.count}
            </span>
          )}
        </button>
      </div>

      {/* Mobile search */}
      <div className="md:hidden px-4 py-2.5">
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[color:var(--pro-muted)]">
            <IconSearch size={16} />
          </div>
          <input
            placeholder="¿Qué estás buscando?"
            className="pro-input"
            style={{ paddingLeft: 40, borderRadius: 999, background: "#FAFAFB", fontSize: 13 }}
          />
        </div>
      </div>

      {/* Mobile category drawer */}
      {mobileNavOpen && (
        <div className="md:hidden border-b border-[color:var(--pro-line)] bg-white">
          <div className="flex flex-col py-2">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={c.id === "all" ? "/productos" : `/productos/${c.id}`}
                onClick={() => setMobileNavOpen(false)}
                className="px-4 py-2.5 text-sm font-semibold text-[color:var(--pro-ink-2)]"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
