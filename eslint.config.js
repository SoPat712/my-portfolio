import { defineConfig } from "eslint/config";
import tsParser from "@typescript-eslint/parser";
import svelte from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";

export default defineConfig([
  {
    ignores: ["build/**", ".svelte-kit/**", "node_modules/**"],
  },
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 2021,
        sourceType: "module",
      },
    },
    plugins: {
      svelte,
    },
    rules: {
      // Add or override Svelte-specific rules here
    },
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
      },
    },
    rules: {
      semi: ["error", "always"],
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  },
]);
