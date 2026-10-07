#!/usr/bin/env bash
# Наложить озвучку на ролик: ./add_voice.sh voice.wav [видео_без_голоса.mp4] [итог.mp4]  ->  по умолчанию reel_final.mp4
# Музыка автоматически приглушается, пока звучит голос (sidechain ducking).
set -e
VOICE="${1:?укажи файл озвучки}"
DIR="$(cd "$(dirname "$0")" && pwd)"
SRC="${2:-$DIR/reel_no_voice.mp4}"
DST="${3:-$DIR/reel_final.mp4}"
ffmpeg -y -v error -i "$SRC" -i "$VOICE" -filter_complex "
 [1:a]highpass=f=80,acompressor=threshold=-20dB:ratio=3:attack=5:release=80,loudnorm=I=-14:TP=-1.5,apad,asplit=2[v][sc];
 [0:a]volume=0.55[m];
 [m][sc]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=300[md];
 [md][v]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.89[a]" \
 -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "$DST"
echo "Готово: $DST"
