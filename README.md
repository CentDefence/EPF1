# EPF — European Professional Football

Official website for the EPF (European Professional Football) league — fixtures, results, league table, teams and player stats.

## Structure

```
.
├── index.html      # Main page (loader + single-page dashboard)
├── style.css       # All styles (dark navy/blue theme)
├── script.js       # Data, rendering, tab navigation, loader animation
├── assets/
│   └── logo.png    # EPF crest
└── README.md
```

## Run locally

No build step needed — it's a static site.

```bash
# any local server works, e.g.:
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

Or just open `index.html` directly in a browser.

## Deploy with GitHub Pages

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Under "Build and deployment", choose **Deploy from a branch**, select `main` and `/ (root)`.
4. Save — your site will be live at `https://<username>.github.io/<repo>/`.

## Editing content

- Teams, fixtures, results and player leaderboards are placeholder data generated in `script.js` (`teams`, `fixtures`, `results`, `topScorers`, `topAssists`, `topCleansheets`). Replace with real data by editing those arrays/objects, or wire up a fetch to a real data source.
- Discord invite link: update the `href="https://discord.gg/Dn62CeCSx"` occurrences in `index.html`.

## License

All rights reserved — EPF, MMXXIII.
