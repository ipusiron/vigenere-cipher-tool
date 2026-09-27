import test from 'node:test';
import assert from 'node:assert/strict';
import { validateInputText, validateLabText, validateFile } from '../js/core/validation.js';
import { I18n } from '../js/i18n.js';

// 検証は表示用の文ではなく辞書のキーと差し込み値を返す。訳文はここで組み立てて照合する。
test('input warnings count all nonletters by code point', () => {
  for (const [input, n] of [
    ['ATTACK AT DAWN', 2], ['DON’T PANIC', 2], ['Vigenère', 1], ['HELLO　WORLD', 1],
    ['HELLO 世界', 3], ['HELLO 😀', 2]
  ]) {
    const result = validateInputText(input);
    assert.deepEqual(result, {
      isValid: true, type: 'warning', key: 'warning.ignored', params: { count: n }
    });
    assert.equal(I18n.t(result.key, result.params), `英字以外の${n}文字は無視されます（記号・数字・空白・日本語など）`);
  }
  const preserve = validateInputText('Attack at dawn!', 'preserve');
  assert.deepEqual(preserve, {
    isValid: true, type: 'warning', key: 'warning.ignoredPreserve', params: { count: 3 }
  });
  assert.equal(I18n.t(preserve.key, preserve.params), '英字以外の3文字は変換せず、そのまま出力します');
});
test('errors and valid empty main input', () => {
  for (const [input, n] of [['ＨＥＬＬＯ', 5], ['ＡＢＣ abc', 3]]) {
    const expected = { isValid: false, type: 'error', key: 'error.fullwidth', params: { count: n } };
    assert.deepEqual(validateInputText(input), expected);
    assert.deepEqual(validateLabText(input), expected);
    assert.equal(I18n.t(expected.key, expected.params), `全角の英字が${n}文字あります。半角に直してください`);
  }
  const noLetters = { isValid: false, type: 'error', key: 'error.noLetters', params: {} };
  assert.deepEqual(validateInputText('12345'), noLetters);
  assert.deepEqual(validateLabText('12345'), noLetters);
  for (const input of ['', 'ATTACKATDAWN']) {
    assert.deepEqual(validateInputText(input), { isValid: true, type: 'none', key: '', params: {} });
  }
  assert.deepEqual(validateLabText(''), { isValid: false, type: 'none', key: '', params: {} });
  assert.deepEqual(validateLabText('HELLO 世界'), { isValid: true, type: 'none', key: '', params: {} });
});
test('file size and type boundaries', () => {
  assert.equal(validateFile({ name: 'a.txt', size: 1048576, type: 'text/plain' }).isValid, true);
  const tooLarge = validateFile({ name: 'a.txt', size: 1048577, type: 'text/plain' });
  assert.equal(tooLarge.isValid, false);
  assert.deepEqual(tooLarge, { isValid: false, type: 'error', key: 'error.fileTooLarge', params: { size: 1 } });
  assert.equal(I18n.t(tooLarge.key, tooLarge.params), 'ファイルサイズが大きすぎます（最大: 1MB）');
  assert.equal(validateFile({ name: 'README', size: 1, type: '' }).isValid, true);
  const png = validateFile({ name: 'a.png', size: 1, type: 'image/png' });
  assert.equal(png.isValid, false);
  assert.equal(png.key, 'error.fileType');
  assert.equal(validateFile({ name: 'a.png', size: 1, type: '' }).isValid, false);
});
