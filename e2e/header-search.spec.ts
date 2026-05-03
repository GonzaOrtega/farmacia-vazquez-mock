/**
 * E2E for the header search combobox. Three flows the unit tests cannot
 * verify end-to-end:
 *   1. Typing opens a typeahead listbox; clicking a suggestion lands on the
 *      product detail page.
 *   2. Submitting (Enter) from any page navigates to /productos?q=… with
 *      the catalog actually filtered.
 *   3. Deep-linking /productos?q=… hydrates both the input and the grid.
 *
 * The desktop HeaderSearch is the first match in DOM order; the mobile
 * variant is rendered behind a Tailwind `md:hidden` wrapper. On the
 * Desktop Chrome project, .first() picks the visible desktop input.
 */
import { expect, test, type Page } from "@playwright/test";

function searchInput(page: Page) {
  return page.getByRole("combobox", { name: /buscar productos/i }).first();
}

test("typing opens the listbox and selecting a suggestion routes to the product", async ({
  page,
}) => {
  await page.goto("/");
  await searchInput(page).fill("ibu");

  // Listbox appears with at least one matching option (p4 — Ibuprofeno 400mg)
  await expect(page.getByRole("listbox")).toBeVisible();
  const option = page.getByRole("option", { name: /ibuprofeno/i }).first();
  await expect(option).toBeVisible();
  await option.click();

  await expect(page).toHaveURL(/\/producto\/p4/);
});

test("submitting from the header lands on /productos?q=… with the grid filtered", async ({
  page,
}) => {
  await page.goto("/");
  await searchInput(page).fill("protector");
  await searchInput(page).press("Enter");

  await expect(page).toHaveURL(/\/productos\?q=protector/);

  // p5 (Protector Solar) matches; p1 (Sérum Hidratante) doesn't
  await expect(page.getByRole("link", { name: "Ver producto p5" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Ver producto p1" })).toHaveCount(0);
});

test("deep-linking /productos?q=… hydrates the input and filters the grid", async ({
  page,
}) => {
  await page.goto("/productos?q=protector");

  await expect(searchInput(page)).toHaveValue("protector");
  await expect(page.getByRole("link", { name: "Ver producto p5" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Ver producto p4" })).toHaveCount(0);
});
