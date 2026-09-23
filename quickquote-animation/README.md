# CARMA QuickQuote animation

A 21-second, 1080×1080 cartoon promo for QuickQuote: a stressed dispensary
gets buried in insurance paperwork, a shield mascot shows up, the four-step
QuickQuote flow plays out, and it ends on the CARMA / carma365.com/quote card.

- `quickquote.mp4`: the finished video, with sound.
- `index.html`: the animation. Open it in a browser to watch it play live.
  Every frame is a pure function of time (`setTime(t)`), so edits render exactly.
- `render.mjs`: renders the page frame by frame with headless Chromium and
  pipes the frames to ffmpeg (writes `quickquote.silent.mp4` plus `sfx.json` cues).
- `sfx.py`: synthesizes the soundtrack (ukulele-style loop plus pops, clicks,
  whooshes, and a chime) from the cue list, so there's no licensed audio.

## Re-render

```sh
node render.mjs quickquote.mp4 30          # needs playwright; set CHROMIUM / FFMPEG if not on PATH
python3 sfx.py                              # needs numpy -> soundtrack.wav
ffmpeg -i quickquote.silent.mp4 -i soundtrack.wav -c:v copy -c:a aac -b:a 192k -shortest quickquote.mp4
```

Stills for quick checks: `node render.mjs --stills 3.5,6,15.8`

## Brand swap

Colors are CSS variables at the top of `index.html` (`--ink`, `--green`, …).
The "CARMA" wordmark is plain text in `.wordmark` / `#endWord`. Drop in the
real logo SVG there.
