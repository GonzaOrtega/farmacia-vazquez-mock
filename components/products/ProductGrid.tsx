import { ProductCard } from "./ProductCard";
import { ProductCardLink } from "./ProductCardLink";
import type { Product } from "@/types/product";

interface Props {
  items: Product[];
  columns?: "2-3" | "2-4";
}

export function ProductGrid({ items, columns = "2-4" }: Props) {
  const cls =
    columns === "2-3"
      ? "grid grid-cols-2 md:grid-cols-3 gap-2.5 md:gap-5"
      : "grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-[18px]";
  return (
    <div className={cls}>
      {items.map((p) => (
        <ProductCardLink key={p.id} id={p.id}>
          <ProductCard p={p} />
        </ProductCardLink>
      ))}
    </div>
  );
}
