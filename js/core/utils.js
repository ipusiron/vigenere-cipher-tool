/**
 * Utility Functions
 * 汎用的なヘルパー関数
 */

/**
 * URLパラメータを取得
 * @param {string} name - パラメータ名
 * @returns {string|null} パラメータ値
 */
export const getUrlParameter = (name) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
};

/**
 * URLから取得したテキストをサニタイズ（XSS防止）
 * @param {string} text - 入力テキスト
 * @returns {string} サニタイズされたテキスト
 */
export const sanitizeUrlText = (text) => {
  if (!text) return '';
  
  // 長さ制限（セキュリティ対策）
  const maxLength = 10000;
  if (text.length > maxLength) {
    console.warn('Input text was truncated due to length limit');
    text = text.substring(0, maxLength);
  }
  
  // HTMLエンティティエスケープ
  const htmlEscapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };
  
  // HTMLエンティティと危険な文字をエスケープ
  text = text.replace(/[&<>"'/`=]/g, (match) => htmlEscapeMap[match]);
  
  // 制御文字と非印刷文字を除去
  text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');
  
  // 危険なプロトコルを除去
  text = text.replace(/^(javascript|data|vbscript|file|about|blob):/gi, '');
  
  return text;
};

/**
 * ファイルをテキストとして読み込み
 * @param {File} file - ファイルオブジェクト
 * @returns {Promise<string>} ファイル内容
 */
export const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        let content = event.target.result;
        content = sanitizeUrlText(content);
        resolve(content);
      } catch (error) {
        reject(new Error('ファイルの処理に失敗しました'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('ファイルの読み込みに失敗しました'));
    };
    
    reader.readAsText(file, 'UTF-8');
  });
};

/**
 * ランダムな英字文字列を生成
 * @param {number} length - 文字列の長さ
 * @returns {string} ランダム文字列
 */
export const generateRandomKey = (length) => {
  const CHAR_CODE_A = 'A'.charCodeAt(0);
  const ALPHABET_SIZE = 26;
  
  let result = '';
  for (let i = 0; i < length; i++) {
    result += String.fromCharCode(Math.floor(Math.random() * ALPHABET_SIZE) + CHAR_CODE_A);
  }
  return result;
};

/**
 * 要素にクラスを追加してメッセージを表示
 * @param {HTMLElement} element - 対象要素
 * @param {string} message - メッセージ
 * @param {string} type - 'warning' | 'error'
 */
export const showMessage = (element, message, type) => {
  element.textContent = message;
  element.classList.remove('show');
  element.classList.add('show');
};

/**
 * 要素からクラスを削除してメッセージを非表示
 * @param {HTMLElement} element - 対象要素
 */
export const hideMessage = (element) => {
  element.classList.remove('show');
};

/**
 * 配列をシャッフル（Fisher-Yates法）
 * @param {Array} array - 対象配列
 * @returns {Array} シャッフルされた配列
 */
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * 数値を指定した範囲内に制限
 * @param {number} value - 値
 * @param {number} min - 最小値
 * @param {number} max - 最大値
 * @returns {number} 制限された値
 */
export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

/**
 * 文字列が空白のみかどうかチェック
 * @param {string} str - 文字列
 * @returns {boolean} 空白のみの場合true
 */
export const isWhitespace = (str) => {
  return !str || /^\s*$/.test(str);
};