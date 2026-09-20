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

ヴィジュネル暗号は以下の数学的原理に基づいて実装されています。

#### 暗号化アルゴリズム
```javascript
export const encryptChar = (plainChar, keyChar, offset = 0) => {
  const plainCode = plainChar.charCodeAt(0) - CHAR_CODE_A;
  const keyCode = keyChar.charCodeAt(0) - CHAR_CODE_A;
  offset = offset === 1 ? 1 : 0;
  // A=0: (plain + key) % 26, A=1: (plain + key + 1) % 26
  return String.fromCharCode((plainCode + keyCode + offset) % ALPHABET_SIZE + CHAR_CODE_A);
};
```

#### 復号アルゴリズム
```javascript
export const decryptChar = (cipherChar, keyChar, offset = 0) => {
  const cipherCode = cipherChar.charCodeAt(0) - CHAR_CODE_A;
  const keyCode = keyChar.charCodeAt(0) - CHAR_CODE_A;
  offset = offset === 1 ? 1 : 0;
  // A=0: (cipher - key + 26) % 26, A=1: (cipher - key - 1 + 26) % 26
  return String.fromCharCode((cipherCode - keyCode - offset + ALPHABET_SIZE) % ALPHABET_SIZE + CHAR_CODE_A);
};
```

表示する値はA=0で0〜25、A=1で1〜26です。
A=1でも表示上の式は(平文+鍵) mod 26で、剰余0は26と読みます。
内部の文字コードは0始まりなので、offsetを加減します。offsetは数値1だけを1として扱います。
formula.jsはこの表示上の計算を担当し、負の剰余を0〜25に直します。

#### 鍵の循環システム
```javascript
export const repeatKey = (key, length) => {
  if (length === 0) return '';
  return key.repeat(Math.ceil(length / key.length)).slice(0, length);
};
```

**技術的ポイント**
- **モジュロ26演算**: アルファベット26文字の循環処理
- **負数処理**: 復号時の `+26` で負数を正数に変換
- **ASCII変換**: 文字コード操作による効率的な計算

---

## モジュラーアーキテクチャ

### JavaScriptモジュール分離

```
js/
├── core/               # cipher・formula・random・input・validation・indexing-mode・utils
├── features/           # main-tab・research-tab・lab-tab
├── ui/                 # tabs・theme・dom-elements・message-display・table-generator
├── theme-init.js       # 描画前にテーマを選ぶ通常スクリプト
└── app.js              # 起動処理とモーダル
```

#### モジュールの依存関係設計
```javascript
export const processText = () => {
  if (!validateMainInputs()) return;
  if (mainTabElements.inputText().value.length > MAX_TEXT_LENGTH) {
    applyLoadedText(mainTabElements.inputText().value);
    if (!validateMainInputs()) return;
  }
  const mode = mainTabElements.mode().value;
  const key = mainTabElements.key().value;
  const inputText = mainTabElements.inputText().value;
  const offset = getIndexingOffset();
  const format = mainTabElements.outputFormat().value;
  mainTabElements.sanitizedText().value = sanitize(inputText);
  const { visualization } = vigenere(inputText, key, mode, offset);
  mainTabElements.outputText().value = formatOutput(inputText, key, mode, offset, format);
  displayVisualization(mainTabElements.visualization(), visualization, mode);
  hasResult = true;
};
```

### CSSレイヤードアーキテクチャ

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

**設計哲学**
- **単一責任原則**: 各ファイルが一つの責任を持つ
- **依存関係の管理**: 低レベルから高レベルへの依存のみ
- **再利用性**: コンポーネント単位での再利用可能性

---

## CSS設計パターン

### デザインシステム変数

配色はthemes/light.cssとthemes/dark.css、間隔や文字サイズはbase/variables.cssで管理します。

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
.tab-button.active {}      /* Modifier */
.tab-content {}             /* Element */

/* 状態管理クラス */
.warning-message {}
.warning-message.show {}   /* 警告の表示状態 */
.error-message {}
.error-message.show {}     /* エラーの表示状態 */
```

---

## 入力検証システム

### 段階的検証フロー

```javascript
export const validateInputText = (inputText, format = 'compact') => {
  if (!inputText) return { isValid: true, type: 'none', message: '' };
  const { letters, fullwidthLatin, ignored } = analyzeInput(inputText);
  if (fullwidthLatin) {
    return {
      isValid: false, type: 'error',
      message: `全角の英字が${fullwidthLatin}文字あります。半角に直してください`
    };
  }
  if (!letters) {
    return { isValid: false, type: 'error', message: 'アルファベット（A-Z）を含む文字を入力してください' };
  }
  if (ignored) {
    return {
      isValid: true, type: 'warning',
      message: format === 'preserve'
        ? `英字以外の${ignored}文字は変換せず、そのまま出力します`
        : `英字以外の${ignored}文字は無視されます（記号・数字・空白・日本語など）`
    };
  }
  return { isValid: true, type: 'none', message: '' };
};
```

### 読み込みと上限

input.jsは制御文字だけを除き、HTMLエスケープをしません。
URLSearchParamsで一度だけ復号した値をtextarea.valueに渡します。
入力は100,000文字、UTF-8ファイルは1MB、対応表は先頭1,000文字までです。
上限で切り捨てたときは画面に警告します。

### 文字サニタイゼーション

```javascript
export const sanitize = (input) => {
  return input.toUpperCase().replace(/[^A-Z]/g, '');
};
```

**実装上の工夫**
- **非破壊的処理**: 元の入力を変更せずサニタイズ版を生成
- **段階的検証**: エラー・警告・成功の3段階での検証
- **ユーザビリティ**: 警告時でも処理を継続

---

## 視覚化エンジン

### 動的テーブル生成

```javascript
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
```

### インタラクティブハイライト

```javascript
const visualization = mainTabElements.visualization();
visualization.addEventListener('mouseover', handleCellHover);
visualization.addEventListener('mouseout', handleCellLeave);
visualization.addEventListener('click', handleCellHover);
```

### ヴィジュネル表の動的ハイライト

```javascript
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

#### ✅ 解決策：インラインスタイルの撤去

```css
/* messages.cssから、警告を表示する規則を抜粋 */
.warning-message.show {
  display: block;
  margin-top: var(--spacing-xs);
  margin-bottom: var(--spacing-sm);
  padding: var(--spacing-sm);
  background-color: var(--message-warning-bg);
  border: 1px solid var(--message-warning-border);
  border-radius: var(--border-radius);
}
```

#### 🎯 推奨する設計パターン

**1. クラスベースの状態管理**
```css
.error-message,
.warning-message {
  display: none;
  font-size: var(--text-sm);
  margin: 0;
  padding: 0;
  transition: all 0.2s ease;
}
```

**2. 一貫したJavaScript制御**
```javascript
export const showWarning = (element, message) => {
  if (!element) return;

  element.textContent = message;
  element.classList.add('show');
  element.classList.remove('error');
  element.classList.add('warning');
};

export const hideMessage = (element) => {
  if (!element) return;

  element.classList.remove('show');
  element.classList.remove('warning');
  element.classList.remove('error');
};
```

#### 📖 学んだこと

1. **インラインスタイルの使用を避ける** - CSS優先度の問題を回避
2. **CSSとJavaScriptの責任を明確にする** - CSSは見た目、JSは状態管理
3. **クラスベースの設計** - `style.display`の直接操作より保守性が高い
4. **デバッグ時の確認ポイント** - ブラウザー開発者ツールでcomputedスタイルを確認

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

#### 解決策：静的インポートと起動処理の集約

```javascript
import { initMainTab } from './features/main-tab.js';
import { initResearchTab } from './features/research-tab.js';
import { initLabTab } from './features/lab-tab.js';

initMainTab();
initResearchTab();
initLabTab();
```

---

### パフォーマンス最適化

#### 静的インポートによる一度だけの初期化

```javascript
import { initTabs } from './ui/tabs.js';
initTabs();
```

#### イベント委譲によるメモリ効率化

```javascript
const visualization = mainTabElements.visualization();
visualization.addEventListener('click', handleCellHover);
```

---

## セキュリティ考慮事項

### XSS防止対策

```javascript
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
```

### CSPヘッダーの実装

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'">
```

---

## 自動テストと乱数

Node 22以上でnpm testを実行します。依存パッケージは不要です。
既知解答、両モードの676組、表のSHA-256、数式、入力、配色、文書の例を検証します。
random.jsはcrypto.getRandomValuesのバイトのうち234以上を捨て、26文字への剰余の偏りをなくします。
これはブラウザーの乱数による学習実験であり、本物のワンタイムパッドの鍵の配送・破棄は再現しません。
ES moduleを使うためfile://では動かず、HTTP配信が必要です。
meta CSPではframe-ancestorsによる埋め込み制御はできません。

## まとめ

このプロジェクトでは、単純な暗号化ツールの実装を通じて、以下の現代的な Web 開発技術を実践しました。

1. **モジュラーアーキテクチャ**: 責任分離による保守性の向上
2. **デザインシステム**: CSS変数による一貫したUI設計
3. **状態管理**: クラスベースによる堅牢な状態制御
4. **パフォーマンス最適化**: 対応表の1,000文字上限とイベント委譲
5. **セキュリティ**: XSS防止とCSP実装

これらの技術的学習は、より大規模なWebアプリケーション開発にも応用可能な実践的知識となります。
