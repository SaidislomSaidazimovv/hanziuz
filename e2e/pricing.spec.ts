import { test, expect } from "@playwright/test";

test("pricing page loads", async ({ page }) => {
  await page.goto("/pricing");
  await expect(page.getByRole("heading", { name: /Narxlar/i })).toBeVisible();
  await expect(page.getByText(/Bepul/i).first()).toBeVisible();
  await expect(page.getByText(/Premium/i).first()).toBeVisible();
  await expect(page.getByText(/Korporativ/i).first()).toBeVisible();
});

test("billing toggle switches monthly/yearly", async ({ page }) => {
  await page.goto("/pricing");
  await expect(page.getByText(/29 000/).first()).toBeVisible();
  await page.getByRole("button", { name: /^Yillik/ }).click();
  await expect(page.getByText(/20 750/).first()).toBeVisible();
});

test("yearly shows savings amount", async ({ page }) => {
  await page.goto("/pricing");
  await page.getByRole("button", { name: /^Yillik/ }).click();
  await expect(page.getByText(/tejaysiz/i)).toBeVisible();
});

test("corporate CTA goes to /contact", async ({ page }) => {
  await page.goto("/pricing");
  await page.getByRole("link", { name: /Bog.lanish/i }).click();
  await expect(page).toHaveURL(/\/contact/);
});
