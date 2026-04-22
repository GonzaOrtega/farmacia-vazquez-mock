import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { FavoritesProvider } from "@/components/favorites/FavoritesProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileTabBar } from "@/components/layout/MobileTabBar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://farmacia-vazquez.example";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Farmacia Vázquez — Tu farmacia de confianza en San Miguel",
    template: "%s — Farmacia Vázquez",
  },
  description:
    "Medicamentos, dermocosmética, perfumería y cuidado personal. Envíos en el día en San Miguel. Farmacéuticos matriculados.",
  applicationName: "Farmacia Vázquez",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "/",
    siteName: "Farmacia Vázquez",
    title: "Farmacia Vázquez — Tu farmacia de confianza en San Miguel",
    description:
      "Medicamentos, dermocosmética, perfumería y cuidado personal. Envíos en el día en San Miguel.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Farmacia Vázquez",
    description:
      "Medicamentos, dermocosmética, perfumería y cuidado personal en San Miguel.",
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${instrumentSerif.variable} antialiased`}>
      <body className="min-h-screen flex flex-col">
        <a href="#main" className="pro-skip">
          Saltar al contenido
        </a>
        <CartProvider>
          <FavoritesProvider>
            <Header />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
            <MobileTabBar />
            <CartDrawer />
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}
