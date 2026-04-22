import type { Metadata } from "next";
import { CheckoutView } from "@/components/pages/CheckoutView";

export const metadata: Metadata = {
  title: "Finalizar compra",
  description: "Completá tu pedido en Farmacia Vázquez.",
  alternates: { canonical: "/checkout" },
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
