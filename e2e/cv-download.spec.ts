import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";

const trigger = (scope: Page | Locator, name = "Baixar currículo") => scope.getByRole("button", { name, exact: true });

const waitForIntro = (page: Page) =>
  expect(page.locator("html")).not.toHaveAttribute("data-intro", /.*/, { timeout: 10_000 });

const PLACES = [
  ["hero", (page: Page) => page.locator("[data-hero=actions]")],
  ["contact", (page: Page) => page.locator("#contact")],
  ["footer", (page: Page) => page.locator("footer")],
] as const;

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await waitForIntro(page);
});

for (const [place, scopeOf] of PLACES) {
  test(`${place}: lists the PT CVs and each one downloads`, async ({ page }) => {
    const scope = scopeOf(page);
    const button = trigger(scope);
    await button.scrollIntoViewIfNeeded();
    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true");

    for (const [name, file] of [
      ["Currículo QA (PDF)", "eduardo-gazolla-cv-qa-pt.pdf"],
      ["Currículo Java (PDF)", "eduardo-gazolla-cv-java-pt.pdf"],
    ]) {
      const link = scope.getByRole("link", { name });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", `/cv/${file}`);

      // The file is served as a PDF.
      const response = await page.request.get(`/cv/${file}`);
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toContain("application/pdf");
    }

    // Choosing a version downloads it and closes the list.
    const download = page.waitForEvent("download");
    await scope.getByRole("link", { name: "Currículo QA (PDF)" }).click();
    expect((await download).suggestedFilename()).toBe("eduardo-gazolla-cv-qa-pt.pdf");
    await expect(button).toHaveAttribute("aria-expanded", "false");
  });
}

test("keyboard: opens with Enter, Escape closes and returns focus", async ({ page }) => {
  const button = trigger(page.locator("[data-hero=actions]"));
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Currículo QA (PDF)" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await expect(button).toBeFocused();
});

test("in EN only the EN CVs are offered", async ({ page }) => {
  await page.getByRole("group", { name: /^(Idioma|Language)$/ }).first().getByRole("button", { name: "EN", exact: true }).click();
  const scope = page.locator("[data-hero=actions]");
  await trigger(scope, "Download CV").click();

  await expect(scope.getByRole("link", { name: "QA CV (PDF)" })).toHaveAttribute("href", "/cv/eduardo-gazolla-cv-qa-en.pdf");
  await expect(scope.getByRole("link", { name: "Java CV (PDF)" })).toHaveAttribute("href", "/cv/eduardo-gazolla-cv-java-en.pdf");
  await expect(scope.getByRole("link", { name: /Currículo/ })).toHaveCount(0);
});

test("axe: no WCAG A/AA violations with the CV list open", async ({ page }) => {
  await trigger(page.locator("[data-hero=actions]")).click();
  const results = await new AxeBuilder({ page })
    .include("[data-hero=actions]")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) }))).toEqual([]);
});
