const STATS = [
  { n: "+12.000", t: "Clientes en la comunidad" },
  { n: "4.9 ★", t: "Promedio de reseñas" },
  { n: "< 90 min", t: "Entregas urgentes" },
  { n: "15 años", t: "Atendiendo San Miguel" },
];

export function TrustBar() {
  return (
    <section className="pro-trust px-4 py-4 md:px-12 md:py-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 md:gap-6">
        {STATS.map((s, i) => (
          <div
            key={i}
            className={`flex flex-col ${i ? "pl-3 md:pl-6 border-l border-[color:var(--pro-line)]" : ""}`}
          >
            <div
              className="pro-serif text-[22px] md:text-[32px] leading-none"
              style={{ color: "#5C1A6E" }}
            >
              {s.n}
            </div>
            <div className="text-[11px] md:text-[13px] mt-1" style={{ color: "#4A3D54" }}>
              {s.t}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
