import type { Product } from "@/types/product";

const BASE: Omit<Product, "short" | "long" | "ingredients" | "howTo" | "benefits" | "variants" | "warnings">[] = [
  { id: "p1", cat: "dermocosmetica", name: "Sérum Hidratante", brand: "VÁZQUEZ LAB", price: 12990, old: 16200, art: "bottle", cA: "#F4EEF7", cB: "#5C1A6E", tag: "20% OFF", rating: 4.8, reviews: 124, rx: false, stock: "En stock", size: "30 ml" },
  { id: "p2", cat: "capilar", name: "Shampoo Reparador", brand: "CAPILAR PRO", price: 8490, old: null, art: "bottle", cA: "#E8F4F8", cB: "#00A651", tag: null, rating: 4.6, reviews: 88, rx: false, stock: "En stock", size: "400 ml" },
  { id: "p3", cat: "maquillaje", name: "Labial Matte", brand: "BEAUTY 22", price: 5990, old: 7490, art: "tube", cA: "#FBEAF0", cB: "#C2185B", tag: "NUEVO", rating: 4.9, reviews: 212, rx: false, stock: "En stock", size: "4 g" },
  { id: "p4", cat: "medicamentos", name: "Ibuprofeno 400mg", brand: "GENÉRICO", price: 2450, old: null, art: "box", cA: "#EAF2F9", cB: "#1A4E8E", tag: null, rating: 4.7, reviews: 53, rx: false, stock: "En stock", size: "20 comp" },
  { id: "p5", cat: "dermocosmetica", name: "Protector Solar FPS 50+", brand: "DERMOCARE", price: 14900, old: 18600, art: "bottle", cA: "#FFF6E0", cB: "#B45309", tag: "20% OFF", rating: 4.9, reviews: 340, rx: false, stock: "En stock", size: "200 ml" },
  { id: "p6", cat: "personal", name: "Crema Corporal", brand: "HIDRABODY", price: 6790, old: null, art: "jar", cA: "#F4EEF7", cB: "#5C1A6E", tag: null, rating: 4.5, reviews: 64, rx: false, stock: "En stock", size: "400 ml" },
  { id: "p7", cat: "bebe", name: "Óleo Calcáreo", brand: "BEBÉ SUAVE", price: 3690, old: null, art: "bottle", cA: "#FBEAF0", cB: "#C2185B", tag: null, rating: 4.8, reviews: 27, rx: false, stock: "En stock", size: "250 ml" },
  { id: "p8", cat: "perfumeria", name: "Eau de Parfum", brand: "FLORÉ", price: 29900, old: 35800, art: "round", cA: "#F0E8EE", cB: "#5C1A6E", tag: "20% OFF", rating: 4.7, reviews: 96, rx: false, stock: "Últimas 3", size: "50 ml" },
  { id: "p9", cat: "capilar", name: "Mascarilla Nutritiva", brand: "CAPILAR PRO", price: 9990, old: null, art: "jar", cA: "#E8F6EE", cB: "#00A651", tag: "NUEVO", rating: 4.9, reviews: 41, rx: false, stock: "En stock", size: "250 ml" },
  { id: "p10", cat: "medicamentos", name: "Paracetamol 500mg", brand: "GENÉRICO", price: 1890, old: null, art: "box", cA: "#EAF2F9", cB: "#1A4E8E", tag: null, rating: 4.6, reviews: 120, rx: false, stock: "En stock", size: "30 comp" },
  { id: "p11", cat: "medicamentos", name: "Amoxicilina 500mg", brand: "GENÉRICO", price: 4290, old: null, art: "box", cA: "#EAF2F9", cB: "#1A4E8E", tag: null, rating: 4.8, reviews: 34, rx: true, stock: "Requiere receta", size: "16 cáps" },
  { id: "p12", cat: "dermocosmetica", name: "Contorno de Ojos", brand: "VÁZQUEZ LAB", price: 11490, old: null, art: "tube", cA: "#F4EEF7", cB: "#5C1A6E", tag: "NUEVO", rating: 4.8, reviews: 15, rx: false, stock: "En stock", size: "15 ml" },
];

type Extra = Pick<Product, "short" | "long" | "ingredients" | "howTo" | "benefits" | "variants" | "warnings">;

const EXTRA: Record<string, Extra> = {
  p1: {
    short: "Hidratación intensiva 24h con ácido hialurónico y vitamina B5.",
    long: "Sérum ligero formulado con ácido hialurónico de bajo peso molecular y vitamina B5. Penetra rápido, deja la piel luminosa y preparada para recibir tu hidratante. Testado bajo control dermatológico — apto pieles sensibles.",
    ingredients: ["Ácido hialurónico", "Vitamina B5 (Pantenol)", "Niacinamida 4%", "Glicerina vegetal"],
    howTo: "Aplicá 3-4 gotas sobre piel limpia, mañana y noche. Seguí con tu hidratante habitual.",
    benefits: ["Hidrata por 24 horas", "Reduce aspecto de líneas finas", "Apto piel sensible"],
    variants: [{ size: "30 ml", price: 12990 }, { size: "50 ml", price: 19900 }],
  },
  p2: {
    short: "Shampoo reparador para cabellos dañados con queratina y aceite de argán.",
    long: "Repara la fibra capilar desde el primer uso. Sin sulfatos agresivos, pH balanceado.",
    ingredients: ["Queratina hidrolizada", "Aceite de argán", "Pantenol"],
    howTo: "Masajeá sobre cabello mojado, dejá actuar 2 minutos y enjuagá.",
    benefits: ["Repara puntas", "Aporta brillo", "Sin sulfatos agresivos"],
    variants: [{ size: "400 ml", price: 8490 }],
  },
  p3: {
    short: "Labial de terminación matte, alta pigmentación, larga duración.",
    long: "Fórmula con cera de candelilla que desliza como bálsamo y seca a un matte suave.",
    ingredients: ["Cera de candelilla", "Vitamina E", "Aceite de jojoba"],
    howTo: "Aplicá desde el centro hacia afuera. Retocá según necesidad.",
    benefits: ["12 horas de duración", "Alta pigmentación", "No reseca"],
    variants: [
      { size: "Rojo clásico", price: 5990 },
      { size: "Nude rosado", price: 5990 },
      { size: "Vino", price: 5990 },
    ],
  },
  p4: {
    short: "Antiinflamatorio y analgésico. Venta libre.",
    long: "Ibuprofeno 400mg en comprimidos recubiertos. Alivia dolores musculares, de cabeza, menstruales y fiebre.",
    ingredients: ["Ibuprofeno 400mg"],
    howTo: "1 comprimido cada 6-8 horas con las comidas. No exceder 1200mg/día.",
    benefits: ["Alivio rápido", "Antiinflamatorio", "Antipirético"],
    variants: [{ size: "10 comp", price: 1490 }, { size: "20 comp", price: 2450 }, { size: "30 comp", price: 3290 }],
    warnings: "Consultá al médico si el dolor persiste más de 3 días. No apto durante el embarazo.",
  },
  p5: {
    short: "Protector solar de amplio espectro FPS 50+ con textura ultra-liviana.",
    long: "Protección UVA+UVB+IR con textura fluida que no deja efecto blanco. Resistente al agua y al sudor hasta 80 minutos.",
    ingredients: ["Filtros UVA/UVB", "Vitamina E", "Niacinamida"],
    howTo: "Aplicá 15 minutos antes de la exposición solar. Reaplicá cada 2 horas.",
    benefits: ["FPS 50+ / PA++++", "Resistente al agua", "Textura fluida no grasa"],
    variants: [{ size: "100 ml", price: 8900 }, { size: "200 ml", price: 14900 }],
  },
  p6: {
    short: "Hidratación corporal para piel seca con manteca de karité.",
    long: "Fórmula rica que absorbe rápido. No deja residuo graso.",
    ingredients: ["Manteca de karité", "Aceite de almendras", "Glicerina"],
    howTo: "Aplicá tras la ducha con piel aún húmeda.",
    benefits: ["Hidrata 48 horas", "No graso", "Apto todo tipo de piel"],
    variants: [{ size: "400 ml", price: 6790 }],
  },
  p7: {
    short: "Óleo calcáreo hipoalergénico para higiene del bebé.",
    long: "Suave y efectivo para limpiar la zona del pañal. Sin perfume ni colorantes.",
    ingredients: ["Aceite mineral", "Carbonato de calcio"],
    howTo: "Aplicá en algodón o toallitas. No requiere enjuague.",
    benefits: ["Hipoalergénico", "Sin fragancia", "Uso dermatológico"],
    variants: [{ size: "250 ml", price: 3690 }, { size: "500 ml", price: 6490 }],
  },
  p8: {
    short: "Eau de parfum floral-amaderada. Estela larga y envolvente.",
    long: "Notas de salida cítricas que abren paso a un corazón floral de jazmín y peonía, sobre fondo de sándalo y almizcle.",
    ingredients: ["Alcohol", "Fragancia"],
    howTo: "Aplicá en puntos de pulso: muñecas, cuello, detrás de las orejas.",
    benefits: ["Estela 8 horas", "Sillage medio", "Unisex"],
    variants: [{ size: "30 ml", price: 19900 }, { size: "50 ml", price: 29900 }, { size: "100 ml", price: 44900 }],
  },
  p9: {
    short: "Mascarilla semanal nutritiva para cabello seco y dañado.",
    long: "Tratamiento intensivo para cabellos castigados por calor, químicos o sol.",
    ingredients: ["Manteca de karité", "Aceite de coco", "Proteína de seda"],
    howTo: "Aplicá 1 vez por semana, dejá actuar 10 minutos.",
    benefits: ["Nutrición profunda", "Sella cutícula", "Brillo intenso"],
    variants: [{ size: "250 ml", price: 9990 }],
  },
  p10: {
    short: "Analgésico y antipirético. Venta libre.",
    long: "Paracetamol 500mg. Alivia dolores leves a moderados y reduce la fiebre.",
    ingredients: ["Paracetamol 500mg"],
    howTo: "1-2 comprimidos cada 4-6 horas. No exceder 4g/día.",
    benefits: ["Alivio del dolor", "Reduce la fiebre", "Bien tolerado"],
    variants: [{ size: "20 comp", price: 1290 }, { size: "30 comp", price: 1890 }],
  },
  p11: {
    short: "Antibiótico de amplio espectro. Requiere receta.",
    long: "Amoxicilina 500mg en cápsulas. Prescripción médica obligatoria.",
    ingredients: ["Amoxicilina 500mg"],
    howTo: "Según indicación médica.",
    benefits: ["Antibiótico de amplio espectro"],
    variants: [{ size: "16 cáps", price: 4290 }],
    warnings: "Requiere receta médica archivada. Completar el tratamiento indicado.",
  },
  p12: {
    short: "Contorno de ojos antifatiga con cafeína y péptidos.",
    long: "Textura ligera que descongestiona la mirada y reduce el aspecto de ojeras.",
    ingredients: ["Cafeína 3%", "Péptidos", "Ácido hialurónico"],
    howTo: "Aplicá con golpes suaves con la yema del dedo anular.",
    benefits: ["Reduce ojeras", "Descongestiona", "Textura ultraligera"],
    variants: [{ size: "15 ml", price: 11490 }],
  },
};

export const products: Product[] = BASE.map((p) => ({ ...p, ...(EXTRA[p.id] ?? {}) }));

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function productsByCategory(cat: string): Product[] {
  return cat === "all" ? products : products.filter((p) => p.cat === cat);
}
