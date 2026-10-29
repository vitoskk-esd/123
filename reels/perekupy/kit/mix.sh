#!/bin/bash
# kit/mix.sh <video.mp4> <voice.wav> <out_prefix>  (рядом с video лежит .events.json)
# → <prefix>.mp4 (голос+музыка+эффекты) и <prefix>_nomusic.mp4 (голос+эффекты — под трендовый звук Instagram)
set -e
K=$(dirname "$0"); V=$1; VO=$2; P=$3; SCORE=${V%.mp4}.events.json
node $K/audio.js $SCORE $P.music.wav $P.sfx.wav
${PY:-python3} $K/voice_track.py $VO $SCORE $P.voice.wav
mix() { # $1 громкость музыки, $2 выход
  ffmpeg -v error -y -i $P.voice.wav -i $P.music.wav -i $P.sfx.wav -filter_complex \
   "[0]highpass=f=90,equalizer=f=3200:t=q:w=1.2:g=2.5,acompressor=threshold=-22dB:ratio=3:attack=4:release=90,asplit=3[v][k1][k2];\
    [1]equalizer=f=2500:t=q:w=1.3:g=-5,volume=$1[m];[m][k1]sidechaincompress=threshold=0.02:ratio=9:attack=8:release=260[md];\
    [2]volume=0.75[s];[s][k2]sidechaincompress=threshold=0.05:ratio=3:attack=5:release=150[sd];\
    [v]pan=stereo|c0=c0|c1=c0[vs];[vs][md][sd]amix=inputs=3:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000" -ar 48000 $2.wav
  ffmpeg -v error -y -i $V -i $2.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart $2.mp4
  echo "$2.mp4 $(ffmpeg -i $2.wav -af ebur128 -f null - 2>&1 | grep -E '^\s+I:' | tail -1 | tr -s ' ')"
}
mix ${MUSIC_VOL:-0.5} $P
mix 0 ${P}_nomusic
