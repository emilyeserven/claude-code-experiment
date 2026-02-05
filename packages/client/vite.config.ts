/// <reference types="vitest/config" />
import { fileURLToPath } from "node:url";
import path from "path";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const dirname = typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  base: process.env.GITHUB_PAGES === "true" ? "/claude-code-experiment/" : "/",
  preview: {
    port: 4173,
  },
  plugins: [tanstackRouter({
    target: "react",
    autoCodeSplitting: true,
  }), react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "unit-tests",
          globals: true,
          environment: "jsdom",
          include: ["**/*.test.{ts,tsx,js,jsx}"],
          exclude: ["**/node_modules/**", "**/dist/**", "**/cypress/**", "**/.{idea,git,cache,output,temp}/**", "**/*.stories.{js,jsx,ts,tsx}"],
          passWithNoTests: true,
          setupFiles: ["./setupTests.js"],
        },
      },
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, ".storybook"),
          })],
        test: {
          name: "storybook",
          passWithNoTests: true,
          browser: {
            enabled: true,
            headless: true,
            provider: "playwright",
            instances: [{
              browser: "chromium",
            }],
          },
          setupFiles: [".storybook/vitest.setup.ts"],
        },
      }],
  },
});
