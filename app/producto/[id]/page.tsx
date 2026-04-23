import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailView } from "@/components/pages/ProductDetailView";
import { ProductJsonLd } from "@/components/seo/ProductJsonLd";
import { getProduct, products } from "@/lib/data/products";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const p = getProduct(id);
  if (!p) return { title: "Producto" };
  const title = `${p.name} — ${p.brand}`;
  const description = p.short
    ? `${p.short} · ${p.brand} en Farmacia Vázquez.`
    : `${p.name} de ${p.brand} en Farmacia Vázquez. Envíos en el día.`;
  const url = `/producto/${p.id}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title,
      description,
      url,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const p = getProduct(id);
  if (!p) notFound();
  return (
    <>
      <ProductJsonLd product={p} />
      <ProductDetailView p={p} />
    </>
  );
}
