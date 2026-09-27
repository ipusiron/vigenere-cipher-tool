# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vigenère cipher tool - a web-based cryptographic application that allows users to encrypt and decrypt text using the Vigenère cipher method. The project is built with vanilla JavaScript, HTML, and CSS for educational purposes. Note: This cipher is not secure for modern cryptographic use.

## Commands

### Running the Application
```bash
# ES modules require HTTP: file:// is not supported
python -m http.server 8000
# Open http://localhost:8000
```

### Testing and Validation
```bash
# Node 22 or newer; no dependencies
npm test
```

## Architecture Overview

### Module System (Vanilla JavaScript + ES Modules)
All three feature modules are statically imported and initialized once. ARIA tabs use hidden panels and keyboard navigation.

### Core Logic Layer (`js/core/`)
- **cipher.js**: Pure cryptographic functions - vigenere encryption/decryption, character operations
- **validation.js**: Input validation returning dictionary keys and substitution values, never wording
- **utils.js**: Raw UTF-8 file reading with FileReader; rejects with dictionary keys
- **formula.js**: Display-number formula parts with explicit mod 26, wording-free
- **random.js**: crypto.getRandomValues, rejecting bytes >= 234 before modulo 26
- **input.js**: Input limits, loaded text normalization, URL parameters, code-point counts
- **indexing-mode.js**: Cached offset with guarded localStorage

### UI Management Layer (`js/ui/`)
- **dom-elements.js**: Centralized DOM element access with null-safety
- **message-display.js**: Toast notifications, warnings, and error display; remembers keys in `data-message-key`
- **table-generator.js**: Vigenère table (tabula recta) generation and interactive highlighting
- **formula-text.js**: Builds one line of arithmetic from the parts formula.js returns
- **theme.js**: Guarded theme storage; saved value or system preference
- **tabs.js**: Three ARIA tabs with ArrowLeft/Right and Home/End
- **../i18n.js**: Japanese and English dictionaries, `data-i18n` / `data-i18n-<attr>` application, guarded storage
- **../theme-init.js**: Synchronous pre-render theme selection

### Feature Layer (`js/features/`)
- **main-tab.js**: Main encryption/decryption with file I/O and visualization
- **research-tab.js**: Interactive tabula recta research and reverse calculations
- **lab-tab.js**: Caesar cipher and one-time pad experiments

### Key Implementation Details

#### Character Processing Pipeline
1. Input validation: Reject fullwidth Latin letters; warn about other nonletters
2. Output format: compact/group5 uppercase letters; preserve retains punctuation and case
3. Key repetition: Extend key to match the sanitized letter count
4. Pure character operations receive offset explicitly (only numeric 1 selects A=1)

#### Interactive Visualization System
- Container-level mouseover/mouseout/click delegation triggers coordinated highlighting across:
  - Character correspondence table (plaintext/key/ciphertext columns)
  - 26x26 Vigenère square cells (pointerover/pointerout and click for touch tooltips)
  - Real-time calculation display in research tab

#### Security Headers and CSP
Strict meta CSP uses script-src 'self', style-src 'self', and connect-src 'none'. No external resources or inline executable content.
Meta cannot enforce frame-ancestors or HTTP-only security headers. User content uses textContent and createElement.

## Important Implementation Notes

### Browser Compatibility
- Requires ES6+ support (const, let, arrow functions, async/await, modules)
- CSS Grid and Flexbox for layout
- Storage failures must not prevent initialization or cipher operations

### File Handling
- Supports both file input button and drag-and-drop
- Text files (.txt, .text or text/plain; extensionless files with empty MIME are accepted)
- Maximum file size: 1MB (1,048,576 bytes), UTF-8
- Text limit: 100,000 UTF-16 code units; truncation avoids splitting surrogate pairs
- Visualization: first 1,000 letters (at most 3,000 data cells), full output remains available

### URL Parameters
- `?text=VALUE` - Pre-populate input field with encoded text
- URLSearchParams decodes once; normalizeLoadedText removes only controls and enforces limits
- Remove the text query parameter even when loading fails

## Development Guidelines

### When modifying cipher logic
Pass getIndexingOffset() from callers; cipher/formula/random/input/validation must not depend on DOM or storage.
Keep both 676-pair round trips, known answers and table hashes passing via npm test.
Do not add dependencies, cipher modes, or unrelated cleanup. Preserve the existing screenshots.

### When updating UI components
Follow the existing modular pattern - UI logic in `js/ui/`, feature logic in `js/features/`, core algorithms in `js/core/`.

### When adding new features
1. Create appropriate module in the correct layer
2. Update `js/app.js` if new initialization is needed
3. Follow existing patterns for DOM element access via `dom-elements.js`

### When touching wording
Every string a person reads belongs in `js/i18n.js`. Core and feature modules hand around `{ key, params }`
and translate at the last moment. Never put `data-i18n` on an element that owns children, on a slot a script
writes into, or on an attribute whose value changes with state (the table-mode toggle builds its own
`aria-label`). Keep the Japanese fallback text in `index.html` equal to the `ja` dictionary; a test enforces it.

### UI contracts

Button and keyboard execution share validation. Mode changes clear results; offset changes recalculate existing results.
A language change redraws only what is already showing, so empty panels stay empty.
OTP keys must match the plaintext letter count and must not regenerate on offset changes.
Only theme and indexing mode are persisted; never persist input, keys, or output format.
