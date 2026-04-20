export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dni: string;
  memberSince: string;
}

export interface Address {
  id: string;
  label: string;
  name: string;
  street: string;
  unit?: string;
  city: string;
  province: string;
  zip: string;
  phone: string;
  isDefault: boolean;
}

export type OrderStatus = "en-camino" | "entregado" | "preparando" | "cancelado";

export interface OrderLine {
  productId: string;
  qty: number;
  priceAtPurchase: number;
}

export interface OrderSummary {
  id: string;
  placedAt: string;
  status: OrderStatus;
  lines: OrderLine[];
  shipping: number;
  total: number;
  shippingAddressId: string;
  eta?: string;
}
