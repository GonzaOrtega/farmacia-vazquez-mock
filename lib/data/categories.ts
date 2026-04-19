import type { Category } from "@/types/product";

export const categories: Category[] = [
  { id: "all", name: "Todo", desc: "Todos los productos" },
  { id: "medicamentos", name: "Medicamentos", desc: "Con y sin receta" },
  { id: "dermocosmetica", name: "Dermocosmética", desc: "Rostro y cuerpo" },
  { id: "perfumeria", name: "Perfumería", desc: "Fragancias premium" },
  { id: "capilar", name: "Cuidado Capilar", desc: "Shampoo, tratamiento" },
  { id: "maquillaje", name: "Maquillaje", desc: "Rostro, labios, ojos" },
  { id: "personal", name: "Cuidado Personal", desc: "Higiene diaria" },
  { id: "bebe", name: "Bebé & Mamá", desc: "Productos para bebés" },
];

export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}
