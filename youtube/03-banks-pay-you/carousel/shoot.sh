#!/bin/bash
# Снимки кадров карусели: ./shoot.sh 2 3 4 … → out/fNN.jpg (1920×1080). Кадр 1 — сцена «Карта» движка.
cd "$(dirname "$0")"
for f in "$@"; do
  n=$(printf "%02d" "$f")
  node ../../kit/shot3d.js 03-banks-pay-you/carousel/frames.html out/f$n.png 1920 1080 "f=$f" && \
  ffmpeg -y -loglevel error -i out/f$n.png -q:v 2 out/f$n.jpg && rm out/f$n.png && echo "f$n ok"
done
