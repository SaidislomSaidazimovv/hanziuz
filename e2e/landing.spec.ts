import { test, expect } from "@playwright/test";

test("landing page loads correctly", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Xitoy tilini/i })
  ).toBeVisible();
});

test("navbar has pricing and features links", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /Narxlar/i }).first()).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Imkoniyatlar/i }).first()
  ).toBeVisible();
});

test("pricing section scrolls into view", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Narxlar/i }).first().click();
  await expect(page.locator("#pricing")).toBeInViewport();
});

test("register CTA goes to /register", async ({ page }) => {
  await page.goto("/");
  const cta = page.locator('a[href="/register"]', { hasText: /Bepul boshlash/i }).first();
  await expect(cta).toBeVisible();
  await Promise.all([
    page.waitForURL(/\/register/, { timeout: 15_000 }),
    cta.click(),
  ]);
});
