import Link from "next/link";
import { SectionHead } from "@/components/atoms/SectionHead";
import {
  IconCheck,
  IconCross,
  IconHeart,
  IconInfo,
  IconRx,
  IconShield,
  IconStar,
  type IconProps,
} from "@/components/atoms/Icon";
import { categories } from "@/lib/data/categories";

const ICONS: Array<(p: IconProps) => React.ReactNode> = [
  IconRx,
  IconShield,
  IconHeart,
  IconCheck,
  IconStar,
  IconInfo,
  IconCross,
];

export function CategoryGrid() {
  const cats = categories.slice(1);
  return (
    <section className="bg-white px-4 pt-7 pb-3 md:px-12 md:pt-16 md:pb-6">
      <SectionHead eyebrow="Explorá por categoría" title="Todo lo que tu familia necesita" />
      <div className="grid grid-cols-4 md:grid-cols-7 gap-2 md:gap-3.5 mt-4 md:mt-8">
        {cats.map((c, i) => {
          const IconComp = ICONS[i % ICONS.length];
          return (
            <Link
              key={c.id}
              href={`/productos/${c.id}`}
              className="pro-card pro-cat flex flex-col items-start text-left gap-2 no-underline"
              style={{
                background: "#fff",
                color: "#1A1320",
                padding: "14px 8px",
              }}
            >
              <div
                className="rounded-[10px] grid place-items-center w-8 h-8 md:w-[42px] md:h-[42px]"
                style={{ background: "#F4EEF7", color: "#5C1A6E" }}
              >
                <IconComp size={16} />
              </div>
              <div>
                <div className="font-semibold text-[11px] md:text-[14px] leading-tight">{c.name}</div>
                <div className="text-[9px] md:text-[11px] opacity-70 mt-0.5">{c.desc}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
