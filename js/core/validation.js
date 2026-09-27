/**
 * Input Validation Logic
 * 入力検証の責任を担当。文言は持たず、辞書のキーと差し込み値だけを返す。
 */

import { sanitize } from './cipher.js';
import { analyzeInput, MAX_FILE_BYTES } from './input.js';

/**
 * 入力検証の結果
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid - 有効性
 * @property {string} type - 'none' | 'warning' | 'error'
 * @property {string} key - 辞書のキー（表示するものが無ければ空文字）
 * @property {Object} params - キーへ差し込む値
 */

/** 表示するものが無い結果。 */
const silent = (isValid) => ({ isValid, type: 'none', key: '', params: {} });

/**
 * メインタブの入力テキストを検証
 * @param {string} inputText - 入力テキスト
 * @returns {ValidationResult} 検証結果
 */
export const validateInputText = (inputText, format = 'compact') => {
  if (!inputText) return silent(true);
  const { letters, fullwidthLatin, ignored } = analyzeInput(inputText);
  if (fullwidthLatin) {
    return { isValid: false, type: 'error', key: 'error.fullwidth', params: { count: fullwidthLatin } };
  }
  if (!letters) {
    return { isValid: false, type: 'error', key: 'error.noLetters', params: {} };
  }
  if (ignored) {
    return {
      isValid: true, type: 'warning',
      key: format === 'preserve' ? 'warning.ignoredPreserve' : 'warning.ignored',
      params: { count: ignored }
    };
  }
  return silent(true);
};

/**
 * 鍵を検証
 * @param {string} keyText - 鍵テキスト
 * @returns {ValidationResult} 検証結果
 */
export const validateKey = (keyText) => {
  const sanitizedKey = sanitize(keyText);

  if (sanitizedKey.length === 0) {
    return silent(false);
  }

  return silent(true);
};

/**
 * 実験室タブ用のテキスト検証
 * @param {string} text - 入力テキスト
 * @returns {ValidationResult} 検証結果
 */
export const validateLabText = (text) => {
  if (!text) return silent(false);
  const validation = validateInputText(text);
  return validation.isValid ? silent(true) : validation;
};

/**
 * シーザー暗号用の鍵検証（1文字のみ）
 * @param {string} key - 鍵文字
 * @returns {ValidationResult} 検証結果
 */
export const validateCaesarKey = (key) => {
  const trimmedKey = key.trim().toUpperCase();

  if (!trimmedKey) {
    return silent(false);
  }

  if (!/^[A-Z]$/.test(trimmedKey)) {
    return { isValid: false, type: 'error', key: 'error.caesarKey', params: {} };
  }

  return silent(true);
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
      isValid: false, type: 'error', key: 'error.fileTooLarge',
      params: { size: maxSize / 1048576 }
    };
  }

  const fileName = file.name.toLowerCase();
  const isTextFile = fileName.endsWith('.txt') ||
                    fileName.endsWith('.text') ||
                    file.type === 'text/plain' ||
                    (file.type === '' && !/\.[^.]+$/.test(fileName));

  if (!isTextFile) {
    return { isValid: false, type: 'error', key: 'error.fileType', params: {} };
  }

  return silent(true);
};
