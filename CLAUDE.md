# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vigenère cipher tool - a web-based cryptographic application that allows users to encrypt and decrypt text using the Vigenère cipher method. The project is built with vanilla JavaScript, HTML, and CSS for educational purposes. Note: This cipher is not secure for modern cryptographic use.

## Commands

### Running the Application
```bash
# Open in default browser (Windows)
start index.html

# Or use Python's built-in server for better development experience
python -m http.server 8000
# Then navigate to http://localhost:8000

# Or use Node.js if available
npx http-server -p 8000
```

### Testing and Validation
```bash
# No automated tests exist - manual testing via browser console
# Test cipher functionality:
# 1. Open browser console (F12)
# 2. Test: 
#    const { vigenere } = await import('./js/core/cipher.js');
#    vigenere("HELLO", "KEY", "encrypt")  // Should return {result: "RIJVS", visualization: [...]}
#    vigenere("RIJVS", "KEY", "decrypt")  // Should return {result: "HELLO", visualization: [...]}
```

## Architecture Overview

### Module System (Alpine.js + ES6 Modules)
The application uses Alpine.js for reactive UI and ES6 modules for code organization. Modules are dynamically loaded for each tab to optimize initial load performance.

### Core Logic Layer (`js/core/`)
- **cipher.js**: Pure cryptographic functions - vigenere encryption/decryption, character operations
- **validation.js**: Input validation with detailed error messages and warnings
- **utils.js**: Utilities for file handling, URL parameters, random key generation

### UI Management Layer (`js/ui/`)
- **dom-elements.js**: Centralized DOM element access with null-safety
- **message-display.js**: Toast notifications, warnings, and error display
- **table-generator.js**: Vigenère table (tabula recta) generation and interactive highlighting
- **theme.js**: Dark/light theme switching with localStorage persistence

### Feature Layer (`js/features/`)
- **main-tab.js**: Main encryption/decryption with file I/O and visualization
- **research-tab.js**: Interactive tabula recta research and reverse calculations
- **lab-tab.js**: Caesar cipher and one-time pad experiments

### Key Implementation Details

#### Character Processing Pipeline
1. Input sanitization: Remove non-alphabetic characters
2. Case normalization: Convert to uppercase
3. Key repetition: Extend key to match text length
4. Character-by-character transformation using modulo 26 arithmetic

#### Interactive Visualization System
- Mouse hover events trigger coordinated highlighting across:
  - Character correspondence table (plaintext/key/ciphertext columns)
  - 26x26 Vigenère square cells
  - Real-time calculation display in research tab

#### Security Headers and CSP
The application implements Content Security Policy and security headers to prevent XSS attacks, though these are primarily educational given the tool's purpose.

## Important Implementation Notes

### Browser Compatibility
- Requires ES6+ support (const, let, arrow functions, async/await, modules)
- CSS Grid and Flexbox for layout
- LocalStorage API for theme persistence

### File Handling
- Supports both file input button and drag-and-drop
- Text files only (.txt)
- Maximum recommended file size: 1MB for performance

### URL Parameters
- `?text=VALUE` - Pre-populate input field with encoded text
- Automatically sanitizes and validates URL input

## Development Guidelines

### When modifying cipher logic
Check `js/core/cipher.js` for the vigenere function and ensure changes maintain backward compatibility with the visualization system.

### When updating UI components
Follow the existing modular pattern - UI logic in `js/ui/`, feature logic in `js/features/`, core algorithms in `js/core/`.

### When adding new features
1. Create appropriate module in the correct layer
2. Update `js/app.js` if new initialization is needed
3. Follow existing patterns for DOM element access via `dom-elements.js`