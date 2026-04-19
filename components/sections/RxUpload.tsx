import { IconArrow, IconCheck, IconRx } from "@/components/atoms/Icon";

export function RxUpload() {
  return (
    <section className="px-4 py-4 md:px-12 md:py-6">
      <div
        className="rounded-[20px] p-5 md:p-12 text-white grid gap-6 items-center md:grid-cols-[1.3fr_1fr]"
        style={{ background: "#1A1320" }}
      >
        <div>
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: "rgba(205,220,57,0.15)", color: "#CDDC39" }}
          >
            <IconRx size={14} stroke="#CDDC39" /> Pedido con receta
          </div>
          <h2
            className="pro-serif mt-3.5 text-[26px] md:text-[40px] leading-[1.1] tracking-[-0.02em]"
          >
            Subí tu receta y nosotros
            <br />
            <em style={{ color: "#CDDC39", fontStyle: "italic" }}>nos encargamos del resto.</em>
          </h2>
          <p
            className="mt-3 max-w-[520px] leading-[1.55] text-[13px] md:text-[15px]"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            Sacá una foto desde el celular. Nuestra farmacéutica la revisa, te avisa el precio final y coordinamos la entrega. Así de simple.
          </p>
          <div className="flex gap-2.5 mt-5 flex-wrap">
            <button
              type="button"
              className="pro-btn"
              style={{ background: "#CDDC39", color: "#1A1320" }}
            >
              Subir receta ahora <IconArrow size={14} />
            </button>
            <button
              type="button"
              className="pro-btn pro-btn-ghost"
              style={{ color: "#fff" }}
            >
              Cómo funciona
            </button>
          </div>
        </div>

        <div className="hidden md:grid place-items-center">
          <div className="relative">
            <div
              className="rounded-[10px] p-[18px]"
              style={{
                width: 220,
                height: 280,
                background: "#fff",
                transform: "rotate(4deg)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-[9px] font-semibold tracking-[0.1em]" style={{ color: "#7A7185" }}>
                    Rx · RECETA MÉDICA
                  </div>
                  <div className="text-[11px] mt-1" style={{ color: "#1A1320" }}>
                    Dr. M. García
                  </div>
                  <div className="text-[9px]" style={{ color: "#7A7185" }}>
                    M.N. 112.334
                  </div>
                </div>
                <IconRx size={28} stroke="#5C1A6E" />
              </div>
              <div className="border-t border-dashed pt-3" style={{ borderColor: "#EAE4EE" }}>
                <div className="h-1.5 rounded-[3px] mb-1.5" style={{ background: "#F1ECF4" }} />
                <div
                  className="h-1.5 rounded-[3px] mb-1.5 w-[70%]"
                  style={{ background: "#F1ECF4" }}
                />
                <div
                  className="h-1.5 rounded-[3px] mb-3 w-[85%]"
                  style={{ background: "#F1ECF4" }}
                />
                <div className="text-[10px] font-semibold" style={{ color: "#4A3D54" }}>
                  Amoxicilina 500mg
                </div>
                <div className="text-[9px]" style={{ color: "#7A7185" }}>
                  1 cáp c/8hs · 7 días
                </div>
              </div>
              <div
                className="mt-3.5 pt-2.5 text-[9px] border-t border-dashed"
                style={{ borderColor: "#EAE4EE", color: "#7A7185" }}
              >
                Firma y sello
              </div>
              <div
                className="mt-1.5 rounded-[4px] grid place-items-center text-[9px] font-semibold"
                style={{
                  width: 80,
                  height: 30,
                  border: "1.5px solid #5C1A6E",
                  color: "#5C1A6E",
                  transform: "rotate(-4deg)",
                }}
              >
                DR. GARCÍA
              </div>
            </div>
            <div
              className="absolute rounded-full font-bold text-[11px]"
              style={{
                top: -14,
                right: -20,
                background: "#CDDC39",
                color: "#1A1320",
                padding: "8px 12px",
                boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
              }}
            >
              <IconCheck size={12} stroke="#1A1320" style={{ verticalAlign: -2, marginRight: 4 }} />
              Validada
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
