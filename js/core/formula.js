/** 表示上の番号（A=0またはA=1）で計算式を作る。 */
export const displayValue = (char, offset = 0) => char.charCodeAt(0) - 65 + (offset === 1 ? 1 : 0);

const formula = (left, right, operator, offset) => {
  const value = ((operator === '+' ? left + right : left - right) % 26 + 26) % 26;
  const annotation = offset === 1 && value === 0 ? '（0は26と読む）' : '';
  const char = String.fromCharCode(65 + (value - (offset === 1 ? 1 : 0) + 26) % 26);
  return `(${left} ${operator} ${right}) mod 26 = ${value}${annotation} → ${char}`;
};

export const encryptFormula = (plainChar, keyChar, offset = 0) => {
  return formula(displayValue(plainChar, offset), displayValue(keyChar, offset), '+', offset);
};

export const decryptFormula = (cipherChar, keyChar, offset = 0) => {
  return formula(displayValue(cipherChar, offset), displayValue(keyChar, offset), '-', offset);
};

export const keyFormula = (plainChar, cipherChar, offset = 0) => {
  return formula(displayValue(cipherChar, offset), displayValue(plainChar, offset), '-', offset);
};
