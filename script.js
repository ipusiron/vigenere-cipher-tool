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
    row.innerHTML = `<div class="header">${label}</div>` + data.map(d => `<div>${d[key]}</div>`).join('');
    return row;
  };

  container.appendChild(makeRow('平文', 'plain'));
  container.appendChild(makeRow('鍵', 'key'));
  container.appendChild(makeRow('出力', 'result'));
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

generateTable();
