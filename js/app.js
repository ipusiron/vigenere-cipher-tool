/**
 * Main Application Entry Point
 * アプリケーションのメインエントリーポイント
 */

import { initTheme, initThemeToggle } from './ui/theme.js';
import { generateMainTable, generateResearchTable } from './ui/table-generator.js';
import { initResearchTab, refreshResearchResults } from './features/research-tab.js';
import { initLabTab, refreshLabResults } from './features/lab-tab.js';
import { initTabs } from './ui/tabs.js';
import { initMainTab, refreshMainResult } from './features/main-tab.js';
import { uiElements } from './ui/dom-elements.js';
import { getIndexingOffset, toggleIndexingMode } from './core/indexing-mode.js';
import { encryptChar } from './core/cipher.js';
import { I18n } from './i18n.js';
import { refreshMessages } from './ui/message-display.js';

/**
 * 表モードのトグルの読み上げラベルを、いまの状態から組み立てる
 * data-i18n-aria-label を付けると切り替えで状態が巻き戻るため、ここで毎回作る。
 */
const updateIndexingModeAria = () => {
  const toggle = uiElements.indexingModeToggle();
  if (!toggle) return;
  const nextMode = toggle.checked ? 'A=0' : 'A=1';
  toggle.setAttribute('aria-label', I18n.t('header.indexingSwitchTo', { mode: nextMode }));
};

/**
 * インデックスモードトグルの初期化
 */
const initIndexingModeToggle = () => {
  const toggle = uiElements.indexingModeToggle();
  const label = uiElements.indexingModeLabel();

  if (!toggle) {
    console.warn('Indexing mode toggle not found');
    return;
  }

  // 保存された設定を反映
  const currentOffset = getIndexingOffset();
  toggle.checked = (currentOffset === 1);
  if (label) {
    label.textContent = currentOffset === 0 ? 'A=0' : 'A=1';
  }
  updateIndexingModeAria();

  // 変更イベントリスナー
  toggle.addEventListener('change', () => {
    const newOffset = toggleIndexingMode();
    if (label) {
      label.textContent = newOffset === 0 ? 'A=0' : 'A=1';
    }
    updateIndexingModeAria();

    // テーブルを再生成
    regenerateAllTables();

    // 表の見方の例を更新
    updateTableExample();
    refreshMainResult();
    refreshResearchResults();
    refreshLabResults();

  });

  const help = document.querySelector('.indexing-mode-help button');
  help.addEventListener('click', () => help.parentElement.classList.toggle('open'));
  // 初期状態で例を更新
  updateTableExample();
};

/**
 * 全てのヴィジュネル表を再生成
 */
const regenerateAllTables = () => {
  const mainTableContainer = document.getElementById('vigenereTable');
  const researchTableContainer = document.getElementById('researchTable');

  if (mainTableContainer) {
    generateMainTable(mainTableContainer);
  }
  if (researchTableContainer) {
    generateResearchTable(researchTableContainer);
  }
};

/**
 * 表の見方の例を更新（H + K の結果）
 * 文と結果の文字が混ざる行なので、HTMLに直書きせず毎回ここで組み立てる。
 */
const updateTableExample = () => {
  const paragraph = document.getElementById('table-example-text');
  if (!paragraph) return;

  const cipherChar = encryptChar('H', 'K', getIndexingOffset());
  const formula = document.createElement('span');
  formula.className = 'example-formula';
  formula.textContent = `${cipherChar}←shift(H, K)`;
  paragraph.replaceChildren(
    document.createTextNode(I18n.t('tabula.example', { char: cipherChar })),
    document.createElement('br'),
    formula
  );
};

/**
 * モーダル関連の機能
 */
const initModal = () => {
  const showModal = () => {
    uiElements.helpModal().classList.add('show');
    document.body.classList.add('modal-open');
    uiElements.modalClose().focus();
  };
  
  const hideModal = () => {
    uiElements.helpModal().classList.remove('show');
    document.body.classList.remove('modal-open');
    uiElements.helpToggle().focus();
  };
  
  const handleModalClick = (event) => {
    if (event.target === uiElements.helpModal()) {
      hideModal();
    }
  };
  
  const handleEscKey = (event) => {
    if (event.key === 'Escape' && uiElements.helpModal().classList.contains('show')) {
      hideModal();
    }
  };
  
  // イベントリスナーを設定
  uiElements.helpToggle().addEventListener('click', showModal);
  uiElements.modalClose().addEventListener('click', hideModal);
  uiElements.helpModal().addEventListener('click', handleModalClick);
  document.addEventListener('keydown', handleEscKey);
  uiElements.helpModal().addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const focusable = [...uiElements.helpModal().querySelectorAll('button, a[href], input, select, [tabindex="0"]')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
};

/**
 * 言語切り替えボタンの配線
 * 切り替えでは、結果が出ているものだけを描き直す。空の状態は空のまま保つ。
 */
const initLanguageToggle = () => {
  const button = document.getElementById('langToggle');
  if (button) {
    button.addEventListener('click', () => {
      I18n.setLanguage(I18n.language === 'ja' ? 'en' : 'ja');
    });
  }

  document.addEventListener('languagechange', () => {
    updateIndexingModeAria();
    regenerateAllTables();
    updateTableExample();
    refreshMessages();
    refreshMainResult();
    refreshResearchResults();
    refreshLabResults();
  });
};

/**
 * アプリケーション全体の初期化
 */
const initApplication = () => {

  try {
    // 0. 表示言語の決定（?lang → 保存値 → ブラウザーの設定）
    I18n.init();
    initLanguageToggle();

    // 1. テーマシステムの初期化
    initTheme(true);
    initThemeToggle(uiElements.themeToggle());

    // 2. インデックスモードトグルの初期化
    initIndexingModeToggle();

    // 3. メインのヴィジュネル表を生成
    generateMainTable(document.getElementById('vigenereTable'));

    // 4. メインタブの初期化
    initMainTab();

    // 5. モーダルの初期化
    initModal();

    // 6. 他のタブを1回だけ初期化
    initResearchTab();
    initLabTab();
    initTabs();


  } catch (error) {
    console.error('Application initialization failed');

    // エラー時のフォールバック
    let message = 'The tool failed to start. Reload the page and try again.';
    try {
      message = I18n.t('app.initError');
    } catch {
      // 辞書が読めないほどの失敗では、英語の定型文だけを出す。
    }
    alert(message);
  }
};

/**
 * DOM読み込み完了後に初期化を実行
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApplication);
} else {
  // 既にDOMが読み込まれている場合は即座に実行
  initApplication();
}
