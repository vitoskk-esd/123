#!/bin/bash
# ./make2.sh ep08 — сборка, рендер и микс серии → final/perekupy_<id>.mp4 (PY — python с numpy для voice_track.py)
set -e
ID=$1
# шипение в озвучке (ep50 «Эво», 13.11) ловим до рендера: шумные реплики — переозвучить; NOISY_OK=1 — собрать всё равно
python3 ../voice_qa.py $ID > qa_$ID.log || { cat qa_$ID.log | grep "✗\|ШУМ"; [ "$NOISY_OK" = 1 ] || { echo "стоп: шум в озвучке"; exit 3; }; }
python3 build2.py $ID
node ../../kit/render.js $ID.html video out_$ID.mp4 30 2 > render_$ID.log 2>&1
mkdir -p final && MUSIC_VOL=${MUSIC_VOL:-0.16} ../../kit/mix.sh out_$ID.mp4 vo/$ID/voice.wav final/perekupy_$ID
