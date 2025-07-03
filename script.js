// script.js
function sanitize(input) {
  return input.toUpperCase().replace(/[^A-Z]/g, '');
}

function repeatKey(key, length) {
  return key.repeat(Math.ceil(length / key.length)).slice(0, length);
}

function vigenere(text, key, mode = 'encrypt') {
  text = sanitize(text);
  key = sanitize(key);
  const fullKey = repeatKey(key, text.length);
  const A = 'A'.charCodeAt(0);
  let result = '';
  let visualization = [];

  for (let i = 0; i < text.length; i++) {
    const t = text.charCodeAt(i) - A;
    const k = fullKey.charCodeAt(i) - A;
    let c = mode === 'encrypt'
      ? (t + k) % 26
      : (t - k + 26) % 26;
    const outChar = String.fromCharCode(c + A);
    result += outChar;
    visualization.push({
      plain: text[i],
      key: fullKey[i],
      result: outChar
    });
  }
  return { result, visualization };
}

function displayVisualization(data) {
  const container = document.getElementById('visualization');
  container.innerHTML = '<h3>対応関係（平文＋鍵 → 出力）</h3>';

  const table = document.createElement('div');
  table.className = 'viz-table';

  const makeRow = (label, key) => {
    const row = document.createElement('div');
    row.className = 'viz-row';
    row.innerHTML = `<div class="header">${label}</div>` + 
      data.map((d, i) => `<div class="viz-cell" data-index="${i}" data-plain="${d.plain}" data-key="${d.key}">${d[key]}</div>`).join('');
    return row;
  };

  container.appendChild(makeRow('平文', 'plain'));
  container.appendChild(makeRow('鍵', 'key'));
  container.appendChild(makeRow('出力', 'result'));
  
  // Add hover event listeners
  const cells = container.querySelectorAll('.viz-cell');
  cells.forEach(cell => {
    cell.addEventListener('mouseenter', () => {
      const plain = cell.dataset.plain;
      const key = cell.dataset.key;
      highlightTableCell(plain, key);
    });
    cell.addEventListener('mouseleave', () => {
      clearTableHighlight();
    });
  });
}

function generateTable() {
  const tableDiv = document.getElementById('vigenereTable');
  let html = '<h3>ヴィジュネル表</h3><table class="vig-table"><tr><th></th>';
  for (let i = 0; i < 26; i++) html += `<th>${String.fromCharCode(65 + i)}</th>`;
  html += '</tr>';
  for (let row = 0; row < 26; row++) {
    html += `<tr><th>${String.fromCharCode(65 + row)}</th>`;
    for (let col = 0; col < 26; col++) {
      const char = String.fromCharCode(((row + col) % 26) + 65);
      html += `<td>${char}</td>`;
    }
    html += '</tr>';
  }
  html += '</table>';
  tableDiv.innerHTML = html;
}

document.getElementById('processButton').addEventListener('click', () => {
  const mode = document.getElementById('mode').value;
  const key = document.getElementById('key').value;
  const inputText = document.getElementById('inputText').value;
  
  // Show sanitized text
  const sanitizedInput = sanitize(inputText);
  document.getElementById('sanitizedText').value = sanitizedInput;
  
  const { result, visualization } = vigenere(inputText, key, mode);
  document.getElementById('outputText').value = result;
  displayVisualization(visualization);
});

// Theme switcher
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
  let currentTheme = document.documentElement.getAttribute('data-theme');
  let newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

function highlightTableCell(plainChar, keyChar) {
  const table = document.querySelector('.vig-table');
  if (!table) return;
  
  // Clear previous highlights
  clearTableHighlight();
  
  // Get row and column indices
  const rowIndex = keyChar.charCodeAt(0) - 65 + 1; // +1 for header row
  const colIndex = plainChar.charCodeAt(0) - 65 + 1; // +1 for header column
  
  // Highlight the cell
  const rows = table.querySelectorAll('tr');
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
}

function clearTableHighlight() {
  const highlighted = document.querySelectorAll('.vig-table .highlight');
  highlighted.forEach(cell => cell.classList.remove('highlight'));
}

generateTable();
