# 技術解説 - ヴィジュネル暗号ツール

本ドキュメントでは、ヴィジュネル暗号ツールの実装における技術的な詳細、コアアルゴリズム、設計上の重要な判断について詳しく解説します。

---

## 目次

1. [コアアルゴリズム](#コアアルゴリズム)
2. [モジュラーアーキテクチャ](#モジュラーアーキテクチャ)
3. [CSS設計パターン](#css設計パターン)
4. [入力検証システム](#入力検証システム)
5. [視覚化エンジン](#視覚化エンジン)
6. [開発で得られた教訓](#開発で得られた教訓)

---

## コアアルゴリズム

### ヴィジュネル暗号の数学的基盤

ヴィジュネル暗号は以下の数学的原理に基づいて実装されています：

#### 暗号化アルゴリズム
```javascript
function encryptChar(plainChar, keyChar) {
  const plainCode = plainChar.charCodeAt(0) - 65;  // A=0, B=1, ..., Z=25
  const keyCode = keyChar.charCodeAt(0) - 65;
  const encryptedCode = (plainCode + keyCode) % 26;  // モジュロ26演算
  return String.fromCharCode(encryptedCode + 65);
}
```

#### 復号アルゴリズム
```javascript
function decryptChar(cipherChar, keyChar) {
  const cipherCode = cipherChar.charCodeAt(0) - 65;
  const keyCode = keyChar.charCodeAt(0) - 65;
  const decryptedCode = (cipherCode - keyCode + 26) % 26;  // 負数対応
  return String.fromCharCode(decryptedCode + 65);
}
```

#### 鍵の循環システム
```javascript
function repeatKey(key, length) {
  let repeatedKey = '';
  for (let i = 0; i < length; i++) {
    repeatedKey += key[i % key.length];
  }
  return repeatedKey;
}
```

**技術的ポイント:**
- **モジュロ26演算**: アルファベット26文字の循環処理
- **負数処理**: 復号時の `+26` で負数を正数に変換
- **ASCII変換**: 文字コード操作による効率的な計算

---

## モジュラーアーキテクチャ

### JavaScript モジュール分離

```
js/
├── core/
│   ├── cipher.js        # 暗号化コアロジック
│   └── validation.js    # 入力検証ロジック
├── ui/
│   ├── tabs.js          # タブ制御
│   ├── theme.js         # テーマ管理
│   ├── visualization.js # 可視化エンジン
│   ├── modal.js         # モーダル管理
│   └── message-display.js # メッセージ表示
├── utils/
│   └── file-handler.js  # ファイル処理
└── app.js              # アプリケーションエントリーポイント
```

#### モジュールの依存関係設計
```javascript
// app.js - 依存性注入パターン
import { vigenere } from './core/cipher.js';
import { validateInput } from './core/validation.js';
import { showMessage } from './ui/message-display.js';

// 責任分離の実現
function processInput() {
  const validation = validateInput(inputText);
  if (!validation.isValid) {
    showMessage(validation.message, validation.type);
    return;
  }
  const result = vigenere(inputText, key, mode);
  updateUI(result);
}
```

### CSS レイヤードアーキテクチャ

```
css/
├── base/                # 基盤レイヤー
│   └── variables.css    # デザインシステム
├── themes/              # テーマレイヤー
│   ├── light.css
│   └── dark.css
├── layout/              # レイアウトレイヤー
│   ├── container.css
│   └── grid.css
├── components/          # コンポーネントレイヤー
│   ├── buttons.css
│   ├── forms.css
│   ├── tabs.css
│   ├── messages.css
│   ├── tables.css
│   ├── modal.css
│   └── icons.css
└── utilities/           # ユーティリティレイヤー
    ├── animations.css
    └── print.css
```

**設計哲学:**
- **単一責任原則**: 各ファイルが一つの責任を持つ
- **依存関係の管理**: 低レベルから高レベルへの依存のみ
- **再利用性**: コンポーネント単位での再利用可能性

---

## CSS設計パターン

### デザインシステム変数

130以上のCSS変数による一元管理：

```css
:root {
  /* スペーシングシステム */
  --spacing-xs: 0.25rem;    /* 4px */
  --spacing-sm: 0.5rem;     /* 8px */
  --spacing-md: 1rem;       /* 16px */
  --spacing-lg: 1.5rem;     /* 24px */
  --spacing-xl: 2rem;       /* 32px */
  --spacing-2xl: 2.5rem;    /* 40px */
  
  /* タイポグラフィシステム */
  --font-system: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'Courier New', Consolas, Monaco, monospace;
  --text-xs: 0.75rem;       /* 12px */
  --text-sm: 0.85rem;       /* 13.6px */
  --text-base: 1rem;        /* 16px */
  
  /* アニメーションシステム */
  --transition-speed: 0.3s;
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Z-indexシステム */
  --z-dropdown: 1000;
  --z-modal: 1050;
  --z-tooltip: 1070;
  --z-toast: 1080;
}
```

### BEMライクなクラス命名
```css
/* Block-Element-Modifier パターン */
.tab-navigation {}           /* Block */
.tab-button {}              /* Element */
.tab-button--active {}      /* Modifier */
.tab-content {}             /* Element */

/* 状態管理クラス */
.message {}
.message.show {}            /* 状態クラス */
.message.warning {}         /* バリアント */
.message.error {}           /* バリアント */
```

---

## 入力検証システム

### 段階的検証フロー

```javascript
export function validateInput(inputText, key, mode) {
  // 1. 基本的な必須チェック
  if (!inputText?.trim()) {
    return { isValid: false, type: 'error', message: 'テキストを入力してください。' };
  }
  
  // 2. 鍵の検証
  if (!key?.trim()) {
    return { isValid: false, type: 'error', message: '鍵を入力してください。' };
  }
  
  // 3. 文字種の検証
  const sanitizedInput = sanitize(inputText);
  const sanitizedKey = sanitize(key);
  
  if (sanitizedInput.length === 0) {
    return { isValid: false, type: 'error', message: '英字を含むテキストを入力してください。' };
  }
  
  // 4. 警告レベルの検証（処理は継続）
  if (sanitizedInput.length < inputText.trim().length) {
    return { 
      isValid: true, 
      type: 'warning', 
      message: '英字以外の文字は自動的に除外されます。' 
    };
  }
  
  return { isValid: true, type: 'success', message: '' };
}
```

### 文字サニタイゼーション

```javascript
export const sanitize = (input) => {
  return input
    .toUpperCase()                    // 大文字統一
    .replace(/[^A-Z]/g, '');         // A-Z以外を除外
};
```

**実装上の工夫:**
- **非破壊的処理**: 元の入力を変更せずサニタイズ版を生成
- **段階的検証**: エラー・警告・成功の3段階での検証
- **ユーザビリティ**: 警告時でも処理を継続

---

## 視覚化エンジン

### 動的テーブル生成

```javascript
function createVisualizationTable(plaintext, key, result) {
  const sanitizedText = sanitize(plaintext);
  const repeatedKey = repeatKey(sanitize(key), sanitizedText.length);
  
  // テーブル構造の動的生成
  let tableHTML = `
    <div class="viz-table">
      <div class="viz-row">
        <div class="header">平文</div>
        ${sanitizedText.split('').map(char => 
          `<div class="viz-cell" data-char="${char}">${char}</div>`
        ).join('')}
      </div>
      <div class="viz-row">
        <div class="header">鍵</div>
        ${repeatedKey.split('').map(char => 
          `<div class="viz-cell" data-char="${char}">${char}</div>`
        ).join('')}
      </div>
      <div class="viz-row">
        <div class="header">出力</div>
        ${result.split('').map(char => 
          `<div class="viz-cell" data-char="${char}">${char}</div>`
        ).join('')}
      </div>
    </div>
  `;
  
  return tableHTML;
}
```

### インタラクティブハイライト

```javascript
function setupInteractiveHighlight() {
  document.querySelectorAll('.viz-cell[data-char]').forEach(cell => {
    cell.addEventListener('mouseenter', (e) => {
      const char = e.target.getAttribute('data-char');
      highlightVigenereSquare(char);
      showTooltip(e.target, char);
    });
    
    cell.addEventListener('mouseleave', () => {
      clearHighlights();
      hideTooltip();
    });
  });
}
```

### ヴィジュネル表の動的ハイライト

```javascript
function highlightVigenereSquare(plainChar, keyChar) {
  // 平文文字の行をハイライト
  const rowIndex = plainChar.charCodeAt(0) - 65;
  const colIndex = keyChar.charCodeAt(0) - 65;
  
  // CSS クラスによるハイライト制御
  const cell = document.querySelector(
    `.vig-table tr:nth-child(${rowIndex + 2}) td:nth-child(${colIndex + 2})`
  );
  
  if (cell) {
    cell.classList.add('highlight');
  }
}
```

---

## 開発で得られた教訓

### CSS優先度とJavaScript連携の課題

#### 🚫 問題：インラインスタイルとクラスセレクタの優先度

**症状**: JavaScriptでクラスを追加してもCSSスタイルが適用されない

```html
<!-- HTMLに直書きのインラインスタイル -->
<div id="message" class="warning-message" style="display: none;"></div>
```

```css
/* 動作しない - インラインスタイルが優先される */
.warning-message.show {
  display: block;
  background-color: #fff3cd;
}
```

#### ✅ 解決策：!importantによる優先度の強制

```css
/* 正しい実装 - !importantでインラインスタイルを上書き */
.warning-message.show {
  display: block !important;
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
}
```

#### 🎯 推奨する設計パターン

**1. クラスベースの状態管理**
```css
.message {
  display: none; /* デフォルト非表示 */
}
.message.show {
  display: block;
  padding: 0.5rem;
  margin: 0.5rem 0;
}
.message.warning { background: #fff3cd; }
.message.error { background: #f8d7da; }
```

**2. 一貫したJavaScript制御**
```javascript
function showWarning(element, message) {
  element.textContent = message;
  element.className = 'message warning show';
}
function hideMessage(element) {
  element.className = 'message';
}
```

#### 📖 学んだこと

1. **インラインスタイルの使用を避ける** - CSS優先度の問題を回避
2. **CSSとJavaScriptの責任を明確にする** - CSSは見た目、JSは状態管理
3. **クラスベースの設計** - `style.display`の直接操作より保守性が高い
4. **デバッグ時の確認ポイント** - ブラウザ開発者ツールでcomputedスタイルを確認

---

### モジュール分離における依存関係管理

#### 課題：循環依存の回避

```javascript
// 悪い例：循環依存
// ui/tabs.js → ui/message-display.js → ui/tabs.js

// 良い例：依存関係の単方向化
// app.js → ui/tabs.js
//       → ui/message-display.js
//       → core/validation.js
```

#### 解決策：依存性注入パターン

```javascript
// app.js - 依存関係のオーケストレーション
class App {
  constructor() {
    this.validator = new Validator();
    this.messageDisplay = new MessageDisplay();
    this.tabManager = new TabManager(this.messageDisplay);
    this.cipher = new VigenereCipher(this.validator, this.messageDisplay);
  }
}
```

---

### パフォーマンス最適化

#### 動的インポートによる分割読み込み

```javascript
// 重いタブコンテンツの遅延読み込み
async function loadTabContent(tabId) {
  const tabModule = await import(`./tabs/${tabId}.js`);
  return tabModule.default;
}
```

#### イベント委譲によるメモリ効率化

```javascript
// 大量の要素へのイベント登録の最適化
document.querySelector('.viz-table').addEventListener('mouseover', (e) => {
  if (e.target.matches('.viz-cell')) {
    handleCellHover(e.target);
  }
});
```

---

## セキュリティ考慮事項

### XSS防止対策

```javascript
// 安全なDOM操作
function safeSetContent(element, content) {
  element.textContent = content;  // innerHTML ではなく textContent
}

// サニタイゼーションの徹底
function sanitizeForDisplay(input) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
```

### CSPヘッダーの実装

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; 
               style-src 'self' 'unsafe-inline';">
```

---

## まとめ

このプロジェクトでは、単純な暗号化ツールの実装を通じて、以下の現代的な Web 開発技術を実践しました：

1. **モジュラーアーキテクチャ**: 責任分離による保守性の向上
2. **デザインシステム**: CSS変数による一貫したUI設計
3. **状態管理**: クラスベースによる堅牢な状態制御
4. **パフォーマンス最適化**: 動的読み込みとイベント委譲
5. **セキュリティ**: XSS防止とCSP実装

これらの技術的学習は、より大規模なWebアプリケーション開発にも応用可能な実践的知識となります。