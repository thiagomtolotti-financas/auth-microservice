import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    rules: {
      "no-warning-comments": "warn",
    },
    settings: {
      "import/resolver": {
        typescript: {},
      },
    },
    languageOptions: { globals: globals.browser },
  },
  {
    ignores: ["dist/**"],
  },
];
