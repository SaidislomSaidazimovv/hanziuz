import { test, expect } from "@playwright/test";

test("lessons page redirects to login when not authenticated", async ({ page }) => {
  await page.goto("/lessons");
  await expect(page).toHaveURL(/\/login/);
});

test("dashboard redirects to login when not authenticated", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login/);
});

test("flashcards page redirects to login when not authenticated", async ({
  page,
}) => {
  await page.goto("/flashcards");
  await expect(page).toHaveURL(/\/login/);
});

test("admin page redirects to admin login when no admin cookie", async ({
  page,
}) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
});
