import type { Review } from "@/types/product";

const REVIEWS: Record<string, Review[]> = {
  p1: [
    { id: 1, name: "Laura F.", rating: 5, date: "hace 2 semanas", verified: true, title: "La piel quedó hermosa", body: "Lo uso hace 3 meses y noto la piel muchísimo más hidratada. La textura es liviana, absorbe rapidísimo. Volveré a comprar." },
    { id: 2, name: "Julia M.", rating: 5, date: "hace 1 mes", verified: true, title: "Excelente", body: "Mejor sérum que probé en años. Se nota la diferencia desde la primera semana." },
    { id: 3, name: "Ana R.", rating: 4, date: "hace 2 meses", verified: true, title: "Muy bueno", body: "Lo esperaba un poquito más hidratante pero es muy bueno igual. Con el contorno del mismo laboratorio funciona genial." },
  ],
  p5: [
    { id: 1, name: "Mariana P.", rating: 5, date: "hace 1 semana", verified: true, title: "No deja blanco", body: "Probé muchos y este es el único que realmente no deja efecto blanco. Para la playa, ideal." },
    { id: 2, name: "Carlos D.", rating: 5, date: "hace 2 semanas", verified: true, title: "Lo recomiendo", body: "FPS 50 real, no sentís nada cuando lo aplicás. Dura todo el día." },
  ],
  p11: [
    { id: 1, name: "Dr. Alonso", rating: 5, date: "hace 3 semanas", verified: true, title: "Atención excelente", body: "La farmacéutica revisó la receta rápido y lo mandaron el mismo día. Gran servicio." },
  ],
};

const FALLBACK: Review[] = [
  { id: 1, name: "Cliente verificado", rating: 5, date: "hace 2 semanas", verified: true, title: "Muy buen producto", body: "Cumple con lo que promete. Llegó rápido y bien embalado." },
  { id: 2, name: "Cliente verificado", rating: 4, date: "hace 1 mes", verified: true, title: "Recomendado", body: "La relación calidad-precio es muy buena. Volvería a comprar." },
];

export function getReviewsFor(pid: string): Review[] {
  return REVIEWS[pid] ?? FALLBACK;
}
