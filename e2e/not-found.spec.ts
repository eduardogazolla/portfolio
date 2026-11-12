import { expect, test } from "@playwright/test";
import { pt } from "./strings";

for (const path of ["/nao-existe", "/projects/nao-existe"]) {
  test(`${path} shows the 404 with both buttons`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);

    await expect(page.getByRole("heading", { level: 1, name: pt.notFound.title })).toBeVisible();
    const home = page.getByRole("link", { name: pt.notFound.backToHome });
    const projects = page.getByRole("main").getByRole("link", { name: pt.notFound.viewProjects });
    await expect(home).toBeVisible();
    await expect(home).toHaveAttribute("href", "/");
    await expect(projects).toBeVisible();
    await expect(projects).toHaveAttribute("href", "/projects");
  });
}
