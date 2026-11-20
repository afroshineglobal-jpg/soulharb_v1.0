/** Conventional Commits, with the scopes that exist in this repository. */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'web',
        'admin',
        'api',
        'worker',
        'shared',
        'db',
        'ui',
        'i18n',
        'api-client',
        'emails',
        'config',
        'supabase',
        'infra',
        'docs',
        'ci',
        'deps',
        'release',
        'repo',
      ],
    ],
    'header-max-length': [2, 'always', 100],
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
  },
};
