import { defineConfig } from 'eslint/config';
import globals from 'globals';

/**
 * Overrides for Node services (apps/api, apps/worker).
 * NestJS dependency injection reads constructor parameter types at runtime, so
 * type-only import enforcement is switched off here.
 */
export const node = defineConfig({
  files: ['**/*.{ts,mts,cts,js,mjs,cjs}'],
  languageOptions: { globals: { ...globals.node } },
  rules: {
    '@typescript-eslint/consistent-type-imports': 'off',
  },
});
