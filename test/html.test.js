import test from 'node:test';
import assert from 'node:assert/strict';
import { read } from './helpers.js';

const html = read('index.html');
test('strict CSP and no external or inline executable resources', () => {
  const policy = "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; "
    + "connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'";
  assert.equal(html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)[1], policy);
  assert.doesNotMatch(html, /frame-ancestors|unsafe-inline|unsafe-eval|cdn\.jsdelivr\.net/);
  assert.doesNotMatch(html, /http-equiv="(?:X-Frame-Options|X-Content-Type-Options)"/);
  assert.match(html, /<meta name="referrer" content="no-referrer">/);
  assert.match(html, /<noscript>.+<\/noscript>/);
  assert.doesNotMatch(html, /\s(?:on\w+|style|x-[\w-]+|@click|:class)\s*=/i);
  const scripts = [...html.matchAll(/<script[^>]*src="([^"]+)"/g)];
  assert.equal(scripts.length, 2);
  for (const [, src] of scripts) assert.doesNotMatch(src, /^(?:\w+:|\/)/);
  assert.match(html, /<script type="module" src="js\/app.js"><\/script>/);
});
test('ARIA tab associations, modal, ids, and external link safety', () => {
  for (const [role, count] of [['tablist', 1], ['tab', 3], ['tabpanel', 3], ['dialog', 1]]) {
    assert.equal([...html.matchAll(new RegExp(`role="${role}"`, 'g'))].length, count);
  }
  for (const name of ['cipher', 'tabula', 'lab']) {
    assert.match(html, new RegExp(`id="tab-${name}"[^>]*aria-selected="(?:true|false)"[^>]*aria-controls="panel-${name}"`));
    assert.match(html, new RegExp(`id="panel-${name}"[^>]*aria-labelledby="tab-${name}"`));
  }
  assert.match(html, /role="dialog" aria-modal="true" aria-labelledby="help-modal-title"/);
  for (const id of [
    'inputText', 'key', 'outputFormat', 'processButton', 'outputText', 'sanitizedText', 'visualization',
    'vigenereTable', 'researchTable', 'plainChar', 'keyChar', 'otpText', 'otpKey', 'help-modal'
  ]) assert.ok(html.includes(`id="${id}"`), id);
  for (const [link] of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    assert.match(link, /rel="noopener noreferrer"/);
  }
});
