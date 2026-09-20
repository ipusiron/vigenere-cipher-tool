import test from 'node:test';
import assert from 'node:assert/strict';
import { read, contrast, contrastPairs } from './helpers.js';

for (const theme of ['light', 'dark']) {
  test(`${theme} 15 text pairs and field border`, () => {
    const source = read(`css/themes/${theme}.css`);
    assert.equal([...source.matchAll(/--[\w-]+:\s*/g)].length, theme === 'light' ? 44 : 24);
    const selector = theme === 'light' ? /:root\s*\{([^}]+)\}/ : /\[data-theme="dark"\]\s*\{([^}]+)\}/;
    const body = source.match(selector)[1];
    const vars = Object.fromEntries([...body.matchAll(/--([\w-]+):\s*(#[\da-f]{6});/gi)].map(m => [m[1], m[2]]));
    assert.equal(Object.keys(vars).length, 24);
    assert.equal(contrastPairs.length, 15);
    for (const [foreground, background] of contrastPairs) {
      assert.ok(contrast(vars[foreground], vars[background]) >= 4.5, `${foreground}/${background}`);
    }
    assert.ok(contrast(vars['field-border'], vars['input-bg']) >= 3);
  });
}
test('message and tooltip colors use variables', () => {
  for (const file of ['messages', 'icons']) assert.doesNotMatch(read(`css/components/${file}.css`), /color:\s*#/);
});
