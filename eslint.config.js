import path from "node:path";

import pluginVue from "eslint-plugin-vue";
import tseslint from "typescript-eslint";

const clientEntryPoint = path.resolve(import.meta.dirname, "packages/client/src/index.css");

export default [
  {
    ignores: ["**/dist/**", "**/node_modules/**", "**/*.gen.ts"],
  },
  ...pluginVue.configs["flat/recommended"],
  ...tseslint.configs.recommended.map(config => ({
    ...config,
    files: config.files || ["**/*.{ts,tsx,mts,cts}"],
  })),
  {
    rules: {
      "no-unused-vars": "off",
      "vue/multi-word-component-names": "off",
      "vue/require-default-prop": "off",
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
    },
  },
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    files: ["packages/client/**/*.{ts,tsx,vue}"],
    settings: {
      "better-tailwindcss": {
        entryPoint: clientEntryPoint,
      },
    },
  },
];
