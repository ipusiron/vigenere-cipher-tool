/**
 * Lab Tab Functionality
 * 実験室タブの機能を担当
 */

import { vigenere, sanitize, repeatKey } from '../core/cipher.js';
import { getIndexingOffset, getCharDisplayValue } from '../core/indexing-mode.js';
import { validateLabText, validateCaesarKey } from '../core/validation.js';
import { generateRandomKey } from '../core/utils.js';
import { labTabElements } from '../ui/dom-elements.js';
import { displayValidationMessage } from '../ui/message-display.js';

/**
 * 実験室タブの初期化フラグ
 */
let isInitialized = false;

/**
 * HTMLエスケープ（XSS対策）
 * @param {string} str - エスケープする文字列
 * @returns {string} エスケープされた文字列
 */
const escapeHtml = (str) => {
  const htmlEscapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };
  return str.replace(/[&<>"'/]/g, (match) => htmlEscapeMap[match]);
};

/**
 * シーザー暗号入力の検証
 */
export const validateCaesarInputs = () => {
  const textInput = labTabElements.caesarText();
  const keyInput = labTabElements.caesarKey();
  const textError = labTabElements.caesarTextError();
  const keyError = labTabElements.caesarKeyError();
  const button = labTabElements.caesarButton();
  
  // テキスト検証
  const textValidation = validateLabText(textInput.value);
  displayValidationMessage(null, textError, textValidation);
  
  // 鍵検証（自動的に大文字変換と非英字除去）
  const originalKey = keyInput.value;
  const sanitizedKey = originalKey.toUpperCase().replace(/[^A-Z]/g, '');
  keyInput.value = sanitizedKey;
  
  const keyValidation = validateCaesarKey(sanitizedKey);
  displayValidationMessage(null, keyError, keyValidation);
  
  // ボタンの有効性を更新
  const hasValidText = sanitize(textInput.value).length > 0;
  const hasValidKey = /^[A-Z]$/.test(sanitizedKey);
  button.disabled = !(hasValidText && hasValidKey);
};

/**
 * ワンタイムパッド入力の検証
 */
export const validateOTPInputs = () => {
  const textInput = labTabElements.otpText();
  const keyInput = labTabElements.otpKey();
  const textError = labTabElements.otpTextError();
  const button = labTabElements.otpButton();
  const generateKeyButton = labTabElements.generateKeyButton();
  
  // テキスト検証
  const textValidation = validateLabText(textInput.value);
  displayValidationMessage(null, textError, textValidation);
  
  // ボタンの有効性を更新
  const hasValidText = sanitize(textInput.value).length > 0;
  const hasKey = keyInput.value.trim().length > 0;
  
  generateKeyButton.disabled = !hasValidText;
  button.disabled = !(hasValidText && hasKey);
};

/**
 * シーザー暗号実験
 */
export const experimentCaesar = () => {
  const text = labTabElements.caesarText().value;
  const key = labTabElements.caesarKey().value;
  const resultDiv = labTabElements.caesarResult();
  
  if (!text || !key) {
    resultDiv.innerHTML = '<span style="color: var(--text-color)">平文と鍵を入力してください</span>';
    return;
  }
  
  const sanitizedText = sanitize(text);
  const { result } = vigenere(text, key, 'encrypt');

  // インデックスモードに応じたシフト量を計算
  const offset = getIndexingOffset();
  const modeLabel = offset === 0 ? 'A=0' : 'A=1';
  const shiftAmount = getCharDisplayValue(key);

  resultDiv.innerHTML = `
    <div class="result-item">
      <strong>入力:</strong> ${escapeHtml(text)}
    </div>
    <div class="result-item">
      <strong>処理対象（英字のみ）:</strong> ${sanitizedText}
    </div>
    <div class="result-item">
      <strong>鍵（1文字）:</strong> ${key}
    </div>
    <div class="result-item">
      <strong>繰り返された鍵:</strong> ${repeatKey(key, sanitizedText.length)}
    </div>
    <div class="result-item">
      <strong>暗号文:</strong> <span class="highlight-text">${result}</span>
    </div>
    <div style="margin-top: 1rem; padding: 1rem; background-color: var(--viz-cell-bg); border-radius: var(--border-radius);">
      <strong>📝 観察:</strong> 鍵が1文字の場合、すべての文字が同じシフト量（${shiftAmount}）で
      暗号化されます。これはシーザー暗号と同じです！ <span style="font-size: 0.85rem; opacity: 0.7;">[${modeLabel}モード]</span>
    </div>
  `;
};

/**
 * ランダム鍵生成
 */
export const generateRandomKeyForOTP = () => {
  const otpText = labTabElements.otpText().value;
  const sanitizedText = sanitize(otpText);
  
  if (!sanitizedText) {
    alert('まず平文を入力してください');
    return;
  }
  
  const randomKey = generateRandomKey(sanitizedText.length);
  labTabElements.otpKey().value = randomKey;
  
  // 検証を再実行
  validateOTPInputs();
};

/**
 * ワンタイムパッド実験
 */
export const experimentOTP = () => {
  const text = labTabElements.otpText().value;
  const key = labTabElements.otpKey().value;
  const resultDiv = labTabElements.otpResult();
  
  if (!text || !key) {
    resultDiv.innerHTML = '<span style="color: var(--text-color)">平文を入力し、ランダム鍵を生成してください</span>';
    return;
  }
  
  const sanitizedText = sanitize(text);
  const { result, visualization } = vigenere(text, key, 'encrypt');
  
  // 可視化テーブルを作成
  let vizTable = '<table style="margin: 1rem 0; border-collapse: collapse;">';
  vizTable += '<tr><th style="padding: 0.5rem; border: 1px solid var(--input-border);">平文</th>';
  visualization.forEach(v => {
    vizTable += `<td style="padding: 0.5rem; border: 1px solid var(--input-border); text-align: center;">${v.plain}</td>`;
  });
  vizTable += '</tr><tr><th style="padding: 0.5rem; border: 1px solid var(--input-border);">鍵</th>';
  visualization.forEach(v => {
    vizTable += `<td style="padding: 0.5rem; border: 1px solid var(--input-border); text-align: center;">${v.key}</td>`;
  });
  vizTable += '</tr><tr><th style="padding: 0.5rem; border: 1px solid var(--input-border);">暗号文</th>';
  visualization.forEach(v => {
    vizTable += `<td style="padding: 0.5rem; border: 1px solid var(--input-border); text-align: center; font-weight: bold; color: var(--button-bg);">${v.result}</td>`;
  });
  vizTable += '</tr></table>';
  
  resultDiv.innerHTML = `
    <div class="result-item">
      <strong>平文:</strong> ${sanitizedText}
    </div>
    <div class="result-item">
      <strong>ランダム鍵:</strong> ${key}
    </div>
    <div class="result-item">
      <strong>暗号文:</strong> <span class="highlight-text">${result}</span>
    </div>
    ${vizTable}
    <div style="margin-top: 1rem; padding: 1rem; background-color: var(--viz-cell-bg); border-radius: var(--border-radius);">
      <strong>🔐 重要な観察:</strong>
      <ul style="margin: 0.5rem 0;">
        <li>鍵の長さが平文と同じ（${sanitizedText.length}文字）</li>
        <li>鍵がランダムで一度だけ使用される</li>
        <li>この条件下では、理論上解読不可能（情報理論的安全性）</li>
        <li>これがワンタイムパッド暗号の原理です！</li>
      </ul>
    </div>
  `;
};

/**
 * 実験室タブのイベントリスナーを初期化
 */
export const initLabTabEventListeners = () => {
  console.log('🧪 Initializing lab tab event listeners...');
  
  // シーザー暗号実験
  const caesarText = labTabElements.caesarText();
  const caesarKey = labTabElements.caesarKey();
  const otpText = labTabElements.otpText();
  const caesarButton = labTabElements.caesarButton();
  const otpButton = labTabElements.otpButton();
  const generateKeyButton = labTabElements.generateKeyButton();
  
  if (caesarText && caesarKey && otpText) {
    // ボタンを初期状態で無効化
    if (caesarButton) caesarButton.disabled = true;
    if (otpButton) otpButton.disabled = true;
    if (generateKeyButton) generateKeyButton.disabled = true;
    
    // イベントリスナー追加
    caesarText.addEventListener('input', validateCaesarInputs);
    caesarKey.addEventListener('input', validateCaesarInputs);
    otpText.addEventListener('input', validateOTPInputs);
    
    // 初期検証実行
    validateCaesarInputs();
    validateOTPInputs();
    
    console.log('✅ Lab tab input event listeners added');
  } else {
    console.error('❌ Lab tab input elements not found!');
    console.log('- caesarText:', caesarText);
    console.log('- caesarKey:', caesarKey);
    console.log('- otpText:', otpText);
  }
  
  // グローバル関数として残す（HTMLのonclick属性用）
  window.experimentCaesar = experimentCaesar;
  window.generateRandomKey = generateRandomKeyForOTP;
  window.experimentOTP = experimentOTP;
  window.validateCaesarInputs = validateCaesarInputs;
  window.validateOTPInputs = validateOTPInputs;
  
  // デバッグ用のグローバル関数
  window.debugLabTab = () => {
    console.log('🐛 Debug lab tab:');
    console.log('- isInitialized:', isInitialized);
    console.log('- caesarText element:', labTabElements.caesarText());
    console.log('- caesarKey element:', labTabElements.caesarKey());
    console.log('- caesarButton element:', labTabElements.caesarButton());
    console.log('- otpText element:', labTabElements.otpText());
    console.log('- otpButton element:', labTabElements.otpButton());
  };
  
  window.forceValidateLabInputs = () => {
    console.log('🔧 Force validating lab inputs...');
    validateCaesarInputs();
    validateOTPInputs();
  };
};

/**
 * 実験室タブを初期化
 */
export const initLabTab = () => {
  console.log('🧪 Initializing Lab Tab... (isInitialized:', isInitialized, ')');
  
  // 強制的に再初期化を許可（ボタン無効化問題のため）
  
  // イベントリスナーを初期化（遅延実行で確実に）
  setTimeout(() => {
    initLabTabEventListeners();
  }, 100);
  
  // 追加の遅延初期化（Alpine.js完全読み込み待ち）
  setTimeout(() => {
    console.log('🧪 Secondary initialization attempt...');
    initLabTabEventListeners();
  }, 1200);
  
  isInitialized = true;
  console.log('✅ Lab Tab initialized');
};