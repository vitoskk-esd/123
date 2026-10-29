#!/bin/bash
# ./make.sh ep04 — рендер серии и микс (музыка тихо + версия без музыки) → final/perekupy_<id>.mp4
set -e
ID=$1
python3 build.py $ID
node ../../kit/render.js $ID.html video out_$ID.mp4 30 2 > render_$ID.log 2>&1
MUSIC_VOL=0.16 ../../kit/mix.sh out_$ID.mp4 vo/$ID/voice.wav final/perekupy_$ID
