import { test, expect } from "@playwright/test";

test("login page renders", async ({ page }) => {
  await page.goto("/login");
  await expect(page.locator("h1", { hasText: "Kirish" })).toBeVisible();
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
});

test("shows error on wrong password", async ({ page }) => {
  await page.goto("/login");
  await page.locator('input[name="email"]').fill("nobody@example.com");
  await page.locator('input[name="password"]').fill("definitely-wrong-password");
  await page.locator('button[type="submit"]').click();
  await expect(page.locator("text=/noto'g'ri|topilmadi/i")).toBeVisible({
    timeout: 15_000,
  });
});

test("forgot password page renders", async ({ page }) => {
  await page.goto("/forgot-password");
  await expect(page.locator("h1", { hasText: /Parolni tiklash/i })).toBeVisible();
  await expect(page.locator('input[type="email"]')).toBeVisible();
});

test("register page renders", async ({ page }) => {
  await page.goto("/register");
  await expect(
    page.locator("h1", { hasText: /Ro.yxatdan o.tish/i })
  ).toBeVisible();
  await expect(page.locator('input[name="email"]')).toBeVisible();
});
