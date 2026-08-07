# Project Legacy v4.0.1 — Audio / Song Engine Fix

The v4 song page was loading the HTML, but the JavaScript stopped because of a syntax error.
That is why the page showed:

- `SONG` instead of `ACTING UP`
- `Loading audio...`
- `0:00`
- no story / lyrics data
- Play button not working

## Upload and replace only:

- `song-engine.js`
- `song.html`

Commit message:

`Fix Project Legacy v4 song engine`

After GitHub Pages turns green, close the old song tab and reopen:

`https://ogeeviruz666-png.github.io/freakout-entertainment/song.html?song=acting-up`

The page should again show ACTING UP, load the story and lyrics, and play the MP3.
