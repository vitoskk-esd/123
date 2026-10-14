#!/usr/bin/env bash
# Рендер длинной страницы движка мелкими кусками, переживающий перезапуски контейнера (опыт ролика №3, 12.10:
# контейнер перезапускался каждые 15–30 мин и убивал куски по 14 с). Готовые куски помечаются <outdir>/.pN и пропускаются,
# повторный запуск продолжает с места. Итог: <outdir>/video_full.mp4 (без звука; сведение — mix.sh).
#   bash render_pieces.sh <page.html> <data.js> <outdir> [pieces=192] [jobs=4] [gl_page.html]
# page.html  — страница для рендера (с запеканием: …_bake.html, см. modes/illu_bake.js);
# data.js    — файл с window.SEGS той же страницы: из него берутся длительность и отрезки с 3D-картой;
# RQUERY=w=1280 — параметры страницы (например, рендер 720p).
# gl_page    — страница без запекания для кусков с картой (swiftshader + запекание упирались в таймаут скриншота).
# Скорость на 4 ядрах (ролик №3): кусок 3,4 с с запеканием — 2–5 мин, с картой через swiftshader — ~20 мин.
set -u
RQUERY=${RQUERY:-}; PAGE=$(realpath "$1"); DATA=$(realpath "$2"); OUT=$(realpath -m "$3"); NP=${4:-192}; JOBS=${5:-4}; GLPAGE=${6:+$(realpath "$6")}
cd "$(dirname "$0")"; mkdir -p "$OUT"
# длительность и номера кусков с картой — один раз, в файл
python3 - "$DATA" "$NP" "$OUT" <<'EOF' || exit 1
import sys, re, json
data, n, out = sys.argv[1], int(sys.argv[2]), sys.argv[3]
segs = json.loads(re.search(r"window.SEGS = (.*?);\n", open(data).read()).group(1))
dur = segs[-1]["t1"]
maps = [j for j in range(n) if any(s["mode"] == "map" and s["t1"] > dur * j / n and s["t0"] < dur * (j + 1) / n for s in segs)]
open(out + "/dur.txt", "w").write(str(dur))
open(out + "/map_pieces.txt", "w").write(" ".join(map(str, maps)))
print(f"{dur} с, {n} кусков по {dur / n:.2f} с; с картой: {maps or 'нет'}")
EOF
DUR=$(cat "$OUT/dur.txt"); MAPS=" $(cat "$OUT/map_pieces.txt") "
export PAGE GLPAGE OUT DUR NP MAPS RQUERY
seq 0 $((NP - 1)) | xargs -P "$JOBS" -I{} bash -c '
  j={}; [ -f "$OUT/.p$j" ] && exit 0
  A=$(python3 -c "print(round($DUR*$j/$NP, 3))"); B=$(python3 -c "print(round($DUR*($j+1)/$NP, 3))")
  PG=$PAGE; [ -n "$GLPAGE" ] && [[ "$MAPS" == *" $j "* ]] && PG=$GLPAGE
  node render.js "$PG" ${RQUERY:+--query "$RQUERY"} --from $A --to $B --out "$OUT/p$j.mp4" > "$OUT/p${j}_log.txt" 2>&1 && touch "$OUT/.p$j"'
for j in $(seq 0 $((NP - 1))); do [ -f "$OUT/.p$j" ] || { echo "кусок $j не отрендерился (лог $OUT/p${j}_log.txt) — запусти снова"; exit 1; }; done
: > "$OUT/pieces.txt"; for j in $(seq 0 $((NP - 1))); do echo "file 'p$j.mp4'" >> "$OUT/pieces.txt"; done
ffmpeg -y -v error -f concat -safe 0 -i "$OUT/pieces.txt" -c copy "$OUT/video_full.mp4" && echo "$(date +%H:%M:%S) готово: $OUT/video_full.mp4"
