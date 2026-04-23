/**
 * Tests for LoginView in components/pages/LoginView.tsx.
 *
 * Covers the auth-gate surface users actually interact with:
 *   - Tab defaults and keyboard-friendly switching
 *   - Validation errors on empty/bad input (blocks submit)
 *   - Successful login calls router.replace with the configured redirect
 *   - The ?next= query param overrides the default redirect target
 *
 * next/navigation is mocked at the module level via vi.hoisted so per-test
 * setup can mutate the searchParams and reset router spies between tests.
 * The component owns its own 400ms submit delay; tests use waitFor with a
 * generous timeout rather than fake timers (user-event + fake timers is
 * fragile — see ShareFilterButton tests for the history).
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginView } from "./LoginView";
import { renderWithProviders } from "@/test-utils/renderWithProviders";

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  push: vi.fn(),
  searchParams: { value: new URLSearchParams() },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mocks.replace,
    push: mocks.push,
    back: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => mocks.searchParams.value,
  usePathname: () => "/ingresar",
}));

describe("LoginView", () => {
  beforeEach(() => {
    mocks.replace.mockReset();
    mocks.push.mockReset();
    mocks.searchParams.value = new URLSearchParams();
  });

  it("renders the 'Ingresar' tab active with pre-filled demo credentials", () => {
    renderWithProviders(<LoginView />);
    const tab = screen.getByRole("tab", { name: /^ingresar$/i });
    expect(tab).toHaveAttribute("aria-selected", "true");
    const email = screen.getByLabelText("Email") as HTMLInputElement;
    // Demo mode pre-fills the mockUser email; we don't pin the exact value,
    // only that it's non-empty so the quick-start experience is preserved.
    expect(email.value.length).toBeGreaterThan(0);
  });

  it("switches to the 'Crear cuenta' tab and reveals signup-only fields", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginView />);
    await user.click(screen.getByRole("tab", { name: /crear cuenta/i }));
    expect(screen.getByLabelText("Nombre")).toBeInTheDocument();
    expect(screen.getByLabelText("Apellido")).toBeInTheDocument();
    expect(screen.getByLabelText("Repetí la contraseña")).toBeInTheDocument();
  });

  it("shows an inline error and does not redirect when email is empty", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginView />);
    const email = screen.getByLabelText("Email");
    await user.clear(email);
    await user.click(screen.getByRole("button", { name: /^ingresar$/i }));
    expect(await screen.findByText(/ingresá tu email/i)).toBeInTheDocument();
    expect(mocks.replace).not.toHaveBeenCalled();
  });

  it("redirects to /cuenta on successful login with demo credentials", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginView />);
    // email + password are pre-filled via defaultValue on the ingresar tab
    await user.click(screen.getByRole("button", { name: /^ingresar$/i }));
    await waitFor(
      () => expect(mocks.replace).toHaveBeenCalledWith("/cuenta"),
      { timeout: 1500 },
    );
  });

  it("honors the ?next= query param for the post-login redirect", async () => {
    mocks.searchParams.value = new URLSearchParams("next=/checkout");
    const user = userEvent.setup();
    renderWithProviders(<LoginView />);
    await user.click(screen.getByRole("button", { name: /^ingresar$/i }));
    await waitFor(
      () => expect(mocks.replace).toHaveBeenCalledWith("/checkout"),
      { timeout: 1500 },
    );
  });
});
