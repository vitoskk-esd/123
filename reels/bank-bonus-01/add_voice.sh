#!/usr/bin/env bash
# Наложить озвучку на ролик: ./add_voice.sh voice.m4a  ->  reel_final.mp4
# Музыка автоматически приглушается, пока звучит голос (sidechain ducking).
set -e
VOICE="${1:?укажи файл озвучки}"
DIR="$(cd "$(dirname "$0")" && pwd)"
ffmpeg -y -i "$DIR/reel_bank_bonus_no_voice.mp4" -i "$VOICE" -filter_complex "
 [1:a]highpass=f=80,acompressor=threshold=-20dB:ratio=3:attack=5:release=80,loudnorm=I=-14:TP=-1.5,apad,asplit=2[v][sc];
 [0:a]volume=0.55[m];
 [m][sc]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=300[md];
 [md][v]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.89[a]" \
 -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "$DIR/reel_final.mp4"
echo "Готово: $DIR/reel_final.mp4"
