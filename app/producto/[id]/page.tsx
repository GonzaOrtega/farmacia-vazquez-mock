import { notFound } from "next/navigation";
import { ProductDetailView } from "@/components/pages/ProductDetailView";
import { getProduct, products } from "@/lib/data/products";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const p = getProduct(id);
  if (!p) return { title: "Producto — Farmacia Vázquez" };
  return { title: `${p.name} — ${p.brand} — Farmacia Vázquez` };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const p = getProduct(id);
  if (!p) notFound();
  return <ProductDetailView p={p} />;
}
