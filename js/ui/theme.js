/**
 * Theme Management
 * テーマ切り替えの責任を担当
 */

/**
 * 現在のテーマを取得
 * @returns {string} 'light' または 'dark'
 */
export const getCurrentTheme = () => {
  return document.documentElement.getAttribute('data-theme') || 'light';
};

/**
 * テーマを設定
 * @param {string} theme - 'light' または 'dark'
 */
export const setTheme = (theme) => {
  if (theme !== 'light' && theme !== 'dark') {
    console.warn(`Invalid theme: ${theme}. Using 'light' as default.`);
    theme = 'light';
  }
  
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
};

/**
 * テーマを切り替え
 * @returns {string} 新しいテーマ
 */
export const toggleTheme = () => {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  return newTheme;
};

/**
 * 保存されたテーマを読み込み
 */
export const loadSavedTheme = () => {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);
};

/**
 * テーマ切り替えボタンを初期化
 * @param {HTMLElement} toggleButton - テーマ切り替えボタン
 */
export const initThemeToggle = (toggleButton) => {
  if (!toggleButton) {
    console.warn('Theme toggle button not found');
    return;
  }
  
  toggleButton.addEventListener('click', () => {
    const newTheme = toggleTheme();
    console.log(`Theme switched to: ${newTheme}`);
  });
};

/**
 * システムの配色設定を検出
 * @returns {string} 'light' または 'dark'
 */
export const detectSystemTheme = () => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

/**
 * システムテーマの変更を監視
 * @param {Function} callback - テーマ変更時のコールバック関数
 */
export const watchSystemTheme = (callback) => {
  if (!window.matchMedia) return;
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleChange = (e) => {
    const systemTheme = e.matches ? 'dark' : 'light';
    if (callback) {
      callback(systemTheme);
    }
  };
  
  mediaQuery.addEventListener('change', handleChange);
  
  // 初回実行
  handleChange(mediaQuery);
};

/**
 * テーマに基づいてクラスを追加/削除
 * @param {HTMLElement} element - 対象要素
 * @param {string} lightClass - ライトテーマ用クラス
 * @param {string} darkClass - ダークテーマ用クラス
 */
export const applyThemeClass = (element, lightClass, darkClass) => {
  if (!element) return;
  
  const currentTheme = getCurrentTheme();
  
  element.classList.remove(lightClass, darkClass);
  
  if (currentTheme === 'dark') {
    element.classList.add(darkClass);
  } else {
    element.classList.add(lightClass);
  }
};

/**
 * テーマ初期化（保存されたテーマまたはシステムテーマを適用）
 * @param {boolean} useSystemTheme - システムテーマを使用するかどうか
 */
export const initTheme = (useSystemTheme = false) => {
  if (useSystemTheme && !localStorage.getItem('theme')) {
    const systemTheme = detectSystemTheme();
    setTheme(systemTheme);
  } else {
    loadSavedTheme();
  }
};

/**
 * テーマ情報を取得
 * @returns {Object} テーマ情報
 */
export const getThemeInfo = () => {
  return {
    current: getCurrentTheme(),
    saved: localStorage.getItem('theme'),
    system: detectSystemTheme(),
    available: ['light', 'dark']
  };
};