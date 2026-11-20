/**
 * Shared PostCSS config. An app re-exports it from its own postcss.config.mjs:
 *   export { default } from '@soulharb/config/postcss';
 */
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
