/* global process */
/// <reference types="vitest/config" />
import { fileURLToPath } from "node:url";
import path from "path";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

const dirname = typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({

  base: process.env.GITHUB_PAGES === "true" ? "/claude-code-experiment/" : "/",
  preview: {
    port: 4173,
  },
  plugins: [vue(), tailwindcss()],
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
              launch: {
                args: ["--no-sandbox", "--no-zygote"],
              },
            }],
          },
          setupFiles: [".storybook/vitest.setup.ts"],
        },
      }],
  },
});
