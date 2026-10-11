#!/usr/bin/env bash
# Полная сборка ролика №3 без участия (владелец 11.10: «даже без моего утверждения пусть весь ролик собирается полностью»).
# Шаги идемпотентны — после обрыва (перезапуск контейнера) просто запустить снова: готовые шаги пропускаются по меткам в out/.
#   bash full_build.sh  → out/final.mp4   (лог — out/full_log.txt)
set -u
cd "$(dirname "$0")"
PY=/tmp/claude-0/-home-user-123/8ca4fbe8-9858-5867-9610-cc1983112730/scratchpad/cbx/bin/python
ROOT=/home/user/123; N=$(grep -c . voice/phrases.txt); CH=4
log() { echo "$(date +%H:%M:%S) $*" | tee -a out/full_log.txt; }
mkdir -p out

# 1. голос: ждём, пока озвучены все фразы и voice_e закончил
until python3 -c "import json,sys; sys.exit(0 if len(json.load(open('voice/out/phrases.json'))) >= $N else 1)" 2>/dev/null && ! pgrep -f "tools/voice_e.py" > /dev/null; do sleep 60; done
log "голос: все $N фраз озвучены"

# 2. слабые фразы (сходство < 0,97) — строгий переотбор (tools/voice_e_clear.py, Whisper small, 2 seed VC), остальные берутся как есть;
#    voice_e_clear сам склеивает голос чисто и с темпом 0,96 (как у рилса #12, выбор владельца)
if [ ! -f out/.glued ]; then
  WEAK=$(python3 - <<'PYX'
import json
m = json.load(open("voice/out/phrases.json")); weak = [k for k, v in m.items() if v.get("sim_e", 1) < .97]
json.dump({k: {"text": v["text"], "tts": v["tts"], "e": v["e"]} for k, v in m.items() if k not in weak}, open("voice/out/clear.json", "w"), ensure_ascii=False, indent=1)
print(",".join(sorted(weak, key=int)))
PYX
)
  log "слабые фразы: ${WEAK:-нет}"
  if [ -n "$WEAK" ]; then (cd $ROOT && ONLY=$WEAK VC_SEEDS=0,1 TTS_MIN=3 $PY tools/voice_e_clear.py youtube/03-banks-pay-you/voice/out) >> out/full_log.txt 2>&1
  else (cd $ROOT && $PY youtube/03-banks-pay-you/voice/glue.py) >> out/full_log.txt 2>&1; fi
  rm -f voice/words.json; touch out/.glued; log "голос склеен"
fi
if [ ! -f voice/words.json ]; then $PY build3.py words >> out/full_log.txt 2>&1; log "слова голоса: $(python3 -c "import json; print(len(json.load(open('voice/words.json'))))")"; fi

# 3. таймлайн, звуки, музыка
python3 build3.py full >> out/full_log.txt 2>&1
node ../kit/yt/sfx.js data_full.js timeline_full.js scenes.js scenes_c1.js scenes_c2.js scenes_c3.js >> out/full_log.txt 2>&1
node ../kit/audio.js timeline_full.js music_full.wav >> out/full_log.txt 2>&1
DUR=$(python3 -c "import re; s=open('data_full.js').read(); import json; segs=json.loads(re.search(r'window.SEGS = (.*?);\n', s).group(1)); print(segs[-1]['t1'])")
log "таймлайн: $DUR с"

# 4. рендер кусками параллельно
cd ../kit/yt
for i in $(seq 0 $((CH - 1))); do
  A=$(python3 -c "print(round($DUR*$i/$CH, 3))"); B=$(python3 -c "print(round($DUR*($i+1)/$CH, 3))")
  if [ ! -f ../../03-banks-pay-you/out/.c$i ]; then
    (node render.js ../../03-banks-pay-you/video_full.html --from $A --to $B --out ../../03-banks-pay-you/out/c$i.mp4 > ../../03-banks-pay-you/out/c${i}_log.txt 2>&1 && touch ../../03-banks-pay-you/out/.c$i) &
  fi
done
wait
cd ../../03-banks-pay-you
for i in $(seq 0 $((CH - 1))); do [ -f out/.c$i ] || { log "кусок $i не отрендерился — запусти снова"; exit 1; }; done
log "рендер готов"
: > out/concat.txt; for i in $(seq 0 $((CH - 1))); do echo "file 'c$i.mp4'" >> out/concat.txt; done
ffmpeg -y -v error -f concat -safe 0 -i out/concat.txt -c copy out/video_full.mp4

# 5. сведение −14 LUFS и проверка
bash ../02-bank-earns/mix.sh out/video_full.mp4 voice/out/voice.wav out/music_full.wav out/final.mp4 >> out/full_log.txt 2>&1
log "итог: $(ffprobe -v error -show_entries format=duration -of csv=p=0 out/final.mp4) с, $(ffmpeg -nostats -i out/final.mp4 -filter_complex ebur128 -f null - 2>&1 | grep -E '^\s+I:' | tail -1 | xargs)"
log "DONE"
