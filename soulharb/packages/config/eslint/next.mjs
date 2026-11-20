import nextPlugin from '@next/eslint-plugin-next';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

/**
 * Overrides for React and Next.js code (apps/web, apps/admin, packages/ui).
 *
 * Built from the individual plugins rather than eslint-config-next, which pulls in an
 * extra import-resolver dependency that fails the workspace's trustPolicy check.
 * The jsx-a11y rules matter here because the product targets WCAG 2.1 AA.
 */
export const next = [
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  reactHooks.configs.flat.recommended,
  jsxA11y.flatConfigs.recommended,
  {
    plugins: { '@next/next': nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      // The apps use the App Router and have no pages directory.
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
  {
    settings: { react: { version: 'detect' } },
    languageOptions: { globals: { ...globals.browser } },
  },
];
