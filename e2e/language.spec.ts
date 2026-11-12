import { expect, test, type Page } from "@playwright/test";
import { en, pt } from "./strings";

const html = (page: Page) => page.locator("html");
const toggle = (page: Page, label: "PT" | "EN") =>
  page
    .getByRole("group", { name: /^(Idioma|Language)$/ })
    .first()
    .getByRole("button", { name: label, exact: true });

const firstProjectPath = async (page: Page) => {
  await page.goto("/projects");
  const href = await page.getByRole("link", { name: pt.projectsSection.viewProject }).first().getAttribute("href");
  expect(href).toMatch(/^\/projects\/.+/);
  return href as string;
};

const pages: [string, (page: Page) => Promise<string>][] = [
  ["Home", async () => "/"],
  ["projects list", async () => "/projects"],
  ["project detail", firstProjectPath],
];

for (const [name, resolvePath] of pages) {
  test(`toggles PT/EN on ${name} and keeps the choice after reload`, async ({ page }) => {
    const path = await resolvePath(page);
    await page.goto(path);
    await expect(html(page)).toHaveAttribute("lang", "pt-BR");
    await expect(toggle(page, "PT")).toHaveAttribute("aria-pressed", "true");

    await toggle(page, "EN").click();
    await expect(html(page)).toHaveAttribute("lang", "en");
    await expect(toggle(page, "EN")).toHaveAttribute("aria-pressed", "true");

    await page.reload();
    await expect(html(page)).toHaveAttribute("lang", "en");
    await expect(toggle(page, "EN")).toHaveAttribute("aria-pressed", "true");

    await toggle(page, "PT").click();
    await expect(html(page)).toHaveAttribute("lang", "pt-BR");
    await page.reload();
    await expect(html(page)).toHaveAttribute("lang", "pt-BR");
  });
}

test("UI strings follow the language on the projects list", async ({ page }) => {
  await page.goto("/projects");
  // On mobile the link text is screen-reader only, so assert on the accessible name.
  await expect(page.getByRole("link", { name: pt.projectsSection.viewProject }).first()).toBeAttached();
  await toggle(page, "EN").click();
  await expect(page.getByRole("link", { name: en.projectsSection.viewProject }).first()).toBeAttached();
});
