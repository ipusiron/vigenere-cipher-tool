import test from 'node:test';
import assert from 'node:assert/strict';
import { read, files } from './helpers.js';
import { I18n } from '../js/i18n.js';
import { encryptFormula } from '../js/core/formula.js';

const html = read('index.html');
const JAPANESE = /[぀-ヿ一-鿿]/;
const KEY = /^[a-z][A-Za-z0-9]*(?:\.[A-Za-z0-9]+)+$/;
const unescape = (text) => text.replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>');
const placeholders = (message) => [...message.matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort();

test('both dictionaries hold the same keys', () => {
  assert.deepEqual(Object.keys(I18n.ja).sort(), Object.keys(I18n.en).sort());
  assert.equal(Object.keys(I18n.ja).length, 193);
});

test('substitution names agree between the two languages', () => {
  for (const key of Object.keys(I18n.ja)) {
    assert.deepEqual(placeholders(I18n.en[key]), placeholders(I18n.ja[key]), key);
  }
});

test('every key the HTML points at exists in both dictionaries', () => {
  const keys = [...html.matchAll(/data-i18n(?:-[\w-]+)?="([^"]+)"/g)].map(match => match[1]);
  assert.ok(keys.length >= 120);
  for (const key of new Set(keys)) {
    assert.equal(typeof I18n.ja[key], 'string', `ja ${key}`);
    assert.equal(typeof I18n.en[key], 'string', `en ${key}`);
  }
});

test('every key the scripts pass around exists in the dictionary', () => {
  const found = new Set();
  for (const file of files('js')) {
    if (file === 'js/i18n.js') continue;
    for (const [, value] of read(file).matchAll(/'([^'\n]+)'/g)) {
      if (KEY.test(value)) found.add(value);
    }
  }
  assert.ok(found.size >= 30);
  for (const key of found) assert.equal(typeof I18n.ja[key], 'string', key);
  for (const key of found) assert.equal(typeof I18n.en[key], 'string', key);
});

test('the English dictionary keeps no Japanese', () => {
  for (const [key, message] of Object.entries(I18n.en)) {
    if (key === 'app.langButton') continue;
    assert.doesNotMatch(message, JAPANESE, key);
  }
  assert.equal(I18n.en['app.langButton'], '日本語');
});

test('t fills substitutions and throws on an unknown key', () => {
  assert.equal(I18n.t('warning.ignored', { count: 3 }), '英字以外の3文字は無視されます（記号・数字・空白・日本語など）');
  assert.equal(I18n.translate('en', 'warning.ignored', { count: 3 }),
    '3 non-letter characters are ignored (symbols, digits, spaces, other scripts)');
  assert.equal(I18n.t('header.indexingSwitchTo', { mode: 'A=1' }), '表モードをA=1に切り替える');
  assert.equal(I18n.t('viz.truncated', { max: '1,000', total: '2,500' }),
    '対応表は先頭1,000文字だけを表示しています（全2,500文字）');
  assert.throws(() => I18n.t('no.such.key'), /Unknown message: no\.such\.key/);
  assert.equal(I18n.has('error.fileRead'), true);
  assert.equal(I18n.has('no.such.key'), false);
  assert.equal(I18n.language, 'ja');
  assert.equal(I18n.STORAGE_KEY, 'vigenere-cipher-tool-language');
});

test('the fallback wording in the HTML matches the Japanese dictionary', () => {
  const pattern = /<(\w+)\b[^>]*\bdata-i18n="([\w.]+)"[^>]*>([\s\S]*?)<\/\1\s*>/g;
  const seen = [];
  for (const [, , key, body] of html.matchAll(pattern)) {
    seen.push(key);
    assert.equal(unescape(body.trim()), I18n.ja[key], key);
  }
  assert.ok(seen.length >= 100);
});

test('the fallback attributes in the HTML match the Japanese dictionary', () => {
  let checked = 0;
  for (const [tag] of html.matchAll(/<[a-zA-Z][^>]*>/g)) {
    for (const [, attribute, key] of tag.matchAll(/data-i18n-([\w-]+)="([\w.]+)"/g)) {
      const value = tag.match(new RegExp(`(?:^|\\s)${attribute}="([^"]*)"`));
      assert.ok(value, `${attribute} missing for ${key}`);
      assert.equal(unescape(value[1]), I18n.ja[key], key);
      checked++;
    }
  }
  assert.ok(checked >= 14, String(checked));
});

test('every social meta tag is translated', () => {
  for (const name of [
    'description', 'keywords', 'og:title', 'og:description', 'og:site_name',
    'twitter:title', 'twitter:description'
  ]) {
    const attribute = name.startsWith('og:') ? 'property' : 'name';
    assert.match(html, new RegExp(`<meta ${attribute}="${name}" data-i18n-content="app\\.\\w+"`), name);
  }
  assert.equal([...html.matchAll(/data-i18n-content=/g)].length, 7);
});

test('no element that owns children carries data-i18n', () => {
  for (const [, , body] of html.matchAll(/<(\w+)\b[^>]*\bdata-i18n="([\w.]+)"[^>]*>([\s\S]*?)<\/\1\s*>/g)) {
    assert.doesNotMatch(body, /</, body.slice(0, 60));
  }
});

test('slots the scripts write into are left out of the translation pass', () => {
  for (const id of [
    'inputTextWarning', 'inputTextError', 'caesarTextError', 'caesarKeyError', 'otpTextError',
    'researchResult', 'researchReverseResult', 'cipherCharResult', 'keyCharReverseResult',
    'visualization', 'vigenereTable', 'researchTable', 'table-example-text', 'indexing-mode-label'
  ]) {
    assert.doesNotMatch(html, new RegExp(`id="${id}"[^>]*\\sdata-i18n="`), id);
  }
  // 表モードのトグルは状態でラベルが変わる。属性を無条件に上書きされると状態が巻き戻る。
  assert.doesNotMatch(html, /id="indexing-mode-toggle"[^>]*data-i18n-aria-label/);
  assert.match(html, /id="indexing-mode-toggle" aria-label="表モードをA=1に切り替える"/);
  assert.equal(I18n.t('header.indexingSwitchTo', { mode: 'A=1' }), '表モードをA=1に切り替える');
});

test('the table example line is not written into the HTML', () => {
  assert.match(html, /<p id="table-example-text"><\/p>/);
  assert.doesNotMatch(html, /table-example-result|table-example-formula/);
  assert.match(read('js/app.js'), /tabula\.example/);
});

test('display wording lives only in the dictionary', () => {
  for (const file of files('js')) {
    if (file === 'js/i18n.js') continue;
    const source = read(file).replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^'"\n]*$/gm, '');
    const left = source.split('\n').map(line => line.trim()).filter(line => JAPANESE.test(line));
    assert.deepEqual(left, [], file);
  }
});

test('the pure layers keep no wording and no dictionary calls', () => {
  for (const name of ['cipher', 'formula', 'input', 'random', 'validation', 'indexing-mode']) {
    assert.doesNotMatch(read(`js/core/${name}.js`), /I18n/, name);
  }
  assert.doesNotMatch(read('js/core/validation.js'), /message:/);
  assert.match(read('js/core/formula.js'), /readAs26/);
});

test('the English note about reading 0 as 26 carries its own leading space', () => {
  const parts = encryptFormula('Z', 'Z', 1);
  const line = `(${parts.left} ${parts.operator} ${parts.right}) mod 26 = ${parts.value}`
    + `${I18n.translate('en', 'formula.readAs26')} → ${parts.char}`;
  assert.equal(line, '(26 + 26) mod 26 = 0 (read 0 as 26) → Z');
});

test('the noscript line carries both languages in one text node', () => {
  const body = html.match(/<noscript>([^<]+)<\/noscript>/)[1];
  assert.match(body, JAPANESE);
  assert.match(body, /Enable JavaScript/);
});

test('a standing message about a loaded file is not wiped by the redraw', () => {
  const source = read('js/features/main-tab.js');
  assert.match(source, /let loadError = null;/);
  assert.match(source, /if \(loadError && inputValidation\.type !== 'error'\)/);
  // 失敗の判定は表示中の文字列との一致ではなく、辞書のキーで行う
  assert.match(source, /I18n\.has\(error\.message\)/);
  assert.doesNotMatch(source, /textContent\s*===/);
});

test('the language button is wired and only the tool itself stores the choice', () => {
  assert.match(html, /id="langToggle"/);
  assert.match(read('js/app.js'), /langToggle/);
  assert.match(read('js/app.js'), /languagechange/);
  assert.match(read('js/i18n.js'), /vigenere-cipher-tool-language/);
});

test('only the title and the noscript sentence keep Japanese outside the translation pass', () => {
  const stripped = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(\w+)\b[^>]*\bdata-i18n="[\w.]+"[^>]*>[\s\S]*?<\/\1\s*>/g, '')
    .replace(/<[a-zA-Z/][^>]*>/g, '\n');
  const left = stripped.split('\n').map(line => line.trim()).filter(line => JAPANESE.test(line));
  assert.deepEqual(left, [
    'ヴィジュネル暗号ツール（Vigenere Cipher Tool）',
    'このツールを使うには、ブラウザーのJavaScriptを有効にしてください。 / Enable JavaScript in your browser to use this tool.'
  ]);
});
