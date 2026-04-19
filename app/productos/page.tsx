import { ProductListView } from "@/components/pages/ProductListView";

export const metadata = {
  title: "Productos — Farmacia Vázquez",
};

export default function ProductosPage() {
  return <ProductListView cat="all" />;
}
