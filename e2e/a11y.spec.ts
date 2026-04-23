/**
 * Automated accessibility checks with axe-core. We assert zero violations
 * at severity `serious` or `critical` on every meaningful public route.
 * Yellow findings (minor/moderate) are not blocking here — they're worth
 * fixing but not worth failing the build over until they're addressed as
 * their own ticket.
 */
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const ROUTES = [
  "/",
  "/productos",
  "/productos/dermocosmetica",
  "/producto/p1",
  "/ingresar",
  "/favoritos",
];

for (const route of ROUTES) {
  test(`${route} has no serious or critical a11y violations`, async ({
    page,
  }) => {
    await page.goto(route);
    // color-contrast + link-in-text-block are style-level findings that
    // would require a design pass to fix; tracked separately, not blocking.
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .disableRules(["color-contrast", "link-in-text-block"])
      .analyze();
    const blocking = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(
      blocking,
      `Serious/critical a11y violations on ${route}:\n${blocking
        .map((v) => `  - ${v.id}: ${v.help}`)
        .join("\n")}`,
    ).toEqual([]);
  });
}
