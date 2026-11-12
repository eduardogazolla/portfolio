import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PAGES = ["/", "/projects", "/projects/hour-sync", "/nao-existe"];
const TAGS = ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"];

for (const path of PAGES) {
  test(`axe: no WCAG A/AA violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    // Let the hero intro finish so axe does not read mid-animation colours.
    await expect(page.locator("html")).not.toHaveAttribute("data-intro", /.*/, { timeout: 10_000 });

    const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    expect(
      results.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => n.target) })),
    ).toEqual([]);
  });
}

const WIDTHS = [360, 390, 768, 1024, 1440, 1920];

for (const path of PAGES) {
  test(`no horizontal scroll on ${path} at ${WIDTHS.join(", ")} px`, async ({ page }) => {
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth, `${path} at ${width}px`).toBe(clientWidth);
    }
  });
}
