export type PromoStyle = "editorial" | "dark-cuotas" | "delivery" | "routine" | "seasonal" | "club";

export interface PromoBadge {
  text: string;
  note: string;
}

export interface PromoBanner {
  id: string;
  eyebrow: string;
  badge: PromoBadge | null;
  title: [string, string, string?];
  body: string;
  ctaA: string;
  ctaB: string;
  bg: string;
  ink: string;
  accent: string;
  muted: string;
  productIdxs: number[];
  style: PromoStyle;
}

export const promoBanners: PromoBanner[] = [
  {
    id: "madre",
    eyebrow: "Semana de la Madre",
    badge: null,
    title: ["Hasta ", "20% off", "en dermocosmética."],
    body: "Del 10 al 20 de octubre. Las mejores marcas con descuentos exclusivos, y hasta 3 cuotas sin interés.",
    ctaA: "Ver la selección",
    ctaB: "Términos y condiciones",
    bg: "#F4EEF7",
    ink: "#1A1320",
    accent: "#5C1A6E",
    muted: "#4A3D54",
    productIdxs: [0, 4, 11],
    style: "editorial",
  },
  {
    id: "cuotas",
    eyebrow: "Medios de pago",
    badge: { text: "3×", note: "sin interés" },
    title: ["Llevá lo que necesitás, ", "pagalo en 3 cuotas", "sin interés."],
    body: "Con todas las tarjetas de crédito. Válido en la web y en la farmacia. Monto mínimo $8.000.",
    ctaA: "Comprar ahora",
    ctaB: "Ver bancos adheridos",
    bg: "#1A1320",
    ink: "#fff",
    accent: "#CDDC39",
    muted: "rgba(255,255,255,0.72)",
    productIdxs: [2, 7, 10],
    style: "dark-cuotas",
  },
  {
    id: "envio",
    eyebrow: "Envíos",
    badge: null,
    title: ["Envío ", "gratis", "en compras desde $15.000."],
    body: "Llegamos a San Miguel, Bella Vista, Muñiz y José C. Paz en menos de 90 minutos. Sin costo.",
    ctaA: "Comprar en la zona",
    ctaB: "Ver área de cobertura",
    bg: "#E8F6EE",
    ink: "#0E3B22",
    accent: "#046B3A",
    muted: "#2F5B43",
    productIdxs: [],
    style: "delivery",
  },
  {
    id: "skincare",
    eyebrow: "Skincare routine",
    badge: null,
    title: ["Construí tu ", "rutina ideal", "con 15% off."],
    body: "Limpiador + sérum + hidratante + protector solar. Combiná 4 productos y te llevás el descuento.",
    ctaA: "Armar mi rutina",
    ctaB: "Asesoramiento gratis",
    bg: "#FBF7F3",
    ink: "#1A1320",
    accent: "#C2185B",
    muted: "#4A3D54",
    productIdxs: [1, 5, 8, 3],
    style: "routine",
  },
  {
    id: "fiebre",
    eyebrow: "Temporada de frío",
    badge: null,
    title: ["Botiquín listo para ", "el invierno."],
    body: "Paracetamol, ibuprofeno, vitaminas y lo esencial para resfríos. Precios cuidados toda la temporada.",
    ctaA: "Ver botiquín",
    ctaB: "Consultar con farmacéutica",
    bg: "#EAF2F9",
    ink: "#0C2E4E",
    accent: "#1A4E8E",
    muted: "#2B4E70",
    productIdxs: [6, 9],
    style: "seasonal",
  },
  {
    id: "club",
    eyebrow: "Club Vázquez",
    badge: { text: "-10%", note: "siempre" },
    title: ["Sumate al ", "Club Vázquez", "y ahorrá todo el año."],
    body: "Descuentos exclusivos, envío gratis en tu primer pedido y prioridad en ofertas. Gratis para vecinos.",
    ctaA: "Crear mi cuenta",
    ctaB: "Conocer beneficios",
    bg: "linear-gradient(135deg, #5C1A6E 0%, #7B2D8E 60%, #C2185B 100%)",
    ink: "#fff",
    accent: "#CDDC39",
    muted: "rgba(255,255,255,0.78)",
    productIdxs: [],
    style: "club",
  },
];
