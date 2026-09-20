/**
 * Lab Tab Functionality
 * 実験室タブの機能を担当
 */

import { vigenere, sanitize, repeatKey } from '../core/cipher.js';
import { getIndexingOffset, getCharDisplayValue } from '../core/indexing-mode.js';
import { validateLabText, validateCaesarKey } from '../core/validation.js';
import { generateRandomKey } from '../core/random.js';
import { labTabElements } from '../ui/dom-elements.js';
import { displayVisualization } from '../ui/table-generator.js';
import { displayValidationMessage, showError } from '../ui/message-display.js';

/**
 * 実験室タブの初期化フラグ
 */
let isInitialized = false;

/** 結果の1行を入力のHTML解釈なしで追加する。 */
const appendResult = (container, label, value, highlight = false) => {
  const item = document.createElement('div');
  item.className = 'result-item';
  const title = document.createElement('strong');
  title.textContent = label + ': ';
  const content = document.createElement('span');
  content.textContent = value;
  if (highlight) content.className = 'highlight-text';
  item.append(title, content);
  container.appendChild(item);
};
let caesarHasResult = false;
let otpHasResult = false;
let otpNeedsKey = false;

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
  button.disabled = !(hasValidText && hasValidKey && textValidation.isValid);
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
  const hasKey = keyInput.value.length === sanitize(textInput.value).length && keyInput.value.length > 0;
  if (keyInput.value && !hasKey) {
    keyInput.value = '';
    otpNeedsKey = true;
    otpHasResult = false;
    labTabElements.otpResult().replaceChildren();
  }
  if (otpNeedsKey) showError(textError, '平文が変わりました。鍵を生成し直してください');
  
  generateKeyButton.disabled = !(hasValidText && textValidation.isValid);
  button.disabled = !(hasValidText && hasKey && textValidation.isValid);
};

/**
 * シーザー暗号実験
 */
export const experimentCaesar = () => {
  const text = labTabElements.caesarText().value;
  const key = labTabElements.caesarKey().value;
  const resultDiv = labTabElements.caesarResult();
  
  validateCaesarInputs();
  if (labTabElements.caesarButton().disabled) return;
  
  const sanitizedText = sanitize(text);
  const { result } = vigenere(text, key, 'encrypt', getIndexingOffset());

  // インデックスモードに応じたシフト量を計算
  const offset = getIndexingOffset();
  const modeLabel = offset === 0 ? 'A=0' : 'A=1';
  const shiftAmount = getCharDisplayValue(key);

  resultDiv.replaceChildren();
  appendResult(resultDiv, '入力', text);
  appendResult(resultDiv, '処理対象（英字のみ）', sanitizedText);
  appendResult(resultDiv, '鍵（1文字）', key);
  appendResult(resultDiv, '繰り返された鍵', repeatKey(key, sanitizedText.length));
  appendResult(resultDiv, '暗号文', result, true);
  appendResult(resultDiv, 'シフト量', String(shiftAmount));
  appendResult(resultDiv, '観察', `すべての文字を同じ量だけずらすシーザー暗号です（${modeLabel}）。`);
  caesarHasResult = true;
};

/**
 * ランダム鍵生成
 */
export const generateRandomKeyForOTP = () => {
  const otpText = labTabElements.otpText().value;
  const sanitizedText = sanitize(otpText);
  
  if (!sanitizedText) {
    showError(labTabElements.otpTextError(), 'まず平文を入力してください');
    return;
  }
  
  if (!validateLabText(otpText).isValid) return;
  otpNeedsKey = false;
  otpHasResult = false;
  labTabElements.otpResult().replaceChildren();
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
  
  validateOTPInputs();
  if (labTabElements.otpButton().disabled || key.length !== sanitize(text).length) return;
  
  const sanitizedText = sanitize(text);
  const { result, visualization } = vigenere(text, key, 'encrypt', getIndexingOffset());

  resultDiv.replaceChildren();
  appendResult(resultDiv, '平文', sanitizedText);
  appendResult(resultDiv, 'ランダム鍵', key);
  appendResult(resultDiv, '暗号文', result, true);
  const visualizationContainer = document.createElement('div');
  visualizationContainer.className = 'lab-visualization';
  displayVisualization(visualizationContainer, visualization);
  resultDiv.appendChild(visualizationContainer);
  appendResult(resultDiv, '観察', `鍵の長さが平文と同じ（${key.length}文字）`);
  appendResult(resultDiv, '注意', 'ブラウザーの乱数による実験です。鍵の配送・破棄までは再現しません。');
  otpHasResult = true;
};

/**
 * 実験室タブのイベントリスナーを初期化
 */
export const initLabTabEventListeners = () => {
  
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
    
  } else {
    console.error('❌ Lab tab input elements not found!');
  }
  
  caesarButton.addEventListener('click', experimentCaesar);
  otpButton.addEventListener('click', experimentOTP);
  generateKeyButton.addEventListener('click', generateRandomKeyForOTP);
};

export const refreshLabResults = () => {
  if (caesarHasResult) experimentCaesar();
  if (otpHasResult) experimentOTP();
};

/**
 * 実験室タブを初期化
 */
export const initLabTab = () => {
  if (isInitialized) return;
  initLabTabEventListeners();
  isInitialized = true;
};
