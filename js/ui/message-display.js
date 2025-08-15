/**
 * Message Display Management
 * メッセージ表示の責任を担当
 */

/**
 * 警告メッセージを表示
 * @param {HTMLElement} element - 対象要素
 * @param {string} message - メッセージ内容
 */
export const showWarning = (element, message) => {
  if (!element) return;
  
  element.textContent = message;
  element.classList.add('show');
  element.classList.remove('error');
  element.classList.add('warning');
};

/**
 * エラーメッセージを表示
 * @param {HTMLElement} element - 対象要素
 * @param {string} message - メッセージ内容
 */
export const showError = (element, message) => {
  if (!element) return;
  
  element.textContent = message;
  element.classList.add('show');
  element.classList.remove('warning');
  element.classList.add('error');
};

/**
 * メッセージを非表示
 * @param {HTMLElement} element - 対象要素
 */
export const hideMessage = (element) => {
  if (!element) return;
  
  element.classList.remove('show');
  element.classList.remove('warning');
  element.classList.remove('error');
};

/**
 * 複数のメッセージ要素を一度に非表示
 * @param {HTMLElement[]} elements - 要素の配列
 */
export const hideMessages = (elements) => {
  elements.forEach(element => hideMessage(element));
};

/**
 * 検証結果に基づいてメッセージを表示
 * @param {HTMLElement} warningElement - 警告メッセージ要素
 * @param {HTMLElement} errorElement - エラーメッセージ要素
 * @param {Object} validationResult - 検証結果 {type, message}
 */
export const displayValidationMessage = (warningElement, errorElement, validationResult) => {
  hideMessage(warningElement);
  hideMessage(errorElement);
  
  if (validationResult.type === 'warning') {
    showWarning(warningElement, validationResult.message);
  } else if (validationResult.type === 'error') {
    showError(errorElement, validationResult.message);
  }
};

/**
 * トーストメッセージを表示
 * @param {HTMLElement} element - トースト要素
 * @param {number} duration - 表示時間（ミリ秒）
 */
export const showToast = (element, duration = 2000) => {
  if (!element) return;
  
  element.classList.add('show');
  
  setTimeout(() => {
    element.classList.remove('show');
  }, duration);
};

/**
 * ローディング状態を表示
 * @param {HTMLElement} element - 対象要素
 * @param {boolean} isLoading - ローディング中かどうか
 */
export const setLoadingState = (element, isLoading) => {
  if (!element) return;
  
  if (isLoading) {
    element.classList.add('loading');
    element.disabled = true;
  } else {
    element.classList.remove('loading');
    element.disabled = false;
  }
};

/**
 * 成功メッセージを表示
 * @param {HTMLElement} element - 対象要素
 * @param {string} message - メッセージ内容
 */
export const showSuccess = (element, message) => {
  if (!element) return;
  
  element.textContent = message;
  element.classList.add('show');
  element.classList.remove('warning', 'error');
  element.classList.add('success');
};

/**
 * インフォメッセージを表示
 * @param {HTMLElement} element - 対象要素
 * @param {string} message - メッセージ内容
 */
export const showInfo = (element, message) => {
  if (!element) return;
  
  element.textContent = message;
  element.classList.add('show');
  element.classList.remove('warning', 'error', 'success');
  element.classList.add('info');
};

/**
 * メッセージの種類を変更
 * @param {HTMLElement} element - 対象要素
 * @param {string} type - メッセージタイプ ('warning', 'error', 'success', 'info')
 */
export const setMessageType = (element, type) => {
  if (!element) return;
  
  const types = ['warning', 'error', 'success', 'info'];
  types.forEach(t => element.classList.remove(t));
  
  if (types.includes(type)) {
    element.classList.add(type);
  }
};