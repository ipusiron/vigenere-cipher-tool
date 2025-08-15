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
# Test cipher functionality (v2.0 modular):
# 1. Open browser console (F12)
# 2. Test: 
#    const { vigenere } = await VigenereApp.modules.cipher();
#    vigenere("HELLO", "KEY", "encrypt")  // Should return {result: "RIJVS", visualization: [...]}
#    vigenere("RIJVS", "KEY", "decrypt")  // Should return {result: "HELLO", visualization: [...]}

# Legacy testing (v1.0):
# Switch to script-legacy.js in index.html, then:
# vigenere("HELLO", "KEY", true)   // Should return "RIJVS"
# vigenere("RIJVS", "KEY", false)  // Should return "HELLO"
```

## New Modular Architecture (v2.0)

### Core Logic Layer (`js/core/`)
- **`cipher.js`** - Pure cryptographic functions
  - `vigenere(text, key, mode)` - Main cipher implementation
  - `encryptChar()`, `decryptChar()` - Single character operations
  - `sanitize()`, `repeatKey()` - Utility functions
  - `findKeyChar()` - Reverse calculation for research
  
- **`validation.js`** - Input validation logic
  - `validateInputText()` - Main text validation with detailed results
  - `validateKey()`, `validateFile()` - Specific validators
  - `validateLabText()`, `validateCaesarKey()` - Lab experiment validators
  
- **`utils.js`** - General utility functions
  - `getUrlParameter()`, `sanitizeUrlText()` - URL handling
  - `readFileAsText()` - File processing
  - `generateRandomKey()` - Random key generation
  - `showMessage()`, `hideMessage()` - Message helpers

### UI Management Layer (`js/ui/`)
- **`dom-elements.js`** - Centralized DOM element access
  - `mainTabElements`, `researchTabElements`, `labTabElements` - Element collections
  - `getElementById()`, `elementExists()` - Safe element access
  
- **`message-display.js`** - Message display responsibilities
  - `showWarning()`, `showError()`, `hideMessage()` - Message control
  - `displayValidationMessage()` - Validation result display
  - `showToast()` - Toast notifications
  
- **`table-generator.js`** - Table generation and interaction
  - `generateVigenereTable()` - Main table generator
  - `highlightTableCell()`, `clearTableHighlight()` - Cell highlighting
  - `displayVisualization()` - Process visualization
  
- **`theme.js`** - Theme management
  - `initTheme()`, `toggleTheme()` - Theme control
  - `detectSystemTheme()` - System preference detection
  - Theme persistence via localStorage

### Feature Layer (`js/features/`)
- **`main-tab.js`** - Main encryption/decryption functionality
  - `processText()` - Core cipher processing
  - `validateMainInputs()` - Real-time input validation
  - File drag & drop, URL parameter loading
  
- **`research-tab.js`** - Tabula recta research features
  - `researchTabula()` - Forward calculation experiments
  - `researchReverseTabula()` - Reverse calculation experiments
  - Dynamic table generation and highlighting
  
- **`lab-tab.js`** - Cryptographic experiments
  - `experimentCaesar()` - Caesar cipher comparison
  - `experimentOTP()` - One-time pad demonstration
  - Input validation for experimental parameters

### Application Entry Point
- **`js/app.js`** - Main application bootstrap
  - Module loading and initialization
  - Dynamic tab loading for performance
  - Error handling and fallback mechanisms
  - Debug utilities and version information

### Legacy Support
- **`script-legacy.js`** - Original monolithic implementation (backup)
- Switch between implementations by commenting/uncommenting script tags in index.html

## Legacy Architecture (v1.0 - script-legacy.js)

### Core Cipher Logic (script-legacy.js)
- `vigenere(text, key, encrypt)` at script-legacy.js:10 - Main cipher implementation
- `sanitize(str)` at script-legacy.js:2 - Removes non-alphabetic characters
- `repeatKey(key, length)` at script-legacy.js:6 - Repeats key to match text length

### UI State Management
- `processInputs()` at script-legacy.js:32 - Main UI update handler
- `createVisualizationTable()` at script-legacy.js:45 - Generates the character mapping visualization
- `createVigenereSquare()` at script-legacy.js:93 - Builds the 26x26 tabula recta
- Theme persistence via localStorage key: 'theme'

### Event Handling
- File input support at script-legacy.js:120-130
- Drag & drop file handling at script-legacy.js:135-150
- GET parameter support for text input (?text=VALUE)
- Copy result functionality at script-legacy.js:115

## Important Implementation Details

### Character Processing
- Only processes A-Z characters (case-insensitive)
- Non-alphabetic characters are stripped during sanitization
- Uses modulo 26 arithmetic for character shifting

### Visualization Features
- Interactive highlighting system connecting input/output characters to Vigenère square
- Fixed header for table visualization (sticky positioning)
- Responsive horizontal scrolling for long texts

### Browser Compatibility Requirements
- ES6+ JavaScript features (const, let, arrow functions, template literals)
- CSS Grid and Flexbox support
- LocalStorage API for theme persistence

## Security Considerations

This is a classical cipher used for educational purposes only. The Vigenère cipher is vulnerable to:
- Kasiski examination for key length determination
- Frequency analysis once key length is known
- Known plaintext attacks

Never use this for actual encryption needs - it's a teaching tool for understanding classical cryptography.