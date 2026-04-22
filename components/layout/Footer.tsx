import { Logo } from "@/components/atoms/Logo";
import {
  IconChat,
  IconClock,
  IconInstagram,
  IconPin,
  IconWhatsapp,
} from "@/components/atoms/Icon";

const TIENDA = ["Medicamentos", "Dermocosmética", "Perfumería", "Maquillaje", "Cuidado Capilar"];
const AYUDA = [
  "Envíos y entregas",
  "Medios de pago",
  "Cambios y devoluciones",
  "Preguntas frecuentes",
  "Contacto",
];

export function Footer() {
  return (
    <footer className="bg-[#1A1320] text-white px-4 py-8 md:px-12 md:pt-14 md:pb-7">
      <div className="grid gap-6 md:gap-10 grid-cols-2 md:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div className="col-span-2 md:col-span-1">
          <Logo size="lg" onDark />
          <p className="mt-4 text-[13px] opacity-70 max-w-[320px] leading-[1.6]">
            Tu farmacia de confianza en San Miguel. Medicamentos, dermocosmética y cuidado personal — con envíos en el día.
          </p>
          <div className="flex gap-2.5 mt-3.5">
            {(
              [
                ["Instagram", <IconInstagram key="ig" size={16} />],
                ["WhatsApp", <IconWhatsapp key="wa" size={16} />],
                ["Chat", <IconChat key="ch" size={16} />],
              ] as const
            ).map(([label, ic]) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="w-[34px] h-[34px] rounded-lg bg-white/10 grid place-items-center text-white cursor-pointer"
              >
                {ic}
              </a>
            ))}
          </div>
        </div>
        <FooterColumn title="Tienda" items={TIENDA} />
        <FooterColumn title="Ayuda" items={AYUDA} />
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#CDDC39] mb-3">Visitanos</div>
          <div className="text-[13px] opacity-80 leading-[1.7]">
            <div className="flex gap-2 items-start">
              <IconPin size={14} />
              <span>
                Av. Balbín 4702
                <br />
                San Miguel, Buenos Aires
              </span>
            </div>
            <div className="flex gap-2 items-center mt-2.5">
              <IconClock size={14} />
              <span>9 a 21 hs · Todos los días</span>
            </div>
            <div className="flex gap-2 items-center mt-2.5">
              <IconWhatsapp size={14} />
              <span>+54 11 0000-0000</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 mt-9 pt-4 flex flex-wrap justify-between gap-3 text-[11px] opacity-55">
        <div>© 2026 Farmacia Vázquez · Farmacia habilitada RNE 11.284</div>
        <div>Directora técnica: Sofía Martínez · M.N. 22.841</div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#CDDC39] mb-3">
        {title}
      </div>
      <ul className="list-none p-0 m-0">
        {items.map((l) => (
          <li key={l}>
            <a
              href="#"
              className="block text-[13px] opacity-80 hover:opacity-100 py-1 cursor-pointer no-underline text-white"
            >
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
