import { expect, test } from "@playwright/test";
import { pt } from "./strings";

test("Home -> all projects -> project detail -> back to the list", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: pt.projectsSection.viewAllProjects }).first().click();
  await expect(page).toHaveURL(/\/projects$/);

  // The card is one big link; on mobile its text is screen-reader only, so tap the card.
  const card = page.getByRole("article").first();
  await expect(card.getByRole("link", { name: pt.projectsSection.viewProject })).toBeAttached();
  await card.click();
  await expect(page).toHaveURL(/\/projects\/[^/]+$/);
  await expect(page.getByText(pt.projectDetail.context, { exact: true }).first()).toBeVisible();

  await page.getByRole("link", { name: pt.projectDetail.backToProjects }).first().click();
  await expect(page).toHaveURL(/\/projects$/);
});
