/**
 * Table Generation Logic
 * テーブル生成の責任を担当
 */

import { ALPHABET_SIZE, CHAR_CODE_A } from '../core/cipher.js';

/**
 * ツールチップを作成
 * @param {string} plainChar - 平文文字
 * @param {string} keyChar - 鍵文字
 * @param {string} cipherChar - 暗号文字
 * @returns {HTMLElement} ツールチップ要素
 */
export const createTooltip = (plainChar, keyChar, cipherChar) => {
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.textContent = `${cipherChar}←shift(${plainChar}, ${keyChar})`;
  return tooltip;
};

/**
 * ツールチップを表示
 * @param {Event} event - マウスイベント
 */
export const showTooltip = (event) => {
  const td = event.currentTarget;
  const tooltip = td.querySelector('.tooltip');
  if (tooltip) {
    tooltip.classList.add('show');
  }
};

/**
 * ツールチップを非表示
 * @param {Event} event - マウスイベント
 */
export const hideTooltip = (event) => {
  const td = event.currentTarget;
  const tooltip = td.querySelector('.tooltip');
  if (tooltip) {
    tooltip.classList.remove('show');
  }
};

/**
 * ヴィジュネル表を生成
 * @param {HTMLElement} container - コンテナ要素
 * @param {string} tableClass - テーブルのクラス名（オプション）
 * @returns {HTMLTableElement} 生成されたテーブル
 */
export const generateVigenereTable = (container, tableClass = 'vig-table') => {
  const table = document.createElement('table');
  table.className = tableClass;
  
  // ヘッダー行を作成
  const headerRow = document.createElement('tr');
  headerRow.appendChild(document.createElement('th')); // 空のコーナーセル
  
  for (let i = 0; i < ALPHABET_SIZE; i++) {
    const th = document.createElement('th');
    th.textContent = String.fromCharCode(CHAR_CODE_A + i);
    if (tableClass.includes('research')) {
      th.id = `research-col-${i}`;
    }
    headerRow.appendChild(th);
  }
  table.appendChild(headerRow);
  
  // データ行を作成
  for (let row = 0; row < ALPHABET_SIZE; row++) {
    const tr = document.createElement('tr');
    
    // 行ヘッダー
    const th = document.createElement('th');
    th.textContent = String.fromCharCode(CHAR_CODE_A + row);
    if (tableClass.includes('research')) {
      th.id = `research-row-${row}`;
    }
    tr.appendChild(th);
    
    // データセル
    for (let col = 0; col < ALPHABET_SIZE; col++) {
      const td = document.createElement('td');
      const cipherChar = String.fromCharCode(((row + col) % ALPHABET_SIZE) + CHAR_CODE_A);
      const plainChar = String.fromCharCode(CHAR_CODE_A + col);
      const keyChar = String.fromCharCode(CHAR_CODE_A + row);
      
      td.textContent = cipherChar;
      td.classList.add('tooltip-container');
      
      if (tableClass.includes('research')) {
        td.id = `research-cell-${row}-${col}`;
      }
      
      // ツールチップを追加
      const tooltip = createTooltip(plainChar, keyChar, cipherChar);
      td.appendChild(tooltip);
      
      // イベントリスナーを追加
      td.addEventListener('mouseenter', showTooltip);
      td.addEventListener('mouseleave', hideTooltip);
      
      tr.appendChild(td);
    }
    
    table.appendChild(tr);
  }
  
  return table;
};

/**
 * メインタブ用のヴィジュネル表を生成
 * @param {HTMLElement} container - コンテナ要素
 */
export const generateMainTable = (container) => {
  const table = generateVigenereTable(container, 'vig-table');
  container.innerHTML = '<h3>ヴィジュネル表（タブラレクタ）</h3>';
  container.appendChild(table);
};

/**
 * 研究タブ用のヴィジュネル表を生成
 * @param {HTMLElement} container - コンテナ要素
 */
export const generateResearchTable = (container) => {
  const table = generateVigenereTable(container, 'vig-table research-table');
  container.innerHTML = '<h3>ヴィジュネル表（タブラレクタ）</h3>';
  container.appendChild(table);
};

/**
 * テーブルセルをハイライト
 * @param {string} plainChar - 平文文字
 * @param {string} keyChar - 鍵文字
 * @param {string} tableSelector - テーブルのCSSセレクタ
 */
export const highlightTableCell = (plainChar, keyChar, tableSelector = '.vig-table') => {
  const table = document.querySelector(tableSelector);
  if (!table || !plainChar || !keyChar) return;
  
  clearTableHighlight(tableSelector);
  
  const rowIndex = keyChar.charCodeAt(0) - CHAR_CODE_A + 1;
  const colIndex = plainChar.charCodeAt(0) - CHAR_CODE_A + 1;
  
  const rows = table.querySelectorAll('tr');
  
  // 交差セルをハイライト
  if (rows[rowIndex]) {
    const cells = rows[rowIndex].querySelectorAll('td, th');
    if (cells[colIndex]) {
      cells[colIndex].classList.add('highlight');
    }
    // 行ヘッダーをハイライト
    if (cells[0]) {
      cells[0].classList.add('highlight');
    }
  }
  
  // 列ヘッダーをハイライト
  if (rows[0]) {
    const headerCells = rows[0].querySelectorAll('th');
    if (headerCells[colIndex]) {
      headerCells[colIndex].classList.add('highlight');
    }
  }
};

/**
 * 研究タブのセルをハイライト
 * @param {string} plainChar - 平文文字
 * @param {string} keyChar - 鍵文字
 */
export const highlightResearchCell = (plainChar, keyChar) => {
  // 前のハイライトをクリア
  document.querySelectorAll('.research-table .highlight').forEach(el => {
    el.classList.remove('highlight');
  });
  
  const rowIndex = keyChar.charCodeAt(0) - CHAR_CODE_A;
  const colIndex = plainChar.charCodeAt(0) - CHAR_CODE_A;
  
  // 行ヘッダーをハイライト
  const rowHeader = document.getElementById(`research-row-${rowIndex}`);
  if (rowHeader) rowHeader.classList.add('highlight');
  
  // 列ヘッダーをハイライト
  const colHeader = document.getElementById(`research-col-${colIndex}`);
  if (colHeader) colHeader.classList.add('highlight');
  
  // 交差セルをハイライト
  const cell = document.getElementById(`research-cell-${rowIndex}-${colIndex}`);
  if (cell) cell.classList.add('highlight');
};

/**
 * テーブルのハイライトをクリア
 * @param {string} tableSelector - テーブルのCSSセレクタ
 */
export const clearTableHighlight = (tableSelector = '.vig-table') => {
  const highlighted = document.querySelectorAll(`${tableSelector} .highlight`);
  highlighted.forEach(cell => cell.classList.remove('highlight'));
};

/**
 * 可視化テーブルのセルを作成
 * @param {string} content - セル内容
 * @param {number} index - インデックス
 * @param {string} plainChar - 平文文字
 * @param {string} keyChar - 鍵文字
 * @param {string} className - クラス名
 * @returns {HTMLElement} セル要素
 */
export const createVisualizationCell = (content, index, plainChar, keyChar, className = 'viz-cell') => {
  const cell = document.createElement('div');
  cell.className = className;
  cell.textContent = content;
  
  if (className === 'viz-cell') {
    cell.dataset.index = index;
    cell.dataset.plain = plainChar;
    cell.dataset.key = keyChar;
  }
  
  return cell;
};

/**
 * 可視化テーブルの行を作成
 * @param {string} label - 行ラベル
 * @param {Array} data - データ配列
 * @param {string} key - データのキー
 * @returns {HTMLElement} 行要素
 */
export const createVisualizationRow = (label, data, key) => {
  const row = document.createElement('div');
  row.className = 'viz-row';
  
  const header = createVisualizationCell(label, -1, '', '', 'header');
  row.appendChild(header);
  
  data.forEach((item, index) => {
    const cell = createVisualizationCell(item[key], index, item.plain, item.key);
    row.appendChild(cell);
  });
  
  return row;
};

/**
 * 可視化テーブルを表示
 * @param {HTMLElement} container - コンテナ要素
 * @param {Array} data - 可視化データ
 * @param {string} mode - 'encrypt' or 'decrypt'
 */
export const displayVisualization = (container, data, mode = 'encrypt') => {
  // モードに応じてタイトルを変更
  const isEncrypt = mode === 'encrypt';
  const title = isEncrypt 
    ? '<h3>対応関係（平文＋鍵 → 出力）</h3>'
    : '<h3>対応関係（暗号文＋鍵 → 出力）</h3>';
  
  container.innerHTML = title;
  
  const table = document.createElement('div');
  table.className = 'viz-table';
  
  // モードに応じて行の順序とラベルを変更
  if (isEncrypt) {
    // 暗号化モード: 平文（入力） → 鍵 → 暗号文（出力）
    table.appendChild(createVisualizationRow('平文', data, 'plain'));
    table.appendChild(createVisualizationRow('鍵', data, 'key'));
    table.appendChild(createVisualizationRow('出力', data, 'result'));
  } else {
    // 復号モード: 暗号文（入力） → 鍵 → 平文（出力）
    // cipher.jsでは、復号時: plain=出力(平文), result=入力(暗号文)
    table.appendChild(createVisualizationRow('暗号文', data, 'result'));
    table.appendChild(createVisualizationRow('鍵', data, 'key'));
    table.appendChild(createVisualizationRow('出力', data, 'plain'));
  }
  
  container.appendChild(table);
  
  return table;
};