/**
 * Research Tab Functionality
 * 研究タブ（タブラ・レクタ研究）の機能を担当
 */

import { encryptChar, findKeyChar } from '../core/cipher.js';
import { getIndexingOffset } from '../core/indexing-mode.js';
import { encryptFormula, keyFormula } from '../core/formula.js';
import { researchTabElements } from '../ui/dom-elements.js';
import { generateResearchTable, highlightResearchCell } from '../ui/table-generator.js';

/**
 * 研究タブの初期化フラグ
 */
let isInitialized = false;

/**
 * 研究用のテーブルを初期化
 */
export const initResearchTable = () => {
  const tableDiv = researchTabElements.researchTable();
  
  if (tableDiv) {
    const existingTable = tableDiv.querySelector('table');
    
    if (!existingTable) {
      generateResearchTable(tableDiv);
    } else {
    }
  } else {
    console.error('❌ Research table div not found!');
  }
};

/**
 * タブラ研究（暗号化実験）
 */
export const researchTabula = () => {
  const plainChar = researchTabElements.plainChar().value;
  const keyChar = researchTabElements.keyChar().value;
  const resultDiv = researchTabElements.researchResult();
  const cipherResultSpan = researchTabElements.cipherCharResult();
  
  if (!plainChar || !keyChar) {
    cipherResultSpan.textContent = '―';
    resultDiv.textContent = '平文文字と鍵文字を選択してください';
    return;
  }
  
  const cipherChar = encryptChar(plainChar, keyChar, getIndexingOffset());

  // 暗号文字結果を更新
  cipherResultSpan.textContent = cipherChar;

  // インデックスモードに応じた表示値を取得
  const offset = getIndexingOffset();
  resultDiv.textContent = encryptFormula(plainChar, keyChar, offset);
  
  // テーブルが存在しない場合は生成
  if (!researchTabElements.researchTable().querySelector('table')) {
    initResearchTable();
  }
  
  // 関連セルをハイライト
  highlightResearchCell(plainChar, keyChar);
};

/**
 * 逆タブラ研究（復号実験）
 */
export const researchReverseTabula = () => {
  const plainChar = researchTabElements.plainCharReverse().value;
  const cipherChar = researchTabElements.cipherCharReverse().value;
  const resultDiv = researchTabElements.researchReverseResult();
  const keyResultSpan = researchTabElements.keyCharReverseResult();
  
  if (!plainChar || !cipherChar) {
    keyResultSpan.textContent = '―';
    resultDiv.textContent = '平文文字と暗号文文字を選択してください';
    return;
  }
  
  const keyChar = findKeyChar(plainChar, cipherChar, getIndexingOffset());

  // 鍵文字結果を更新
  keyResultSpan.textContent = keyChar;

  // インデックスモードに応じた表示値を取得
  const offset = getIndexingOffset();
  resultDiv.textContent = keyFormula(plainChar, cipherChar, offset);
  
  // 関連セルをハイライト
  highlightResearchCell(plainChar, keyChar);
};

/**
 * 研究タブのイベントリスナーを初期化
 */
export const initResearchTabEventListeners = () => {
  for (const element of [researchTabElements.plainChar(), researchTabElements.keyChar()]) {
    element.addEventListener('change', researchTabula);
  }
  for (const element of [researchTabElements.plainCharReverse(), researchTabElements.cipherCharReverse()]) {
    element.addEventListener('change', researchReverseTabula);
  }
  document.getElementById('researchButton').addEventListener('click', researchTabula);
  document.getElementById('researchReverseButton').addEventListener('click', researchReverseTabula);
};

export const refreshResearchResults = () => {
  if (researchTabElements.plainChar().value && researchTabElements.keyChar().value) researchTabula();
  if (researchTabElements.plainCharReverse().value && researchTabElements.cipherCharReverse().value) researchReverseTabula();
};

/**
 * 研究タブを初期化
 */
export const initResearchTab = () => {
  if (isInitialized) return;
  initResearchTable();
  initResearchTabEventListeners();
  isInitialized = true;
};
