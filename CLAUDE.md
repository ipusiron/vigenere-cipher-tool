# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vigenère cipher tool - a web-based cryptographic application that allows users to encrypt and decrypt text using the Vigenère cipher method. The project is built with vanilla JavaScript, HTML, and CSS.

## Project Structure

- `index.html` - Main HTML file containing the user interface structure
- `script.js` - Core JavaScript implementation of the Vigenère cipher algorithm and UI interactions
- `style.css` - Styling with support for light/dark themes
- `assets/` - Empty directory (likely for future assets)

## Key Architecture Components

### Cipher Implementation (script.js)
- `vigenere()` function at script.js:10 - Main cipher logic supporting both encryption and decryption modes
- `sanitize()` function at script.js:2 - Input sanitization to ensure only uppercase letters
- `repeatKey()` function at script.js:6 - Key repetition algorithm to match text length

### UI Components
- Theme switching functionality with localStorage persistence (script.js:81-90)
- Visualization table showing character-by-character encryption process
- Vigenère square (tabula recta) generation for reference

## Development Notes

This is a static web application with no build process or dependencies. The application runs directly in the browser without any compilation or bundling steps.

## Security Considerations

This is a cryptographic tool implementing the Vigenère cipher. While this is a classical cipher used primarily for educational purposes, be aware that any modifications to cryptographic functionality should be carefully reviewed.