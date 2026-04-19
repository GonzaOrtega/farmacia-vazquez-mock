import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Benefits, BuyBlock } from "@/components/detail/BuyBlock";
import { Gallery, MobileHero } from "@/components/detail/Gallery";
import { MobileAccordion, DetailTabs } from "@/components/detail/Tabs";
import { Reviews, ReviewsMobile } from "@/components/detail/Reviews";
import { Related } from "@/components/detail/Related";
import { MobileBuyBar } from "@/components/detail/MobileBuyBar";
import { getCategory } from "@/lib/data/categories";
import type { Product } from "@/types/product";

interface Props {
  p: Product;
}

export function ProductDetailView({ p }: Props) {
  const cat = getCategory(p.cat);
  const crumbs = [
    { label: "Inicio", href: "/" },
    { label: "Productos", href: "/productos" },
    ...(cat ? [{ label: cat.name, href: `/productos/${cat.id}` }] : []),
    { label: p.name },
  ];

  return (
    <>
      <div className="px-4 pt-3.5 md:px-12 md:pt-6">
        <Breadcrumb items={crumbs} />
      </div>

      <section className="px-4 py-3 md:px-12 md:py-5 md:pb-8">
        <div className="grid gap-5 md:gap-12 md:grid-cols-[1.1fr_1fr]">
          <div className="md:block">
            <div className="md:hidden">
              <MobileHero p={p} />
            </div>
            <div className="hidden md:block">
              <Gallery p={p} />
            </div>
          </div>

          <div>
            <div
              className="text-[11px] font-bold uppercase tracking-[0.1em]"
              style={{ color: "#5C1A6E" }}
            >
              {p.brand}
            </div>
            <h1
              className="pro-serif text-[28px] md:text-[44px] leading-[1.05] tracking-[-0.02em] mt-1"
              style={{ color: "#1A1320" }}
            >
              {p.name}
            </h1>
            <div className="text-[13px] mt-1" style={{ color: "#7A7185" }}>
              {p.size}
            </div>
            {p.short && (
              <p className="text-[15px] leading-[1.55] mt-3.5" style={{ color: "#4A3D54" }}>
                {p.short}
              </p>
            )}
            <Benefits p={p} />
            <div
              className="mt-5 pt-5"
              style={{ borderTop: "1px solid var(--pro-line-2)" }}
            >
              <BuyBlock p={p} />
            </div>
          </div>
        </div>

        {/* Desktop tabs */}
        <div className="hidden md:block">
          <DetailTabs p={p} />
        </div>

        {/* Mobile accordion */}
        <div className="md:hidden">
          <MobileAccordion p={p} />
        </div>

        {/* Reviews */}
        <div className="hidden md:block">
          <Reviews p={p} />
        </div>
        <div className="md:hidden">
          <ReviewsMobile p={p} />
        </div>

        {/* Related */}
        <Related p={p} />
      </section>

      <MobileBuyBar p={p} />
    </>
  );
}
