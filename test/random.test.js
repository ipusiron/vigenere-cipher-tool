import test from 'node:test';
import assert from 'node:assert/strict';
import { randomKeyFromBytes, generateRandomKey } from '../js/core/random.js';

test('reject bytes 234 and above', () => {
  const bytes = [0, 25, 26, 233, 234, 255, 51, 52, 100, 200];
  let consumed = 0;
  assert.equal(randomKeyFromBytes(7, () => bytes[consumed++]), 'AZAZZAW');
  assert.equal(consumed, 9);
});
test('each letter occurs nine times in accepted byte range', () => {
  let consumed = 0;
  const key = randomKeyFromBytes(234, () => consumed++);
  assert.equal(consumed, 234);
  for (const char of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') assert.equal([...key].filter(c => c === char).length, 9);
});
test('browser-compatible secure generator', () => {
  assert.equal(generateRandomKey(0), '');
  assert.match(generateRandomKey(1000), /^[A-Z]{1000}$/);
});
