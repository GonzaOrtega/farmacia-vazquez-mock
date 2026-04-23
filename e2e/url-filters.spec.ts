/**
 * E2E proof that filter state survives a reload and a category switch, both
 * of which the unit tests can only check indirectly. Uses the toolbar
 * chips (En oferta / En stock / Sin receta) which are exposed at the
 * top level of ProductListView — simpler to drive than the drawer.
 */
import { expect, test } from "@playwright/test";

test("filter state persists via the URL across reload and category switch", async ({
  page,
}) => {
  await page.goto("/productos/medicamentos");

  // Toggle the "En oferta" chip — state change syncs to URL after 150ms debounce
  await page.getByRole("button", { name: /^en oferta$/i }).click();
  await expect(page).toHaveURL(/\/productos\/medicamentos\?onSale=1/, {
    timeout: 2_000,
  });

  // Reload: the URL param should still apply → "Limpiar todo" chip-row visible
  await page.reload();
  await expect(page).toHaveURL(/\/productos\/medicamentos\?onSale=1/);
  await expect(
    page.getByRole("button", { name: /limpiar todo/i }),
  ).toBeVisible();

  // Switch to Dermocosmética — sticky category chip inside main (header and
  // footer also have "Dermocosmética" links, so scope to main to disambiguate)
  await page
    .locator("#main")
    .getByRole("link", { name: /^dermocosmética$/i })
    .click();
  await expect(page).toHaveURL(/\/productos\/dermocosmetica\?onSale=1/);

  // Clear filters: URL collapses back to the clean category path
  await page.getByRole("button", { name: /limpiar todo/i }).click();
  await expect(page).toHaveURL(/\/productos\/dermocosmetica(?:$|[^?])/, {
    timeout: 2_000,
  });
});

test("deep-linked filter URL hydrates state on first paint", async ({
  page,
}) => {
  await page.goto("/productos/all?sort=price-asc&onSale=1");
  // "Limpiar todo" only renders when activeCount > 0 — confirms state hydrated
  await expect(
    page.getByRole("button", { name: /limpiar todo/i }),
  ).toBeVisible();
  // Sort select should reflect the URL param
  await expect(page.getByLabel(/ordenar por/i)).toHaveValue("price-asc");
});
