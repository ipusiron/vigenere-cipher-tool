export const MAX_TEXT_LENGTH = 100000;
export const MAX_FILE_BYTES = 1048576;
export const VIZ_MAX_CHARS = 1000;

/** textareaへ渡す文字列。タブと改行を残し、HTMLの加工はしない。 */
export const normalizeLoadedText = (raw) => {
  const clean = String(raw).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '');
  const originalLength = clean.length;
  const truncated = originalLength > MAX_TEXT_LENGTH;
  let end = Math.min(originalLength, MAX_TEXT_LENGTH);
  if (truncated && /[\uD800-\uDBFF]/.test(clean[end - 1])) end--;
  return { text: clean.slice(0, end), truncated, originalLength };
};

export const readTextParam = (search) => {
  const raw = new URLSearchParams(search).get('text');
  return raw === null ? null : normalizeLoadedText(raw).text;
};

/** 受け渡しの値は「#」より後ろ（サーバーへ送られず、URLの長さの上限もない）を優先し、なければ「?」から読む。 */
export const linkParams = (search, hash) => {
  const fromHash = new URLSearchParams(String(hash || '').replace(/^#/, ''));
  return fromHash.has('text') ? fromHash : new URLSearchParams(search || '');
};

/** 読み込んだtextを「?」と「#」の両方から消したときのパス。textがなければnull。 */
export const urlWithoutText = (href) => {
  const url = new URL(href);
  const fromHash = new URLSearchParams(url.hash.slice(1));
  const inHash = fromHash.has('text');
  if (!url.searchParams.has('text') && !inHash) return null;
  url.searchParams.delete('text');
  fromHash.delete('text');
  const hash = inHash ? fromHash.toString() : url.hash.slice(1);
  return url.pathname + url.search + (hash ? `#${hash}` : '');
};

/** 文字数はUTF-16コード単位ではなくコードポイントで数える。 */
export const analyzeInput = (text) => {
  let letters = 0;
  let fullwidthLatin = 0;
  let ignored = 0;
  for (const char of text) {
    if (/[A-Za-z]/.test(char)) letters++;
    else {
      ignored++;
      if (/[Ａ-Ｚａ-ｚ]/.test(char)) fullwidthLatin++;
    }
  }
  return { letters, fullwidthLatin, ignored };
};
