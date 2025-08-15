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
# 2. Test: vigenere("HELLO", "KEY", true)  // Should return "RIJVS"
# 3. Test: vigenere("RIJVS", "KEY", false) // Should return "HELLO"
```

## Key Architecture Components

### Core Cipher Logic (script.js)
- `vigenere(text, key, encrypt)` at script.js:10 - Main cipher implementation
  - Parameters: text (string), key (string), encrypt (boolean)
  - Returns encrypted/decrypted text as uppercase string
- `sanitize(str)` at script.js:2 - Removes non-alphabetic characters
- `repeatKey(key, length)` at script.js:6 - Repeats key to match text length

### UI State Management
- `processInputs()` at script.js:32 - Main UI update handler
- `createVisualizationTable()` at script.js:45 - Generates the character mapping visualization
- `createVigenereSquare()` at script.js:93 - Builds the 26x26 tabula recta
- Theme persistence via localStorage key: 'theme'

### Event Handling
- File input support at script.js:120-130
- Drag & drop file handling at script.js:135-150
- GET parameter support for text input (?text=VALUE)
- Copy result functionality at script.js:115

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