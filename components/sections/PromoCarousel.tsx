"use client";

import { useEffect, useState } from "react";
import { IconArrow, IconCheck, IconChevronLeft, IconChevronRight } from "@/components/atoms/Icon";
import { ProductArt } from "@/components/atoms/ProductArt";
import { products } from "@/lib/data/products";
import { promoBanners, type PromoBanner } from "@/lib/data/promoBanners";

const TRANSITION = "transform 600ms cubic-bezier(0.22, 1, 0.36, 1)";

export function PromoCarousel() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = promoBanners.length;

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % n), 6000);
    return () => clearInterval(t);
  }, [paused, n]);

  const go = (d: number) => setIdx((i) => (i + d + n) % n);

  return (
    <section
      className="px-4 py-5 md:px-12 md:py-12"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <div
            className="text-[11px] font-semibold uppercase tracking-[0.08em]"
            style={{ color: "#7A7185" }}
          >
            Ofertas del mes
          </div>
          <div
            className="pro-serif text-[20px] md:text-[26px] mt-0.5"
            style={{ color: "#1A1320" }}
          >
            {idx + 1} / {n} — {promoBanners[idx].eyebrow}
          </div>
        </div>
        <div className="hidden md:flex gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Anterior"
            className="grid place-items-center"
            style={{
              width: 40,
              height: 40,
              borderRadius: 999,
              border: "1px solid var(--pro-line)",
              background: "#fff",
              cursor: "pointer",
              color: "#1A1320",
            }}
          >
            <IconChevronLeft size={14} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Siguiente"
            className="grid place-items-center"
            style={{
              width: 40,
              height: 40,
              borderRadius: 999,
              border: "1px solid var(--pro-line)",
              background: "#fff",
              cursor: "pointer",
              color: "#1A1320",
            }}
          >
            <IconChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[20px]">
        <div
          className="flex"
          style={{
            width: `${n * 100}%`,
            transform: `translateX(-${idx * (100 / n)}%)`,
            transition: TRANSITION,
          }}
        >
          {promoBanners.map((promo) => (
            <div
              key={promo.id}
              style={{ width: `${100 / n}%`, flexShrink: 0, padding: "0 4px" }}
            >
              <PromoCard promo={promo} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {promoBanners.map((p, i) => (
          <button
            type="button"
            key={p.id}
            onClick={() => setIdx(i)}
            aria-label={`Ir al banner ${i + 1}`}
            style={{
              width: i === idx ? 28 : 8,
              height: 8,
              borderRadius: 4,
              border: "none",
              background: i === idx ? "#1A1320" : "#D8D2DC",
              cursor: "pointer",
              transition: "all 300ms",
            }}
          />
        ))}
      </div>

      <div className="md:hidden flex gap-2 mt-2.5 justify-center">
        <button
          type="button"
          onClick={() => go(-1)}
          className="flex-1 text-[12px] font-semibold rounded-full"
          style={{
            padding: 10,
            border: "1px solid var(--pro-line)",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          ← Anterior
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          className="flex-1 text-[12px] font-semibold rounded-full"
          style={{
            padding: 10,
            border: "1px solid var(--pro-line)",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          Siguiente →
        </button>
      </div>
    </section>
  );
}

function PromoTitle({ promo }: { promo: PromoBanner }) {
  return (
    <h2
      className="pro-serif text-[30px] md:text-[52px] leading-[1.02] tracking-[-0.02em] mt-3"
      style={{ color: promo.ink }}
    >
      {promo.title[0]}
      <em style={{ color: promo.accent, fontStyle: "italic" }}>{promo.title[1]}</em>
      {promo.title[2] && (
        <>
          <br />
          {promo.title[2]}
        </>
      )}
    </h2>
  );
}

function PromoEyebrow({ promo }: { promo: PromoBanner }) {
  return (
    <div
      className="text-[11px] font-semibold uppercase tracking-[0.1em]"
      style={{ color: promo.accent }}
    >
      {promo.eyebrow}
    </div>
  );
}

function PromoBody({ promo }: { promo: PromoBanner }) {
  return (
    <p
      className="mt-3.5 max-w-[480px] leading-[1.55] text-[13px] md:text-[15px]"
      style={{ color: promo.muted }}
    >
      {promo.body}
    </p>
  );
}

function PromoCard({ promo }: { promo: PromoBanner }) {
  if (promo.style === "delivery") return <DeliveryBanner promo={promo} />;
  if (promo.style === "dark-cuotas") return <CuotasBanner promo={promo} />;
  if (promo.style === "routine") return <RoutineBanner promo={promo} />;
  if (promo.style === "seasonal") return <SeasonalBanner promo={promo} />;
  if (promo.style === "club") return <ClubBanner promo={promo} />;
  return <EditorialBanner promo={promo} />;
}

/* ------- editorial (default) ------- */
function EditorialBanner({ promo }: { promo: PromoBanner }) {
  const prods = promo.productIdxs.map((i) => products[i]).filter(Boolean);
  return (
    <div
      className="rounded-[20px] p-5 md:p-14 relative overflow-hidden grid gap-6 items-center md:grid-cols-[1.3fr_1fr] min-h-auto md:min-h-[340px]"
      style={{ background: promo.bg }}
    >
      <div>
        <PromoEyebrow promo={promo} />
        <PromoTitle promo={promo} />
        <PromoBody promo={promo} />
        <div className="flex gap-2.5 mt-5 flex-wrap">
          <button type="button" className="pro-btn pro-btn-primary">
            {promo.ctaA} <IconArrow size={14} />
          </button>
          <button type="button" className="pro-btn pro-btn-secondary">
            {promo.ctaB}
          </button>
        </div>
      </div>
      {prods.length > 0 && (
        <div className="hidden md:flex gap-3 justify-end">
          {prods.slice(0, 3).map((p, i) => (
            <div
              key={p.id}
              className="pro-card"
              style={{
                width: 140,
                padding: 10,
                transform: `translateY(${i === 1 ? "-16px" : "0"})`,
              }}
            >
              <div
                className="pro-img-bg rounded-lg grid place-items-center"
                style={{ aspectRatio: "1/1" }}
              >
                <ProductArt
                  kind={p.art}
                  colorA={p.cA}
                  colorB={p.cB}
                  brand={p.brand.split(" ")[0]}
                  name={p.name.split(" ")[0]}
                  size={p.size}
                  width={80}
                  height={110}
                />
              </div>
              <div className="text-[9px] font-semibold mt-2" style={{ color: "#7A7185" }}>
                {p.brand}
              </div>
              <div className="pro-serif text-[13px]" style={{ color: "#1A1320" }}>
                {p.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------- dark cuotas ------- */
function CuotasBanner({ promo }: { promo: PromoBanner }) {
  return (
    <div
      className="rounded-[20px] p-5 md:p-14 relative overflow-hidden grid gap-6 items-center md:grid-cols-[1.1fr_1fr] min-h-auto md:min-h-[340px]"
      style={{ background: promo.bg }}
    >
      <div className="relative z-[2]">
        <PromoEyebrow promo={promo} />
        <PromoTitle promo={promo} />
        <PromoBody promo={promo} />
        <div className="flex gap-2.5 mt-5 flex-wrap">
          <button
            type="button"
            className="pro-btn"
            style={{ background: promo.accent, color: promo.bg, border: "none" }}
          >
            {promo.ctaA} <IconArrow size={14} />
          </button>
          <button type="button" className="pro-btn pro-btn-ghost" style={{ color: "#fff" }}>
            {promo.ctaB}
          </button>
        </div>
      </div>
      <div className="hidden md:grid place-items-center h-full relative">
        <div
          className="pro-serif"
          style={{
            fontSize: 280,
            color: promo.accent,
            lineHeight: 0.8,
            fontStyle: "italic",
            letterSpacing: "-0.06em",
            opacity: 0.95,
          }}
        >
          3×
        </div>
        <div
          className="absolute rounded-[10px] text-[11px]"
          style={{
            bottom: 20,
            right: 20,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.18)",
            padding: "10px 14px",
            color: "#fff",
          }}
        >
          <div className="text-[10px] opacity-60">Visa · Mastercard · Amex</div>
          <div className="mt-1 font-semibold">Sin mínimo en dermocosmética</div>
        </div>
      </div>
    </div>
  );
}

/* ------- delivery map ------- */
function DeliveryBanner({ promo }: { promo: PromoBanner }) {
  return (
    <div
      className="rounded-[20px] p-5 md:p-14 relative overflow-hidden grid gap-6 items-center md:grid-cols-[1.4fr_1fr] min-h-auto md:min-h-[320px]"
      style={{ background: promo.bg }}
    >
      <div className="relative z-[2]">
        <PromoEyebrow promo={promo} />
        <PromoTitle promo={promo} />
        <PromoBody promo={promo} />
        <div className="flex gap-2.5 mt-5 flex-wrap">
          <button
            type="button"
            className="pro-btn"
            style={{ background: promo.accent, color: "#fff", border: "none" }}
          >
            {promo.ctaA} <IconArrow size={14} />
          </button>
          <button
            type="button"
            className="pro-btn pro-btn-ghost"
            style={{ color: promo.ink }}
          >
            {promo.ctaB}
          </button>
        </div>
      </div>
      <div className="hidden md:grid place-items-center relative h-[260px]">
        <svg width="240" height="240" viewBox="0 0 240 240" className="absolute">
          <circle
            cx="120"
            cy="120"
            r="100"
            fill="none"
            stroke={promo.accent}
            strokeWidth="1"
            strokeDasharray="4 6"
            opacity="0.5"
          />
          <circle
            cx="120"
            cy="120"
            r="70"
            fill="none"
            stroke={promo.accent}
            strokeWidth="1"
            strokeDasharray="4 6"
            opacity="0.7"
          />
          <circle
            cx="120"
            cy="120"
            r="40"
            fill="none"
            stroke={promo.accent}
            strokeWidth="1.2"
            strokeDasharray="3 4"
          />
          <text x="56" y="60" fontFamily="Inter" fontSize="10" fill={promo.muted} fontWeight="600">
            Bella Vista
          </text>
          <text x="160" y="80" fontFamily="Inter" fontSize="10" fill={promo.muted} fontWeight="600">
            Muñiz
          </text>
          <text x="40" y="200" fontFamily="Inter" fontSize="10" fill={promo.muted} fontWeight="600">
            José C. Paz
          </text>
          <circle cx="120" cy="120" r="6" fill={promo.accent} />
          <path
            d="M120 108 L120 120 L130 122"
            stroke="#fff"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        <div
          className="absolute rounded-[12px] text-[12px]"
          style={{
            top: 8,
            right: 8,
            background: "#fff",
            padding: "10px 14px",
            boxShadow: "0 6px 18px rgba(14,59,34,0.15)",
            color: promo.ink,
          }}
        >
          <div
            className="text-[10px] font-bold tracking-[0.05em]"
            style={{ color: promo.accent }}
          >
            LLEGA EN
          </div>
          <div className="pro-serif text-[26px] leading-none">&lt;90 min</div>
        </div>
      </div>
    </div>
  );
}

/* ------- routine 4 steps ------- */
function RoutineBanner({ promo }: { promo: PromoBanner }) {
  const steps = ["Limpiar", "Tratar", "Hidratar", "Proteger"];
  const prods = promo.productIdxs.map((i) => products[i]).filter(Boolean);
  return (
    <div
      className="rounded-[20px] p-5 md:p-14 relative overflow-hidden min-h-auto md:min-h-[340px]"
      style={{ background: promo.bg, border: "1px solid var(--pro-line)" }}
    >
      <div className="grid gap-7 items-center md:grid-cols-[1fr_1.1fr]">
        <div>
          <PromoEyebrow promo={promo} />
          <PromoTitle promo={promo} />
          <PromoBody promo={promo} />
          <div className="flex gap-2.5 mt-5 flex-wrap">
            <button type="button" className="pro-btn pro-btn-primary">
              {promo.ctaA} <IconArrow size={14} />
            </button>
            <button type="button" className="pro-btn pro-btn-secondary">
              {promo.ctaB}
            </button>
          </div>
        </div>
        <div className="hidden md:grid grid-cols-4 gap-2.5 relative">
          <div
            className="absolute top-[54px] left-5 right-5"
            style={{ height: 1, borderTop: `1.5px dashed ${promo.accent}`, opacity: 0.4 }}
          />
          {prods.slice(0, 4).map((p, i) => (
            <div key={p.id} className="text-center">
              <div
                className="relative grid place-items-center"
                style={{
                  background: "#fff",
                  border: "1px solid var(--pro-line)",
                  borderRadius: 10,
                  padding: 8,
                  aspectRatio: "1/1.1",
                }}
              >
                <div
                  className="absolute grid place-items-center font-bold text-[11px]"
                  style={{
                    top: -10,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 24,
                    height: 24,
                    borderRadius: 999,
                    background: promo.accent,
                    color: "#fff",
                  }}
                >
                  {i + 1}
                </div>
                <ProductArt
                  kind={p.art}
                  colorA={p.cA}
                  colorB={p.cB}
                  brand=""
                  name=""
                  size=""
                  width={54}
                  height={74}
                />
              </div>
              <div
                className="pro-serif italic text-[13px] mt-2"
                style={{ color: promo.ink }}
              >
                {steps[i]}
              </div>
              <div className="text-[10px] mt-[1px]" style={{ color: promo.muted }}>
                {p.brand}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------- seasonal checklist ------- */
function SeasonalBanner({ promo }: { promo: PromoBanner }) {
  const items = [
    "Paracetamol 500mg",
    "Ibuprofeno 400mg",
    "Vitamina C efervescente",
    "Spray nasal",
    "Pastillas para la garganta",
  ];
  return (
    <div
      className="rounded-[20px] p-5 md:p-14 relative overflow-hidden min-h-auto md:min-h-[320px] grid gap-6 items-center md:grid-cols-[1.2fr_1fr]"
      style={{
        background: promo.bg,
        backgroundImage: `radial-gradient(circle, ${promo.accent}22 1px, transparent 1px)`,
        backgroundSize: "16px 16px",
      }}
    >
      <div className="relative z-[2]">
        <PromoEyebrow promo={promo} />
        <PromoTitle promo={promo} />
        <PromoBody promo={promo} />
        <div className="flex gap-2.5 mt-5 flex-wrap">
          <button
            type="button"
            className="pro-btn"
            style={{ background: promo.accent, color: "#fff", border: "none" }}
          >
            {promo.ctaA} <IconArrow size={14} />
          </button>
          <button
            type="button"
            className="pro-btn pro-btn-ghost"
            style={{ color: promo.ink }}
          >
            {promo.ctaB}
          </button>
        </div>
      </div>
      <div
        className="hidden md:block rounded-[12px] p-5"
        style={{
          background: "#fff",
          boxShadow: "0 8px 24px rgba(12,46,78,0.08)",
          border: `1px solid ${promo.accent}22`,
        }}
      >
        <div
          className="text-[10px] font-bold uppercase tracking-[0.1em] mb-3"
          style={{ color: promo.accent }}
        >
          Botiquín esencial
        </div>
        {items.map((it, i) => {
          const checked = i < 3;
          return (
            <div
              key={it}
              className="flex items-center gap-2.5 py-2 text-[13px]"
              style={{
                borderBottom: i < items.length - 1 ? "1px dashed var(--pro-line-2)" : "none",
                color: promo.ink,
              }}
            >
              <div
                className="grid place-items-center flex-shrink-0"
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  border: `1.5px solid ${promo.accent}`,
                  background: checked ? promo.accent : "#fff",
                }}
              >
                {checked && <IconCheck size={11} stroke="#fff" />}
              </div>
              <span>{it}</span>
              {checked && (
                <span
                  className="ml-auto text-[10px] font-bold"
                  style={{ color: "#046B3A" }}
                >
                  EN STOCK
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------- club gradient card ------- */
function ClubBanner({ promo }: { promo: PromoBanner }) {
  return (
    <div
      className="rounded-[20px] p-5 md:p-14 relative overflow-hidden min-h-auto md:min-h-[340px] grid gap-6 items-center md:grid-cols-[1.1fr_1fr]"
      style={{ background: promo.bg }}
    >
      <svg
        className="absolute opacity-[0.12]"
        style={{ right: -60, top: -60 }}
        width="400"
        height="400"
        viewBox="0 0 400 400"
      >
        <circle cx="200" cy="200" r="180" fill="none" stroke="#fff" strokeWidth="1" />
        <circle cx="200" cy="200" r="140" fill="none" stroke="#fff" strokeWidth="1" />
        <circle cx="200" cy="200" r="100" fill="none" stroke="#fff" strokeWidth="1" />
      </svg>
      <div className="relative z-[2]">
        <PromoEyebrow promo={promo} />
        <PromoTitle promo={promo} />
        <PromoBody promo={promo} />
        <div className="flex gap-2.5 mt-5 flex-wrap">
          <button
            type="button"
            className="pro-btn"
            style={{ background: promo.accent, color: "#1A1320", border: "none" }}
          >
            {promo.ctaA} <IconArrow size={14} />
          </button>
          <button
            type="button"
            className="pro-btn pro-btn-ghost"
            style={{ color: "#fff" }}
          >
            {promo.ctaB}
          </button>
        </div>
      </div>
      <div className="hidden md:grid place-items-center relative z-[2]">
        <div
          className="rounded-[14px] p-5"
          style={{
            width: 280,
            height: 170,
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.25)",
            backdropFilter: "blur(12px)",
            transform: "rotate(-3deg)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          }}
        >
          <div className="flex justify-between items-start">
            <div
              className="pro-serif italic text-[22px]"
              style={{ color: "#fff" }}
            >
              Club <span style={{ color: promo.accent }}>Vázquez</span>
            </div>
            <div
              style={{
                width: 34,
                height: 24,
                borderRadius: 4,
                background: "linear-gradient(135deg, #CDDC39, #fff4)",
              }}
            />
          </div>
          <div
            className="text-[14px] font-medium mt-9 tracking-[0.15em]"
            style={{ color: "#fff" }}
          >
            4702 · 1528 · 5C1A · 6E24
          </div>
          <div
            className="flex justify-between mt-3.5 text-[10px] uppercase tracking-[0.1em]"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            <div>
              <div style={{ opacity: 0.6 }}>Socia</div>
              <div className="mt-0.5 text-[11px]" style={{ color: "#fff" }}>
                Laura F.
              </div>
            </div>
            <div>
              <div style={{ opacity: 0.6 }}>Vence</div>
              <div className="mt-0.5 text-[11px]" style={{ color: "#fff" }}>
                12/28
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
