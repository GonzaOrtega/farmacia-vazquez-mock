/**
 * Happy-path E2E: catalog → detail → cart → login → checkout → success.
 *
 * This is the single journey that determines whether the site ships. If
 * this spec breaks, the product is broken regardless of what unit tests say.
 */
import { expect, test } from "@playwright/test";

test("home → product detail → add to cart → login → checkout success", async ({
  page,
}) => {
  // 1. Category page — jump straight to /productos/dermocosmetica where p1 lives
  await page.goto("/productos/dermocosmetica");
  await expect(
    page.getByRole("heading", { name: /dermocosmética/i }),
  ).toBeVisible();

  // 2. Click the first product card (ProductCardLink uses role=link + aria-label 'Ver producto <id>')
  await page.getByRole("link", { name: "Ver producto p1", exact: true }).click();
  await expect(page).toHaveURL(/\/producto\/p1/);

  // 3. Add to cart — BuyBlock's "Agregar al carrito" adds the item but does
  // NOT auto-open the drawer; the header's cart button does that.
  await page
    .getByRole("button", { name: /agregar al carrito/i })
    .first()
    .click();

  // 4. Open the cart via the header button (aria-label is "Carrito, N productos")
  await page
    .getByRole("button", { name: /^carrito, \d+ producto/i })
    .first()
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("link", { name: /finalizar compra/i }).click();

  // 5. Signed out → routed through /ingresar with next=/checkout
  await expect(page).toHaveURL(/\/ingresar\?next=/);

  // Demo credentials are pre-filled; just click "Ingresar" (the submit button)
  await page.getByRole("button", { name: /^ingresar$/i }).click();

  // 6. Post-login redirect lands on /checkout
  await expect(page).toHaveURL(/\/checkout/);
  await expect(
    page.getByRole("heading", { name: /finalizá tu compra/i }),
  ).toBeVisible();

  // 7. Switch to cash-in-store so we skip card-field validation
  await page.getByRole("radio", { name: /efectivo en sucursal/i }).click();

  // 8. Submit the order (defaults are all pre-filled from mockUser/mockAddresses)
  await page.getByRole("button", { name: /realizar pedido/i }).click();

  // 9. Success view appears after the 600ms settle
  await expect(page.getByRole("heading", { name: /¡listo!/i })).toBeVisible({
    timeout: 5_000,
  });
});
