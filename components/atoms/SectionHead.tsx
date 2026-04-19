import Link from "next/link";
import { IconArrow } from "./Icon";

interface Props {
  eyebrow: string;
  title: string;
  cta?: string;
  ctaHref?: string;
}

export function SectionHead({ eyebrow, title, cta, ctaHref }: Props) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-5">
      <div>
        <div className="text-[11px] md:text-xs font-semibold uppercase tracking-[0.08em] text-[color:var(--pro-primary)]">
          {eyebrow}
        </div>
        <h2 className="pro-serif mt-1.5 text-[26px] md:text-[40px] leading-[1.1] tracking-[-0.02em] text-[color:var(--pro-ink)]">
          {title}
        </h2>
      </div>
      {cta &&
        (ctaHref ? (
          <Link
            href={ctaHref}
            className="pro-btn pro-btn-ghost inline-flex items-center gap-2 p-0 text-[color:var(--pro-primary)]"
          >
            {cta} <IconArrow size={14} />
          </Link>
        ) : (
          <button
            type="button"
            className="pro-btn pro-btn-ghost inline-flex items-center gap-2 p-0 text-[color:var(--pro-primary)]"
          >
            {cta} <IconArrow size={14} />
          </button>
        ))}
    </div>
  );
}
