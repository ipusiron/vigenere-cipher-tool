/**
 * Message Display Management
 * メッセージ表示の責任を担当。表示中の文言はキーで覚え、言語の切り替えで訳し直す。
 */

import { I18n } from '../i18n.js';

/**
 * 表示中の文言をキーと差し込み値で覚えてから描く
 * @param {HTMLElement} element - 対象要素
 * @param {string} key - 辞書のキー
 * @param {Object} params - 差し込み値
 */
export const renderMessage = (element, key, params = {}) => {
  if (!element) return;

  element.dataset.messageKey = key;
  element.dataset.messageParams = JSON.stringify(params);
  element.textContent = I18n.t(key, params);
};

/**
 * キーを持たない文字列を描く（数式など、呼び出し側が描き直すもの）
 * @param {HTMLElement} element - 対象要素
 * @param {string} text - 表示する文字列
 */
export const renderText = (element, text) => {
  if (!element) return;

  delete element.dataset.messageKey;
  delete element.dataset.messageParams;
  element.textContent = text;
};

/**
 * 表示中のメッセージを、いまの言語で訳し直す
 * @param {ParentNode} root - 探索の起点
 */
export const refreshMessages = (root = document) => {
  for (const element of root.querySelectorAll('[data-message-key]')) {
    const raw = element.dataset.messageParams;
    element.textContent = I18n.t(element.dataset.messageKey, raw ? JSON.parse(raw) : {});
  }
};

/**
 * 警告メッセージを表示
 * @param {HTMLElement} element - 対象要素
 * @param {string} key - 辞書のキー
 * @param {Object} params - 差し込み値
 */
export const showWarning = (element, key, params = {}) => {
  if (!element) return;

  renderMessage(element, key, params);
  element.classList.add('show');
  element.classList.remove('error');
  element.classList.add('warning');
};

/**
 * エラーメッセージを表示
 * @param {HTMLElement} element - 対象要素
 * @param {string} key - 辞書のキー
 * @param {Object} params - 差し込み値
 */
export const showError = (element, key, params = {}) => {
  if (!element) return;

  renderMessage(element, key, params);
  element.classList.add('show');
  element.classList.remove('warning');
  element.classList.add('error');
};

/**
 * メッセージを非表示
 * 読み上げ対象に古い文言を残さないため、本文とキーも消す。
 * @param {HTMLElement} element - 対象要素
 */
export const hideMessage = (element) => {
  if (!element) return;

  renderText(element, '');
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
 * @param {Object} validationResult - 検証結果 {type, key, params}
 */
export const displayValidationMessage = (warningElement, errorElement, validationResult) => {
  hideMessage(warningElement);
  hideMessage(errorElement);

  if (validationResult.type === 'warning') {
    showWarning(warningElement, validationResult.key, validationResult.params);
  } else if (validationResult.type === 'error') {
    showError(errorElement, validationResult.key, validationResult.params);
  }
};

/**
 * トーストメッセージを表示
 * 文言はHTML側の data-i18n が持つので、ここでは表示の切り替えだけを行う。
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
 * @param {string} key - 辞書のキー
 * @param {Object} params - 差し込み値
 */
export const showSuccess = (element, key, params = {}) => {
  if (!element) return;

  renderMessage(element, key, params);
  element.classList.add('show');
  element.classList.remove('warning', 'error');
  element.classList.add('success');
};

/**
 * インフォメッセージを表示
 * @param {HTMLElement} element - 対象要素
 * @param {string} key - 辞書のキー
 * @param {Object} params - 差し込み値
 */
export const showInfo = (element, key, params = {}) => {
  if (!element) return;

  renderMessage(element, key, params);
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
