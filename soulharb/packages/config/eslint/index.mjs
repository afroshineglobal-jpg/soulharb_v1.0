import { defineConfig } from 'eslint/config';
import { base } from './base.mjs';
import { boundaries } from './boundaries.mjs';
import { ignores } from './ignores.mjs';
import { next } from './next.mjs';
import { node } from './node.mjs';

export { base } from './base.mjs';
export { ALLOWED, WORKSPACE_PACKAGES, boundaries, boundaryConfig } from './boundaries.mjs';
export { ignores } from './ignores.mjs';
export { next } from './next.mjs';
export { node } from './node.mjs';

/** Areas that get the Node preset and the React preset. */
const NODE_AREAS = ['apps/api/**', 'apps/worker/**', 'packages/db/**', 'packages/emails/**'];
const REACT_AREAS = ['apps/web/**', 'apps/admin/**', 'packages/ui/**'];

/**
 * The complete workspace configuration. The root eslint.config.mjs re-exports this, so
 * `eslint .` behaves the same from the repository root and from any package directory.
 */
export const workspace = defineConfig(
  ignores,
  base,
  { files: NODE_AREAS, extends: [node] },
  { files: REACT_AREAS, extends: [next] },
  boundaries,
);
