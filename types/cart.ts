export interface CartItem {
  id: string;
  qty: number;
}

export interface CartState {
  items: CartItem[];
  count: number;
  subtotal: number;
  open: boolean;
  bump: number;
  add: (id: string) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  setOpen: (open: boolean) => void;
}
