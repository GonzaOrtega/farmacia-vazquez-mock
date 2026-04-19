import { ProductArt } from "@/components/atoms/ProductArt";
import { IconTruck } from "@/components/atoms/Icon";
import { products } from "@/lib/data/products";

export function HeroCluster() {
  const showcase = [products[0], products[4], products[8]];
  return (
    <div className="relative min-h-[280px] md:min-h-[520px]">
      <div className="pro-dots absolute inset-0 opacity-70 rounded-[20px]" />

      {/* Main card */}
      <div
        className="pro-card pro-rise absolute flex flex-col p-4 md:p-[18px] w-[180px] md:w-[280px] h-[230px] md:h-[360px] top-[10px] md:top-10 left-[10px] md:left-10"
      >
        <div className="pro-chip pro-chip-green self-start">-20%</div>
        <div className="pro-img-bg flex-1 rounded-[10px] mt-2.5 grid place-items-center">
          <div className="md:hidden">
            <ProductArt
              kind={showcase[0].art}
              colorA={showcase[0].cA}
              colorB={showcase[0].cB}
              brand={showcase[0].brand}
              name="Sérum"
              size={showcase[0].size}
              width={90}
              height={120}
            />
          </div>
          <div className="hidden md:block">
            <ProductArt
              kind={showcase[0].art}
              colorA={showcase[0].cA}
              colorB={showcase[0].cB}
              brand={showcase[0].brand}
              name="Sérum"
              size={showcase[0].size}
              width={140}
              height={180}
            />
          </div>
        </div>
        <div className="mt-2.5 text-[11px] text-[color:var(--pro-muted)] font-semibold tracking-[0.05em]">
          {showcase[0].brand}
        </div>
        <div className="pro-serif text-sm md:text-[18px] text-[color:var(--pro-ink)]">
          {showcase[0].name}
        </div>
      </div>

      {/* Secondary — desktop only */}
      <div
        className="pro-card pro-rise hidden md:block absolute"
        style={{ width: 220, height: 280, top: 20, right: 40, padding: 14 }}
      >
        <div className="pro-img-bg h-[180px] rounded-[10px] grid place-items-center">
          <ProductArt
            kind={showcase[1].art}
            colorA={showcase[1].cA}
            colorB={showcase[1].cB}
            brand={showcase[1].brand}
            name="Solar"
            size={showcase[1].size}
            width={100}
            height={140}
          />
        </div>
        <div className="mt-2.5 text-[10px] text-[color:var(--pro-muted)] font-semibold">
          {showcase[1].brand}
        </div>
        <div className="pro-serif text-[15px] text-[color:var(--pro-ink)]">{showcase[1].name}</div>
      </div>

      {/* Tertiary — desktop only */}
      <div
        className="pro-card pro-rise hidden md:block absolute"
        style={{ width: 200, height: 220, bottom: 20, right: 120, padding: 14 }}
      >
        <div className="pro-img-bg h-[130px] rounded-[10px] grid place-items-center">
          <ProductArt
            kind={showcase[2].art}
            colorA={showcase[2].cA}
            colorB={showcase[2].cB}
            brand={showcase[2].brand}
            name="Máscara"
            size={showcase[2].size}
            width={80}
            height={110}
          />
        </div>
        <div className="mt-2 text-[10px] text-[color:var(--pro-muted)] font-semibold">
          {showcase[2].brand}
        </div>
        <div className="pro-serif text-[14px] text-[color:var(--pro-ink)]">{showcase[2].name}</div>
      </div>

      {/* Delivery badge */}
      <div
        className="pro-rise absolute flex items-center gap-2.5 rounded-[12px] bottom-0 md:bottom-[60px] left-[180px] md:left-[10px] p-[8px_12px] md:p-[14px_18px]"
        style={{
          background: "#1A1320",
          color: "#fff",
          boxShadow: "0 12px 28px rgba(26,19,32,0.3)",
        }}
      >
        <div
          className="rounded-lg grid place-items-center w-7 h-7 md:w-9 md:h-9"
          style={{ background: "#CDDC39", color: "#1A1320" }}
        >
          <IconTruck size={14} />
        </div>
        <div className="leading-[1.2]">
          <div className="text-[9px] md:text-[11px] opacity-70 tracking-[0.04em]">ENTREGA HOY</div>
          <div className="text-[11px] md:text-[14px] font-semibold">San Miguel · gratis</div>
        </div>
      </div>
    </div>
  );
}
