import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./website/tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL: "http://127.0.0.1:3106", trace: "retain-on-failure" },
  webServer: {
    command: "cd website && bunx next start -p 3106",
    url: "http://127.0.0.1:3106",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
