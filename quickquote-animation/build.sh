#!/usr/bin/env bash
# Renders all cuts: quickquote.mp4 (4:5 brand), quickquote-sketch.mp4 (16:9 hand-drawn, folder)
# and quickquote-sketch-critter.mp4 (16:9 hand-drawn, CARMA critter mascot).
set -euo pipefail
cd "$(dirname "$0")"
FFMPEG="${FFMPEG:-ffmpeg}"
render() { # page out [query]
  PAGE="$1" QUERY="${3:-}" node render.mjs "$2" 30
  python3 sfx.py soundtrack.wav
  "$FFMPEG" -y -loglevel error -i "${2%.mp4}.silent.mp4" -i soundtrack.wav -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "$2"
  rm "${2%.mp4}.silent.mp4"
}
render index.html quickquote.mp4
render sketch.html quickquote-sketch.mp4
render sketch.html quickquote-sketch-critter.mp4 char=critter
