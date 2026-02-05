// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import ccExperimentsConfig from "@emilyeserven/eslint-config";
import tseslint from "typescript-eslint";

export default tseslint.config([
  ...ccExperimentsConfig,
]);
