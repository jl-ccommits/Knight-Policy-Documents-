#!/usr/bin/env bash
# Renders both cuts: quickquote.mp4 (4:5 brand) and quickquote-sketch.mp4 (16:9 hand-drawn).
set -euo pipefail
cd "$(dirname "$0")"
FFMPEG="${FFMPEG:-ffmpeg}"
render() { # page out
  PAGE="$1" node render.mjs "$2" 30
  python3 sfx.py soundtrack.wav
  "$FFMPEG" -y -loglevel error -i "${2%.mp4}.silent.mp4" -i soundtrack.wav -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "$2"
  rm "${2%.mp4}.silent.mp4"
}
render index.html quickquote.mp4
render sketch.html quickquote-sketch.mp4
