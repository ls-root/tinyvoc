# TinyVoc

A simple vocabulary trainer web application that helps you learn and practice vocabulary using your browser's IndexedDB for storage.

## How to Build

To build the project (if you're making modifications):

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

Run the build command:
```bash
npm run build
```
## How to Use

### Installation
No installation needed! Just open `dist/tinyvoc.html` in your web browser.

### Main Menu
- **A**: Enter Add Vocabulary mode
- **T**: Enter Training mode
- **-**: Exit current mode (returns to main menu)

### Add Vocabulary Mode
1. Type the key (e.g., a word in your native language)
2. Press Enter to move to the value field
3. Type the value (e.g., the translation)
4. Press Enter to save and clear the fields for the next entry
5. Press - to return to the main menu

### Training Mode
1. A random key from your vocabulary will be displayed
2. The value will show as "???" initially
3. Type what you think the value is
4. Press Enter to check your answer
5. After 350 milliseconds, a new random key appears automatically
6. Press - to return to the main menu



## License

GPLv3
