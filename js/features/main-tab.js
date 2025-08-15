/**
 * Main Tab Functionality
 * メインタブ（暗号化・復号）の機能を担当
 */

import { vigenere, sanitize } from '../core/cipher.js';
import { validateInputText, validateKey } from '../core/validation.js';
import { getUrlParameter, sanitizeUrlText, readFileAsText } from '../core/utils.js';
import { mainTabElements } from '../ui/dom-elements.js';
import { displayValidationMessage, showToast } from '../ui/message-display.js';
import { displayVisualization, highlightTableCell, clearTableHighlight } from '../ui/table-generator.js';

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
  const inputValidation = validateInputText(inputText);
  displayValidationMessage(inputTextWarning, inputTextError, inputValidation);
  
  // 両フィールドが有効な出力を生成できるかチェック
  const sanitizedInput = sanitize(inputText);
  const sanitizedKey = sanitize(keyText);
  
  const hasValidText = sanitizedInput.length > 0;
  const hasValidKey = sanitizedKey.length > 0;
  
  // ボタンの有効/無効を制御
  processButton.disabled = !(hasValidText && hasValidKey && inputValidation.isValid);
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
  const mode = mainTabElements.mode().value;
  const key = mainTabElements.key().value;
  const inputText = mainTabElements.inputText().value;
  
  if (!inputText.trim()) {
    alert('テキストを入力してください。');
    return;
  }
  
  if (!key.trim()) {
    alert('鍵を入力してください。');
    return;
  }
  
  // サニタイズされたテキストを表示
  const sanitizedInput = sanitize(inputText);
  mainTabElements.sanitizedText().value = sanitizedInput;
  
  if (!sanitizedInput) {
    alert('英字を含むテキストを入力してください。');
    return;
  }
  
  // 暗号化・復号の実行
  const { result, visualization } = vigenere(inputText, key, mode);
  mainTabElements.outputText().value = result;
  
  // 可視化テーブルを表示
  const visualizationContainer = mainTabElements.visualization();
  const table = displayVisualization(visualizationContainer, visualization);
  
  // ホバーイベントリスナーを追加
  const cells = table.querySelectorAll('.viz-cell');
  cells.forEach(cell => {
    cell.addEventListener('mouseenter', handleCellHover);
    cell.addEventListener('mouseleave', handleCellLeave);
  });
};

/**
 * 可視化セルのホバー処理
 * @param {Event} event - マウスイベント
 */
export const handleCellHover = (event) => {
  const cell = event.target;
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
    textArea.setSelectionRange(0, 99999);
    
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
  try {
    const encodedText = getUrlParameter('text');
    if (!encodedText) return;
    
    // URL デコードとサニタイズ
    const decodedText = decodeURIComponent(encodedText);
    const sanitizedText = sanitizeUrlText(decodedText);
    
    if (sanitizedText) {
      // 入力フィールドに設定
      mainTabElements.inputText().value = sanitizedText;
      
      // 検証を実行
      validateMainInputs();
      
      // URLパラメータをクリア（オプション）
      const url = new URL(window.location);
      url.searchParams.delete('text');
      window.history.replaceState({}, document.title, url.pathname + url.search);
      
      console.log('Text loaded from URL parameter');
    }
  } catch (error) {
    console.error('Failed to load URL parameter');
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
    const { validateFile } = await import('../core/validation.js');
    const validation = validateFile(file);
    
    if (!validation.isValid) {
      throw new Error(validation.message);
    }
    
    const content = await readFileAsText(file);
    
    if (content.trim()) {
      mainTabElements.inputText().value = content;
      validateMainInputs();
      console.log('ファイルが正常に読み込まれました:', file.name);
    } else {
      throw new Error('ファイルが空です');
    }
  } catch (error) {
    console.error('File processing error');
    alert(error.message || 'ファイルの処理に失敗しました');
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
  mainTabElements.inputText().addEventListener('input', validateMainInputs);
  mainTabElements.key().addEventListener('input', (e) => {
    handleKeyInput(e);
    validateMainInputs();
  });
  
  // Enterキーサポート
  mainTabElements.inputText().addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      processText();
    }
  });
  
  mainTabElements.key().addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
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
};