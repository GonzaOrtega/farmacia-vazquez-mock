import { IconCross, IconWhatsapp } from "@/components/atoms/Icon";
import { staff } from "@/lib/data/staff";

export function Staff() {
  return (
    <section
      className="px-4 py-8 md:px-12 md:py-16"
      style={{ background: "#FBF7F3" }}
    >
      <div className="grid gap-8 items-center md:grid-cols-[1fr_1.3fr]">
        <div>
          <div
            className="text-[12px] font-semibold uppercase tracking-[0.08em]"
            style={{ color: "#5C1A6E" }}
          >
            El equipo
          </div>
          <h2
            className="pro-serif mt-2 text-[28px] md:text-[48px] leading-[1.05] tracking-[-0.02em]"
            style={{ color: "#1A1320" }}
          >
            Farmacéuticos matriculados,
            <br />
            <em style={{ color: "#5C1A6E", fontStyle: "italic" }}>vecinos del barrio.</em>
          </h2>
          <p
            className="mt-3.5 max-w-[440px] leading-[1.6] text-[13px] md:text-[16px]"
            style={{ color: "#4A3D54" }}
          >
            Hace 15 años que acompañamos a las familias de San Miguel. Nuestro equipo te asesora en cada compra — presencial, por WhatsApp o en la web.
          </p>
          <div className="flex gap-2.5 mt-5 flex-wrap">
            <button type="button" className="pro-btn pro-btn-primary">
              Contactar por WhatsApp <IconWhatsapp size={16} />
            </button>
            <button type="button" className="pro-btn pro-btn-secondary">
              Conocer la farmacia
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 md:gap-4">
          {staff.map((s) => (
            <div key={s.id} className="pro-card overflow-hidden" style={{ padding: 0 }}>
              <div
                className="relative grid place-items-center"
                style={{ aspectRatio: "4/5", background: s.bg }}
              >
                <svg viewBox="0 0 120 160" width="66%">
                  <circle cx="60" cy="56" r="22" fill={s.accent} />
                  <path d="M16 160 Q16 100 60 100 Q104 100 104 160 Z" fill={s.accent} />
                  <path d="M34 100 L60 122 L86 100 L86 120 Q60 130 34 120 Z" fill="#00A651" />
                  <text
                    x="60"
                    y="62"
                    textAnchor="middle"
                    fontFamily="Inter"
                    fontSize="22"
                    fontWeight="700"
                    fill="#fff"
                  >
                    {s.name[0]}
                  </text>
                </svg>
                <div
                  className="absolute rounded-full inline-flex items-center gap-1 font-semibold text-[10px]"
                  style={{
                    bottom: 10,
                    left: 10,
                    background: "#fff",
                    color: "#046B3A",
                    padding: "3px 8px",
                  }}
                >
                  <IconCross size={10} stroke="#046B3A" /> Matriculada
                </div>
              </div>
              <div className="px-3.5 py-3">
                <div
                  className="pro-serif text-[14px] md:text-[18px]"
                  style={{ color: "#1A1320" }}
                >
                  {s.name}
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: "#7A7185" }}>
                  {s.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
