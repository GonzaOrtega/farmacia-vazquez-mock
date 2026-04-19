import { notFound } from "next/navigation";
import { ProductListView } from "@/components/pages/ProductListView";
import { categories, getCategory } from "@/lib/data/categories";

interface PageProps {
  params: Promise<{ cat: string }>;
}

export function generateStaticParams() {
  return categories.filter((c) => c.id !== "all").map((c) => ({ cat: c.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { cat } = await params;
  const c = getCategory(cat);
  if (!c) return { title: "Categoría — Farmacia Vázquez" };
  return { title: `${c.name} — Farmacia Vázquez` };
}

export default async function CategoryPage({ params }: PageProps) {
  const { cat } = await params;
  if (!getCategory(cat)) notFound();
  return <ProductListView cat={cat} />;
}
