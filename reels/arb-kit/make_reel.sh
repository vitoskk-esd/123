#!/usr/bin/env bash
# Сборка рилса с Арбузовым: таймлайн → музыка и звуки → рендер кусками (переживает перезапуск контейнера) → сведение.
#   bash arb-kit/make_reel.sh <папка рилса>  → <папка>/reel_final.mp4 (1080×1920, −14 LUFS)
set -u
cd "$(dirname "$0")/.."; R=$(realpath "$1"); N=$(basename "$R"); ROOT=$(realpath ..)
[ -f "$R/out/voice/voice.wav" ] || { echo "$N: нет голоса"; exit 1; }
python3 arb-kit/build_arb.py "$R" || exit 1
node "$ROOT/youtube/kit/audio.js" "$R/timeline.js" music_sfx.wav > /dev/null || exit 1
OFF=$(python3 -c "import json,re;s=open('$R/timeline.js').read();print(int(json.loads(s[s.index('=')+1:].strip().rstrip(';'))['off']*1000))")
ffmpeg -v error -y -i "$R/out/voice/voice.wav" -af "adelay=$OFF:all=1" "$R/out/voice_off.wav"
# куски рендера сбрасываются, если поменялись страница, кит, раскадровка или тайминг (иначе продолжаем после перезапуска контейнера)
SUM=$(cat arb-kit/reel.html arb-kit/arb9.js "$ROOT/youtube/characters/hd/arbuzhd.js" "$R/story.js" "$R/timeline.js" | md5sum | cut -c1-12)
[ "$(cat "$R/out/pieces/.sum" 2>/dev/null)" = "$SUM" ] || { rm -rf "$R/out/pieces"; mkdir -p "$R/out/pieces"; echo "$SUM" > "$R/out/pieces/.sum"; }
# страница рисует рилс по ?r=; render_pieces передаёт параметры через RQUERY
RQUERY="r=$N" bash "$ROOT/youtube/kit/yt/render_pieces.sh" "$ROOT/reels/arb-kit/reel.html" "$R/out/segs.js" "$R/out/pieces" 12 4 > "$R/out/render_log.txt" 2>&1 || { echo "$N: рендер не закончен — запусти снова"; exit 1; }
bash "$ROOT/youtube/02-bank-earns/mix.sh" "$R/out/pieces/video_full.mp4" "$R/out/voice_off.wav" "$R/out/music_sfx.wav" "$R/reel_final.mp4" | tail -1
echo "$N: $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$R/reel_final.mp4") с"
