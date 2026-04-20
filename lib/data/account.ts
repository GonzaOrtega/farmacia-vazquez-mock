import type { Address, OrderSummary, User } from "@/types/user";

export const mockUser: User = {
  firstName: "Camila",
  lastName: "Fernández",
  email: "camila.fernandez@correo.com.ar",
  phone: "+54 9 11 5678-9012",
  dni: "38.421.907",
  memberSince: "Marzo 2024",
};

export const mockAddresses: Address[] = [
  {
    id: "addr-1",
    label: "Casa",
    name: "Camila Fernández",
    street: "Av. Presidente Perón 1532",
    unit: "3º B",
    city: "San Miguel",
    province: "Buenos Aires",
    zip: "1663",
    phone: "+54 9 11 5678-9012",
    isDefault: true,
  },
  {
    id: "addr-2",
    label: "Trabajo",
    name: "Camila Fernández",
    street: "Av. Santa Fe 2840",
    unit: "Piso 7",
    city: "CABA",
    province: "Ciudad Autónoma de Buenos Aires",
    zip: "1425",
    phone: "+54 9 11 5678-9012",
    isDefault: false,
  },
];

export const mockOrders: OrderSummary[] = [
  {
    id: "FV-2026-00184",
    placedAt: "2026-04-14",
    status: "en-camino",
    lines: [
      { productId: "p5", qty: 1, priceAtPurchase: 14900 },
      { productId: "p1", qty: 2, priceAtPurchase: 12990 },
    ],
    shipping: 0,
    total: 40880,
    shippingAddressId: "addr-1",
    eta: "2026-04-21",
  },
  {
    id: "FV-2026-00142",
    placedAt: "2026-03-28",
    status: "entregado",
    lines: [
      { productId: "p10", qty: 2, priceAtPurchase: 1890 },
      { productId: "p4", qty: 1, priceAtPurchase: 2450 },
      { productId: "p6", qty: 1, priceAtPurchase: 6790 },
    ],
    shipping: 1200,
    total: 14220,
    shippingAddressId: "addr-1",
  },
  {
    id: "FV-2026-00097",
    placedAt: "2026-02-11",
    status: "entregado",
    lines: [
      { productId: "p8", qty: 1, priceAtPurchase: 29900 },
      { productId: "p3", qty: 1, priceAtPurchase: 5990 },
    ],
    shipping: 0,
    total: 35890,
    shippingAddressId: "addr-2",
  },
];

export function statusLabel(s: OrderSummary["status"]): string {
  switch (s) {
    case "en-camino":
      return "En camino";
    case "entregado":
      return "Entregado";
    case "preparando":
      return "Preparando";
    case "cancelado":
      return "Cancelado";
  }
}

export function statusColors(s: OrderSummary["status"]): { bg: string; fg: string } {
  switch (s) {
    case "en-camino":
      return { bg: "#EAF2F9", fg: "#1A4E8E" };
    case "entregado":
      return { bg: "#E8F6EE", fg: "#046B3A" };
    case "preparando":
      return { bg: "#FFF6E0", fg: "#B45309" };
    case "cancelado":
      return { bg: "#FBEAF0", fg: "#C2185B" };
  }
}

export function fmtDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" });
}
