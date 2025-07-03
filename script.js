// Constants
const ALPHABET_SIZE = 26;
const CHAR_CODE_A = 'A'.charCodeAt(0);

// DOM Elements
const elements = {
  mode: () => document.getElementById('mode'),
  key: () => document.getElementById('key'),
  inputText: () => document.getElementById('inputText'),
  sanitizedText: () => document.getElementById('sanitizedText'),
  outputText: () => document.getElementById('outputText'),
  processButton: () => document.getElementById('processButton'),
  visualization: () => document.getElementById('visualization'),
  vigenereTable: () => document.getElementById('vigenereTable'),
  themeToggle: () => document.getElementById('theme-toggle'),
  helpToggle: () => document.getElementById('help-toggle'),
  helpModal: () => document.getElementById('help-modal'),
  modalClose: () => document.querySelector('.modal-close')
};

// Utility Functions
const sanitize = (input) => {
  return input.toUpperCase().replace(/[^A-Z]/g, '');
};

const repeatKey = (key, length) => {
  if (length === 0) return '';
  return key.repeat(Math.ceil(length / key.length)).slice(0, length);
};

// Cipher Functions
const encryptChar = (plainChar, keyChar) => {
  const plainCode = plainChar.charCodeAt(0) - CHAR_CODE_A;
  const keyCode = keyChar.charCodeAt(0) - CHAR_CODE_A;
  return String.fromCharCode((plainCode + keyCode) % ALPHABET_SIZE + CHAR_CODE_A);
};

const decryptChar = (cipherChar, keyChar) => {
  const cipherCode = cipherChar.charCodeAt(0) - CHAR_CODE_A;
  const keyCode = keyChar.charCodeAt(0) - CHAR_CODE_A;
  return String.fromCharCode((cipherCode - keyCode + ALPHABET_SIZE) % ALPHABET_SIZE + CHAR_CODE_A);
};

const vigenere = (text, key, mode = 'encrypt') => {
  const sanitizedText = sanitize(text);
  const sanitizedKey = sanitize(key);
  
  if (!sanitizedText || !sanitizedKey) {
    return { result: '', visualization: [] };
  }
  
  const fullKey = repeatKey(sanitizedKey, sanitizedText.length);
  const processChar = mode === 'encrypt' ? encryptChar : decryptChar;
  
  let result = '';
  const visualization = [];
  
  for (let i = 0; i < sanitizedText.length; i++) {
    const inputChar = sanitizedText[i];
    const keyChar = fullKey[i];
    const outputChar = processChar(inputChar, keyChar);
    
    result += outputChar;
    visualization.push({
      plain: mode === 'encrypt' ? inputChar : outputChar,
      key: keyChar,
      result: mode === 'encrypt' ? outputChar : inputChar
    });
  }
  
  return { result, visualization };
};

// UI Functions
const createVisualizationCell = (content, index, plainChar, keyChar, className = 'viz-cell') => {
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

const createVisualizationRow = (label, data, key) => {
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

const displayVisualization = (data) => {
  const container = elements.visualization();
  container.innerHTML = '<h3>対応関係（平文＋鍵 → 出力）</h3>';
  
  const table = document.createElement('div');
  table.className = 'viz-table';
  
  table.appendChild(createVisualizationRow('平文', data, 'plain'));
  table.appendChild(createVisualizationRow('鍵', data, 'key'));
  table.appendChild(createVisualizationRow('出力', data, 'result'));
  
  container.appendChild(table);
  
  // Add hover event listeners
  const cells = container.querySelectorAll('.viz-cell');
  cells.forEach(cell => {
    cell.addEventListener('mouseenter', handleCellHover);
    cell.addEventListener('mouseleave', handleCellLeave);
  });
};

const handleCellHover = (event) => {
  const cell = event.target;
  const plain = cell.dataset.plain;
  const key = cell.dataset.key;
  highlightTableCell(plain, key);
};

const handleCellLeave = () => {
  clearTableHighlight();
};

// Table Functions
const generateTable = () => {
  const tableDiv = elements.vigenereTable();
  const table = document.createElement('table');
  table.className = 'vig-table';
  
  // Create header row
  const headerRow = document.createElement('tr');
  headerRow.appendChild(document.createElement('th')); // Empty corner cell
  
  for (let i = 0; i < ALPHABET_SIZE; i++) {
    const th = document.createElement('th');
    th.textContent = String.fromCharCode(CHAR_CODE_A + i);
    headerRow.appendChild(th);
  }
  table.appendChild(headerRow);
  
  // Create data rows
  for (let row = 0; row < ALPHABET_SIZE; row++) {
    const tr = document.createElement('tr');
    
    // Row header
    const th = document.createElement('th');
    th.textContent = String.fromCharCode(CHAR_CODE_A + row);
    tr.appendChild(th);
    
    // Data cells
    for (let col = 0; col < ALPHABET_SIZE; col++) {
      const td = document.createElement('td');
      td.textContent = String.fromCharCode(((row + col) % ALPHABET_SIZE) + CHAR_CODE_A);
      tr.appendChild(td);
    }
    
    table.appendChild(tr);
  }
  
  tableDiv.innerHTML = '<h3>ヴィジュネル表</h3>';
  tableDiv.appendChild(table);
};

const highlightTableCell = (plainChar, keyChar) => {
  const table = document.querySelector('.vig-table');
  if (!table || !plainChar || !keyChar) return;
  
  clearTableHighlight();
  
  const rowIndex = keyChar.charCodeAt(0) - CHAR_CODE_A + 1;
  const colIndex = plainChar.charCodeAt(0) - CHAR_CODE_A + 1;
  
  const rows = table.querySelectorAll('tr');
  
  // Highlight intersection cell
  if (rows[rowIndex]) {
    const cells = rows[rowIndex].querySelectorAll('td, th');
    if (cells[colIndex]) {
      cells[colIndex].classList.add('highlight');
    }
    // Highlight row header
    if (cells[0]) {
      cells[0].classList.add('highlight');
    }
  }
  
  // Highlight column header
  if (rows[0]) {
    const headerCells = rows[0].querySelectorAll('th');
    if (headerCells[colIndex]) {
      headerCells[colIndex].classList.add('highlight');
    }
  }
};

const clearTableHighlight = () => {
  const highlighted = document.querySelectorAll('.vig-table .highlight');
  highlighted.forEach(cell => cell.classList.remove('highlight'));
};

// Process Functions
const processText = () => {
  const mode = elements.mode().value;
  const key = elements.key().value;
  const inputText = elements.inputText().value;
  
  if (!inputText.trim()) {
    alert('テキストを入力してください。');
    return;
  }
  
  if (!key.trim()) {
    alert('鍵を入力してください。');
    return;
  }
  
  // Show sanitized text
  const sanitizedInput = sanitize(inputText);
  elements.sanitizedText().value = sanitizedInput;
  
  if (!sanitizedInput) {
    alert('英字を含むテキストを入力してください。');
    return;
  }
  
  const { result, visualization } = vigenere(inputText, key, mode);
  elements.outputText().value = result;
  displayVisualization(visualization);
};

// Theme Functions
const initTheme = () => {
  const currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
};

const toggleTheme = () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
};

// Modal Functions
const showModal = () => {
  elements.helpModal().classList.add('show');
};

const hideModal = () => {
  elements.helpModal().classList.remove('show');
};

const handleModalClick = (event) => {
  if (event.target === elements.helpModal()) {
    hideModal();
  }
};

const handleEscKey = (event) => {
  if (event.key === 'Escape' && elements.helpModal().classList.contains('show')) {
    hideModal();
  }
};

// Event Listeners
const initEventListeners = () => {
  elements.processButton().addEventListener('click', processText);
  elements.themeToggle().addEventListener('click', toggleTheme);
  elements.helpToggle().addEventListener('click', showModal);
  elements.modalClose().addEventListener('click', hideModal);
  elements.helpModal().addEventListener('click', handleModalClick);
  document.addEventListener('keydown', handleEscKey);
  
  // Enter key support for input fields
  elements.inputText().addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      processText();
    }
  });
  
  elements.key().addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      processText();
    }
  });
};

// Initialize
const init = () => {
  initTheme();
  generateTable();
  initEventListeners();
};

// Start the application
init();