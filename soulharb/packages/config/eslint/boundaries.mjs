/**
 * Import boundaries between workspace packages.
 *
 * Each area lists the workspace packages it may import. Everything else under the
 * @soulharb scope is blocked, along with deep imports into another package's src or dist
 * and relative paths that climb into another workspace.
 *
 * The dependency graph:
 *   shared                        leaf, imports nothing
 *   config                        tooling only, imports nothing
 *   i18n, api-client, db          shared
 *   emails                        shared, i18n
 *   ui                            shared, i18n
 *   web, admin (apps)             shared, ui, i18n, api-client
 *   api (app)                     shared, db, i18n, emails
 *   worker (app)                  shared, db, i18n, emails, api
 */
import { defineConfig } from 'eslint/config';

export const WORKSPACE_PACKAGES = [
  'admin',
  'api',
  'api-client',
  'config',
  'db',
  'emails',
  'i18n',
  'shared',
  'ui',
  'web',
  'worker',
];

export const ALLOWED = {
  'apps/web': ['shared', 'ui', 'i18n', 'api-client'],
  'apps/admin': ['shared', 'ui', 'i18n', 'api-client'],
  'apps/api': ['shared', 'db', 'i18n', 'emails'],
  'apps/worker': ['shared', 'db', 'i18n', 'emails', 'api'],
  'packages/shared': [],
  'packages/config': [],
  'packages/db': ['shared'],
  'packages/i18n': ['shared'],
  'packages/api-client': ['shared'],
  'packages/emails': ['shared', 'i18n'],
  'packages/ui': ['shared', 'i18n'],
  'tests/e2e': ['shared', 'api-client'],
  'tests/load': ['shared'],
};

/** The package an area publishes, so an area is never blocked from importing itself. */
const selfName = (area) => area.split('/')[1];

export function boundaryConfig(allowed = ALLOWED) {
  return defineConfig(
    Object.entries(allowed).map(([area, allowedPackages]) => {
      const blocked = WORKSPACE_PACKAGES.filter(
        (name) => name !== selfName(area) && !allowedPackages.includes(name),
      ).map((name) => `@soulharb/${name}`);

      const patterns = [
        {
          group: [
            '@soulharb/*/src',
            '@soulharb/*/src/**',
            '@soulharb/*/dist',
            '@soulharb/*/dist/**',
          ],
          message: 'Import from the package entry point, not its internals.',
        },
        {
          group: ['**/apps/**', '**/packages/**'],
          message: 'Import other workspaces by package name, not by relative path.',
        },
      ];
      if (blocked.length > 0) {
        patterns.push({
          group: blocked,
          message: `${area} must not import this package. See packages/config/eslint/boundaries.mjs.`,
        });
      }

      return {
        files: [`${area}/**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}`],
        rules: { 'no-restricted-imports': ['error', { patterns }] },
      };
    }),
  );
}

export const boundaries = boundaryConfig();
