#!/usr/bin/env bash
# Сборка ролика №5 «Заработок на кредитке» (стиль «Премиум», голос Yandex LiveTTS vasily/sales): голос → слова → таймлайн →
# звуки и музыка → рендер кусками (переживает перезапуски контейнера) → сведение. Повторный запуск продолжает с места.
#   bash ya_build5.sh → out/final.mp4, лог out/build_log.txt
set -u
cd "$(dirname "$0")"; mkdir -p out
PY=/tmp/claude-0/-home-user-123/8ca4fbe8-9858-5867-9610-cc1983112730/scratchpad/cbx/bin/python
log() { echo "$(date +%H:%M:%S) $*" | tee -a out/build_log.txt; }
if [ ! -f out/.yv ]; then $PY voice/ya_live.py >> voice/ya_live_log.txt 2>&1 || { log "голос: ошибка"; exit 1; }; touch out/.yv; log "голос: $(tail -2 voice/ya_live_log.txt | head -1)"; fi
if [ ! -f out/.yw ]; then $PY voice/ya_words.py >> out/build_log.txt 2>&1 || { log "слова: ошибка"; exit 1; }; touch out/.yw; log "слова готовы"; fi
python3 build5.py >> out/build_log.txt 2>&1 || { log "таймлайн: ошибка"; exit 1; }
python3 -c "import json; s=open('timeline5.js').read(); tl=json.loads(s[s.index('=')+1:].strip().rstrip(';')); open('out/segs.js','w').write('window.SEGS = '+json.dumps(tl['segs'],ensure_ascii=False)+';\n')"
node ../kit/yt/sfx.js sfx_data.js timeline_audio.js >> out/build_log.txt 2>&1
node ../kit/audio.js timeline_audio.js music5.wav >> out/build_log.txt 2>&1
log "таймлайн: $(grep -o 'отрезков [0-9]*, длительность [0-9.]* с' out/build_log.txt | tail -1)"
bash ../kit/yt/render_pieces.sh video5.html out/segs.js out/pieces 192 4 >> out/build_log.txt 2>&1 || { log "рендер не закончен — запусти снова"; exit 1; }
log "рендер готов"
bash ../02-bank-earns/mix.sh out/pieces/video_full.mp4 voice/out/voice.wav out/music5.wav out/final.mp4 >> out/build_log.txt 2>&1
log "итог: $(ffprobe -v error -show_entries format=duration -of csv=p=0 out/final.mp4) с, $(ffmpeg -nostats -i out/final.mp4 -filter_complex ebur128 -f null - 2>&1 | grep -E '^\s+I:' | tail -1 | xargs)"
log "DONE"
