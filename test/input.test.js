import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeLoadedText, readTextParam, analyzeInput } from '../js/core/input.js';

test('URL parameters are decoded once', () => {
  const cases = [
    ['?text=100%25%20SURE', '100% SURE'], ['?text=%2541%2542', '%41%42'],
    ['?text=TOM%20%26%20JERRY', 'TOM & JERRY'], ['?text=A%2BB+C', 'A+B C'],
    ['?text=A%3CB%3EC', 'A<B>C'], ['?text=A%2FB%3DC', 'A/B=C'], ['?key=x', null],
    ['?text=', ''], ['?text=%E4%B8%96%E7%95%8C%20HELLO', '世界 HELLO']
  ];
  for (const [input, expected] of cases) assert.equal(readTextParam(input), expected);
});
test('loaded text preserves punctuation and removes only control characters', () => {
  const raw = 'TOM & JERRY <3 "QUOTE" A/B=C';
  assert.deepEqual(normalizeLoadedText(raw), { text: raw, truncated: false, originalLength: 28 });
  assert.deepEqual(normalizeLoadedText('AB\u0000C\u0007D\tE\nF\rG\u007fH\u0085I'), {
    text: 'ABCD\tE\nF\rGHI', truncated: false, originalLength: 12
  });
});
test('limits never split a surrogate pair', () => {
  assert.deepEqual(normalizeLoadedText('A'.repeat(99999) + '😀B'), {
    text: 'A'.repeat(99999), truncated: true, originalLength: 100002
  });
  assert.deepEqual(normalizeLoadedText('AB'.repeat(60000)), {
    text: 'AB'.repeat(50000), truncated: true, originalLength: 120000
  });
  assert.deepEqual(normalizeLoadedText('A'.repeat(100000)), {
    text: 'A'.repeat(100000), truncated: false, originalLength: 100000
  });
});
test('input analysis counts code points', () => {
  assert.deepEqual(analyzeInput('HELLO 世界 😀'), { letters: 5, fullwidthLatin: 0, ignored: 5 });
  assert.deepEqual(analyzeInput('ＡＢＣ abc'), { letters: 3, fullwidthLatin: 3, ignored: 4 });
});
