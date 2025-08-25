import type { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: ".",
  testMatch: ["**/__test__/**/*.spec.ts"],
  webServer: {
    command: "npm run preview",
    port: 2000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: "http://localhost:2000/api",
  },
};

export default config;
