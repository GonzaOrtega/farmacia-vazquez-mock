import Link from "next/link";
import { IconArrow, IconCross, IconRx, IconShield, IconTruck } from "@/components/atoms/Icon";
import { HeroCluster } from "./HeroCluster";

export function Hero() {
  return (
    <section className="bg-white relative overflow-hidden">
      <div className="grid gap-5 md:gap-12 items-center px-4 py-7 pb-8 md:px-12 md:py-[72px] md:pb-20 md:grid-cols-[1.1fr_1fr]">
        <div>
          <div className="pro-chip pro-rise mb-3.5 md:mb-6">
            <span
              style={{ width: 6, height: 6, borderRadius: "50%", background: "#00A651" }}
            />{" "}
            Tu farmacia de confianza en San Miguel
          </div>
          <h1
            className="pro-serif pro-rise text-[46px] md:text-[92px] leading-none tracking-[-0.03em]"
            style={{ color: "#1A1320" }}
          >
            Tu salud,
            <br />
            <em style={{ color: "#5C1A6E", fontStyle: "italic" }}>a un clic.</em>
          </h1>
          <p
            className="pro-rise mt-3.5 md:mt-[22px] text-sm md:text-[17px] leading-[1.55] max-w-[480px]"
            style={{ color: "#4A3D54" }}
          >
            Medicamentos, dermocosmética y cuidado personal. Farmacéuticos matriculados te acompañan en cada compra.
          </p>

          <div className="pro-rise flex gap-2.5 mt-4 md:mt-7 flex-wrap">
            <Link
              href="/productos"
              className="pro-btn pro-btn-primary no-underline"
              style={{ padding: "12px 20px", fontSize: 13 }}
            >
              Explorar productos <IconArrow size={16} />
            </Link>
            <button
              type="button"
              className="pro-btn pro-btn-secondary"
              style={{ padding: "12px 18px", fontSize: 13 }}
            >
              <IconRx size={16} stroke="#5C1A6E" /> Subir receta
            </button>
          </div>

          <div className="pro-rise flex gap-3.5 md:gap-7 mt-5 md:mt-10 flex-wrap items-center">
            {[
              { icon: <IconShield size={16} stroke="#046B3A" />, t: "Farmacia habilitada" },
              { icon: <IconCross size={16} stroke="#046B3A" />, t: "Farmacéutico de guardia" },
              { icon: <IconTruck size={16} stroke="#046B3A" />, t: "Envíos en el día" },
            ].map((x, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-[13px] font-medium"
                style={{ color: "#4A3D54" }}
              >
                {x.icon}
                <span>{x.t}</span>
              </div>
            ))}
          </div>
        </div>

        <HeroCluster />
      </div>
    </section>
  );
}
