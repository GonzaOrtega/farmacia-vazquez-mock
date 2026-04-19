import { ProductGrid } from "@/components/products/ProductGrid";
import { products } from "@/lib/data/products";
import type { Product } from "@/types/product";

export function Related({ p }: { p: Product }) {
  const related = products.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4);
  if (related.length === 0) return null;
  return (
    <div className="py-8 pb-2">
      <h3 className="pro-serif text-[24px] md:text-[28px] mb-4" style={{ color: "#1A1320" }}>
        Productos relacionados
      </h3>
      <ProductGrid items={related} columns="2-4" />
    </div>
  );
}
