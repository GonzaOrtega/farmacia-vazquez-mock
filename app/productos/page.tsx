import type { Metadata } from "next";
import { ProductListView } from "@/components/pages/ProductListView";

export const metadata: Metadata = {
  title: "Productos",
  description:
    "Catálogo completo de Farmacia Vázquez: medicamentos, dermocosmética, perfumería, capilar, maquillaje, cuidado personal y bebé.",
  alternates: { canonical: "/productos" },
  openGraph: {
    title: "Catálogo de productos",
    description: "Explorá todo el catálogo de Farmacia Vázquez.",
    url: "/productos",
  },
};

export default function ProductosPage() {
  return <ProductListView cat="all" />;
}
