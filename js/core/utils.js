/**
 * Utility Functions
 * 汎用的なヘルパー関数
 */

/**
 * ファイルをテキストとして読み込み
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
        reject(new Error('ファイルの処理に失敗しました'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('ファイルの読み込みに失敗しました'));
    };
    
    reader.readAsText(file, 'UTF-8');
  });
};
