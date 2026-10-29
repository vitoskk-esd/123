#!/bin/bash
# ./make2.sh ep06 — сборка, рендер и микс серии второго сезона → final/perekupy_<id>.mp4
set -e
ID=$1
python3 build2.py $ID
node ../../kit/render.js $ID.html video out_$ID.mp4 30 2 > render_$ID.log 2>&1
mkdir -p final && MUSIC_VOL=0.16 ../../kit/mix.sh out_$ID.mp4 vo/$ID/voice.wav final/perekupy_$ID
