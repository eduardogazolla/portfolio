import { expect, test, type Page } from "@playwright/test";
import { pt } from "./strings";

const t = pt.contactVoice;

// The real webhook must never be reached: every test stubs the endpoint.
const stubContact = async (page: Page, status: number) => {
  const requests: string[] = [];
  await page.route("**/api/contact", async (route) => {
    requests.push(route.request().postData() ?? "");
    await route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify({ ok: status === 200 }),
    });
  });
  return requests;
};

const fields = (page: Page) => ({
  name: page.getByLabel(t.nameLabel, { exact: true }),
  email: page.getByLabel(t.emailLabel, { exact: true }),
  message: page.getByLabel(t.messageLabel, { exact: true }),
  submit: page.getByRole("button", { name: t.submit }),
});

const MESSAGE = "Olá, gostaria de conversar sobre uma vaga.";

const fillValid = async (page: Page) => {
  const f = fields(page);
  await f.name.fill("Ana Teste");
  await f.email.fill("ana@exemplo.com");
  await f.message.fill(MESSAGE);
};

test.beforeEach(async ({ page }) => {
  // Registered before any interaction: no test can reach the real webhook.
  await page.route("**/api/contact", (route) => route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' }));
  await page.goto("/#contact");
  await expect(fields(page).submit).toBeVisible();
});

test("invalid submit shows errors and focuses the first invalid field", async ({ page }) => {
  const requests = await stubContact(page, 200);
  const f = fields(page);

  await f.submit.click();
  await expect(f.name).toHaveAttribute("aria-invalid", "true");
  await expect(f.email).toHaveAttribute("aria-invalid", "true");
  await expect(f.message).toHaveAttribute("aria-invalid", "true");
  await expect(f.name).toBeFocused();
  const errorId = await f.name.getAttribute("aria-describedby");
  await expect(page.locator(`[id="${errorId?.split(" ")[0]}"]`)).not.toBeEmpty();

  await f.name.fill("Ana");
  await f.email.fill("eduardo@gmail");
  await f.message.fill("Olá!");
  await f.submit.click();
  await expect(f.email).toHaveAttribute("aria-invalid", "true");
  await expect(f.email).toBeFocused();
  expect(requests).toHaveLength(0);
});

test("success shows the confirmation and moves focus to it", async ({ page }) => {
  const requests = await stubContact(page, 200);
  await fillValid(page);
  await fields(page).submit.click();

  const confirmation = page.getByRole("heading", { name: t.sent });
  await expect(confirmation).toBeVisible();
  await expect(confirmation).toBeFocused();
  expect(requests).toHaveLength(1);
  expect(JSON.parse(requests[0])).toMatchObject({ name: "Ana Teste", email: "ana@exemplo.com" });
});

test("failure keeps the data and offers to retry", async ({ page }) => {
  await stubContact(page, 502);
  await fillValid(page);
  await fields(page).submit.click();

  await expect(page.getByRole("alert").filter({ hasText: t.failed })).toBeFocused();
  const f = fields(page);
  await expect(f.name).toHaveValue("Ana Teste");
  await expect(f.email).toHaveValue("ana@exemplo.com");
  await expect(f.message).toHaveValue(MESSAGE);
  await expect(page.getByRole("button", { name: t.retry })).toBeVisible();
});

test("retry after a failure can succeed", async ({ page }) => {
  await stubContact(page, 502);
  await fillValid(page);
  await fields(page).submit.click();
  const retry = page.getByRole("button", { name: t.retry });
  await expect(retry).toBeVisible();

  await page.unroute("**/api/contact");
  await stubContact(page, 200);
  await retry.click();
  await expect(page.getByRole("heading", { name: t.sent })).toBeFocused();
});
