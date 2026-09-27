import test from 'node:test';
import assert from 'node:assert/strict';
import { encryptFormula, decryptFormula, keyFormula, displayValue } from '../js/core/formula.js';
import { encryptChar, decryptChar, findKeyChar } from '../js/core/cipher.js';
import { formatFormula } from '../js/ui/formula-text.js';

const examples = [
  [encryptFormula, 'X', 'K', 0, '(23 + 10) mod 26 = 7 → H'],
  [encryptFormula, 'Z', 'Z', 0, '(25 + 25) mod 26 = 24 → Y'],
  [encryptFormula, 'H', 'K', 0, '(7 + 10) mod 26 = 17 → R'],
  [encryptFormula, 'A', 'A', 0, '(0 + 0) mod 26 = 0 → A'],
  [encryptFormula, 'H', 'K', 1, '(8 + 11) mod 26 = 19 → S'],
  [encryptFormula, 'A', 'A', 1, '(1 + 1) mod 26 = 2 → B'],
  [encryptFormula, 'Z', 'Z', 1, '(26 + 26) mod 26 = 0（0は26と読む） → Z'],
  [encryptFormula, 'Y', 'A', 1, '(25 + 1) mod 26 = 0（0は26と読む） → Z'],
  [keyFormula, 'X', 'H', 0, '(7 - 23) mod 26 = 10 → K'],
  [keyFormula, 'B', 'A', 0, '(0 - 1) mod 26 = 25 → Z'],
  [keyFormula, 'A', 'A', 0, '(0 - 0) mod 26 = 0 → A'],
  [keyFormula, 'Z', 'A', 1, '(1 - 26) mod 26 = 1 → A'],
  [keyFormula, 'H', 'S', 1, '(19 - 8) mod 26 = 11 → K'],
  [keyFormula, 'A', 'A', 1, '(1 - 1) mod 26 = 0（0は26と読む） → Z'],
  [decryptFormula, 'R', 'K', 0, '(17 - 10) mod 26 = 7 → H'],
  [decryptFormula, 'S', 'K', 1, '(19 - 11) mod 26 = 8 → H'],
  [decryptFormula, 'A', 'A', 1, '(1 - 1) mod 26 = 0（0は26と読む） → Z']
];
// formula.js は文言を持たず式の部品を返す。既定の日本語で組み立てた1行を、従来どおり照合する。
for (const [fn, left, right, offset, expected] of examples) {
  test(`${fn.name} ${left} ${right} A=${offset}`, () => assert.equal(formatFormula(fn(left, right, offset)), expected));
}
test('the pure formula layer holds no wording', () => {
  assert.deepEqual(encryptFormula('H', 'K', 0), { left: 7, right: 10, operator: '+', value: 17, readAs26: false, char: 'R' });
  assert.deepEqual(encryptFormula('Z', 'Z', 1), { left: 26, right: 26, operator: '+', value: 0, readAs26: true, char: 'Z' });
  assert.deepEqual(keyFormula('A', 'A', 1), { left: 1, right: 1, operator: '-', value: 0, readAs26: true, char: 'Z' });
});
test('formulas agree with character functions for all pairs', () => {
  for (const offset of [0, 1]) {
    assert.equal(displayValue('A', offset), offset);
    assert.equal(displayValue('Z', offset), 25 + offset);
    for (const a of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
      for (const b of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
        for (const [formula, fn] of [[encryptFormula, encryptChar], [keyFormula, findKeyChar], [decryptFormula, decryptChar]]) {
          const parts = formula(a, b, offset);
          assert.equal(parts.char, fn(a, b, offset));
          assert.equal(formatFormula(parts).split(' → ')[1], fn(a, b, offset));
        }
      }
    }
  }
});
