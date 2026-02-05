// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import path from "node:path";

import emstackConfig from "@emilyeserven/eslint-config";
import tseslint from "typescript-eslint";

const clientEntryPoint = path.resolve(import.meta.dirname, "packages/client/src/index.css");

export default tseslint.config([
  ...emstackConfig,
  {
    rules: {
      "no-unused-vars": "off",
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
    },
  },
  {
    files: ["packages/client/**/*.{ts,tsx}"],
    settings: {
      "better-tailwindcss": {
        entryPoint: clientEntryPoint,
      },
    },
  },
]);
