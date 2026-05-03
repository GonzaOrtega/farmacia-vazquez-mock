"use client";

import { Suspense, useEffect, useId, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconSearch } from "@/components/atoms/Icon";
import { products } from "@/lib/data/products";
import { searchProducts } from "@/lib/search/match";
import { fmtPrice } from "@/lib/format";

const MAX_RESULTS = 6;

type Variant = "desktop" | "mobile";

interface Props {
  variant: Variant;
}

// Header lives in app/layout.tsx, so HeaderSearch renders during static
// prerender of every route. useSearchParams forces a CSR bailout that Next 16
// requires to be wrapped in Suspense — the fallback is the same visual shell
// without state, so SSR + client pickup look identical.
export function HeaderSearch({ variant }: Props) {
  return (
    <Suspense fallback={<HeaderSearchShell variant={variant} />}>
      <HeaderSearchInner variant={variant} />
    </Suspense>
  );
}

function HeaderSearchShell({ variant }: Props) {
  const placeholder =
    variant === "desktop"
      ? "Buscá por medicamento, marca o condición — ej. ibuprofeno, protector solar…"
      : "¿Qué estás buscando?";
  const wrapperClass =
    variant === "desktop" ? "relative flex-1 max-w-[640px]" : "relative";
  const inputStyle: React.CSSProperties =
    variant === "desktop"
      ? { paddingLeft: 46, paddingRight: 120, borderRadius: 999, background: "#FAFAFB" }
      : { paddingLeft: 40, borderRadius: 999, background: "#FAFAFB", fontSize: 13 };
  const iconWrapStyle: React.CSSProperties =
    variant === "desktop" ? { left: 16 } : { left: 14 };
  const iconSize = variant === "desktop" ? 18 : 16;
  return (
    <div className={wrapperClass}>
      <div
        className="absolute top-1/2 -translate-y-1/2 text-[color:var(--pro-muted)] pointer-events-none"
        style={iconWrapStyle}
      >
        <IconSearch size={iconSize} />
      </div>
      <input
        type="search"
        placeholder={placeholder}
        aria-label="Buscar productos"
        className="pro-input"
        style={inputStyle}
        readOnly
      />
      {variant === "desktop" && (
        <button
          type="button"
          disabled
          className="pro-btn pro-btn-primary absolute top-1 right-1"
          style={{ padding: "8px 18px", fontSize: 13 }}
        >
          Buscar
        </button>
      )}
    </div>
  );
}

function HeaderSearchInner({ variant }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const listboxId = useId();

  const urlQuery = (searchParams.get("q") ?? "").trim();
  const [value, setValue] = useState(urlQuery);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mirror external URL changes (back/forward, Compartir filtros, sibling
  // HeaderSearch instance) into the input, and close the popup on any nav.
  // Render-time state adjustment per the React docs "Adjusting state when a
  // prop changes" pattern — avoids the setState-in-effect anti-pattern.
  const sig = `${pathname}|${urlQuery}`;
  const [lastSig, setLastSig] = useState(sig);
  if (lastSig !== sig) {
    setLastSig(sig);
    setValue(urlQuery);
    setOpen(false);
    setActiveIndex(-1);
  }

  // Click-outside.
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const results = useMemo(
    () => searchProducts(products, value, MAX_RESULTS),
    [value],
  );
  const showPopup = open && value.trim().length > 0;

  function navigateToResults() {
    const trimmed = value.trim();
    const sp = new URLSearchParams(searchParams.toString());
    if (trimmed) sp.set("q", trimmed);
    else sp.delete("q");
    const qs = sp.toString();
    router.push(qs ? `/productos?${qs}` : "/productos");
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (activeIndex >= 0 && activeIndex < results.length) {
      router.push(`/producto/${results[activeIndex].id}`);
      return;
    }
    navigateToResults();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      if (!showPopup) return;
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      if (!showPopup) return;
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Escape") {
      if (open) {
        e.preventDefault();
        setOpen(false);
        setActiveIndex(-1);
      }
    } else if (e.key === "Home") {
      if (showPopup && results.length > 0) {
        e.preventDefault();
        setActiveIndex(0);
      }
    } else if (e.key === "End") {
      if (showPopup && results.length > 0) {
        e.preventDefault();
        setActiveIndex(results.length - 1);
      }
    }
  }

  const placeholder =
    variant === "desktop"
      ? "Buscá por medicamento, marca o condición — ej. ibuprofeno, protector solar…"
      : "¿Qué estás buscando?";

  const wrapperClass =
    variant === "desktop"
      ? "relative flex-1 max-w-[640px]"
      : "relative";

  const inputStyle: React.CSSProperties =
    variant === "desktop"
      ? { paddingLeft: 46, paddingRight: 120, borderRadius: 999, background: "#FAFAFB" }
      : { paddingLeft: 40, borderRadius: 999, background: "#FAFAFB", fontSize: 13 };

  const iconWrapStyle: React.CSSProperties =
    variant === "desktop"
      ? { left: 16 }
      : { left: 14 };

  const iconSize = variant === "desktop" ? 18 : 16;
  const activeId =
    activeIndex >= 0 && activeIndex < results.length
      ? `${listboxId}-opt-${activeIndex}`
      : undefined;

  return (
    <div ref={containerRef} className={wrapperClass}>
      <form onSubmit={onSubmit} role="search">
        <div
          className="absolute top-1/2 -translate-y-1/2 text-[color:var(--pro-muted)] pointer-events-none"
          style={iconWrapStyle}
        >
          <IconSearch size={iconSize} />
        </div>
        <input
          ref={inputRef}
          type="search"
          autoComplete="off"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => {
            if (value.trim().length > 0) setOpen(true);
          }}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          aria-label="Buscar productos"
          aria-autocomplete="list"
          aria-expanded={showPopup}
          aria-controls={showPopup ? listboxId : undefined}
          aria-activedescendant={activeId}
          role="combobox"
          className="pro-input"
          style={inputStyle}
        />
        {variant === "desktop" && (
          <button
            type="submit"
            className="pro-btn pro-btn-primary absolute top-1 right-1"
            style={{ padding: "8px 18px", fontSize: 13 }}
          >
            Buscar
          </button>
        )}
      </form>

      {showPopup && (
        <div
          className="absolute left-0 right-0 top-full mt-2 bg-white border border-[color:var(--pro-line)] rounded-[14px] overflow-hidden z-30"
          style={{ boxShadow: "0 18px 40px rgba(26,19,32,0.12)" }}
        >
          {results.length > 0 ? (
            <ul
              id={listboxId}
              role="listbox"
              aria-label="Sugerencias de productos"
              className="list-none m-0 p-0"
            >
              {results.map((p, i) => (
                <li
                  key={p.id}
                  id={`${listboxId}-opt-${i}`}
                  role="option"
                  aria-selected={i === activeIndex}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    router.push(`/producto/${p.id}`);
                  }}
                  onMouseEnter={() => setActiveIndex(i)}
                  className="cursor-pointer px-4 py-2.5 flex items-center justify-between gap-3 text-[13px]"
                  style={{
                    background:
                      i === activeIndex ? "var(--pro-cream)" : "transparent",
                  }}
                >
                  <span className="flex flex-col min-w-0">
                    <span className="font-semibold text-[color:var(--pro-ink)] truncate">
                      {p.name}
                    </span>
                    <span className="text-[11px] text-[color:var(--pro-muted)] uppercase tracking-wide">
                      {p.brand}
                    </span>
                  </span>
                  <span className="text-[color:var(--pro-ink-2)] font-semibold whitespace-nowrap">
                    {fmtPrice(p.price)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-3 text-[13px] text-[color:var(--pro-muted)] m-0">
              Sin coincidencias para «{value.trim()}»
            </p>
          )}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              navigateToResults();
            }}
            className="block w-full text-left px-4 py-2.5 text-[12px] font-semibold text-[color:var(--pro-primary)] bg-transparent border-0 border-t border-[color:var(--pro-line)] cursor-pointer"
          >
            Ver todos los resultados para «{value.trim()}»
          </button>
        </div>
      )}
    </div>
  );
}
