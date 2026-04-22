"use client";

import { useEffect, useId, useRef } from "react";
import { IconClose } from "@/components/atoms/Icon";
import { useFocusTrap } from "@/components/cart/useFocusTrap";
import type { ReactNode } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
  resultCount: number;
  children: ReactNode;
}

export function FilterDrawer({ open, onClose, onApply, onReset, resultCount, children }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useFocusTrap(dialogRef, open);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(26,19,32,0.4)",
          backdropFilter: "blur(2px)",
        }}
        aria-hidden
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(420px, 92%)",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          animation: "pro-rise .3s ease",
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{ padding: "20px 24px", borderBottom: "1px solid var(--pro-line)" }}
        >
          <div id={titleId} className="pro-serif text-[22px]" style={{ color: "#1A1320" }}>
            Filtros
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="grid place-items-center cursor-pointer"
            style={{
              background: "#F4EEF7",
              border: "none",
              width: 34,
              height: 34,
              borderRadius: 999,
              color: "#5C1A6E",
            }}
          >
            <IconClose size={16} />
          </button>
        </div>
        <div className="pro-scroll flex-1 overflow-y-auto" style={{ padding: "12px 24px 16px" }}>
          {children}
        </div>
        <div
          className="flex gap-2 justify-between"
          style={{
            padding: 16,
            borderTop: "1px solid var(--pro-line)",
            background: "#FBF7F3",
          }}
        >
          <button
            type="button"
            onClick={onReset}
            className="pro-btn pro-btn-secondary flex-1"
          >
            Limpiar
          </button>
          <button
            type="button"
            onClick={onApply}
            className="pro-btn pro-btn-primary flex-1"
          >
            Ver {resultCount} productos
          </button>
        </div>
      </div>
    </div>
  );
}
