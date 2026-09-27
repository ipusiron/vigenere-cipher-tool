/**
 * Utility Functions
 * 汎用的なヘルパー関数
 */

/**
 * ファイルをテキストとして読み込み
 * 失敗したときは表示用の文ではなく辞書のキーを投げる。表示の直前に訳す。
 * @param {File} file - ファイルオブジェクト
 * @returns {Promise<string>} ファイル内容
 */
export const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        resolve(event.target.result);
      } catch (error) {
        reject(new Error('error.fileProcess'));
      }
    };

    reader.onerror = () => {
      reject(new Error('error.fileRead'));
    };

    reader.readAsText(file, 'UTF-8');
  });
};
