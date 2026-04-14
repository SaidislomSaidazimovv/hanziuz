import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  // Windows + Next dev server (Turbopack) EPERM-races when multiple workers
  // hit uncompiled routes concurrently. Serial is slower but stable.
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  timeout: 30_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: "http://localhost:3000",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    navigationTimeout: 30_000,
    actionTimeout: 15_000,
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
