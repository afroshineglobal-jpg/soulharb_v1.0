/** Files no preset should ever lint. */
export const ignores = {
  ignores: [
    '**/node_modules/**',
    '**/dist/**',
    '**/.next/**',
    '**/.turbo/**',
    '**/coverage/**',
    '**/playwright-report/**',
    '**/test-results/**',
    '**/next-env.d.ts',
    'supabase/.temp/**',
    'pnpm-lock.yaml',
  ],
};
