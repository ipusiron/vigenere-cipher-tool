/**
 * Vigenère Cipher Core Logic
 * 純粋関数による暗号化・復号ロジック
 */

import { getIndexingOffset } from './indexing-mode.js';

// Constants
export const ALPHABET_SIZE = 26;
export const CHAR_CODE_A = 'A'.charCodeAt(0);

/**
 * 文字列をサニタイズ（英字のみ残して大文字に変換）
 * @param {string} input - 入力文字列
 * @returns {string} サニタイズされた文字列
 */
export const sanitize = (input) => {
  return input.toUpperCase().replace(/[^A-Z]/g, '');
};

/**
 * 鍵を指定した長さまで繰り返す
 * @param {string} key - 鍵文字列
 * @param {number} length - 目標の長さ
 * @returns {string} 繰り返された鍵
 */
export const repeatKey = (key, length) => {
  if (length === 0) return '';
  return key.repeat(Math.ceil(length / key.length)).slice(0, length);
};

/**
 * 1文字を暗号化
 * @param {string} plainChar - 平文文字（A-Z）
 * @param {string} keyChar - 鍵文字（A-Z）
 * @returns {string} 暗号文字
 */
export const encryptChar = (plainChar, keyChar) => {
  const plainCode = plainChar.charCodeAt(0) - CHAR_CODE_A;
  const keyCode = keyChar.charCodeAt(0) - CHAR_CODE_A;
  const offset = getIndexingOffset();
  // A=0: (plain + key) % 26, A=1: (plain + key + 1) % 26
  return String.fromCharCode((plainCode + keyCode + offset) % ALPHABET_SIZE + CHAR_CODE_A);
};

/**
 * 1文字を復号
 * @param {string} cipherChar - 暗号文字（A-Z）
 * @param {string} keyChar - 鍵文字（A-Z）
 * @returns {string} 平文文字
 */
export const decryptChar = (cipherChar, keyChar) => {
  const cipherCode = cipherChar.charCodeAt(0) - CHAR_CODE_A;
  const keyCode = keyChar.charCodeAt(0) - CHAR_CODE_A;
  const offset = getIndexingOffset();
  // A=0: (cipher - key + 26) % 26, A=1: (cipher - key - 1 + 26) % 26
  return String.fromCharCode((cipherCode - keyCode - offset + ALPHABET_SIZE) % ALPHABET_SIZE + CHAR_CODE_A);
};

/**
 * ヴィジュネル暗号による暗号化・復号
 * @param {string} text - 入力テキスト
 * @param {string} key - 鍵
 * @param {string} mode - 'encrypt' または 'decrypt'
 * @returns {Object} {result: string, visualization: Array}
 */
export const vigenere = (text, key, mode = 'encrypt') => {
  const sanitizedText = sanitize(text);
  const sanitizedKey = sanitize(key);
  
  if (!sanitizedText || !sanitizedKey) {
    return { result: '', visualization: [] };
  }
  
  const fullKey = repeatKey(sanitizedKey, sanitizedText.length);
  const processChar = mode === 'encrypt' ? encryptChar : decryptChar;
  
  let result = '';
  const visualization = [];
  
  for (let i = 0; i < sanitizedText.length; i++) {
    const inputChar = sanitizedText[i];
    const keyChar = fullKey[i];
    const outputChar = processChar(inputChar, keyChar);
    
    result += outputChar;
    visualization.push({
      plain: mode === 'encrypt' ? inputChar : outputChar,
      key: keyChar,
      result: mode === 'encrypt' ? outputChar : inputChar
    });
  }
  
  return { result, visualization };
};

/**
 * 平文文字と暗号文文字から鍵文字を逆算
 * @param {string} plainChar - 平文文字（A-Z）
 * @param {string} cipherChar - 暗号文字（A-Z）
 * @returns {string} 鍵文字
 */
export const findKeyChar = (plainChar, cipherChar) => {
  const plainCode = plainChar.charCodeAt(0) - CHAR_CODE_A;
  const cipherCode = cipherChar.charCodeAt(0) - CHAR_CODE_A;
  const offset = getIndexingOffset();
  // A=0: (cipher - plain + 26) % 26, A=1: (cipher - plain - 1 + 26) % 26
  const keyCode = (cipherCode - plainCode - offset + ALPHABET_SIZE) % ALPHABET_SIZE;
  return String.fromCharCode(keyCode + CHAR_CODE_A);
};