# TinyVoc

A simple vocabulary trainer web application that helps you learn and practice vocabulary using your browser's IndexedDB for storage.

## Features

- **Add Vocabulary** - Add vocabulary to your personal collection.
- **Broadcast** - Send vocabulary via file or P2P connection to your friends.
- **Correct Vocabulary** - Correct already entered vocabulary.
- **Docs** - Every feature on this list is documented in detail.
- **Export Vocabulary (Deprecated)** - The old method of exporting vocabulary.
- **Figure View** - View detailed analytics of your learning history.
- **Generate List** - Apply filters to customize your vocabulary list.
- **Import Vocabulary** - Import vocabulary from a file.
- **Join Lections** - Combine lections and perform advanced operations.
- **Lections View** - View all lections with success scores and average attempts.
- **Move List** - Rename a list.
- **Git Integration** - Track your vocabulary with Git-like features:
  - Branches
  - Commits
  - Adding/Removing files
  - ...
- **Git Status** - View Git-like status (similar to `git status`).
- **Train Vocabulary** - Practice and train your entered vocabulary.
- **View** - View the contents of a lection.

> ¹ This is not a full Git integration and does not use the original Git. It is a reimplementation of selected Git features.

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
