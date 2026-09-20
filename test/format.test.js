import test from 'node:test';
import assert from 'node:assert/strict';
import { read, files } from './helpers.js';

test('readable source line lengths', () => {
  for (const file of [...files('js'), ...files('css'), ...files('test'), 'index.html']) {
    const limit = file === 'index.html' ? 250 : 160;
    read(file).split(/\r?\n/).forEach((line, index) => assert.ok(line.length <= limit, `${file}:${index + 1}: ${line.length}`));
  }
});
test('major files retain readable structure', () => {
  for (const [file, minimum] of [
    ['index.html', 400], ['js/core/cipher.js', 120], ['js/features/main-tab.js', 250],
    ['js/ui/table-generator.js', 250], ['js/app.js', 130], ['css/components/buttons.css', 250]
  ]) assert.ok(read(file).split('\n').length >= minimum, file);
});
