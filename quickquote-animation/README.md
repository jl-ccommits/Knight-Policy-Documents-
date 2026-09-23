# CARMA QuickQuote animation

A 23.5-second, 4:5 (1080×1350) promo for QuickQuote, aimed at retail insurance
agents. A coral folder mascot (from the QuickQuote ad) gets buried in cannabis
submission paperwork, gobbles it up, then watches an agent run the real four-step
flow (Coverage → Eligibility → Rate → Indication) to a $1,511 non-binding
indication. It ends on the "Cannabis account? Get QuickQuote access." card.

The phone UI mirrors carma365.com's QuickQuote demo screens: copy, coverage cards,
risk-type chips, and the indication breakdown. The Rate step is illustrative,
because its real fields weren't in the reference screenshots.

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

Colors are CSS variables at the top of `index.html`, sampled from the site:
coral `#EC5F59`, forest green `#426844`, ink `#232833`. The CARMA insurance logo
is a type recreation (`.logo`: Montserrat plus Playfair plus a coral slash). Swap
in the real SVG for a pixel-exact mark.
