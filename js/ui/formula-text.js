/**
 * Formula Text
 * 純ロジックが返した式の部品を、選ばれている言語の1行に組み立てる。
 */

import { I18n } from '../i18n.js';

export const formatFormula = (parts) => {
  const note = parts.readAs26 ? I18n.t('formula.readAs26') : '';
  return `(${parts.left} ${parts.operator} ${parts.right}) mod 26 = ${parts.value}${note} → ${parts.char}`;
};
