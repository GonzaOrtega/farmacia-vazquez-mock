/**
 * Tests for CartDrawer in components/cart/CartDrawer.tsx.
 *
 * The drawer renders only when `cart.open === true`. To open it from inside
 * the provider tree we mount a small `OpenCart` harness that calls
 * `cart.setOpen(true)` in an effect. localStorage seeds cart and auth state
 * for each test (cleared by the global vitest setup between tests).
 *
 * Covered:
 *   - Closed state → nothing rendered
 *   - Empty cart → empty-cart message
 *   - Seeded items → item list with qty controls
 *   - '+' button increments qty
 *   - ESC key closes the drawer
 *   - Finalizar compra href depends on auth
 *
 * What would break these tests: renaming 'Finalizar compra', changing the
 * localStorage key shape, or removing the aria-label on the +/- buttons.
 */
import { useEffect } from "react";
import { describe, expect, it } from "vitest";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartDrawer } from "./CartDrawer";
import { useCart } from "./useCart";
import { renderWithProviders } from "@/test-utils/renderWithProviders";

// Harness that flips cart.open to true after mount so the drawer renders.
function OpenCart() {
  const cart = useCart();
  useEffect(() => {
    cart.setOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);
  return <CartDrawer />;
}

describe("CartDrawer", () => {
  it("renders nothing when cart.open is false", () => {
    renderWithProviders(<CartDrawer />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("shows the empty-cart message when opened with no items", async () => {
    renderWithProviders(<OpenCart />);
    await screen.findByRole("dialog");
    expect(screen.getByText(/tu carrito está vacío/i)).toBeInTheDocument();
  });

  it("renders seeded items with +/- controls", async () => {
    // p1 in the product data is "Sérum Hidratante" by VÁZQUEZ LAB.
    renderWithProviders(<OpenCart />, { cart: [{ id: "p1", qty: 2 }] });
    await screen.findByRole("dialog");
    expect(screen.getByText(/sérum hidratante/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Sumar")).toBeInTheDocument();
    expect(screen.getByLabelText("Restar")).toBeInTheDocument();
  });

  it("increments the item quantity when '+' is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<OpenCart />, { cart: [{ id: "p1", qty: 2 }] });
    await screen.findByRole("dialog");
    await user.click(screen.getByLabelText("Sumar"));
    // Qty renders as bare text content "{it.qty}" in a span; after increment → "3"
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("closes the drawer when the Escape key is pressed", async () => {
    renderWithProviders(<OpenCart />);
    await screen.findByRole("dialog");
    fireEvent.keyDown(window, { key: "Escape" });
    await act(async () => {
      await Promise.resolve();
    });
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });

  it("'Finalizar compra' points to /checkout when a user is signed in", async () => {
    renderWithProviders(
      <OpenCart />,
      {
        cart: [{ id: "p1", qty: 1 }],
        auth: {
          firstName: "Gonzalo",
          lastName: "Ortega",
          email: "go@example.com",
          memberSince: "Abril de 2026",
        },
      },
    );
    await screen.findByRole("dialog");
    const link = screen.getByRole("link", { name: /finalizar compra/i });
    expect(link).toHaveAttribute("href", "/checkout");
  });

  it("'Finalizar compra' routes through /ingresar when signed out", async () => {
    renderWithProviders(<OpenCart />, { cart: [{ id: "p1", qty: 1 }] });
    await screen.findByRole("dialog");
    const link = screen.getByRole("link", { name: /finalizar compra/i });
    expect(link).toHaveAttribute("href", "/ingresar?next=%2Fcheckout");
  });
});
