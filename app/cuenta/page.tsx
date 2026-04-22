import type { Metadata } from "next";
import { AccountView } from "@/components/pages/AccountView";

export const metadata: Metadata = {
  title: "Mi cuenta",
  description: "Gestioná tu perfil, pedidos, direcciones y recetas en Farmacia Vázquez.",
  alternates: { canonical: "/cuenta" },
  robots: { index: false, follow: false },
};

export default function CuentaPage() {
  return <AccountView />;
}
