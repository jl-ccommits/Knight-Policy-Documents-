#!/usr/bin/env bash
# Renders all cuts: quickquote.mp4 (4:5 brand), quickquote-sketch.mp4 (16:9 hand-drawn, folder)
# quickquote-sketch-bolt.mp4 (CARMA critter, lightning bolt) and quickquote-sketch-cowboy.mp4 (lasso alt).
# Other critter looks for stills/tests: PAGE=sketch.html QUERY=char=tabs|slash|ink|check|sprout.
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
render sketch.html quickquote-sketch-bolt.mp4 char=bolt
render sketch.html quickquote-sketch-cowboy.mp4 char=cowboy
