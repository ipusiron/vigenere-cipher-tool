/**
 * Input Validation Logic
 * 入力検証の責任を担当
 */

import { sanitize } from './cipher.js';
import { analyzeInput, MAX_FILE_BYTES } from './input.js';

/**
 * 入力検証の結果
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid - 有効性
 * @property {string} type - 'none' | 'warning' | 'error'
 * @property {string} message - メッセージ
 */

/**
 * メインタブの入力テキストを検証
 * @param {string} inputText - 入力テキスト
 * @returns {ValidationResult} 検証結果
 */
export const validateInputText = (inputText, format = 'compact') => {
  if (!inputText) return { isValid: true, type: 'none', message: '' };
  const { letters, fullwidthLatin, ignored } = analyzeInput(inputText);
  if (fullwidthLatin) {
    return {
      isValid: false, type: 'error',
      message: `全角の英字が${fullwidthLatin}文字あります。半角に直してください`
    };
  }
  if (!letters) {
    return { isValid: false, type: 'error', message: 'アルファベット（A-Z）を含む文字を入力してください' };
  }
  if (ignored) {
    return {
      isValid: true, type: 'warning',
      message: format === 'preserve'
        ? `英字以外の${ignored}文字は変換せず、そのまま出力します`
        : `英字以外の${ignored}文字は無視されます（記号・数字・空白・日本語など）`
    };
  }
  return { isValid: true, type: 'none', message: '' };
};

/**
 * 鍵を検証
 * @param {string} keyText - 鍵テキスト
 * @returns {ValidationResult} 検証結果
 */
export const validateKey = (keyText) => {
  const sanitizedKey = sanitize(keyText);
  
  if (sanitizedKey.length === 0) {
    return { isValid: false, type: 'none', message: '' };
  }
  
  return { isValid: true, type: 'none', message: '' };
};

/**
 * 実験室タブ用のテキスト検証
 * @param {string} text - 入力テキスト
 * @returns {ValidationResult} 検証結果
 */
export const validateLabText = (text) => {
  if (!text) return { isValid: false, type: 'none', message: '' };
  const validation = validateInputText(text);
  return validation.isValid ? { isValid: true, type: 'none', message: '' } : validation;
};

/**
 * シーザー暗号用の鍵検証（1文字のみ）
 * @param {string} key - 鍵文字
 * @returns {ValidationResult} 検証結果
 */
export const validateCaesarKey = (key) => {
  const trimmedKey = key.trim().toUpperCase();
  
  if (!trimmedKey) {
    return { isValid: false, type: 'none', message: '' };
  }
  
  if (!/^[A-Z]$/.test(trimmedKey)) {
    return {
      isValid: false,
      type: 'error',
      message: 'アルファベット1文字を入力してください'
    };
  }
  
  return { isValid: true, type: 'none', message: '' };
};

/**
 * ファイルを検証
 * @param {File} file - ファイルオブジェクト
 * @returns {ValidationResult} 検証結果
 */
export const validateFile = (file) => {
  const maxSize = MAX_FILE_BYTES;
  
  if (file.size > maxSize) {
    return {
      isValid: false,
      type: 'error',
      message: 'ファイルサイズが大きすぎます（最大: 1MB）'
    };
  }
  
  const fileName = file.name.toLowerCase();
  const isTextFile = fileName.endsWith('.txt') || 
                    fileName.endsWith('.text') || 
                    file.type === 'text/plain' ||
                    (file.type === '' && !/\.[^.]+$/.test(fileName));
  
  if (!isTextFile) {
    return {
      isValid: false,
      type: 'error',
      message: 'テキストファイル（.txt）のみサポートしています'
    };
  }
  
  return { isValid: true, type: 'none', message: '' };
};
