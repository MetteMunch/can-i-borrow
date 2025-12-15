import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-plugin-prettier';
import svelte from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  // ===============================
  // JavaScript (Node + Browser)
  // ===============================
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      'prettier/prettier': 'error',
      'no-console': 'off',
    },
  },

  // ===============================
  // Svelte
  // ===============================
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      svelte,
      prettier,
    },
    rules: {
      ...svelte.configs.recommended.rules,
      'prettier/prettier': 'error',
    },
  },
]);
