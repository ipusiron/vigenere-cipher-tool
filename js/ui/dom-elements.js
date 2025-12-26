/**
 * DOM Elements Management
 * DOM要素の取得と管理を担当
 */

/**
 * メインタブの要素
 */
export const mainTabElements = {
  mode: () => document.getElementById('mode'),
  inputText: () => document.getElementById('inputText'),
  key: () => document.getElementById('key'),
  sanitizedText: () => document.getElementById('sanitizedText'),
  outputText: () => document.getElementById('outputText'),
  processButton: () => document.getElementById('processButton'),
  visualization: () => document.getElementById('visualization'),
  vigenereTable: () => document.getElementById('vigenereTable'),
  inputTextWarning: () => document.getElementById('inputTextWarning'),
  inputTextError: () => document.getElementById('inputTextError'),
  keyWarning: () => document.getElementById('keyWarning'),
  copyButton: () => document.getElementById('copyButton'),
  copyToast: () => document.getElementById('copyToast'),
  fileInput: () => document.getElementById('fileInput'),
  fileSelectButton: () => document.getElementById('fileSelectButton'),
  textareaDropZone: () => document.getElementById('textareaDropZone'),
  dropOverlay: () => document.getElementById('dropOverlay')
};

/**
 * 研究タブの要素
 */
export const researchTabElements = {
  researchTable: () => document.getElementById('researchTable'),
  plainChar: () => document.getElementById('plainChar'),
  keyChar: () => document.getElementById('keyChar'),
  cipherCharResult: () => document.getElementById('cipherCharResult'),
  researchResult: () => document.getElementById('researchResult'),
  plainCharReverse: () => document.getElementById('plainCharReverse'),
  cipherCharReverse: () => document.getElementById('cipherCharReverse'),
  keyCharReverseResult: () => document.getElementById('keyCharReverseResult'),
  researchReverseResult: () => document.getElementById('researchReverseResult')
};

/**
 * 実験室タブの要素
 */
export const labTabElements = {
  // シーザー暗号実験
  caesarText: () => document.getElementById('caesarText'),
  caesarKey: () => document.getElementById('caesarKey'),
  caesarButton: () => document.getElementById('caesarButton'),
  caesarResult: () => document.getElementById('caesarResult'),
  caesarTextError: () => document.getElementById('caesarTextError'),
  caesarKeyError: () => document.getElementById('caesarKeyError'),
  
  // ワンタイムパッド実験
  otpText: () => document.getElementById('otpText'),
  otpKey: () => document.getElementById('otpKey'),
  otpButton: () => document.getElementById('otpButton'),
  otpResult: () => document.getElementById('otpResult'),
  otpTextError: () => document.getElementById('otpTextError'),
  generateKeyButton: () => document.getElementById('generateKeyButton')
};

/**
 * UI全般の要素
 */
export const uiElements = {
  themeToggle: () => document.getElementById('theme-toggle'),
  indexingModeToggle: () => document.getElementById('indexing-mode-toggle'),
  indexingModeLabel: () => document.getElementById('indexing-mode-label'),
  helpToggle: () => document.getElementById('help-toggle'),
  helpModal: () => document.getElementById('help-modal'),
  modalClose: () => document.querySelector('.modal-close')
};

/**
 * 全ての要素を含む統合オブジェクト（後方互換性のため）
 */
export const elements = {
  ...mainTabElements,
  ...researchTabElements,
  ...labTabElements,
  ...uiElements
};

/**
 * 指定されたIDの要素を安全に取得
 * @param {string} id - 要素ID
 * @returns {HTMLElement|null} 要素またはnull
 */
export const getElementById = (id) => {
  const element = document.getElementById(id);
  if (!element) {
    console.warn(`Element with ID '${id}' not found`);
  }
  return element;
};

/**
 * 複数の要素を一度に取得
 * @param {string[]} ids - 要素IDの配列
 * @returns {Object} {id: element} の形式のオブジェクト
 */
export const getElementsByIds = (ids) => {
  const elements = {};
  ids.forEach(id => {
    elements[id] = getElementById(id);
  });
  return elements;
};

/**
 * 要素の存在確認
 * @param {string} id - 要素ID
 * @returns {boolean} 存在する場合true
 */
export const elementExists = (id) => {
  return document.getElementById(id) !== null;
};

/**
 * クラス名で要素を取得
 * @param {string} className - クラス名
 * @returns {NodeList} 要素のリスト
 */
export const getElementsByClassName = (className) => {
  return document.getElementsByClassName(className);
};

/**
 * セレクタで要素を取得
 * @param {string} selector - CSSセレクタ
 * @returns {HTMLElement|null} 最初の要素またはnull
 */
export const querySelector = (selector) => {
  return document.querySelector(selector);
};

/**
 * セレクタで複数の要素を取得
 * @param {string} selector - CSSセレクタ
 * @returns {NodeList} 要素のリスト
 */
export const querySelectorAll = (selector) => {
  return document.querySelectorAll(selector);
};