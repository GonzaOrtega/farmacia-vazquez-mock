"use client";

import { IconArrow } from "@/components/atoms/Icon";

export type AccountSection = "perfil" | "pedidos" | "direcciones" | "recetas";

export const ACCOUNT_SECTIONS: Array<{ id: AccountSection; label: string; hint: string }> = [
  { id: "perfil", label: "Perfil", hint: "Tus datos de contacto" },
  { id: "pedidos", label: "Pedidos", hint: "Historial y seguimiento" },
  { id: "direcciones", label: "Direcciones", hint: "Envíos y retiros" },
  { id: "recetas", label: "Recetas", hint: "Archivo médico" },
];

interface Props {
  active: AccountSection;
  onChange: (s: AccountSection) => void;
}

export function AccountSidebar({ active, onChange }: Props) {
  return (
    <>
      {/* Desktop: vertical card list */}
      <aside className="hidden md:block sticky top-24 self-start">
        <div className="pro-card" style={{ padding: 10 }}>
          {ACCOUNT_SECTIONS.map((s) => {
            const on = s.id === active;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onChange(s.id)}
                className="w-full text-left cursor-pointer flex items-center justify-between"
                style={{
                  background: on ? "var(--pro-primary-50)" : "transparent",
                  border: "none",
                  padding: "12px 14px",
                  borderRadius: 10,
                  color: on ? "var(--pro-primary)" : "var(--pro-ink-2)",
                  marginBottom: 2,
                }}
              >
                <span>
                  <div className="text-[14px] font-semibold">{s.label}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: on ? "var(--pro-primary)" : "var(--pro-muted)", opacity: on ? 0.8 : 1 }}>
                    {s.hint}
                  </div>
                </span>
                <IconArrow size={14} stroke={on ? "var(--pro-primary)" : "var(--pro-muted)"} />
              </button>
            );
          })}
        </div>
        <button
          type="button"
          className="pro-btn pro-btn-ghost w-full mt-3 justify-start"
          style={{ padding: "12px 14px", fontSize: 13, color: "var(--pro-muted)" }}
        >
          Cerrar sesión
        </button>
      </aside>

      {/* Mobile: horizontal chip scroll */}
      <div className="md:hidden pro-scroll -mx-4 px-4 flex gap-2 overflow-x-auto mb-4">
        {ACCOUNT_SECTIONS.map((s) => {
          const on = s.id === active;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onChange(s.id)}
              className="rounded-full text-[13px] font-semibold cursor-pointer whitespace-nowrap"
              style={{
                padding: "8px 16px",
                background: on ? "#1A1320" : "#fff",
                color: on ? "#fff" : "#1A1320",
                border: on ? "1px solid #1A1320" : "1px solid var(--pro-line)",
              }}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </>
  );
}
