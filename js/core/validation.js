/**
 * Input Validation Logic
 * 入力検証の責任を担当
 */

import { sanitize } from './cipher.js';

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
export const validateInputText = (inputText) => {
  if (!inputText) {
    return { isValid: true, type: 'none', message: '' };
  }

  const sanitizedInput = sanitize(inputText);
  
  // 全角文字や非ASCII文字のチェック
  const hasInvalidChars = /[^\x00-\x7F]/.test(inputText) || /[ａ-ｚＡ-Ｚ０-９]/.test(inputText);
  
  if (hasInvalidChars) {
    return {
      isValid: false,
      type: 'error',
      message: '全角文字は使用できません（半角のみ有効）'
    };
  }
  
  if (sanitizedInput.length === 0) {
    return {
      isValid: false,
      type: 'error',
      message: 'アルファベット（A-Z）を含む文字を入力してください'
    };
  }
  
  if (sanitizedInput.length < inputText.length) {
    return {
      isValid: true,
      type: 'warning',
      message: '記号・数字・空白は無視されて処理されます（英字のみ使用）'
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
  if (!text.trim()) {
    return { isValid: false, type: 'none', message: '' };
  }
  
  const sanitizedText = sanitize(text);
  
  if (sanitizedText.length === 0) {
    return {
      isValid: false,
      type: 'error',
      message: 'アルファベット（A-Z）を含む文字を入力してください'
    };
  }
  
  if (sanitizedText.length !== text.replace(/[^a-zA-Z]/g, '').length) {
    return {
      isValid: true,
      type: 'warning',
      message: 'アルファベット以外の文字は無視されます'
    };
  }
  
  return { isValid: true, type: 'none', message: '' };
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
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (file.size > maxSize) {
    return {
      isValid: false,
      type: 'error',
      message: 'ファイルサイズが大きすぎます（最大: 10MB）'
    };
  }
  
  const fileName = file.name.toLowerCase();
  const isTextFile = fileName.endsWith('.txt') || 
                    fileName.endsWith('.text') || 
                    file.type === 'text/plain' ||
                    file.type === '';
  
  if (!isTextFile) {
    return {
      isValid: false,
      type: 'error',
      message: 'テキストファイル（.txt）のみサポートしています'
    };
  }
  
  return { isValid: true, type: 'none', message: '' };
};