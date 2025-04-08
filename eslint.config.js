import { defineConfig } from "eslint/config";
import svelte from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";

export default defineConfig([
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parser: svelteParser,
    },
    plugins: {
      svelte,
    },
    rules: {
      // Add or override rules here
    },
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
    },
    globals: {
      window: "readonly",
      document: "readonly",
    },
    rules: {
      semi: ["error", "always"],
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  },
]);
