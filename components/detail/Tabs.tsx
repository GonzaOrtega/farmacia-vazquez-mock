"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { IconMinus, IconPlus } from "@/components/atoms/Icon";
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
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = tabs.findIndex(([k]) => k === tab);
    if (i < 0) return;
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    else return;
    e.preventDefault();
    setTab(tabs[next][0]);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="mt-12">
      <div
        role="tablist"
        aria-label="Información del producto"
        onKeyDown={onKey}
        className="flex gap-1 mb-5"
        style={{ borderBottom: "1px solid var(--pro-line)" }}
      >
        {tabs.map(([k, l], i) => {
          const active = tab === k;
          return (
            <button
              key={k}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`detail-tab-${k}`}
              aria-selected={active}
              aria-controls={`detail-panel-${k}`}
              tabIndex={active ? 0 : -1}
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
        role="tabpanel"
        id={`detail-panel-${tab}`}
        aria-labelledby={`detail-tab-${tab}`}
        tabIndex={0}
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
            <span aria-hidden="true">⚠ </span>
            {p.warnings}
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
      {items.map(([k, l, body]) => {
        const isOpen = open === k;
        return (
          <div key={k} style={{ borderBottom: "1px solid var(--pro-line-2)" }}>
            <button
              type="button"
              id={`acc-trigger-${k}`}
              aria-expanded={isOpen}
              aria-controls={`acc-panel-${k}`}
              onClick={() => setOpen(isOpen ? null : k)}
              className="w-full flex justify-between items-center cursor-pointer"
              style={{ padding: "16px 0", background: "transparent", border: "none" }}
            >
              <span className="text-[14px] font-semibold" style={{ color: "#1A1320" }}>
                {l}
              </span>
              <span style={{ color: "#7A7185", display: "inline-flex" }}>
                {isOpen ? <IconMinus size={16} /> : <IconPlus size={16} />}
              </span>
            </button>
            <div
              id={`acc-panel-${k}`}
              role="region"
              aria-labelledby={`acc-trigger-${k}`}
              hidden={!isOpen}
              className="text-[14px] leading-[1.6] pb-4"
              style={{ color: "#4A3D54" }}
            >
              {body}
            </div>
          </div>
        );
      })}
    </div>
  );
}
