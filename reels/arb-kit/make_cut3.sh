#!/usr/bin/env bash
# Рилс-история v3 (владелец 15.10: «больше деталей, больше кадров, показать чат на телефоне»): cut3.py → звук → рендер cut3.html → сведение.
#   [OUT=reel.mp4] bash arb-kit/make_cut3.sh <папка рилса>  → <папка>/reel_v3.mp4 или $OUT (1080×1920, −14 LUFS)
# Нужно: <папка>/timeline.js (build_arb.py, тайминг голоса), cut3.py, кадры клипов out/clips/<id>/NNN.jpg.
set -u
cd "$(dirname "$0")/.."; R=$(realpath "$1"); N=$(basename "$R"); ROOT=$(realpath ..)
python3 "$R/cut3.py" > /dev/null || exit 1
for c in $(python3 -c "import json;s=open('$R/timeline3.js').read();print(' '.join(sorted({x['clip'] for x in json.loads(s[s.index('=')+1:].strip().rstrip(';'))['shots'] if x.get('clip')})))"); do
  [ -f "$R/hf/$c.mp4" ] || continue
  [ -f "$R/out/clips/$c/151.jpg" ] || { mkdir -p "$R/out/clips/$c"; ffmpeg -v error -y -i "$R/hf/$c.mp4" -vf "fps=30,scale=1080:1920" -q:v 3 "$R/out/clips/$c/%03d.jpg"; }
done
node "$ROOT/youtube/kit/audio.js" "$R/timeline3.js" music_sfx3.wav > /dev/null || exit 1
OFF=$(python3 -c "import json;s=open('$R/timeline3.js').read();print(int(json.loads(s[s.index('=')+1:].strip().rstrip(';'))['off']*1000))")
ffmpeg -v error -y -i "$R/out/voice/voice.wav" -af "adelay=$OFF:all=1" "$R/out/voice_off.wav"
mkdir -p "$R/out/img"   # рисунки планов (img, phone, calflip, фон карточки, позы) → jpg 1188×2112 (запас под движение камеры)
for f in $(python3 -c "import json;s=open('$R/timeline3.js').read();T=json.loads(s[s.index('=')+1:].strip().rstrip(';'));print(' '.join(sorted(({x.get(k) for x in T['shots'] for k in ('img','bg')} | {p['img'] for x in T['shots'] for p in x.get('poses',[])}) - {None})))"); do
  [ -f "$R/out/img/$f.jpg" ] || ffmpeg -v error -y -i "$R/hf/$f.png" -vf scale=1188:2112 -q:v 2 "$R/out/img/$f.jpg"; done
SUM=$(cat arb-kit/cut3.html "$R/timeline3.js" "$R"/out/img/*_top.png | md5sum | cut -c1-12)
[ "$(cat "$R/out/pieces3/.sum" 2>/dev/null)" = "$SUM" ] || { rm -rf "$R/out/pieces3"; mkdir -p "$R/out/pieces3"; echo "$SUM" > "$R/out/pieces3/.sum"; }
RQUERY="r=$N" bash "$ROOT/youtube/kit/yt/render_pieces.sh" "$ROOT/reels/arb-kit/cut3.html" "$R/out/segs3.js" "$R/out/pieces3" 12 3 > "$R/out/render3_log.txt" 2>&1 || { echo "$N: рендер не закончен — запусти снова"; exit 1; }
bash "$ROOT/youtube/02-bank-earns/mix.sh" "$R/out/pieces3/video_full.mp4" "$R/out/voice_off.wav" "$R/out/music_sfx3.wav" "$R/${OUT:-reel_v3.mp4}" | tail -1
echo "$N: $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$R/${OUT:-reel_v3.mp4}") с"
