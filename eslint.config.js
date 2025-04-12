import { defineConfig } from "eslint/config";
import svelte from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig([
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json"],
      },
    },
    plugins: {
      svelte,
    },
    settings: {
      "svelte3/typescript": require("typescript"),
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
