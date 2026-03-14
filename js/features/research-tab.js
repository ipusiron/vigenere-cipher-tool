/**
 * Research Tab Functionality
 * 研究タブ（タブラ・レクタ研究）の機能を担当
 */

import { encryptChar, findKeyChar } from '../core/cipher.js';
import { getIndexingOffset, getCharDisplayValue } from '../core/indexing-mode.js';
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
  console.log('🔍 Initializing research table...');
  const tableDiv = researchTabElements.researchTable();
  console.log('📍 Research table div:', tableDiv);
  
  if (tableDiv) {
    const existingTable = tableDiv.querySelector('table');
    console.log('🔍 Existing table:', existingTable);
    
    if (!existingTable) {
      console.log('🔄 Generating new research table...');
      generateResearchTable(tableDiv);
      console.log('✅ Research table generated');
    } else {
      console.log('ℹ️ Research table already exists');
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
    resultDiv.innerHTML = '<span style="color: var(--text-color)">平文文字と鍵文字を選択してください</span>';
    return;
  }
  
  const cipherChar = encryptChar(plainChar, keyChar);

  // 暗号文字結果を更新
  cipherResultSpan.textContent = cipherChar;

  // インデックスモードに応じた表示値を取得
  const offset = getIndexingOffset();
  const modeLabel = offset === 0 ? 'A=0' : 'A=1';
  const plainValue = getCharDisplayValue(plainChar);
  const keyValue = getCharDisplayValue(keyChar);
  const cipherValue = getCharDisplayValue(cipherChar);

  resultDiv.innerHTML = `
    <div>
      <div style="margin-bottom: 0.5rem;">
        <span>計算式: <strong style="font-family: 'Courier New', monospace; font-size: 1.1rem;">${cipherChar}←shift(${plainChar}, ${keyChar})</strong></span>
        <span style="font-size: 0.8rem; opacity: 0.7; margin-left: 0.5rem;">[${modeLabel}モード]</span>
      </div>
      <div style="font-size: 0.9rem; color: var(--text-color); opacity: 0.8; font-family: 'Courier New', monospace;">
        ${plainChar}(${plainValue}) + ${keyChar}(${keyValue})
        = ${cipherValue}
        → ${cipherChar}
      </div>
    </div>
  `;
  
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
    resultDiv.innerHTML = '<span style="color: var(--text-color)">平文文字と暗号文文字を選択してください</span>';
    return;
  }
  
  const keyChar = findKeyChar(plainChar, cipherChar);

  // 鍵文字結果を更新
  keyResultSpan.textContent = keyChar;

  // インデックスモードに応じた表示値を取得
  const offset = getIndexingOffset();
  const modeLabel = offset === 0 ? 'A=0' : 'A=1';
  const cipherValue = getCharDisplayValue(cipherChar);
  const plainValue = getCharDisplayValue(plainChar);
  const keyValue = getCharDisplayValue(keyChar);

  resultDiv.innerHTML = `
    <div>
      <div style="margin-bottom: 0.5rem;">
        <span>計算式: <strong style="font-family: 'Courier New', monospace; font-size: 1.1rem;">${keyChar}←findKey(${plainChar}, ${cipherChar})</strong></span>
        <span style="font-size: 0.8rem; opacity: 0.7; margin-left: 0.5rem;">[${modeLabel}モード]</span>
      </div>
      <div style="font-size: 0.9rem; color: var(--text-color); opacity: 0.8; font-family: 'Courier New', monospace;">
        ${cipherChar}(${cipherValue}) - ${plainChar}(${plainValue})
        = ${keyValue}
        → ${keyChar}
      </div>
    </div>
  `;
  
  // 関連セルをハイライト
  highlightResearchCell(plainChar, keyChar);
};

/**
 * 研究タブのイベントリスナーを初期化
 */
export const initResearchTabEventListeners = () => {
  // 計算ボタンのイベントリスナー（グローバル関数として残す）
  window.researchTabula = researchTabula;
  window.researchReverseTabula = researchReverseTabula;
  
  // デバッグ用のグローバル関数
  window.forceInitResearchTable = () => {
    console.log('🔧 Force initializing research table...');
    initResearchTable();
  };
  window.debugResearchTab = () => {
    console.log('🐛 Debug research tab:');
    console.log('- isInitialized:', isInitialized);
    console.log('- researchTable element:', researchTabElements.researchTable());
    console.log('- existing table:', researchTabElements.researchTable()?.querySelector('table'));
  };
};

/**
 * 研究タブを初期化
 */
export const initResearchTab = () => {
  console.log('🔬 Initializing Research Tab... (isInitialized:', isInitialized, ')');
  
  // 強制的に再初期化を許可（テーブルが表示されない問題のため）
  
  // テーブルを初期化
  setTimeout(() => {
    initResearchTable();
  }, 100);
  
  // 追加の遅延初期化（Alpine.js完全読み込み待ち）
  setTimeout(() => {
    console.log('🔬 Secondary initialization attempt...');
    initResearchTable();
  }, 1000);
  
  // イベントリスナーを初期化
  initResearchTabEventListeners();
  
  isInitialized = true;
  console.log('✅ Research Tab initialized');
};