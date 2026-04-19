import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="text-[12px] text-[color:var(--pro-muted)]" aria-label="Breadcrumb">
      {items.map((c, i) => {
        const last = i === items.length - 1;
        return (
          <span key={i}>
            {c.href && !last ? (
              <Link href={c.href} className="hover:text-[color:var(--pro-primary)]">
                {c.label}
              </Link>
            ) : (
              <span className={last ? "text-[color:var(--pro-ink-2)]" : undefined}>{c.label}</span>
            )}
            {!last && <span className="mx-1.5 opacity-70">›</span>}
          </span>
        );
      })}
    </nav>
  );
}
