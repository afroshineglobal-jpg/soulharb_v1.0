# @soulharb/config

Shared tooling presets. No runtime code.

| Preset                    | Import                                                                         | Used by                                 |
| ------------------------- | ------------------------------------------------------------------------------ | --------------------------------------- |
| TypeScript, Node services | `"extends": "@soulharb/config/tsconfig/node"`                                  | `apps/api`, `apps/worker`               |
| TypeScript, Next.js apps  | `"extends": "@soulharb/config/tsconfig/nextjs"`                                | `apps/web`, `apps/admin`                |
| TypeScript, libraries     | `"extends": "@soulharb/config/tsconfig/library"`                               | `packages/*`                            |
| ESLint                    | root `eslint.config.mjs` re-exports `workspace` from `@soulharb/config/eslint` | whole repo                              |
| Tailwind v4 theme         | `@import "@soulharb/config/tailwind/theme.css";`                               | `apps/web`, `apps/admin`, `packages/ui` |
| PostCSS                   | `export { default } from '@soulharb/config/postcss';`                          | `apps/web`, `apps/admin`                |

## Import boundaries

`eslint/boundaries.mjs` holds the allowed-dependency table for the workspace and is enforced by ESLint
(`no-restricted-imports`). To allow a new dependency between workspaces, change the `ALLOWED` table in
the same pull request that adds it, and record the reason in an ADR if it changes the architecture.

## Placeholders

The colour palette and fonts in `tailwind/theme.css` are placeholders until the brand assets are supplied
(blueprint decision 15). Component code should use the semantic tokens (`bg-surface`, `text-ink`,
`border-line`) so the swap is a one-file change.

## Open point

`tsconfig/node.json` assumes decorators and `NodeNext` modules. The NestJS bootstrap step confirms this
against the installed NestJS major version and adjusts the preset if needed.
