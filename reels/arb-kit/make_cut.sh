#!/usr/bin/env bash
# Рилс-история v2 «всё живое» (владелец 15.10): cut2.py → звук → рендер cut.html кусками (продолжает после перезапуска) → сведение.
#   bash arb-kit/make_cut.sh <папка рилса>  → <папка>/reel_v2.mp4 (1080×1920, −14 LUFS)
# Нужно: <папка>/timeline.js (build_arb.py, тайминг голоса), cut2.py, кадры клипов out/clips/<id>/NNN.jpg.
set -u
cd "$(dirname "$0")/.."; R=$(realpath "$1"); N=$(basename "$R"); ROOT=$(realpath ..)
python3 "$R/cut2.py" > /dev/null || exit 1
for c in $(python3 -c "import json;s=open('$R/timeline2.js').read();print(' '.join(sorted({x['clip'] for x in json.loads(s[s.index('=')+1:].strip().rstrip(';'))['shots']})))"); do
  [ -f "$R/out/clips/$c/151.jpg" ] || { mkdir -p "$R/out/clips/$c"; ffmpeg -v error -y -i "$R/hf/$c.mp4" -vf "fps=30,scale=1080:1920" -q:v 3 "$R/out/clips/$c/%03d.jpg"; }
done
node "$ROOT/youtube/kit/audio.js" "$R/timeline2.js" music_sfx2.wav > /dev/null || exit 1
OFF=$(python3 -c "import json;s=open('$R/timeline2.js').read();print(int(json.loads(s[s.index('=')+1:].strip().rstrip(';'))['off']*1000))")
ffmpeg -v error -y -i "$R/out/voice/voice.wav" -af "adelay=$OFF:all=1" "$R/out/voice_off.wav"
SUM=$(cat arb-kit/cut.html "$R/timeline2.js" | md5sum | cut -c1-12)
[ "$(cat "$R/out/pieces2/.sum" 2>/dev/null)" = "$SUM" ] || { rm -rf "$R/out/pieces2"; mkdir -p "$R/out/pieces2"; echo "$SUM" > "$R/out/pieces2/.sum"; }
RQUERY="r=$N" bash "$ROOT/youtube/kit/yt/render_pieces.sh" "$ROOT/reels/arb-kit/cut.html" "$R/out/segs2.js" "$R/out/pieces2" 12 3 > "$R/out/render2_log.txt" 2>&1 || { echo "$N: рендер не закончен — запусти снова"; exit 1; }
bash "$ROOT/youtube/02-bank-earns/mix.sh" "$R/out/pieces2/video_full.mp4" "$R/out/voice_off.wav" "$R/out/music_sfx2.wav" "$R/reel_v2.mp4" | tail -1
echo "$N: $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$R/reel_v2.mp4") с"
