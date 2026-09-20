import test from 'node:test';
import assert from 'node:assert/strict';
import { validateInputText, validateLabText, validateFile } from '../js/core/validation.js';

test('input warnings count all nonletters by code point', () => {
  for (const [input, n] of [
    ['ATTACK AT DAWN', 2], ['DON’T PANIC', 2], ['Vigenère', 1], ['HELLO　WORLD', 1],
    ['HELLO 世界', 3], ['HELLO 😀', 2]
  ]) assert.deepEqual(validateInputText(input), {
    isValid: true, type: 'warning', message: `英字以外の${n}文字は無視されます（記号・数字・空白・日本語など）`
  });
  assert.deepEqual(validateInputText('Attack at dawn!', 'preserve'), {
    isValid: true, type: 'warning', message: '英字以外の3文字は変換せず、そのまま出力します'
  });
});
test('errors and valid empty main input', () => {
  for (const [input, n] of [['ＨＥＬＬＯ', 5], ['ＡＢＣ abc', 3]]) {
    const expected = { isValid: false, type: 'error', message: `全角の英字が${n}文字あります。半角に直してください` };
    assert.deepEqual(validateInputText(input), expected);
    assert.deepEqual(validateLabText(input), expected);
  }
  const noLetters = { isValid: false, type: 'error', message: 'アルファベット（A-Z）を含む文字を入力してください' };
  assert.deepEqual(validateInputText('12345'), noLetters);
  assert.deepEqual(validateLabText('12345'), noLetters);
  for (const input of ['', 'ATTACKATDAWN']) {
    assert.deepEqual(validateInputText(input), { isValid: true, type: 'none', message: '' });
  }
  assert.deepEqual(validateLabText(''), { isValid: false, type: 'none', message: '' });
  assert.deepEqual(validateLabText('HELLO 世界'), { isValid: true, type: 'none', message: '' });
});
test('file size and type boundaries', () => {
  assert.equal(validateFile({ name: 'a.txt', size: 1048576, type: 'text/plain' }).isValid, true);
  const tooLarge = validateFile({ name: 'a.txt', size: 1048577, type: 'text/plain' });
  assert.equal(tooLarge.isValid, false);
  assert.equal(tooLarge.message, 'ファイルサイズが大きすぎます（最大: 1MB）');
  assert.equal(validateFile({ name: 'README', size: 1, type: '' }).isValid, true);
  assert.equal(validateFile({ name: 'a.png', size: 1, type: 'image/png' }).isValid, false);
  assert.equal(validateFile({ name: 'a.png', size: 1, type: '' }).isValid, false);
});
