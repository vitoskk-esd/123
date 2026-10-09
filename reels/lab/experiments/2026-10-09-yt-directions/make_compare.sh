#!/usr/bin/env bash
# Сводка трёх направлений: для каждого — титр 1,2 с, потом 15,4 с прототипа с тем же голосом и музыкой. → out/compare.mp4
set -e
cd "$(dirname "$0")"
F=../../../../youtube/kit/fonts/Unbounded.ttf; M=../../../../youtube/02-bank-earns/out/studio_music.wav
# звук: голос + тихая музыка с приседанием под голос
ffmpeg -y -v error -i out/voice.wav -stream_loop 1 -i "$M" -filter_complex "[0:a]aresample=48000,asplit[v][sc];[1:a]aresample=48000,volume=0.25,atrim=0:15.4[m];[m][sc]sidechaincompress=threshold=0.03:ratio=6:release=300[md];[md][v]amix=inputs=2:duration=longest:normalize=0,loudnorm=I=-14:TP=-1.5,atrim=0:15.4" -ar 48000 -ac 2 out/mix.wav
parts=()
for p in "a_doc:A · ДОКУМЕНТАЛЬНЫЙ:стол, документы, телефон, камера летает" "b_3d:B · 3D-МИР:одна 3D-сцена, камера внутри" "c_host:C · ВЕДУЩИЙ-АВАТАР:персонаж + окна и плашки"; do
  IFS=: read n t s <<< "$p"
  ffmpeg -y -v error -f lavfi -i color=c=0x0b0c10:s=1920x1080:d=1.2:r=30 -f lavfi -i anullsrc=r=48000:cl=stereo -t 1.2 \
    -vf "drawtext=fontfile=$F:text='$t':fontcolor=white:fontsize=96:x=(w-text_w)/2:y=(h-text_h)/2-40,drawtext=fontfile=$F:text='$s':fontcolor=0x9aa5b1:fontsize=36:x=(w-text_w)/2:y=(h/2)+60" \
    -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest out/title_$n.mp4
  ffmpeg -y -v error -i out/$n.mp4 -i out/mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest out/${n}_sound.mp4
  parts+=(out/title_$n.mp4 out/${n}_sound.mp4)
done
printf "file '%s'\n" "${parts[@]/#/$PWD/}" > out/list.txt
ffmpeg -y -v error -f concat -safe 0 -i out/list.txt -c:v libx264 -crf 20 -preset veryfast -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart out/compare.mp4
echo "готово: out/compare.mp4"
