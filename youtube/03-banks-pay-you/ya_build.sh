#!/usr/bin/env bash
# Сборка ролика №3 с голосом Yandex SpeechKit (madirus): голос → слова → таймлайн → звуки и музыка → рендер 4 кусками → сведение.
# Идемпотентна по меткам out/.yv (голос) и out/.c0–.c3 (куски).  bash ya_build.sh → out/final.mp4, лог out/full_log.txt
set -u
cd "$(dirname "$0")"
PY=/tmp/claude-0/-home-user-123/8ca4fbe8-9858-5867-9610-cc1983112730/scratchpad/cbx/bin/python; CH=48   # куски ~17 с: перезапуск контейнера отнимает максимум один
log() { echo "$(date +%H:%M:%S) $*" | tee -a out/full_log.txt; }
mkdir -p out
if [ ! -f out/.yv ]; then YA_VOICE=${YA_VOICE:-vasily} YA_ROLE=${YA_ROLE:-sales} $PY voice/ya_live.py >> out/full_log.txt 2>&1 || { log "голос: ошибка"; exit 1; }; rm -f voice/words.json; touch out/.yv; log "голос Яндекса склеен"; fi
if [ ! -f voice/words.json ]; then $PY voice/ya_words.py >> out/full_log.txt 2>&1; log "слова голоса: $(python3 -c "import json; print(len(json.load(open('voice/words.json'))))")"; fi
python3 build3.py full >> out/full_log.txt 2>&1
sed "s|modes/illu.js|modes/illu_bake.js|" video_full.html > video_full_bake.html   # запекание фонов (владелец 12.10)
node ../kit/yt/sfx.js data_full.js timeline_full.js scenes.js scenes_c1.js scenes_c2.js scenes_c3.js >> out/full_log.txt 2>&1
node ../kit/audio.js timeline_full.js music_full.wav >> out/full_log.txt 2>&1
DUR=$(python3 -c "import re,json; s=open('data_full.js').read(); print(json.loads(re.search(r'window.SEGS = (.*?);\n', s).group(1))[-1]['t1'])")
log "таймлайн: $DUR с"
# рендер: 16 коротких кусков по 4 одновременно — после перезапуска контейнера теряется максимум текущий кусок (12.10: обрыв съел 1,4 ч)
cd ../kit/yt
seq 0 $((CH - 1)) | xargs -P 4 -I{} bash -c '
  i={}; A=$(python3 -c "print(round('$DUR'*$i/'$CH', 3))"); B=$(python3 -c "print(round('$DUR'*($i+1)/'$CH', 3))")
  [ -f ../../03-banks-pay-you/out/.c$i ] || { node render.js ../../03-banks-pay-you/video_full_bake.html --from $A --to $B --out ../../03-banks-pay-you/out/c$i.mp4 > ../../03-banks-pay-you/out/c${i}_log.txt 2>&1 && touch ../../03-banks-pay-you/out/.c$i; }'
cd ../../03-banks-pay-you
for i in $(seq 0 $((CH - 1))); do [ -f out/.c$i ] || { log "кусок $i не отрендерился — запусти снова"; exit 1; }; done
log "рендер готов"
: > out/concat.txt; for i in $(seq 0 $((CH - 1))); do echo "file 'c$i.mp4'" >> out/concat.txt; done
ffmpeg -y -v error -f concat -safe 0 -i out/concat.txt -c copy out/video_full.mp4
bash ../02-bank-earns/mix.sh out/video_full.mp4 voice/out/voice.wav out/music_full.wav out/final.mp4 >> out/full_log.txt 2>&1
log "итог: $(ffprobe -v error -show_entries format=duration -of csv=p=0 out/final.mp4) с, $(ffmpeg -nostats -i out/final.mp4 -filter_complex ebur128 -f null - 2>&1 | grep -E '^\s+I:' | tail -1 | xargs)"
log "DONE"
