/**
 * Language Layer
 * 日本語と英語の文言をまとめ、DOMへ当てる層。ほかのモジュールは言語ごとの文字列を持たない。
 */

const ja = {
  'app.title': 'ヴィジュネル暗号ツール（Vigenere Cipher Tool）',
  'app.headingLine1': 'ヴィジュネル暗号ツール',
  'app.headingLine2': '（Vigenere Cipher Tool）',
  'app.description':
    'ヴィジュネル暗号の暗号化・復号、タブラ・レクタの研究、シーザー暗号とワンタイムパッドの実験ができる学習ツール。ブラウザー内だけで動きます。',
  'app.keywords': 'ヴィジュネル暗号,多表式換字暗号,タブラ・レクタ,シーザー暗号,ワンタイムパッド,古典暗号,暗号学習',
  'app.ogTitle': 'ヴィジュネル暗号ツール',
  'app.ogDescription': 'ヴィジュネル表をたどりながら、暗号化・復号と文字の対応を学べるツールです。',
  'app.ogSiteName': '生成AIで作るセキュリティツール100',
  'app.twitterTitle': 'ヴィジュネル暗号ツール',
  'app.twitterDescription': '暗号化・復号、タブラ・レクタの研究、シーザー暗号とワンタイムパッドの実験ができます。',
  'app.langButton': 'English',
  'app.langAria': '言語を切り替える',
  'app.initError': 'アプリケーションの初期化に失敗しました。ページを再読み込みしてください。',

  'header.helpAria': 'ヘルプ',
  'header.themeAria': 'テーマ切替',
  'header.indexingPrefix': '表モード:',
  'header.indexingSwitchTo': '表モードを{mode}に切り替える',
  'header.indexingHelpAria': '表モードの説明',
  'header.indexingHelp': 'ヴィジュネル表の計算方式。A=0（標準）では A+A=A、A=1 では A+A=B となります。',

  'tabs.aria': '機能の切り替え',
  'tabs.cipher': '暗号化・復号',
  'tabs.tabula': 'タブラ・レクタ研究',
  'tabs.lab': '実験室',

  'main.modeLabel': 'モード選択:',
  'main.modeEncrypt': '暗号化',
  'main.modeDecrypt': '復号',
  'main.inputLabel': '平文（暗号化時）/ 暗号文（復号時）:',
  'main.fileButtonTitle': 'ファイルを選択',
  'main.inputPlaceholder': 'ここにテキストを入力、またはファイルをドラッグ＆ドロップ',
  'main.dropMessage': 'ファイルをドロップしてください',
  'main.keyLabel': '鍵（英字）:',
  'main.keyPlaceholder': '例: LEMON',
  'main.keyWarning': 'アルファベット以外は無視されます',
  'main.formatLabel': '出力形式:',
  'main.formatCompact': '詰めて出力（英字のみ・大文字）',
  'main.formatGroup5': '5文字ごとに区切る',
  'main.formatPreserve': '書式を保つ（空白・記号・大文字小文字）',
  'main.processButton': '実行',
  'main.sanitizedLabel': '処理対象テキスト（英字のみ）:',
  'main.outputLabel': '出力:',
  'main.copyTitle': 'クリップボードにコピー',
  'main.copyToast': 'コピーしました！',
  'main.vizAria': '対応関係の表（横スクロール）',
  'main.tableAria': 'ヴィジュネル表（横スクロール）',

  'tabula.intro': 'ヴィジュネル表（タブラ・レクタ）を使って、文字の換字変換を研究します。',
  'tabula.guideTitle': '📖 表の見方：',
  'tabula.guideRowLabel': '上部の行（横）',
  'tabula.guideRowText': '：平文文字（A〜Z）',
  'tabula.guideColLabel': '左側の列（縦）',
  'tabula.guideColText': '：鍵文字（A〜Z）',
  'tabula.guideCrossLabel': '交差する場所',
  'tabula.guideCrossText': '：暗号文字',
  'tabula.example': '例：平文「H」＋鍵「K」→ 上部で「H」の列、左側で「K」の行を探し、交差する文字「{char}」が暗号文',
  'tabula.tableAria': 'ヴィジュネル表（横スクロール）',
  'tabula.headingForward': '平文文字と鍵文字から、暗号文文字を計算する',
  'tabula.headingReverse': '平文文字と暗号文文字から、鍵文字を計算する',
  'tabula.plainCharLabel': '平文文字:',
  'tabula.keyCharLabel': '鍵文字:',
  'tabula.cipherCharLabel': '暗号文文字:',
  'tabula.selectOption': '選択',
  'tabula.calcButton': '計算',
  'tabula.selectBoth': '平文文字と鍵文字を選択してください',
  'tabula.selectBothReverse': '平文文字と暗号文文字を選択してください',

  'lab.exp1Title': '実験1: シーザー暗号との関係',
  'lab.exp1Intro': '鍵が1文字の場合、ヴィジュネル暗号はシーザー暗号と同じになります。',
  'lab.plainLabel': '平文:',
  'lab.caesarKeyLabel': '鍵（1文字）:',
  'lab.runButton': '実験する',
  'lab.exp2Title': '実験2: ワンタイムパッドとの関係',
  'lab.exp2Intro':
    '平文の英字数と同じ長さの鍵を生成し、ワンタイムパッドの原理を実験します。鍵の配送・破棄までは再現しません。',
  'lab.otpKeyLabel': '鍵（平文と同じ長さ）:',
  'lab.generateKey': 'ランダム鍵生成',
  'lab.otpKeyPlaceholder': '自動生成されます',
  'lab.resultInput': '入力',
  'lab.resultSanitized': '処理対象（英字のみ）',
  'lab.resultKeyOne': '鍵（1文字）',
  'lab.resultRepeatedKey': '繰り返された鍵',
  'lab.resultCipher': '暗号文',
  'lab.resultShift': 'シフト量',
  'lab.resultObservation': '観察',
  'lab.resultPlain': '平文',
  'lab.resultRandomKey': 'ランダム鍵',
  'lab.resultCaution': '注意',
  'lab.caesarObservation': 'すべての文字を同じ量だけずらすシーザー暗号です（{mode}）。',
  'lab.otpObservation': '鍵の長さが平文と同じ（{count}文字）',
  'lab.otpCaution': 'ブラウザーの乱数による実験です。鍵の配送・破棄までは再現しません。',
  'lab.needPlain': 'まず平文を入力してください',
  'lab.keyStale': '平文が変わりました。鍵を生成し直してください',

  'viz.tableTitle': 'ヴィジュネル表（タブラ・レクタ）',
  'viz.titleEncrypt': '対応関係（平文＋鍵 → 出力）',
  'viz.titleDecrypt': '対応関係（暗号文＋鍵 → 出力）',
  'viz.truncated': '対応表は先頭{max}文字だけを表示しています（全{total}文字）',
  'viz.rowPlain': '平文',
  'viz.rowKey': '鍵',
  'viz.rowOutput': '出力',
  'viz.rowCipher': '暗号文',

  'formula.readAs26': '（0は26と読む）',

  'error.fullwidth': '全角の英字が{count}文字あります。半角に直してください',
  'error.noLetters': 'アルファベット（A-Z）を含む文字を入力してください',
  'error.caesarKey': 'アルファベット1文字を入力してください',
  'error.fileTooLarge': 'ファイルサイズが大きすぎます（最大: {size}MB）',
  'error.fileType': 'テキストファイル（.txt）のみサポートしています',
  'error.fileEmpty': 'ファイルが空です',
  'error.fileRead': 'ファイルの読み込みに失敗しました',
  'error.fileProcess': 'ファイルの処理に失敗しました',
  'error.urlText': 'URLのテキストを読み込めませんでした',
  'warning.ignored': '英字以外の{count}文字は無視されます（記号・数字・空白・日本語など）',
  'warning.ignoredPreserve': '英字以外の{count}文字は変換せず、そのまま出力します',
  'warning.truncated': '先頭{max}文字だけを読み込みました（元は{total}文字）',

  'footer.prefix': '🔗 GitHubリポジトリーはこちら（',
  'footer.suffix': '）',

  'help.modalTitle': '🔐 ヴィジュネル暗号ツール - 完全ガイド',
  'help.closeAria': '閉じる',
  'help.overviewTitle': '概要',
  'help.overviewBody':
    'ヴィジュネル暗号は、16世紀に考案された多表式換字暗号です。このツールでは暗号化・復号だけでなく、暗号の仕組みを研究・実験できます。',
  'help.tab1Title': '📝 タブ1: 暗号化・復号',
  'help.tab1BasicTitle': '基本的な使い方:',
  'help.t1s1Label': 'モード選択:',
  'help.t1s1Text': '「暗号化」または「復号」を選択',
  'help.t1s2Label': 'テキスト入力:',
  'help.t1s2Text': '平文または暗号文を入力',
  'help.t1s2a': '📁 ファイル選択アイコンでテキストファイル読み込み',
  'help.t1s2b': 'ドラッグ&ドロップでファイル読み込み対応',
  'help.t1s2c': '全角英字はエラーになります。その他の英字以外は無視し、「書式を保つ」ではそのまま出力します',
  'help.t1s3Label': '鍵の入力:',
  'help.t1s3Text': '暗号化・復号に使用する鍵を英字で入力（例: LEMON）',
  'help.t1s4Label': '出力形式:',
  'help.t1s4Text': '詰めて出力／5文字ごとに区切る／書式を保つ、の3形式を選択',
  'help.t1s5Label': '実行:',
  'help.t1s5Text': '「実行」ボタンをクリックして結果を表示',
  'help.t1s6Label': '結果コピー:',
  'help.t1s6Text': '📋 コピーアイコンでワンクリックコピー',
  'help.tab1VizTitle': '視覚化機能:',
  'help.t1v1Label': '処理対象テキスト:',
  'help.t1v1Text': '実際に処理される英字のみのテキスト表示',
  'help.t1v2Label': '対応関係の可視化:',
  'help.t1v2Text': '平文・鍵・出力の文字対応を表形式で表示',
  'help.t1v3Label': 'インタラクティブハイライト:',
  'help.t1v3Text': 'セルにマウスを合わせると、ヴィジュネル表の該当部分をハイライト',
  'help.t1v4Label': 'ヴィジュネル表（タブラ・レクタ）:',
  'help.t1v4Text': '26×26の完全な換字表を常時表示',
  'help.tab2Title': '🔬 タブ2: タブラ・レクタ研究',
  'help.tab2Intro': 'ヴィジュネル表を使った文字変換の仕組みを詳しく研究できます。',
  'help.t2aLabel': '暗号化研究:',
  'help.t2aText': '平文文字と鍵文字を選択して、暗号文字を計算',
  'help.t2bLabel': '復号研究:',
  'help.t2bText': '平文文字と暗号文字から、使用された鍵文字を逆算',
  'help.t2cLabel': '数式表示:',
  'help.t2cText': 'モジュロ26演算の詳細な計算過程を表示',
  'help.t2dLabel': 'ハイライト機能:',
  'help.t2dText': '選択した文字組み合わせをヴィジュネル表でハイライト',
  'help.tab3Title': '🧪 タブ3: 実験室',
  'help.tab3Intro': 'ヴィジュネル暗号の特殊なケースや関連する暗号を実験できます。',
  'help.t3CaesarTitle': 'シーザー暗号実験:',
  'help.t3c1': '1文字の鍵を使用したヴィジュネル暗号 = シーザー暗号',
  'help.t3c2': '鍵の長さによる暗号の性質の違いを観察',
  'help.t3OtpTitle': 'ワンタイムパッド実験:',
  'help.t3o1': '平文と同じ長さのランダム鍵を自動生成',
  'help.t3o2': 'crypto.getRandomValuesと棄却サンプリングによる鍵を使用',
  'help.t3o3': '文字ごとの対応関係を詳細に可視化',
  'help.otherTitle': '🎨 その他の機能',
  'help.o1Label': '表モード切替（A=0 / A=1）:',
  'help.o1Text': 'タブ横のトグルで計算方式を切り替え',
  'help.o1a': 'A=0（標準）: A=0, B=1, ..., Z=25。A+A=A',
  'help.o1b': 'A=1: A=1, B=2, ..., Z=26。A+A=B（一部の文献で使用）',
  'help.o2Label': 'ダークモード:',
  'help.o2Text': '🌙 アイコンでライト/ダーク切り替え',
  'help.o3Label': 'レスポンシブ対応:',
  'help.o3Text': '長いテキストでも横スクロールで快適に表示',
  'help.o4Label': '固定ヘッダー:',
  'help.o4Text': 'スクロール時も列ラベルが常に表示',
  'help.o5Label': 'キーボードショートカット:',
  'help.o5Text': 'Escキーでモーダルを閉じる',
  'help.o6Label': '日本語・英語の切り替え:',
  'help.o6Text': 'ヘッダーのボタンで表示言語を切り替え（選択は次回も引き継ぎます）',
  'help.mechTitle': '⚡ 暗号化の仕組み',
  'help.mechIntro': '各文字は以下の数学的手順で変換されます（表モードで切替可能）：',
  'help.m1Label': '文字コード変換:',
  'help.m1a': 'A=0モード: A=0, B=1, ..., Z=25',
  'help.m1b': 'A=1モード: A=1, B=2, ..., Z=26',
  'help.m2Label': 'モジュロ26演算:',
  'help.m2a': 'A=0: 暗号化 = (平文 + 鍵) mod 26',
  'help.m2b': 'A=1: 暗号化 = (平文 + 鍵) mod 26（0は26と読む）',
  'help.m3Label': '鍵の循環:',
  'help.m3Text': '鍵は平文の長さに合わせて繰り返し使用',
  'help.m4Label': '結果表示:',
  'help.m4Text': '数値を再び文字に変換して出力',
  'help.secTitle': '⚠️ セキュリティに関する注意',
  'help.secStrong': 'このツールは教育・学習目的です。',
  'help.secLead': 'ヴィジュネル暗号は現代のセキュリティ基準では安全ではありません：',
  'help.sec1': '短い鍵は周期性により解読される可能性があります',
  'help.sec2': '頻度解析や既知平文攻撃に対して脆弱です',
  'help.sec3': '実際の機密情報の保護には使用しないでください'
};

const en = {
  'app.title': 'Vigenere Cipher Tool - Learn Classical Cryptography',
  'app.headingLine1': 'Vigenere Cipher Tool',
  'app.headingLine2': 'Learn Classical Cryptography',
  'app.description':
    'A learning tool for the Vigenère cipher: encrypt and decrypt, study the tabula recta, and experiment with the '
    + 'Caesar cipher and the one-time pad. Everything runs inside your browser.',
  'app.keywords':
    'vigenere cipher,polyalphabetic substitution,tabula recta,caesar cipher,one-time pad,classical cryptography',
  'app.ogTitle': 'Vigenere Cipher Tool',
  'app.ogDescription':
    'Follow the tabula recta and learn how the Vigenère cipher maps letters while you encrypt and decrypt.',
  'app.ogSiteName': '100 Security Tools Built with Generative AI',
  'app.twitterTitle': 'Vigenere Cipher Tool',
  'app.twitterDescription':
    'Encrypt and decrypt, study the tabula recta, and experiment with the Caesar cipher and the one-time pad.',
  'app.langButton': '日本語',
  'app.langAria': 'Switch language',
  'app.initError': 'The tool failed to start. Reload the page and try again.',

  'header.helpAria': 'Help',
  'header.themeAria': 'Toggle theme',
  'header.indexingPrefix': 'Table mode:',
  'header.indexingSwitchTo': 'Switch the table mode to {mode}',
  'header.indexingHelpAria': 'About the table mode',
  'header.indexingHelp':
    'How the Vigenère table is computed. A=0 (standard) gives A+A=A, while A=1 gives A+A=B.',

  'tabs.aria': 'Switch features',
  'tabs.cipher': 'Encrypt / Decrypt',
  'tabs.tabula': 'Tabula recta',
  'tabs.lab': 'Lab',

  'main.modeLabel': 'Mode:',
  'main.modeEncrypt': 'Encrypt',
  'main.modeDecrypt': 'Decrypt',
  'main.inputLabel': 'Plaintext (encrypt) / ciphertext (decrypt):',
  'main.fileButtonTitle': 'Choose a file',
  'main.inputPlaceholder': 'Type text here, or drag and drop a file',
  'main.dropMessage': 'Drop the file here',
  'main.keyLabel': 'Key (letters):',
  'main.keyPlaceholder': 'e.g. LEMON',
  'main.keyWarning': 'Anything other than letters is ignored',
  'main.formatLabel': 'Output format:',
  'main.formatCompact': 'Compact (letters only, uppercase)',
  'main.formatGroup5': 'Groups of five letters',
  'main.formatPreserve': 'Keep the layout (spaces, symbols, letter case)',
  'main.processButton': 'Run',
  'main.sanitizedLabel': 'Text that will be processed (letters only):',
  'main.outputLabel': 'Output:',
  'main.copyTitle': 'Copy to the clipboard',
  'main.copyToast': 'Copied.',
  'main.vizAria': 'Letter mapping table (scrolls sideways)',
  'main.tableAria': 'Vigenère table (scrolls sideways)',

  'tabula.intro': 'Study how letters are substituted by reading the Vigenère table (the tabula recta).',
  'tabula.guideTitle': '📖 How to read the table',
  'tabula.guideRowLabel': 'Top row (across)',
  'tabula.guideRowText': ': plaintext letter (A-Z)',
  'tabula.guideColLabel': 'Left column (down)',
  'tabula.guideColText': ': key letter (A-Z)',
  'tabula.guideCrossLabel': 'Where they cross',
  'tabula.guideCrossText': ': ciphertext letter',
  'tabula.example':
    'Example: plaintext H plus key K. Find column H across the top and row K down the left side; '
    + 'the letter where they cross, {char}, is the ciphertext.',
  'tabula.tableAria': 'Vigenère table (scrolls sideways)',
  'tabula.headingForward': 'Work out the ciphertext letter from a plaintext letter and a key letter',
  'tabula.headingReverse': 'Work out the key letter from a plaintext letter and a ciphertext letter',
  'tabula.plainCharLabel': 'Plaintext letter:',
  'tabula.keyCharLabel': 'Key letter:',
  'tabula.cipherCharLabel': 'Ciphertext letter:',
  'tabula.selectOption': 'Select',
  'tabula.calcButton': 'Calculate',
  'tabula.selectBoth': 'Select a plaintext letter and a key letter',
  'tabula.selectBothReverse': 'Select a plaintext letter and a ciphertext letter',

  'lab.exp1Title': 'Experiment 1: how it relates to the Caesar cipher',
  'lab.exp1Intro': 'With a one-letter key, the Vigenère cipher becomes the Caesar cipher.',
  'lab.plainLabel': 'Plaintext:',
  'lab.caesarKeyLabel': 'Key (one letter):',
  'lab.runButton': 'Run the experiment',
  'lab.exp2Title': 'Experiment 2: how it relates to the one-time pad',
  'lab.exp2Intro':
    'A key as long as the letters in the plaintext is generated so that you can try the idea behind the one-time '
    + 'pad. Key delivery and destruction are not reproduced here.',
  'lab.otpKeyLabel': 'Key (as long as the plaintext):',
  'lab.generateKey': 'Generate a random key',
  'lab.otpKeyPlaceholder': 'Generated for you',
  'lab.resultInput': 'Input',
  'lab.resultSanitized': 'Processed text (letters only)',
  'lab.resultKeyOne': 'Key (one letter)',
  'lab.resultRepeatedKey': 'Repeated key',
  'lab.resultCipher': 'Ciphertext',
  'lab.resultShift': 'Shift amount',
  'lab.resultObservation': 'Observation',
  'lab.resultPlain': 'Plaintext',
  'lab.resultRandomKey': 'Random key',
  'lab.resultCaution': 'Caution',
  'lab.caesarObservation': 'Every letter moves by the same amount, which is the Caesar cipher ({mode}).',
  'lab.otpObservation': 'The key is as long as the plaintext ({count} letters)',
  'lab.otpCaution':
    'This experiment uses the randomness of your browser. Key delivery and destruction are not reproduced.',
  'lab.needPlain': 'Enter a plaintext first',
  'lab.keyStale': 'The plaintext changed. Generate the key again',

  'viz.tableTitle': 'Vigenère table (tabula recta)',
  'viz.titleEncrypt': 'Letter mapping (plaintext + key to output)',
  'viz.titleDecrypt': 'Letter mapping (ciphertext + key to output)',
  'viz.truncated': 'The mapping shows the first {max} letters only (out of {total})',
  'viz.rowPlain': 'Plain',
  'viz.rowKey': 'Key',
  'viz.rowOutput': 'Output',
  'viz.rowCipher': 'Cipher',

  'formula.readAs26': ' (read 0 as 26)',

  'error.fullwidth': 'Found {count} full-width letters. Replace them with half-width letters',
  'error.noLetters': 'Enter text that contains letters from A to Z',
  'error.caesarKey': 'Enter a single letter',
  'error.fileTooLarge': 'The file is too large (limit: {size}MB)',
  'error.fileType': 'Only text files (.txt) are supported',
  'error.fileEmpty': 'The file is empty',
  'error.fileRead': 'The file could not be read',
  'error.fileProcess': 'The file could not be processed',
  'error.urlText': 'The text in the URL could not be loaded',
  'warning.ignored': '{count} non-letter characters are ignored (symbols, digits, spaces, other scripts)',
  'warning.ignoredPreserve': '{count} non-letter characters pass through unchanged',
  'warning.truncated': 'Only the first {max} characters were loaded (the original had {total})',

  'footer.prefix': '🔗 GitHub repository: ',
  'footer.suffix': '',

  'help.modalTitle': '🔐 Vigenere Cipher Tool - full guide',
  'help.closeAria': 'Close',
  'help.overviewTitle': 'Overview',
  'help.overviewBody':
    'The Vigenère cipher is a polyalphabetic substitution cipher devised in the 16th century. This tool encrypts '
    + 'and decrypts, and also lets you study and experiment with how the cipher works.',
  'help.tab1Title': '📝 Tab 1: encrypt and decrypt',
  'help.tab1BasicTitle': 'Basic steps:',
  'help.t1s1Label': 'Pick a mode:',
  'help.t1s1Text': 'choose Encrypt or Decrypt',
  'help.t1s2Label': 'Enter text:',
  'help.t1s2Text': 'type the plaintext or the ciphertext',
  'help.t1s2a': '📁 the file icon loads a text file',
  'help.t1s2b': 'drag and drop also loads a file',
  'help.t1s2c':
    'full-width letters raise an error; other non-letters are ignored, and the keep-the-layout format passes '
    + 'them through as they are',
  'help.t1s3Label': 'Enter a key:',
  'help.t1s3Text': 'type the key in letters (for example LEMON)',
  'help.t1s4Label': 'Output format:',
  'help.t1s4Text': 'choose compact, groups of five letters, or keep the layout',
  'help.t1s5Label': 'Run:',
  'help.t1s5Text': 'press Run to see the result',
  'help.t1s6Label': 'Copy the result:',
  'help.t1s6Text': '📋 the copy icon copies it in one click',
  'help.tab1VizTitle': 'Ways to see the cipher at work:',
  'help.t1v1Label': 'Text that will be processed:',
  'help.t1v1Text': 'shows only the letters that are actually converted',
  'help.t1v2Label': 'Letter mapping:',
  'help.t1v2Text': 'lines up plaintext, key, and output letter by letter',
  'help.t1v3Label': 'Highlighting as you point:',
  'help.t1v3Text': 'hovering a cell highlights the matching part of the Vigenère table',
  'help.t1v4Label': 'Vigenère table (tabula recta):',
  'help.t1v4Text': 'the full 26 by 26 substitution table stays on screen',
  'help.tab2Title': '🔬 Tab 2: tabula recta study',
  'help.tab2Intro': 'Look closely at how single letters are converted through the Vigenère table.',
  'help.t2aLabel': 'Encryption study:',
  'help.t2aText': 'pick a plaintext letter and a key letter to get the ciphertext letter',
  'help.t2bLabel': 'Decryption study:',
  'help.t2bText': 'recover the key letter from a plaintext letter and a ciphertext letter',
  'help.t2cLabel': 'The arithmetic:',
  'help.t2cText': 'shows each step of the modulo 26 calculation',
  'help.t2dLabel': 'Highlighting:',
  'help.t2dText': 'marks the letter pair you chose on the Vigenère table',
  'help.tab3Title': '🧪 Tab 3: lab',
  'help.tab3Intro': 'Try the special cases of the Vigenère cipher and the ciphers it is related to.',
  'help.t3CaesarTitle': 'Caesar cipher experiment:',
  'help.t3c1': 'a Vigenère cipher with a one-letter key is the Caesar cipher',
  'help.t3c2': 'see how the key length changes the character of the cipher',
  'help.t3OtpTitle': 'One-time pad experiment:',
  'help.t3o1': 'a random key as long as the plaintext is generated for you',
  'help.t3o2': 'the key comes from crypto.getRandomValues with rejection sampling',
  'help.t3o3': 'the letter-by-letter mapping is drawn out in full',
  'help.otherTitle': '🎨 Other features',
  'help.o1Label': 'Table mode (A=0 / A=1):',
  'help.o1Text': 'the toggle beside the tabs switches how the table is computed',
  'help.o1a': 'A=0 (standard): A=0, B=1, ..., Z=25, so A+A=A',
  'help.o1b': 'A=1: A=1, B=2, ..., Z=26, so A+A=B (used in some references)',
  'help.o2Label': 'Dark mode:',
  'help.o2Text': 'the 🌙 icon switches between light and dark',
  'help.o3Label': 'Responsive layout:',
  'help.o3Text': 'long text stays readable by scrolling sideways',
  'help.o4Label': 'Sticky headers:',
  'help.o4Text': 'the row labels stay visible while you scroll',
  'help.o5Label': 'Keyboard shortcut:',
  'help.o5Text': 'Esc closes this dialog',
  'help.o6Label': 'Japanese and English:',
  'help.o6Text': 'the header button switches the language, and your choice is remembered',
  'help.mechTitle': '⚡ How the encryption works',
  'help.mechIntro': 'Every letter goes through these steps, and the table mode decides which numbering is used.',
  'help.m1Label': 'Letters to numbers:',
  'help.m1a': 'A=0 mode: A=0, B=1, ..., Z=25',
  'help.m1b': 'A=1 mode: A=1, B=2, ..., Z=26',
  'help.m2Label': 'Modulo 26 arithmetic:',
  'help.m2a': 'A=0: ciphertext = (plaintext + key) mod 26',
  'help.m2b': 'A=1: ciphertext = (plaintext + key) mod 26, reading 0 as 26',
  'help.m3Label': 'The key repeats:',
  'help.m3Text': 'the key is repeated to match the length of the plaintext',
  'help.m4Label': 'Numbers back to letters:',
  'help.m4Text': 'each number becomes a letter again and is printed',
  'help.secTitle': '⚠️ A note on security',
  'help.secStrong': 'This tool is for learning.',
  'help.secLead': 'The Vigenère cipher is not safe by present-day standards.',
  'help.sec1': 'a short key repeats, and that periodicity can be broken',
  'help.sec2': 'it is weak against frequency analysis and known-plaintext attacks',
  'help.sec3': 'never use it to protect real secrets'
};

const LANGUAGES = ['ja', 'en'];
const ATTRIBUTES = ['aria-label', 'title', 'placeholder', 'alt', 'content'];
const STORAGE_KEY = 'vigenere-cipher-tool-language';
let language = 'ja';

const dictionary = () => (language === 'en' ? en : ja);

/** 辞書にそのキーがあるかを返す。純ロジックが返したコードを訳せるか確かめるために使う。 */
const has = (key) => typeof dictionary()[key] === 'string';

/** 言語を指定して訳す。DOMに触れないので、どちらの言語もテストから確かめられる。 */
const translate = (lang, key, values = {}) => {
  const message = (lang === 'en' ? en : ja)[key];
  if (typeof message !== 'string') throw new Error('Unknown message: ' + key);
  return message.replace(/\{(\w+)\}/g, (match, name) =>
    (Object.prototype.hasOwnProperty.call(values, name) ? String(values[name]) : match));
};

const t = (key, values = {}) => translate(language, key, values);

const apply = (root = document) => {
  document.documentElement.lang = language;
  document.title = t('app.title');
  for (const element of root.querySelectorAll('[data-i18n]')) element.textContent = t(element.dataset.i18n);
  for (const attribute of ATTRIBUTES) {
    for (const element of root.querySelectorAll(`[data-i18n-${attribute}]`)) {
      element.setAttribute(attribute, t(element.getAttribute(`data-i18n-${attribute}`)));
    }
  }
};

const setLanguage = (value) => {
  if (!LANGUAGES.includes(value) || value === language) return;
  language = value;
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // 保存領域が使えない環境では、この表示のあいだだけ選択を保つ。
  }
  apply();
  document.dispatchEvent(new Event('languagechange'));
};

const preferred = () => {
  let query = null;
  let saved = null;
  try {
    query = new URLSearchParams(location.search).get('lang');
  } catch {
    // location が読めない環境では保存値とブラウザーの設定に任せる。
  }
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch {
    // 保存領域が使えない環境ではブラウザーの設定に従う。
  }
  const chosen = [query, saved].find((value) => LANGUAGES.includes(value));
  if (chosen) return chosen;
  const browser = (typeof navigator === 'object' && navigator && navigator.language) || '';
  return /^ja\b/i.test(browser) ? 'ja' : 'en';
};

const init = () => {
  language = preferred();
  apply();
};

export const I18n = {
  ja,
  en,
  STORAGE_KEY,
  languages: LANGUAGES,
  t,
  translate,
  has,
  apply,
  init,
  setLanguage,
  get language() { return language; }
};
