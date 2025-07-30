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
  modalClose: () => document.querySelector('.modal-close'),
  copyButton: () => document.getElementById('copyButton'),
  copyToast: () => document.getElementById('copyToast'),
  keyWarning: () => document.getElementById('keyWarning'),
  fileInput: () => document.getElementById('fileInput'),
  fileSelectButton: () => document.getElementById('fileSelectButton'),
  textareaDropZone: () => document.getElementById('textareaDropZone'),
  dropOverlay: () => document.getElementById('dropOverlay')
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

// Copy Functions
const copyToClipboard = async () => {
  const outputText = elements.outputText().value;
  
  if (!outputText.trim()) {
    return;
  }
  
  try {
    await navigator.clipboard.writeText(outputText);
    showToast();
  } catch (err) {
    // Fallback for older browsers
    const textArea = elements.outputText();
    textArea.select();
    textArea.setSelectionRange(0, 99999);
    
    try {
      document.execCommand('copy');
      showToast();
    } catch (fallbackErr) {
      console.error('Failed to copy text: ', fallbackErr);
    }
  }
};

const showToast = () => {
  const toast = elements.copyToast();
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
};

// URL Parameter Functions
const getUrlParameter = (name) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
};

const sanitizeUrlText = (text) => {
  if (!text) return '';
  
  // Limit text length for security (max 10000 characters)
  const maxLength = 10000;
  if (text.length > maxLength) {
    console.warn(`URL parameter text truncated to ${maxLength} characters`);
    text = text.substring(0, maxLength);
  }
  
  // Basic HTML entity escaping to prevent XSS
  const htmlEscapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };
  
  // Escape HTML entities
  text = text.replace(/[&<>"'/]/g, (match) => htmlEscapeMap[match]);
  
  // Remove any potentially dangerous characters
  text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  return text;
};

const loadTextFromUrl = () => {
  try {
    const encodedText = getUrlParameter('text');
    if (!encodedText) return;
    
    // Decode URL-encoded text
    const decodedText = decodeURIComponent(encodedText);
    
    // Sanitize the text for security
    const sanitizedText = sanitizeUrlText(decodedText);
    
    if (sanitizedText) {
      // Set the text in the input field
      elements.inputText().value = sanitizedText;
      
      // Update the URL to remove the parameter (optional, for cleaner URL)
      const url = new URL(window.location);
      url.searchParams.delete('text');
      window.history.replaceState({}, document.title, url.pathname + url.search);
      
      console.log('Text loaded from URL parameter');
    }
  } catch (error) {
    console.error('Error loading text from URL parameter:', error);
  }
};

// Key Input Functions
const handleKeyInput = (event) => {
  const input = event.target;
  const originalValue = input.value;
  const cursorPosition = input.selectionStart;
  
  // Convert to uppercase and remove non-alphabetic characters
  const sanitizedValue = originalValue.toUpperCase().replace(/[^A-Z]/g, '');
  
  // Update input value
  input.value = sanitizedValue;
  
  // Restore cursor position (adjust for removed characters)
  const removedChars = originalValue.length - sanitizedValue.length;
  const newCursorPosition = Math.max(0, cursorPosition - removedChars);
  input.setSelectionRange(newCursorPosition, newCursorPosition);
  
  // Show/hide warning message
  const hasNonAlphabetic = /[^A-Za-z]/.test(originalValue);
  const warning = elements.keyWarning();
  
  if (hasNonAlphabetic && sanitizedValue !== originalValue) {
    warning.classList.add('show');
  } else {
    warning.classList.remove('show');
  }
};

// File Functions
const validateFile = (file) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['text/plain', ''];
  
  if (file.size > maxSize) {
    throw new Error(`ファイルサイズが大きすぎます（最大: ${maxSize / 1024 / 1024}MB）`);
  }
  
  // Allow common text file extensions
  const fileName = file.name.toLowerCase();
  const isTextFile = fileName.endsWith('.txt') || 
                    fileName.endsWith('.text') || 
                    file.type === 'text/plain' ||
                    file.type === '';
  
  if (!isTextFile) {
    throw new Error('テキストファイル（.txt）のみサポートしています');
  }
  
  return true;
};

const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        let content = event.target.result;
        
        // Basic sanitization
        content = sanitizeUrlText(content);
        
        resolve(content);
      } catch (error) {
        reject(new Error('ファイルの読み込み中にエラーが発生しました'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('ファイルの読み込みに失敗しました'));
    };
    
    reader.readAsText(file, 'UTF-8');
  });
};

const handleFileLoad = async (file) => {
  try {
    validateFile(file);
    const content = await readFileAsText(file);
    
    if (content.trim()) {
      elements.inputText().value = content;
      console.log('ファイルが正常に読み込まれました:', file.name);
    } else {
      throw new Error('ファイルが空です');
    }
  } catch (error) {
    console.error('ファイル処理エラー:', error);
    alert(error.message);
  }
};

const handleFileSelect = () => {
  elements.fileInput().click();
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    handleFileLoad(file);
  }
  // Reset file input
  event.target.value = '';
};

// Drag and Drop Functions
const handleDragOver = (event) => {
  event.preventDefault();
  event.stopPropagation();
  elements.textareaDropZone().classList.add('drag-over');
};

const handleDragLeave = (event) => {
  event.preventDefault();
  event.stopPropagation();
  
  // Only remove class if we're leaving the drop zone entirely
  const rect = elements.textareaDropZone().getBoundingClientRect();
  const x = event.clientX;
  const y = event.clientY;
  
  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    elements.textareaDropZone().classList.remove('drag-over');
  }
};

const handleDrop = (event) => {
  event.preventDefault();
  event.stopPropagation();
  elements.textareaDropZone().classList.remove('drag-over');
  
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    handleFileLoad(files[0]);
  }
};

// Event Listeners
const initEventListeners = () => {
  elements.processButton().addEventListener('click', processText);
  elements.themeToggle().addEventListener('click', toggleTheme);
  elements.helpToggle().addEventListener('click', showModal);
  elements.modalClose().addEventListener('click', hideModal);
  elements.helpModal().addEventListener('click', handleModalClick);
  elements.copyButton().addEventListener('click', copyToClipboard);
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
  
  // Key input handling for real-time conversion and validation
  elements.key().addEventListener('input', handleKeyInput);
  
  // File input event listeners
  elements.fileSelectButton().addEventListener('click', handleFileSelect);
  elements.fileInput().addEventListener('change', handleFileChange);
  
  // Drag and drop event listeners
  const dropZone = elements.textareaDropZone();
  dropZone.addEventListener('dragover', handleDragOver);
  dropZone.addEventListener('dragleave', handleDragLeave);
  dropZone.addEventListener('drop', handleDrop);
  
  // Prevent default drag behaviors on document
  document.addEventListener('dragover', (e) => e.preventDefault());
  document.addEventListener('drop', (e) => e.preventDefault());
};

// Initialize
const init = () => {
  initTheme();
  generateTable();
  initEventListeners();
  loadTextFromUrl();
};

// Start the application
init();