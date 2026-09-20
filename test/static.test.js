import test from 'node:test';
import assert from 'node:assert/strict';
import { read, files } from './helpers.js';

test('JavaScript has no unsafe rendering, debug globals, or weak random generator', () => {
  for (const file of files('js')) {
    assert.doesNotMatch(read(file), /Math\.random|console\.log|decodeURIComponent|window\.\w+\s*=|innerHTML|onclick=/, file);
  }
});
test('pure core modules and isolated guarded storage', () => {
  for (const name of ['cipher', 'formula', 'random', 'input', 'validation']) {
    assert.doesNotMatch(read(`js/core/${name}.js`), /localStorage|document|window/);
  }
  const storage = files('js').filter(file => /localStorage/.test(read(file))).sort();
  assert.deepEqual(storage, ['js/core/indexing-mode.js', 'js/theme-init.js', 'js/ui/theme.js']);
  for (const file of storage) assert.match(read(file), /try\s*\{[\s\S]+catch/);
});
test('technical code excerpts use existing declaration names', () => {
  const source = files('js').map(read).join('\n');
  const blocks = [...read('TECHNICAL.md').matchAll(/```javascript\n([\s\S]*?)```/g)];
  assert.ok(blocks.length >= 5);
  let declarations = 0;
  for (const block of blocks) {
    for (const match of block[1].matchAll(/(?:function\s+(\w+)\s*\(|const\s+(\w+)\s*=)/g)) {
      const name = match[1] || match[2];
      declarations++;
      assert.match(source, new RegExp(`\\b(?:function|const)\\s+${name}\\b`), name);
    }
  }
  assert.ok(declarations >= 10);
});
test('package and CI have no dependencies', () => {
  assert.deepEqual(JSON.parse(read('package.json')), {
    name: 'vigenere-cipher-tool', private: true, type: 'module', scripts: { test: 'node --test' }
  });
  const workflow = read('.github/workflows/test.yml');
  for (const expected of ['push', 'pull_request', 'contents: read', 'node-version: 22', 'npm test']) {
    assert.ok(workflow.includes(expected));
  }
  assert.doesNotMatch(workflow, /npm (?:install|ci)/);
});
