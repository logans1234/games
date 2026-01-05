# Demo site — Run and Notes

This project contains a static demo site scaffold that lets you browse placeholder HTML games, search by name, and filter by category.

Run locally:

```bash
# from repo root
python3 -m http.server 8000
# open http://localhost:8000
```

Replace files in `public/games/` with your actual downloaded HTML files. Each game should be referenced from `public/games.json` with keys: `id`, `title`, `category`, `thumbnail`, `path`.

Search behavior:
- Name-only search using Fuse.js (title field). Typing part of a game's name (e.g. "slither") will surface matches.
- Category dropdown filters results.

Keyboard shortcut:
- When a game is open in the player, press `Ctrl+S` (or `Cmd+S` on macOS) to download the game's HTML file.

If you want me to import your real game ZIP or fetch the Google Doc with categories, upload the ZIP or grant permission to fetch the doc.

Importing your game HTML files

- Put your `.html` files into an `import/` directory at the repo root (create it if needed).
- Run the importer to copy files into `public/games/` and generate `public/games.json`:

```bash
node tools/import_games.js import
```

The importer extracts the game's title from the page `<title>` or first `<h1>` and uses that as the game's `title` (it also slugifies the title for filenames). You can edit `public/games.json` afterwards to add categories or authors.
