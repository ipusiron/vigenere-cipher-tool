import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = fileURLToPath(new URL('../', import.meta.url));
export const read = (path) => readFileSync(resolve(root, path), 'utf8');
export const files = (directory) => readdirSync(resolve(root, directory), { withFileTypes: true }).flatMap(entry => {
  const path = join(directory, entry.name);
  return entry.isDirectory() ? files(path) : [path.replaceAll('\\', '/')];
});

export const contrastPairs = [
  ['text-color', 'bg-color'], ['text-color', 'container-bg'], ['text-color', 'input-bg'],
  ['text-color', 'viz-cell-bg'], ['text-color', 'viz-header-bg'], ['text-color', 'table-header-bg'],
  ['button-text', 'button-bg'], ['accent-text', 'container-bg'], ['accent-text', 'viz-cell-bg'],
  ['link-color', 'bg-color'], ['footer-text', 'bg-color'], ['placeholder-text', 'input-bg'],
  ['message-warning-text', 'message-warning-bg'], ['message-error-text', 'message-error-bg'],
  ['tooltip-text', 'tooltip-bg']
];
export const luminance = (hex) => {
  const rgb = hex.replace('#', '').match(/../g).map(n => parseInt(n, 16) / 255);
  const linear = rgb.map(n => n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4);
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
};
export const contrast = (a, b) => {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
};
