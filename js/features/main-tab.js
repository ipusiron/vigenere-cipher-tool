/**
 * Main Tab Functionality
 * メインタブ（暗号化・復号）の機能を担当
 */

import { vigenere, sanitize, formatOutput } from '../core/cipher.js';
import { validateInputText, validateFile } from '../core/validation.js';
import { readFileAsText } from '../core/utils.js';
import { normalizeLoadedText, readTextParam, MAX_TEXT_LENGTH } from '../core/input.js';
import { getIndexingOffset } from '../core/indexing-mode.js';
import { mainTabElements } from '../ui/dom-elements.js';
import { displayValidationMessage, showToast, showWarning, showError } from '../ui/message-display.js';
import { displayVisualization, highlightTableCell, clearTableHighlight } from '../ui/table-generator.js';

let hasResult = false;
let loadWarning = '';

export const clearMainResult = () => {
  hasResult = false;
  mainTabElements.sanitizedText().value = '';
  mainTabElements.outputText().value = '';
  mainTabElements.visualization().replaceChildren();
  clearTableHighlight();
};

const applyLoadedText = (raw) => {
  const loaded = normalizeLoadedText(raw);
  mainTabElements.inputText().value = loaded.text;
  loadWarning = loaded.truncated
    ? `先頭${MAX_TEXT_LENGTH.toLocaleString('en-US')}文字だけを読み込みました（元は${loaded.originalLength.toLocaleString('en-US')}文字）`
    : '';
  clearMainResult();
  validateMainInputs();
};

export const refreshMainResult = () => {
  if (hasResult) processText();
};

/**
 * メインタブの入力を検証してUI更新
 */
export const validateMainInputs = () => {
  const inputText = mainTabElements.inputText().value;
  const keyText = mainTabElements.key().value.trim();
  const processButton = mainTabElements.processButton();
  const inputTextWarning = mainTabElements.inputTextWarning();
  const inputTextError = mainTabElements.inputTextError();
  
  // 入力テキストの検証
  const inputValidation = validateInputText(inputText, mainTabElements.outputFormat().value);
  displayValidationMessage(inputTextWarning, inputTextError, inputValidation);
  
  // 両フィールドが有効な出力を生成できるかチェック
  const sanitizedInput = sanitize(inputText);
  const sanitizedKey = sanitize(keyText);
  
  const hasValidText = sanitizedInput.length > 0;
  const hasValidKey = sanitizedKey.length > 0;
  
  // ボタンの有効/無効を制御
  const canProcess = hasValidText && hasValidKey && inputValidation.isValid;
  processButton.disabled = !canProcess;
  if (!canProcess) clearMainResult();
  if (loadWarning) showWarning(inputTextWarning, loadWarning);
  return canProcess;
};

/**
 * 鍵入力の処理（リアルタイム変換と検証）
 * @param {Event} event - 入力イベント
 */
export const handleKeyInput = (event) => {
  const input = event.target;
  const originalValue = input.value;
  const cursorPosition = input.selectionStart;
  
  // 大文字変換と非英字文字の除去
  const sanitizedValue = originalValue.toUpperCase().replace(/[^A-Z]/g, '');
  
  // 入力値を更新
  input.value = sanitizedValue;
  
  // カーソル位置を復元（削除された文字数を考慮）
  const removedChars = originalValue.length - sanitizedValue.length;
  const newCursorPosition = Math.max(0, cursorPosition - removedChars);
  input.setSelectionRange(newCursorPosition, newCursorPosition);
  
  // 警告メッセージの表示/非表示
  const hasNonAlphabetic = /[^A-Za-z]/.test(originalValue);
  const warning = mainTabElements.keyWarning();
  
  if (hasNonAlphabetic && sanitizedValue !== originalValue) {
    warning.classList.add('show');
  } else {
    warning.classList.remove('show');
  }
};

/**
 * テキスト処理（暗号化・復号の実行）
 */
export const processText = () => {
  if (!validateMainInputs()) return;
  if (mainTabElements.inputText().value.length > MAX_TEXT_LENGTH) {
    applyLoadedText(mainTabElements.inputText().value);
    if (!validateMainInputs()) return;
  }
  const mode = mainTabElements.mode().value;
  const key = mainTabElements.key().value;
  const inputText = mainTabElements.inputText().value;
  const offset = getIndexingOffset();
  const format = mainTabElements.outputFormat().value;
  mainTabElements.sanitizedText().value = sanitize(inputText);
  const { visualization } = vigenere(inputText, key, mode, offset);
  mainTabElements.outputText().value = formatOutput(inputText, key, mode, offset, format);
  displayVisualization(mainTabElements.visualization(), visualization, mode);
  hasResult = true;
};

/**
 * 可視化セルのホバー処理
 * @param {Event} event - マウスイベント
 */
export const handleCellHover = (event) => {
  const cell = event.target.closest('.viz-cell');
  if (!cell) return;
  const plain = cell.dataset.plain;
  const key = cell.dataset.key;
  highlightTableCell(plain, key);
};

/**
 * 可視化セルのホバー終了処理
 */
export const handleCellLeave = () => {
  clearTableHighlight();
};

/**
 * クリップボードにコピー
 */
export const copyToClipboard = async () => {
  const outputText = mainTabElements.outputText().value;
  
  if (!outputText.trim()) {
    return;
  }
  
  try {
    await navigator.clipboard.writeText(outputText);
    showToast(mainTabElements.copyToast());
  } catch (err) {
    // フォールバック（古いブラウザ対応）
    const textArea = mainTabElements.outputText();
    textArea.select();
    textArea.setSelectionRange(0, outputText.length);
    
    try {
      document.execCommand('copy');
      showToast(mainTabElements.copyToast());
    } catch (fallbackErr) {
      console.error('Copy operation failed');
    }
  }
};

/**
 * URLパラメータからテキストを読み込み
 */
export const loadTextFromUrl = () => {
  const url = new URL(window.location.href);
  if (!url.searchParams.has('text')) return;
  try {
    const raw = url.searchParams.get('text');
    applyLoadedText(raw);
    mainTabElements.inputText().value = readTextParam(url.search);
  } catch {
    showError(mainTabElements.inputTextError(), 'URLのテキストを読み込めませんでした');
  } finally {
    url.searchParams.delete('text');
    window.history.replaceState({}, document.title, url.pathname + url.search + url.hash);
  }
};

/**
 * ファイル選択ボタンのクリック処理
 */
export const handleFileSelect = () => {
  mainTabElements.fileInput().click();
};

/**
 * ファイル変更時の処理
 * @param {Event} event - ファイル変更イベント
 */
export const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    handleFileLoad(file);
  }
  // ファイル入力をリセット
  event.target.value = '';
};

/**
 * ファイル読み込み処理
 * @param {File} file - ファイルオブジェクト
 */
export const handleFileLoad = async (file) => {
  try {
    const validation = validateFile(file);
    
    if (!validation.isValid) {
      throw new Error(validation.message);
    }
    
    const content = await readFileAsText(file);
    
    if (content.trim()) {
      applyLoadedText(content);
    } else {
      throw new Error('ファイルが空です');
    }
  } catch (error) {
    showError(mainTabElements.inputTextError(), error.message || 'ファイルの処理に失敗しました');
  }
};

/**
 * ドラッグオーバー処理
 * @param {Event} event - ドラッグイベント
 */
export const handleDragOver = (event) => {
  event.preventDefault();
  event.stopPropagation();
  mainTabElements.textareaDropZone().classList.add('drag-over');
};

/**
 * ドラッグリーブ処理
 * @param {Event} event - ドラッグイベント
 */
export const handleDragLeave = (event) => {
  event.preventDefault();
  event.stopPropagation();
  
  // ドロップゾーンを完全に離れた場合のみクラスを削除
  const rect = mainTabElements.textareaDropZone().getBoundingClientRect();
  const x = event.clientX;
  const y = event.clientY;
  
  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    mainTabElements.textareaDropZone().classList.remove('drag-over');
  }
};

/**
 * ドロップ処理
 * @param {Event} event - ドロップイベント
 */
export const handleDrop = (event) => {
  event.preventDefault();
  event.stopPropagation();
  mainTabElements.textareaDropZone().classList.remove('drag-over');
  
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    handleFileLoad(files[0]);
  }
};

/**
 * メインタブのイベントリスナーを初期化
 */
export const initMainTabEventListeners = () => {
  // 基本操作
  mainTabElements.processButton().addEventListener('click', processText);
  mainTabElements.copyButton().addEventListener('click', copyToClipboard);
  
  // 入力検証
  mainTabElements.inputText().addEventListener('input', () => {
    loadWarning = '';
    clearMainResult();
    validateMainInputs();
  });
  mainTabElements.mode().addEventListener('change', clearMainResult);
  mainTabElements.outputFormat().addEventListener('change', () => {
    validateMainInputs();
    refreshMainResult();
  });
  const visualization = mainTabElements.visualization();
  visualization.addEventListener('mouseover', handleCellHover);
  visualization.addEventListener('mouseout', handleCellLeave);
  visualization.addEventListener('click', handleCellHover);
  mainTabElements.key().addEventListener('input', (e) => {
    clearMainResult();
    handleKeyInput(e);
    validateMainInputs();
  });
  
  // Enterキーサポート
  mainTabElements.inputText().addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      processText();
    }
  });
  
  mainTabElements.key().addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      processText();
    }
  });
  
  // ファイル操作
  mainTabElements.fileSelectButton().addEventListener('click', handleFileSelect);
  mainTabElements.fileInput().addEventListener('change', handleFileChange);
  
  // ドラッグ&ドロップ
  const dropZone = mainTabElements.textareaDropZone();
  dropZone.addEventListener('dragover', handleDragOver);
  dropZone.addEventListener('dragleave', handleDragLeave);
  dropZone.addEventListener('drop', handleDrop);
  
  // ドキュメント全体でデフォルトのドラッグ動作を防止
  document.addEventListener('dragover', (e) => e.preventDefault());
  document.addEventListener('drop', (e) => e.preventDefault());
};

/**
 * メインタブを初期化
 */
export const initMainTab = () => {
  initMainTabEventListeners();
  loadTextFromUrl();
  validateMainInputs();
};
