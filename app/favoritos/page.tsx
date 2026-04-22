import type { Metadata } from "next";
import { FavoritesView } from "@/components/pages/FavoritesView";

export const metadata: Metadata = {
  title: "Favoritos",
  description: "Tus productos guardados en Farmacia Vázquez.",
  alternates: { canonical: "/favoritos" },
};

export default function FavoritosPage() {
  return <FavoritesView />;
}
