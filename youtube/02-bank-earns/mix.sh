#!/usr/bin/env bash
# Сведение: ./mix.sh видео_без_звука.mp4 голос.wav музыка_sfx.wav итог.mp4 [начало длительность]
# Музыка тише, чем в рилсах (длинный ролик слушают дольше), и приседает под голос (sidechain).
set -e
VID="${1:?видео}"; VOICE="${2:?голос}"; MUS="${3:?музыка}"; DST="${4:?итог}"
CUT=(); [ -n "$5" ] && CUT=(-ss "$5" -t "$6")
ffmpeg -y -v error -i "$VID" "${CUT[@]}" -i "$VOICE" "${CUT[@]}" -i "$MUS" -filter_complex "
 [1:a]highpass=f=80,acompressor=threshold=-20dB:ratio=3:attack=5:release=80,loudnorm=I=-13.5:TP=-1.2,aresample=48000,apad,asplit=2[v][sc];
 [2:a]aresample=48000,volume=0.32[m];
 [m][sc]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=350[md];
 [md][v]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[a]" \
 -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "$DST"
# точная громкость: меряем и доводим до −14 LUFS линейным усилением + лимитер (однопроходный loudnorm недобирает)
I=$(ffmpeg -nostats -i "$DST" -filter_complex ebur128 -f null - 2>&1 | grep -E "^\s+I:" | tail -1 | awk '{print $2}')
G=$(python3 -c "print(round(-14.0 - float('$I'), 2))")
ffmpeg -y -v error -i "$DST" -af "volume=${G}dB,alimiter=limit=0.89:level=false" -c:v copy -c:a aac -b:a 192k -movflags +faststart "$DST.tmp.mp4" && mv "$DST.tmp.mp4" "$DST"
echo "Готово: $DST (было $I LUFS, +$G дБ)"
