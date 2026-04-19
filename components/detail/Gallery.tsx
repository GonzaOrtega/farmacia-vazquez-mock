"use client";

import { useState } from "react";
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

  return (
    <div className="grid grid-cols-[72px_1fr] gap-3.5">
      <div className="flex flex-col gap-2">
        {frames.map((fr, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIdx(i)}
            title={fr.label}
            aria-label={fr.label}
            className="grid place-items-center overflow-hidden cursor-pointer"
            style={{
              width: 72,
              height: 72,
              borderRadius: 10,
              border: i === idx ? "2px solid #1A1320" : "1px solid var(--pro-line-2)",
              background: fr.cA,
              padding: 0,
            }}
          >
            <ProductArt kind={fr.kind} colorA={fr.cA} colorB={fr.cB} brand="" name="" size="" width={45} height={56} />
          </button>
        ))}
      </div>
      <div
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
