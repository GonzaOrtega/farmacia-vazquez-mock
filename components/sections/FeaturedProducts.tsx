import { SectionHead } from "@/components/atoms/SectionHead";
import { ProductGrid } from "@/components/products/ProductGrid";
import { products } from "@/lib/data/products";

export function FeaturedProducts() {
  const items = products.slice(0, 8);
  return (
    <section className="px-4 py-4 pb-14 md:px-12 md:py-6 md:pb-14">
      <SectionHead
        eyebrow="Más vendidos"
        title="Lo más pedido esta semana"
        cta="Ver todo"
        ctaHref="/productos"
      />
      <div className="mt-4 md:mt-7">
        <ProductGrid items={items} />
      </div>
    </section>
  );
}
