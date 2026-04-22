"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { ProductArt } from "@/components/atoms/ProductArt";
import type { Product } from "@/types/product";

interface Props {
  p: Product;
}

export function Gallery({ p }: Props) {
  const frames = [
    { kind: p.art, cA: p.cA, cB: p.cB, label: "Frente" },
    { kind: p.art, cA: "#FBF7F3", cB: p.cB, label: "Perfil" },
    { kind: p.art, cA: p.cA, cB: "#1A1320", label: "Packaging" },
    { kind: p.art, cA: "#F4EEF7", cB: p.cB, label: "Detalle" },
  ];
  const [idx, setIdx] = useState(0);
  const active = frames[idx];
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const panelId = `gallery-panel-${p.id}`;

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    let next = idx;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (idx + 1) % frames.length;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (idx - 1 + frames.length) % frames.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = frames.length - 1;
    else return;
    e.preventDefault();
    setIdx(next);
    thumbRefs.current[next]?.focus();
  };

  return (
    <div className="grid grid-cols-[72px_1fr] gap-3.5">
      <div
        role="tablist"
        aria-label="Vistas del producto"
        aria-orientation="vertical"
        onKeyDown={onKey}
        className="flex flex-col gap-2"
      >
        {frames.map((fr, i) => {
          const on = i === idx;
          return (
            <button
              key={i}
              ref={(el) => {
                thumbRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`gallery-tab-${p.id}-${i}`}
              aria-selected={on}
              aria-controls={panelId}
              tabIndex={on ? 0 : -1}
              onClick={() => setIdx(i)}
              title={fr.label}
              aria-label={fr.label}
              className="grid place-items-center overflow-hidden cursor-pointer"
              style={{
                width: 72,
                height: 72,
                borderRadius: 10,
                border: on ? "2px solid #1A1320" : "1px solid var(--pro-line-2)",
                background: fr.cA,
                padding: 0,
              }}
            >
              <ProductArt kind={fr.kind} colorA={fr.cA} colorB={fr.cB} brand="" name="" size="" width={45} height={56} />
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id={panelId}
        aria-labelledby={`gallery-tab-${p.id}-${idx}`}
        className="pro-img-bg rounded-[14px] grid place-items-center relative overflow-hidden"
        style={{ background: active.cA, aspectRatio: "1/1" }}
      >
        {p.tag && (
          <span
            className="pro-promo-pill absolute top-4 left-4"
            style={{
              background: p.tag === "NUEVO" ? "#E8F6EE" : "#FBEAF0",
              color: p.tag === "NUEVO" ? "#046B3A" : "#C2185B",
            }}
          >
            {p.tag}
          </span>
        )}
        <ProductArt
          kind={active.kind}
          colorA={active.cA}
          colorB={active.cB}
          brand={p.brand.split(" ")[0]}
          name={p.name.split(" ")[0]}
          size={p.size}
          width={260}
          height={320}
        />
      </div>
    </div>
  );
}

export function MobileHero({ p }: Props) {
  return (
    <div
      className="pro-img-bg rounded-[14px] grid place-items-center relative"
      style={{ background: p.cA, aspectRatio: "1/1" }}
    >
      {p.tag && (
        <span
          className="pro-promo-pill absolute top-3.5 left-3.5"
          style={{
            background: p.tag === "NUEVO" ? "#E8F6EE" : "#FBEAF0",
            color: p.tag === "NUEVO" ? "#046B3A" : "#C2185B",
          }}
        >
          {p.tag}
        </span>
      )}
      <ProductArt
        kind={p.art}
        colorA={p.cA}
        colorB={p.cB}
        brand={p.brand.split(" ")[0]}
        name={p.name.split(" ")[0]}
        size={p.size}
        width={220}
        height={270}
      />
    </div>
  );
}
