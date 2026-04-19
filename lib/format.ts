export function fmtPrice(n: number): string {
  return "$" + n.toLocaleString("es-AR");
}
