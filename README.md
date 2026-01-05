# Games Portal

A searchable, categorized games browser. Click a game to play it directly in the browser. Search by name and filter by category.

## Features

- **Name-based search** — type to filter games by title (e.g., "slither" finds "Slither")
- **Category filters** — browse by: Action, Adventure, Sports, Racing, Puzzle, RPG, Platformer, Multiplayer, Retro, Casual, Clicker, and more
- **In-browser playback** — click a game card to open it in a modal iframe
- **Auto-categorization** — games are automatically sorted based on title patterns
- **289+ games** — full archive from the UGS games list

## Running Locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000 in your browser.

## GitHub Pages Deployment

The site is ready for GitHub Pages:

1. Go to your repo settings → **Pages**
2. Select **Source**: `Deploy from a branch`
3. Select **Branch**: `main`, **Folder**: `/ (root)`
4. Save

Your site will be live at: https://logans1234.github.io/games/

## Customizing Categories

Edit `scripts/categorize_games.js` to adjust how games are categorized based on their titles. Re-run `node scripts/categorize_games.js` to regenerate `public/games.json`.

## Importing New Games

1. Place `.html` game files in the `import/` folder
2. Run: `node tools/import_games.js import`
3. Run: `node scripts/categorize_games.js`
4. Commit and push

## File Structure

```
.
├── index.html                   # Main app entry
├── assets/
│   ├── app.js                   # Search, category filters, modal player
│   └── styles.css               # Layout & dark theme
├── public/
│   ├── games.json               # Game metadata (289 entries)
│   └── games/                   # Game HTML files (placeholder)
├── tools/
│   └── import_games.js          # Import tool: copies HTML & extracts titles
├── scripts/
│   ├── categorize_games.js      # Auto-categorizer
│   └── parse_games_list.js      # Parse game IDs
└── README.md                    # This file
```

## Search Behavior

- Fuse.js (v6.6.2) provides fuzzy matching on game titles
- Partial matches work: typing "sli" finds "Slither"
- Category filter narrows results
- Both filters work together

Enjoy the games! 🎮
