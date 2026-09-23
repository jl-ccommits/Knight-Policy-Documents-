# CARMA QuickQuote animation

Two cuts:

| File | Format | Style |
|---|---|---|
| `quickquote-sketch.mp4` (`sketch.html`) | 16:9, 1920×1080, 21s | Hand-drawn doodle (boiling pencil lines, paper texture), after Tak's "Oktoberfest" clip |
| `quickquote-sketch-critter.mp4` (`sketch.html?char=critter`) | 16:9, 1920×1080, 21s | Same sketch cut starring the CARMA critter (see `mascot-critter.png`) |
| `quickquote.mp4` (`index.html`) | 4:5, 1080×1350, 23.5s | Clean brand/UI demo matching carma365.com |

**Sketch cut:** a coral folder critter walks past the agency. A new cannabis account
buries it in ACORD forms and loss runs. The QuickQuote phone slides in, the critter
hop-taps Coverage → Eligibility → Rate → Indication while a stopwatch runs to 2:47,
and it catches the $1,511 non-binding indication ("QUOTED!"). It ends on the
CARMA QuickQuote card.

**CARMA critter:** an original blocky mascot in a chunky-doodle style: coral body, stubby legs and
side nubs, round shiny eyes, a forest-green agent hat with the logo's coral slash as a feather,
and a green bow tie. Switch characters with `?char=critter` (the default is the folder).

## Brand cut

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
./build.sh      # renders both cuts; needs playwright + numpy; set CHROMIUM / FFMPEG if not on PATH
```

Stills for quick checks: `PAGE=sketch.html node render.mjs --stills 3.5,6,15.8`

Fonts (Inter Tight, Montserrat, Playfair Display, IBM Plex Mono, Gaegu, Patrick
Hand; all SIL OFL) are vendored in `fonts/`, so renders don't depend on network
access to Google Fonts.

## Brand swap

Colors are CSS variables at the top of `index.html`, sampled from the site:
coral `#EC5F59`, forest green `#426844`, ink `#232833`. The CARMA insurance logo
is a type recreation (`.logo`: Montserrat plus Playfair plus a coral slash). Swap
in the real SVG for a pixel-exact mark.
