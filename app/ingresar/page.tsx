import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginView } from "@/components/pages/LoginView";

export const metadata: Metadata = {
  title: "Ingresar",
  description: "Accedé a tu cuenta para finalizar compras, ver tus pedidos y guardar recetas.",
  alternates: { canonical: "/ingresar" },
  robots: { index: false, follow: false },
};

export default function IngresarPage() {
  return (
    <Suspense fallback={null}>
      <LoginView />
    </Suspense>
  );
}
