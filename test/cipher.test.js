import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import {
  sanitize, vigenere, encryptChar, decryptChar, findKeyChar, vigenerePreserve, groupBy5, formatOutput
} from '../js/core/cipher.js';

const examples = [
  ['ATTACK AT DAWN', 'LEMON', 'LXFOPVEFRNHR', 'MYGPQWFGSOIS'],
  ['HELLO', 'KEY', 'RIJVS', 'SJKWT'],
  ['CRYPTO IS SHORT FOR CRYPTOGRAPHY', 'ABCD', 'CSASTPKVSIQUTGQUCSASTPIUAQJB', 'DTBTUQLWTJRVUHRVDTBTUQJVBRKC'],
  ['THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG', 'VIGENERE',
    'OPKUHMTOWZUAAJFBECSTFSMIMBNIYEQCYWM', 'PQLVINUPXAVBBKGCFDTUGTNJNCOJZFRDZXN'],
  ['HELLO WORLD', 'K', 'ROVVYGYBVN', 'SPWWZHZCWO'],
  ['ZZZ', 'ZZZ', 'YYY', 'ZZZ'],
  ['A', 'A', 'A', 'B']
];
for (const [plain, key, ...expected] of examples) {
  for (const offset of [0, 1]) {
    test(`known answer ${plain} A=${offset}`, () => {
      assert.equal(vigenere(plain, key, 'encrypt', offset).result, expected[offset]);
      assert.equal(vigenere(expected[offset], key, 'decrypt', offset).result, sanitize(plain));
    });
  }
}

test('676 pairs in both modes and complete table hashes', () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const hashes = [
    '90661b6ca7940b293b019f61275f10f8a690ce47af7d7f33a52903a5596d965a',
    'a0d7c88b502ba891ea1ce5f2eec1610bda8e6dd2f3fd1f953c350ea38a8a00cd'
  ];
  for (const offset of [0, 1]) {
    let table = '';
    for (const key of alphabet) {
      for (const plain of alphabet) {
        const cipher = encryptChar(plain, key, offset);
        assert.equal(decryptChar(cipher, key, offset), plain);
        assert.equal(findKeyChar(plain, cipher, offset), key);
        table += cipher;
      }
      table += '\n';
    }
    assert.equal(createHash('sha256').update(table).digest('hex'), hashes[offset]);
  }
});

const preserveCases = [
  ['Attack at dawn!', 'LEMON', 0, 'Lxfopv ef rnhr!'],
  ['Attack at dawn!', 'LEMON', 1, 'Mygpqw fg sois!'],
  ['DON’T PANIC — 42', 'KEY', 0, 'NSL’D TYXMA — 42'],
  ['Hello, World! 123', 'key', 0, 'Rijvs, Uyvjn! 123'],
  ['HELLO 世界 😀 WORLD', 'ABC', 0, 'HFNLP 世界 😀 YOSND'],
  ['ＨＥＬＬＯ hello', 'B', 0, 'ＨＥＬＬＯ ifmmp']
];
for (const [plain, key, offset, cipher] of preserveCases) {
  test(`preserve ${plain} A=${offset}`, () => {
    assert.equal(vigenerePreserve(plain, key, 'encrypt', offset), cipher);
    assert.equal(vigenerePreserve(cipher, key, 'decrypt', offset), plain);
  });
}

test('grouping and output formats', () => {
  for (const [text, expected] of [
    ['LXFOPVEFRNHR', 'LXFOP VEFRN HR'], ['ABCDE', 'ABCDE'], ['ABCDEF', 'ABCDE F'],
    ['ABCD', 'ABCD'], ['', ''], ['ABCDEFGHIJ', 'ABCDE FGHIJ']
  ]) assert.equal(groupBy5(text), expected);
  for (const [format, expected] of [
    ['compact', 'LXFOPVEFRNHR'], ['group5', 'LXFOP VEFRN HR'], ['preserve', 'Lxfopv ef rnhr!'],
    ['invalid', 'LXFOPVEFRNHR']
  ]) assert.equal(formatOutput('Attack at dawn!', 'LEMON', 'encrypt', 0, format), expected);
});

test('boundaries and strict offset', () => {
  for (const [text, key] of [['', 'A'], ['A', ''], ['A', '123']]) {
    assert.deepEqual(vigenere(text, key), { result: '', visualization: [] });
  }
  assert.equal(vigenere('HELLO', 'key').result, 'RIJVS');
  assert.equal(vigenere('A'.repeat(100000), 'B').result, 'B'.repeat(100000));
  assert.equal(vigenere('A😀B', 'A').result, 'AB');
  assert.equal(vigenerePreserve('A😀B', 'A'), 'A😀B');
  for (const offset of [2, '1', null, undefined]) {
    assert.equal(vigenere('HELLO', 'KEY', 'encrypt', offset).result, 'RIJVS');
    assert.equal(encryptChar('A', 'A', offset), 'A');
    assert.equal(decryptChar('A', 'A', offset), 'A');
    assert.equal(findKeyChar('A', 'A', offset), 'A');
  }
});
