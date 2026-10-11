#!/usr/bin/env bash
# Первая минута ролика №3 кусками (после обрыва — запустить снова, готовые куски пропускаются): out/hook_final.mp4
cd "$(dirname "$0")/../kit/yt"
D=$(python3 -c "import re,json; s=open('../../03-banks-pay-you/data_hook.js').read(); print(json.loads(re.search(r'window.SEGS = (.*?);\n', s).group(1))[-1]['t1'])")
for i in 0 1; do A=$(python3 -c "print(round($D*$i/2,3))"); B=$(python3 -c "print(round($D*($i+1)/2,3))")
  [ -f ../../03-banks-pay-you/out/.h$i ] || { node render.js ../../03-banks-pay-you/video_hook.html --from $A --to $B --out ../../03-banks-pay-you/out/h$i.mp4 > ../../03-banks-pay-you/out/h${i}_log.txt 2>&1 && touch ../../03-banks-pay-you/out/.h$i; }
done
cd ../../03-banks-pay-you && [ -f out/.h0 ] && [ -f out/.h1 ] || exit 1
printf "file 'h0.mp4'\nfile 'h1.mp4'\n" > out/hconcat.txt && ffmpeg -y -v error -f concat -safe 0 -i out/hconcat.txt -c copy out/hook_video.mp4
bash ../02-bank-earns/mix.sh out/hook_video.mp4 out/voice_hook.wav out/music_hook.wav out/hook_final.mp4 && echo HOOK_DONE
