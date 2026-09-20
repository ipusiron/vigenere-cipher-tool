/** 234未満のバイトだけを使い、26文字への剰余の偏りを除く。 */
export const randomKeyFromBytes = (length, nextByte) => {
  if (!Number.isSafeInteger(length) || length < 0) throw new RangeError('Invalid key length');
  let result = '';
  while (result.length < length) {
    const byte = nextByte();
    if (!Number.isInteger(byte) || byte < 0 || byte > 255) throw new RangeError('Invalid byte');
    if (byte < 234) result += String.fromCharCode(65 + byte % 26);
  }
  return result;
};

export const generateRandomKey = (length) => {
  const bytes = new Uint8Array(256);
  let index = bytes.length;
  return randomKeyFromBytes(length, () => {
    if (index === bytes.length) {
      globalThis.crypto.getRandomValues(bytes);
      index = 0;
    }
    return bytes[index++];
  });
};
