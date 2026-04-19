"use client";

import { useState } from "react";
import type { Product } from "@/types/product";

type TabKey = "desc" | "use" | "ing" | "warn";

export function DetailTabs({ p }: { p: Product }) {
  const tabs: Array<[TabKey, string]> = [
    ["desc", "Descripción"],
    ["use", "Modo de uso"],
    ["ing", "Composición"],
    ...(p.warnings ? ([["warn", "Precauciones"]] as Array<[TabKey, string]>) : []),
  ];
  const [tab, setTab] = useState<TabKey>("desc");

  return (
    <div className="mt-12">
      <div className="flex gap-1 mb-5" style={{ borderBottom: "1px solid var(--pro-line)" }}>
        {tabs.map(([k, l]) => {
          const active = tab === k;
          return (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k)}
              className="cursor-pointer"
              style={{
                padding: "12px 20px",
                background: "transparent",
                border: "none",
                borderBottom: active ? "2px solid #1A1320" : "2px solid transparent",
                color: active ? "#1A1320" : "#7A7185",
                fontSize: 14,
                fontWeight: active ? 600 : 500,
              }}
            >
              {l}
            </button>
          );
        })}
      </div>
      <div
        className="text-[15px] leading-[1.65] max-w-[720px]"
        style={{ color: "#4A3D54" }}
      >
        {tab === "desc" && <p>{p.long ?? p.short}</p>}
        {tab === "use" && (
          <p>{p.howTo ?? "Seguí las indicaciones del envase o consultá con tu farmacéutico."}</p>
        )}
        {tab === "ing" &&
          (p.ingredients ? (
            <ul className="list-none p-0 grid grid-cols-2 gap-2.5">
              {p.ingredients.map((i, k) => (
                <li
                  key={k}
                  className="rounded-lg text-[14px]"
                  style={{ padding: "10px 14px", background: "#FBF7F3" }}
                >
                  {i}
                </li>
              ))}
            </ul>
          ) : (
            <p>Composición disponible en el envase.</p>
          ))}
        {tab === "warn" && p.warnings && (
          <p
            className="rounded-[10px] text-[14px]"
            style={{ padding: 16, background: "#FBEAF0", color: "#8A1A3E" }}
          >
            ⚠ {p.warnings}
          </p>
        )}
      </div>
    </div>
  );
}

export function MobileAccordion({ p }: { p: Product }) {
  const items: Array<[TabKey, string, string | undefined]> = [
    ["desc", "Descripción", p.long ?? p.short],
    ["use", "Modo de uso", p.howTo ?? "—"],
    ...(p.ingredients ? ([["ing", "Composición", p.ingredients.join(", ")]] as Array<[TabKey, string, string]>) : []),
    ...(p.warnings ? ([["warn", "Precauciones", p.warnings]] as Array<[TabKey, string, string]>) : []),
  ];
  const [open, setOpen] = useState<TabKey | null>("desc");

  return (
    <div className="mt-6" style={{ borderTop: "1px solid var(--pro-line-2)" }}>
      {items.map(([k, l, body]) => (
        <div key={k} style={{ borderBottom: "1px solid var(--pro-line-2)" }}>
          <button
            type="button"
            onClick={() => setOpen(open === k ? null : k)}
            className="w-full flex justify-between items-center cursor-pointer"
            style={{ padding: "16px 0", background: "transparent", border: "none" }}
          >
            <span className="text-[14px] font-semibold" style={{ color: "#1A1320" }}>
              {l}
            </span>
            <span className="text-[18px]" style={{ color: "#7A7185" }}>
              {open === k ? "−" : "+"}
            </span>
          </button>
          {open === k && (
            <div
              className="text-[14px] leading-[1.6] pb-4"
              style={{ color: "#4A3D54" }}
            >
              {body}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
