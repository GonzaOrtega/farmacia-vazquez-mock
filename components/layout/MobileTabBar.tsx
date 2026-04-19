"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconMenu, IconPin, IconRx, IconUser } from "@/components/atoms/Icon";

const TABS = [
  { icon: IconPin, label: "Inicio", href: "/" },
  { icon: IconMenu, label: "Categorías", href: "/productos" },
  { icon: IconRx, label: "Receta", href: "/#receta" },
  { icon: IconUser, label: "Cuenta", href: "/#cuenta" },
];

export function MobileTabBar() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden sticky bottom-0 z-10 bg-white border-t border-[color:var(--pro-line)] grid grid-cols-4 py-2 pt-2 pb-2.5">
      {TABS.map((t) => {
        const active = t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
        const IconComp = t.icon;
        return (
          <Link
            key={t.label}
            href={t.href}
            className="flex flex-col items-center gap-0.5 text-[10px] font-semibold"
            style={{ color: active ? "var(--pro-primary)" : "var(--pro-muted)" }}
          >
            <IconComp size={18} />
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
