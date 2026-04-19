import { brands } from "@/lib/data/brands";

export function BrandStrip() {
  return (
    <section
      className="bg-white px-4 py-5 md:px-12 md:py-10"
      style={{ borderTop: "1px solid var(--pro-line)", borderBottom: "1px solid var(--pro-line)" }}
    >
      <div
        className="text-center text-[11px] font-semibold uppercase tracking-[0.1em] mb-3.5"
        style={{ color: "#7A7185" }}
      >
        Trabajamos con las mejores marcas
      </div>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-5 items-center">
        {brands.map((b) => (
          <div
            key={b}
            className="pro-serif text-center text-[13px] md:text-[18px] italic opacity-75"
            style={{ color: "#7A7185" }}
          >
            {b}
          </div>
        ))}
      </div>
    </section>
  );
}
