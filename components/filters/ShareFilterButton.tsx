"use client";

import { useCallback, useState } from "react";
import { IconCheck, IconShare } from "@/components/atoms/Icon";

/**
 * One-click copy of the current filtered URL to the clipboard. Intended to
 * sit next to "Limpiar todo" in the active-filters row — the parent gates
 * visibility on `activeCount > 0`, so we don't double-gate here.
 *
 * Fails silently if the Clipboard API is denied or unavailable (e.g. in an
 * insecure context) — the button just does nothing rather than showing an
 * error state, matching native browser "Copy link" affordances.
 */
export function ShareFilterButton() {
  const [copied, setCopied] = useState(false);

  const share = useCallback(() => {
    if (typeof window === "undefined" || !navigator.clipboard) return;
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        // Clipboard denied / insecure context — stay silent
      });
  }, []);

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex items-center gap-1.5 text-[12px] font-semibold ml-1"
      style={{
        color: copied ? "#00A651" : "#5C1A6E",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: 0,
      }}
      aria-live="polite"
    >
      {copied ? <IconCheck size={12} /> : <IconShare size={12} />}
      {copied ? "Enlace copiado" : "Compartir filtros"}
    </button>
  );
}
