/**
 * Indexing Mode Management
 * インデックスモード管理 (A=0 または A=1)
 */

const STORAGE_KEY = 'indexingMode';
const DEFAULT_MODE = 0; // A=0 is default

const CHAR_CODE_A = 'A'.charCodeAt(0);
let currentOffset = DEFAULT_MODE;
try {
  currentOffset = localStorage.getItem(STORAGE_KEY) === '1' ? 1 : 0;
} catch {
  // 保存領域が使えない場合もメモリー内の値で動作する。
}

/**
 * 現在のインデックスオフセットを取得 (0 または 1)
 * @returns {number} A=0モードなら0、A=1モードなら1
 */
export const getIndexingOffset = () => {
  return currentOffset;
};

/**
 * モードラベルを取得（表示用）
 * @returns {string} 'A=0' または 'A=1'
 */
export const getIndexingModeLabel = () => {
  return getIndexingOffset() === 0 ? 'A=0' : 'A=1';
};

/**
 * インデックスモードを設定
 * @param {number} offset - 0 (A=0) または 1 (A=1)
 */
export const setIndexingMode = (offset) => {
  const validOffset = (offset === 1) ? 1 : 0;
  currentOffset = validOffset;
  try {
    localStorage.setItem(STORAGE_KEY, String(validOffset));
  } catch {
    // 保存できなくても現在のページでは設定を保持する。
  }
  // カスタムイベントを発火してリスナーに通知
  window.dispatchEvent(new CustomEvent('indexingModeChanged', {
    detail: { offset: validOffset }
  }));
};

/**
 * A=0 と A=1 を切り替え
 * @returns {number} 新しいオフセット値
 */
export const toggleIndexingMode = () => {
  const current = getIndexingOffset();
  const newOffset = current === 0 ? 1 : 0;
  setIndexingMode(newOffset);
  return newOffset;
};

/**
 * モードに基づいた文字の表示値を取得
 * @param {string} char - 文字 (A-Z)
 * @returns {number} インデックス値 (A=0なら0-25、A=1なら1-26)
 */
export const getCharDisplayValue = (char) => {
  const baseValue = char.charCodeAt(0) - CHAR_CODE_A;
  return baseValue + getIndexingOffset();
};
