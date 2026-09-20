import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { read, root } from './helpers.js';
import { formatOutput } from '../js/core/cipher.js';
import { MAX_TEXT_LENGTH, MAX_FILE_BYTES, VIZ_MAX_CHARS } from '../js/core/input.js';

test('README examples are recalculated, including every output format', () => {
  const section = read('README.md').split('### 動作例')[1].split('\n### ')[0];
  const rows = [...section.matchAll(/^\| (.+) \| (.+) \| A=([01]) \| (.+) \| (.+) \|$/gm)];
  assert.ok(rows.length >= 8);
  const formats = { '詰めて出力': 'compact', '5文字ごとに区切る': 'group5', '書式を保つ': 'preserve' };
  for (const [, plain, key, offset, format, expected] of rows) {
    assert.ok(formats[format]);
    assert.equal(formatOutput(plain, key, 'encrypt', Number(offset), formats[format]), expected);
  }
  assert.deepEqual(new Set(rows.map(row => formats[row[4]])), new Set(Object.values(formats)));
});

test('README limits and all four relative screenshots match implementation', () => {
  const text = read('README.md');
  assert.ok(text.includes(`${MAX_TEXT_LENGTH.toLocaleString('en-US')}文字`));
  assert.ok(text.includes(`${MAX_FILE_BYTES / 1048576}MB`));
  assert.ok(text.includes(`${VIZ_MAX_CHARS.toLocaleString('en-US')}文字`));
  const images = [...text.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map(match => match[1])
    .filter(path => !/^https?:/.test(path));
  assert.deepEqual(images, [3, 4, 5, 6].map(n => `assets/screenshot${n}.png`));
  for (const path of images) assert.ok(existsSync(resolve(root, path)), path);
});

test('README YAML preserves original key order, identity and block lists', () => {
  const text = read('README.md');
  const metadata = text.match(/^<!--\r?\n---\r?\n([\s\S]*?)\r?\n---\r?\n-->/);
  assert.ok(metadata);
  const fields = [...metadata[1].matchAll(/^(\w+):(?: (.*))?$/gm)];
  assert.deepEqual(fields.map(field => field[1]), [
    'id', 'slug', 'title', 'subtitle_ja', 'subtitle_en', 'description_ja', 'description_en',
    'category_ja', 'category_en', 'difficulty', 'tags', 'repo_url', 'demo_url', 'hub'
  ]);
  const values = Object.fromEntries(fields.map(([, key, value]) => [key, value?.trim()]));
  for (const [key, value] of Object.entries({
    id: 'day017', slug: 'vigenere-cipher-tool', title: '"Vigenere Cipher Tool"',
    repo_url: '"https://github.com/ipusiron/vigenere-cipher-tool"',
    demo_url: '"https://ipusiron.github.io/vigenere-cipher-tool/"', hub: 'true'
  })) assert.equal(values[key], value);
  for (const key of ['category_ja', 'category_en', 'tags']) {
    assert.match(metadata[1], new RegExp(`^${key}:\\r?\\n  - `, 'm'));
  }
});

test('all three documents describe the implemented dependencies and randomness', () => {
  for (const path of ['README.md', 'CLAUDE.md', 'TECHNICAL.md']) {
    assert.doesNotMatch(read(path), /Alpine|暗号学的に安全な疑似乱数使用|完全ランダム/);
  }
});
