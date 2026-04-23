/**
 * Tests for CheckoutView in components/pages/CheckoutView.tsx.
 *
 * CheckoutView is a router — it picks between 'verifying', 'empty',
 * 'form', and 'success' based on auth + cart state. These tests mount
 * the full view with seeded providers and verify each branch renders
 * the right child. The final test drives the full happy-path submit
 * through CheckoutForm (payment mode switched to 'efectivo' to skip
 * card-field validation) and verifies the success view appears after
 * the 600ms settle.
 *
 * next/navigation is mocked so useRequireAuth's redirect is observable
 * as a router.replace call rather than an actual navigation.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CheckoutView } from "./CheckoutView";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import type { AuthUser } from "@/types/user";

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  push: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mocks.replace,
    push: mocks.push,
    back: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/checkout",
}));

const authedUser: AuthUser = {
  firstName: "Gonzalo",
  lastName: "Ortega",
  email: "go@example.com",
  memberSince: "Abril de 2026",
};

describe("CheckoutView", () => {
  beforeEach(() => {
    mocks.replace.mockReset();
    mocks.push.mockReset();
  });

  it("shows 'Verificando tu sesión' and redirects when signed out", async () => {
    renderWithProviders(<CheckoutView />);
    expect(screen.getByText(/verificando tu sesión/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(mocks.replace).toHaveBeenCalledWith(
        "/ingresar?next=%2Fcheckout",
      );
    });
  });

  it("shows the empty-cart state when signed in but cart has no items", async () => {
    renderWithProviders(<CheckoutView />, { auth: authedUser });
    // Empty-state title is rendered as a styled div, not an <h1> — use getByText.
    expect(
      await screen.findByText(/no hay nada para pagar/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /ver el catálogo/i }),
    ).toBeInTheDocument();
  });

  it("renders the checkout form + order summary when signed in with items", async () => {
    renderWithProviders(<CheckoutView />, {
      auth: authedUser,
      cart: [{ id: "p1", qty: 1 }],
    });
    expect(
      await screen.findByRole("button", { name: /realizar pedido/i }),
    ).toBeInTheDocument();
    // OrderSummary renders the seeded product (p1 = "Sérum Hidratante")
    expect(screen.getByText(/sérum hidratante/i)).toBeInTheDocument();
  });

  it("submits successfully (efectivo pay mode) and shows the success view", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CheckoutView />, {
      auth: authedUser,
      cart: [{ id: "p1", qty: 1 }],
    });
    await screen.findByRole("button", { name: /realizar pedido/i });
    // PayOption is a role="radio" button inside a role="radiogroup"; switching
    // to cash-in-store unmounts the card fields so their validation is skipped.
    await user.click(
      screen.getByRole("radio", { name: /efectivo en sucursal/i }),
    );
    await user.click(
      screen.getByRole("button", { name: /realizar pedido/i }),
    );
    // handleSubmit has a 600ms setTimeout before success state is set
    await waitFor(
      () =>
        expect(
          screen.getByRole("heading", { name: /¡listo!/i }),
        ).toBeInTheDocument(),
      { timeout: 2000 },
    );
  });
});
