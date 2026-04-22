import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Página no encontrada",
  description: "La página que buscás no está disponible.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="px-4 py-16 md:px-12 md:py-24 text-center min-h-[400px]">
      <div
        className="pro-serif text-[40px] md:text-[64px] leading-[1.05]"
        style={{ color: "#1A1320" }}
      >
        Página no encontrada
      </div>
      <p className="mt-3" style={{ color: "#4A3D54" }}>
        El link al que accediste no está disponible.
      </p>
      <div className="mt-6 flex justify-center gap-2.5 flex-wrap">
        <Link href="/" className="pro-btn pro-btn-primary no-underline">
          Volver al inicio
        </Link>
        <Link href="/productos" className="pro-btn pro-btn-secondary no-underline">
          Ver catálogo
        </Link>
      </div>
    </section>
  );
}
