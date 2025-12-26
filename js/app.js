/**
 * Main Application Entry Point
 * アプリケーションのメインエントリーポイント
 */

import { initTheme, initThemeToggle } from './ui/theme.js';
import { generateMainTable, generateResearchTable } from './ui/table-generator.js';
import { initMainTab } from './features/main-tab.js';
import { uiElements } from './ui/dom-elements.js';
import { getIndexingOffset, toggleIndexingMode } from './core/indexing-mode.js';
import { encryptChar } from './core/cipher.js';

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

  // 変更イベントリスナー
  toggle.addEventListener('change', () => {
    const newOffset = toggleIndexingMode();
    if (label) {
      label.textContent = newOffset === 0 ? 'A=0' : 'A=1';
    }

    // テーブルを再生成
    regenerateAllTables();

    // 表の見方の例を更新
    updateTableExample();

    console.log(`Indexing mode switched to: A=${newOffset}`);
  });

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
 */
const updateTableExample = () => {
  const resultSpan = document.getElementById('table-example-result');
  const formulaSpan = document.getElementById('table-example-formula');

  if (resultSpan && formulaSpan) {
    const cipherChar = encryptChar('H', 'K');
    resultSpan.textContent = cipherChar;
    formulaSpan.textContent = cipherChar;
  }
};

/**
 * モーダル関連の機能
 */
const initModal = () => {
  const showModal = () => {
    uiElements.helpModal().classList.add('show');
  };
  
  const hideModal = () => {
    uiElements.helpModal().classList.remove('show');
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
};

/**
 * 研究タブの初期化（動的読み込み）
 */
const initResearchTab = async () => {
  console.log('🔬 Setting up research tab initialization...');
  
  // 即座にモジュールを読み込み、研究タブを初期化
  try {
    const module = await import('./features/research-tab.js');
    
    // タブが表示されたときに呼び出されるグローバル関数として設定
    window.initResearchTabOnShow = () => {
      console.log('🔬 Research tab shown, initializing...');
      module.initResearchTab();
    };
    
    // 少し遅延してから初期化を実行（Alpine.js完全初期化待ち）
    setTimeout(() => {
      console.log('🔬 Force initializing research tab...');
      module.initResearchTab();
    }, 500);
    
  } catch (error) {
    console.error('❌ Failed to load research tab module:', error);
  }
};

/**
 * 実験室タブの初期化（動的読み込み）
 */
const initLabTab = async () => {
  console.log('🧪 Setting up lab tab initialization...');
  
  // 即座にモジュールを読み込み、実験室タブを初期化
  try {
    const module = await import('./features/lab-tab.js');
    
    // タブが表示されたときに呼び出されるグローバル関数として設定
    window.initLabTabOnShow = () => {
      console.log('🧪 Lab tab shown, initializing...');
      module.initLabTab();
    };
    
    // 少し遅延してから初期化を実行（Alpine.js完全初期化待ち）
    setTimeout(() => {
      console.log('🧪 Force initializing lab tab...');
      module.initLabTab();
    }, 600);
    
  } catch (error) {
    console.error('❌ Failed to load lab tab module:', error);
  }
};

/**
 * アプリケーション全体の初期化
 */
const initApplication = async () => {
  console.log('🚀 Initializing Vigenère Cipher Tool...');
  
  try {
    // 1. テーマシステムの初期化
    initTheme();
    initThemeToggle(uiElements.themeToggle());
    console.log('✅ Theme system initialized');

    // 2. インデックスモードトグルの初期化
    initIndexingModeToggle();
    console.log('✅ Indexing mode toggle initialized');

    // 3. メインのヴィジュネル表を生成
    generateMainTable(document.getElementById('vigenereTable'));
    console.log('✅ Main Vigenère table generated');

    // 4. メインタブの初期化
    initMainTab();
    console.log('✅ Main tab initialized');

    // 5. モーダルの初期化
    initModal();
    console.log('✅ Modal system initialized');

    // 6. 他のタブの遅延初期化
    await initResearchTab();
    await initLabTab();
    console.log('✅ Tab observers initialized');
    
    console.log('🎉 Application initialization complete!');
    
  } catch (error) {
    console.error('❌ Application initialization failed:', error);
    
    // エラー時のフォールバック
    alert('アプリケーションの初期化に失敗しました。ページを再読み込みしてください。');
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

// デバッグ用のグローバル関数をエクスポート
window.VigenereApp = {
  initApplication,
  version: '2.0.0',
  modules: {
    theme: () => import('./ui/theme.js'),
    cipher: () => import('./core/cipher.js'),
    validation: () => import('./core/validation.js'),
    utils: () => import('./core/utils.js')
  }
};