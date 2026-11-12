import { expect, test } from "@playwright/test";
import { pt } from "./strings";

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "The menu button only exists below 768 px.");
});

test("opens, traps focus, and Esc closes and returns focus to Menu", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: pt.menu.open, exact: true });
  const dialog = page.getByRole("dialog", { name: pt.menu.open });

  await trigger.click();
  await expect(dialog).toBeVisible();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(dialog.getByRole("button", { name: pt.menu.close })).toBeFocused();

  // Tab through the whole dialog and a bit more: focus never leaves it.
  const count = await dialog.locator('a[href], button:not([disabled])').count();
  for (let i = 0; i < count + 3; i++) {
    await page.keyboard.press("Tab");
    expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true);
  }
  for (let i = 0; i < count + 3; i++) {
    await page.keyboard.press("Shift+Tab");
    expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true);
  }

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});
