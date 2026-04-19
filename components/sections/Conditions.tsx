import { IconArrow } from "@/components/atoms/Icon";
import { conditions } from "@/lib/data/conditions";

export function Conditions() {
  return (
    <section className="bg-white px-4 pb-7 pt-3 md:px-12 md:pb-12 md:pt-5">
      <div className="flex items-center justify-between mb-4">
        <div className="text-[13px] font-medium" style={{ color: "#4A3D54" }}>
          Comprá según lo que necesitás
        </div>
        <button
          type="button"
          className="pro-btn pro-btn-ghost inline-flex items-center gap-1.5 p-0 text-xs"
          style={{ color: "#5C1A6E" }}
        >
          Ver todos los síntomas <IconArrow size={14} />
        </button>
      </div>
      <div
        className="pro-scroll grid gap-2.5 pb-1 overflow-x-auto
          [grid-auto-flow:column] [grid-auto-columns:160px]
          md:[grid-auto-flow:initial] md:[grid-auto-columns:initial] md:grid-cols-6"
      >
        {conditions.map((c) => (
          <button
            key={c.id}
            type="button"
            className="pro-card pro-cat text-left flex flex-col gap-0.5"
            style={{ padding: "14px 16px", border: "1px solid var(--pro-line)" }}
          >
            <div className="font-semibold text-[14px]" style={{ color: "#1A1320" }}>
              {c.title}
            </div>
            <div className="text-[11px]" style={{ color: "#7A7185" }}>
              {c.sub}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
