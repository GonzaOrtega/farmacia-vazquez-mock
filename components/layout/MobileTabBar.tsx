"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconHeart, IconMenu, IconPin, IconUser } from "@/components/atoms/Icon";
import { useFavorites } from "@/components/favorites/useFavorites";

const TABS = [
  { icon: IconPin, label: "Inicio", href: "/" },
  { icon: IconMenu, label: "Categorías", href: "/productos" },
  { icon: IconHeart, label: "Favoritos", href: "/favoritos" },
  { icon: IconUser, label: "Cuenta", href: "/cuenta" },
];

export function MobileTabBar() {
  const pathname = usePathname();
  const fav = useFavorites();
  return (
    <nav className="md:hidden sticky bottom-0 z-10 bg-white border-t border-[color:var(--pro-line)] grid grid-cols-4 py-2 pt-2 pb-2.5">
      {TABS.map((t) => {
        const active = t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
        const IconComp = t.icon;
        const showBadge = t.href === "/favoritos" && fav.count > 0;
        return (
          <Link
            key={t.label}
            href={t.href}
            className="flex flex-col items-center gap-0.5 text-[10px] font-semibold"
            style={{ color: active ? "var(--pro-primary)" : "var(--pro-muted)" }}
          >
            <span style={{ position: "relative", display: "inline-flex" }}>
              <IconComp size={18} />
              {showBadge && (
                <span
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -6,
                    background: "#C2185B",
                    color: "#fff",
                    fontSize: 9,
                    padding: "1px 5px",
                    borderRadius: 999,
                    fontWeight: 700,
                    lineHeight: 1.2,
                  }}
                >
                  {fav.count}
                </span>
              )}
            </span>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
