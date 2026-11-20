import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ESLint } from 'eslint';
import tseslint from 'typescript-eslint';
import { boundaries } from '../eslint/boundaries.mjs';

const eslint = new ESLint({
  cwd: process.cwd(),
  overrideConfigFile: true,
  overrideConfig: [
    { files: ['**/*.ts'], languageOptions: { parser: tseslint.parser } },
    ...boundaries,
  ],
});

async function messagesFor(filePath, code) {
  const [result] = await eslint.lintText(code, { filePath });
  return result.messages.filter((m) => m.ruleId === 'no-restricted-imports');
}

test('web may import shared and ui', async () => {
  assert.equal(
    (await messagesFor('apps/web/src/a.ts', "import '@soulharb/shared';\nimport '@soulharb/ui';"))
      .length,
    0,
  );
});

test('web must not import the api or the worker', async () => {
  assert.equal((await messagesFor('apps/web/src/a.ts', "import '@soulharb/api';")).length, 1);
  assert.equal((await messagesFor('apps/web/src/a.ts', "import '@soulharb/worker';")).length, 1);
});

test('api-client is not mistaken for api', async () => {
  assert.equal(
    (await messagesFor('apps/web/src/a.ts', "import '@soulharb/api-client';")).length,
    0,
  );
  assert.equal(
    (await messagesFor('apps/api/src/a.ts', "import '@soulharb/api-client';")).length,
    1,
  );
});

test('shared is a leaf', async () => {
  assert.equal((await messagesFor('packages/shared/src/a.ts', "import '@soulharb/ui';")).length, 1);
  assert.equal((await messagesFor('packages/shared/src/a.ts', "import '@soulharb/db';")).length, 1);
});

test('worker may import api, api may not import worker', async () => {
  assert.equal((await messagesFor('apps/worker/src/a.ts', "import '@soulharb/api';")).length, 0);
  assert.equal((await messagesFor('apps/api/src/a.ts', "import '@soulharb/worker';")).length, 1);
});

test('deep imports into another package are blocked', async () => {
  assert.equal(
    (await messagesFor('apps/web/src/a.ts', "import '@soulharb/shared/src/x';")).length,
    1,
  );
  assert.equal(
    (await messagesFor('apps/web/src/a.ts', "import '@soulharb/shared/dist/x';")).length,
    1,
  );
});

test('relative paths into another workspace are blocked', async () => {
  assert.equal(
    (await messagesFor('apps/web/src/a.ts', "import '../../../packages/shared/src/x';")).length,
    1,
  );
});

test('relative imports inside a package are fine', async () => {
  assert.equal(
    (await messagesFor('apps/web/src/a.ts', "import './b';\nimport '../lib/c';")).length,
    0,
  );
});

test('every area in the table names real workspace packages', async () => {
  const { ALLOWED, WORKSPACE_PACKAGES } = await import('../eslint/boundaries.mjs');
  for (const [area, list] of Object.entries(ALLOWED)) {
    for (const name of list)
      assert.ok(WORKSPACE_PACKAGES.includes(name), `${area} lists unknown ${name}`);
  }
});
