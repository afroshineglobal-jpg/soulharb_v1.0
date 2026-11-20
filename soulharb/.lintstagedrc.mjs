/**
 * Runs on staged files only. ESLint is added to this list in the packages/config step,
 * once the shared ESLint preset exists.
 */
export default {
  '*.{ts,tsx,js,jsx,mjs,cjs,json,md,yml,yaml,css}': ['prettier --write'],
};
