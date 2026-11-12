import { expect, test, type Page } from "@playwright/test";
import { pt } from "./strings";

const PAGES = ["/", "/projects", "/nao-existe"];
const MAX_TABS = 150;

type Focused = { tag: string; description: string; visible: boolean; hasFocusStyle: boolean };

// Describes the focused element: in the viewport, and drawing some focus indicator.
const inspectFocus = (page: Page): Promise<Focused | null> =>
  page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body || el === document.documentElement) return null;
    // A stretched link with screen-reader-only text has no box of its own (project cards on
    // mobile): its card, which carries the ring through :has(:focus-visible), is what shows focus.
    const own = el.getBoundingClientRect();
    const indicator = own.width === 0 || own.height === 0 ? (el.closest("article") ?? el) : el;
    const rect = indicator.getBoundingClientRect();
    const style = getComputedStyle(indicator);
    const tag = el.tagName.toLowerCase();
    const outline = style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0;
    const shadow = style.boxShadow !== "none";
    // Text fields replace the outline with an underline that grows on focus (peer-focus).
    const underlined = tag === "input" || tag === "textarea";
    return {
      tag,
      description: `${tag}${el.id ? `#${el.id}` : ""} "${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 40)}"`,
      visible:
        rect.width > 0 &&
        rect.height > 0 &&
        rect.bottom > 0 &&
        rect.right > 0 &&
        rect.top < window.innerHeight &&
        rect.left < window.innerWidth,
      hasFocusStyle: outline || shadow || underlined,
    };
  });

test("the first Tab reveals the skip link, and it moves focus to main", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: pt.a11y.skipToContent });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport({ ratio: 1 });

  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
});

for (const path of PAGES) {
  test(`Tab through ${path}: the focused element is always visible`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const seen = new Set<string>();
    for (let i = 0; i < MAX_TABS; i++) {
      await page.keyboard.press("Tab");
      const focused = await inspectFocus(page);
      if (!focused) break; // focus left the page (browser UI): one full cycle done
      expect(focused.visible, `${focused.description} is in the viewport`).toBe(true);
      expect(focused.hasFocusStyle, `${focused.description} shows a focus style`).toBe(true);
      if (seen.has(focused.description) && seen.size > 3) break;
      seen.add(focused.description);
    }
    expect(seen.size).toBeGreaterThan(3);
  });
}

test("back to top moves focus to main", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));

  const button = page.getByRole("button", { name: pt.a11y.backToTop });
  await expect(button).toBeVisible();
  await page.keyboard.press("Tab"); // keyboard modality; the button is reached below
  await button.focus();
  await page.keyboard.press("Enter");

  await expect(page.locator("#main")).toBeFocused();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});

test("Tab from 'Ver todos os projetos' reaches a visible 'Ver projeto' in the pinned card", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "the pinned scroll stage is desktop only");
  await page.goto("/");
  const all = page.getByRole("link", { name: pt.projectsSection.viewAllProjects }).first();
  await all.focus();
  await page.keyboard.press("Tab");
  const link = page.getByRole("link", { name: pt.projectsSection.viewProject, exact: true });
  await expect(link).toBeFocused();
  await expect(link).toBeInViewport();
  await expect
    .poll(() => link.evaluate((el) => getComputedStyle(el.closest("[style]") as HTMLElement).opacity))
    .toBe("1");
});
