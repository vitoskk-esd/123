#!/usr/bin/env bash
# Сборка ролика №6 «Деньги, которые тебе положены» (канал «Арбузов», стиль amo_test, голос №7): голос → таймлайн →
# музыка и звуки → рендер кусками (переживает перезапуски контейнера) → сведение. Повторный запуск продолжает с места.
#   bash ya_build6.sh [w=1280|w=1920] → out/final_720p.mp4 (или final_1080p.mp4), лог out/build_log.txt
set -u
cd "$(dirname "$0")"; mkdir -p out
Q=${1:-w=1280}; TAG=$([ "$Q" = "w=1920" ] && echo 1080p || echo 720p)
PY=/tmp/claude-0/-home-user-123/8ca4fbe8-9858-5867-9610-cc1983112730/scratchpad/cbx/bin/python
log() { echo "$(date +%H:%M:%S) $*" | tee -a out/build_log.txt; }
if [ ! -f voice/out/voice.wav ]; then $PY ../characters/voice/arbuzov_voice.py voice/phrases.txt voice/out >> voice/log.txt 2>&1 || { log "голос: ошибка"; exit 1; }; fi
log "голос: $(grep -A99 '^фраз:' voice/log.txt | tr '\n' ' ' | cut -c1-300)"
python3 build6.py >> out/build_log.txt 2>&1 || { log "таймлайн: ошибка"; exit 1; }
python3 -c "import json; s=open('timeline6.js').read(); tl=json.loads(s[s.index('=')+1:].strip().rstrip(';')); open('out/segs.js','w').write('window.SEGS = '+json.dumps([dict(mode='scene',t0=x['t0'],t1=x['t1']) for x in tl['segs']])+';\n')"
node ../kit/audio.js timeline_audio6.js music6.wav >> out/build_log.txt 2>&1 || { log "музыка: ошибка"; exit 1; }
# звуковая подпись «хрум» в начале поверх музыки; голос — с OFF = 1,0 с
ffmpeg -y -v error -i out/music6.wav -i ../characters/voice/out/sting.wav -filter_complex "[1:a]aresample=44100,volume=1.6[s];[0:a][s]amix=inputs=2:duration=first:normalize=0" out/music6s.wav
ffmpeg -y -v error -i voice/out/voice.wav -af "adelay=1000:all=1" out/voice_off.wav
log "таймлайн: $(grep 'длительность' out/build_log.txt | tail -1)"
RQUERY=$Q bash ../kit/yt/render_pieces.sh video6.html out/segs.js out/pieces_$TAG 192 4 >> out/build_log.txt 2>&1 || { log "рендер не закончен — запусти снова"; exit 1; }
log "рендер готов"
bash ../02-bank-earns/mix.sh out/pieces_$TAG/video_full.mp4 out/voice_off.wav out/music6s.wav out/final_$TAG.mp4 >> out/build_log.txt 2>&1
log "итог: $(ffprobe -v error -show_entries format=duration -of csv=p=0 out/final_$TAG.mp4) с, $(ffmpeg -nostats -i out/final_$TAG.mp4 -filter_complex ebur128 -f null - 2>&1 | grep -E '^\s+I:' | tail -1 | xargs)"
log "DONE"
