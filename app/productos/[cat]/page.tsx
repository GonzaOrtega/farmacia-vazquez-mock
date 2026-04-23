import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductListView } from "@/components/pages/ProductListView";
import { categories, getCategory } from "@/lib/data/categories";

interface PageProps {
  params: Promise<{ cat: string }>;
}

export function generateStaticParams() {
  return categories.filter((c) => c.id !== "all").map((c) => ({ cat: c.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { cat } = await params;
  const c = getCategory(cat);
  if (!c) return { title: "Categoría" };
  const description = `${c.name} en Farmacia Vázquez — ${c.desc}. Envíos en el día en San Miguel.`;
  const url = `/productos/${c.id}`;
  return {
    title: c.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${c.name} — Farmacia Vázquez`,
      description,
      url,
    },
    twitter: { card: "summary_large_image", title: c.name, description },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { cat } = await params;
  if (!getCategory(cat)) notFound();
  return (
    <Suspense fallback={null}>
      <ProductListView cat={cat} />
    </Suspense>
  );
}
