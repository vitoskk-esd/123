#!/bin/bash
# звук варианта: синтез музыки и эффектов по score.json (perekupy/kit/audio.js), голос, сведение, сборка mp4
# bash mix_nb.sh <ep_dir> <variant>  → <ep_dir>/out/<variant>/final.mp4
set -e
EP=$1; V=$2; D=$EP/out/$V; K=../perekupy/kit
python3 - "$D/score.json" <<'PY'
import json, sys
p = sys.argv[1]; s = json.load(open(p)); k = {"buzz": .55, "ping": .6, "tick": .45, "pop": .8}
for e in s["events"]:
    if e.get("_adj"): continue
    e["gain"] = round(e["gain"] * k.get(e["type"], 1) * (.75 if e["at"] < 4 else 1), 3); e["_adj"] = 1
json.dump(s, open(p, "w"))
PY
node $K/audio.js $D/score.json $D/music.wav $D/sfx.wav
DUR=$(python3 -c "import json;print(json.load(open('$D/score.json'))['dur'])")
ffmpeg -v error -y -i $EP/vo/voice.wav -af "acompressor=threshold=-20dB:ratio=2.5:attack=5:release=80,loudnorm=I=-15:TP=-1.5,aresample=48000,apad,atrim=duration=$DUR" -ac 2 $D/voice_n.wav
ffmpeg -v error -y -i $D/music.wav -af "loudnorm=I=-27:TP=-8,aresample=48000,atrim=duration=$DUR,afade=t=in:d=0.6,afade=t=out:st=$(python3 -c "print($DUR-1.5)"):d=1.5" -ac 2 $D/music_n.wav
ffmpeg -v error -y -i $D/sfx.wav -af "loudnorm=I=-24:TP=-4,aresample=48000,atrim=duration=$DUR" -ac 2 $D/sfx_n.wav
ffmpeg -v error -y -i $D/voice_n.wav -i $D/music_n.wav -i $D/sfx_n.wav -filter_complex "[0]asplit=2[v][sc];[1][sc]sidechaincompress=threshold=0.04:ratio=5:attack=25:release=350:makeup=1[m];[v][m][2]amix=inputs=3:duration=first:normalize=0,alimiter=limit=0.9[a]" -map "[a]" $D/mix.wav
ffmpeg -v error -y -i $D/video.mp4 -i $D/mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart $D/final.mp4
echo "ok $D/final.mp4"
