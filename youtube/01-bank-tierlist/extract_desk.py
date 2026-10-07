"""Кадры видео для desk.html: out/bfr/<id>/00001.jpg… (30 к/с, 1280×720 — видео живёт в окне, не на весь экран).
Список — out/desk_broll.json (пишет build_desk.py): [id, src, ss, n]."""
import json, os, subprocess
DIR = os.path.dirname(os.path.abspath(__file__))
counts = {}
for id, src, ss, n in json.load(open(os.path.join(DIR, "out", "desk_broll.json"))):
    out = os.path.join(DIR, "out", "bfr", id); os.makedirs(out, exist_ok=True)
    for f in os.listdir(out): os.remove(os.path.join(out, f))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(ss), "-i", os.path.join(DIR, "..", "assets", "broll", src + ".mp4"), "-frames:v", str(n),
                    "-vf", "fps=30,scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,eq=saturation=1.1:contrast=1.04",
                    "-q:v", "4", os.path.join(out, "%05d.jpg")], check=True)
    counts[id] = len(os.listdir(out)); print(id, src, counts[id], "кадров")
json.dump(counts, open(os.path.join(DIR, "out", "bfr_counts.json"), "w"))  # build_desk.py берёт реальную длину клипа
# стоп-кадры для карточек (out/desk_thumbs.json: [src, ss]) -> out/thumbs/<src>.jpg
os.makedirs(os.path.join(DIR, "out", "thumbs"), exist_ok=True)
p = os.path.join(DIR, "out", "desk_thumbs.json")
for src, ss in (json.load(open(p)) if os.path.exists(p) else []):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(ss), "-i", os.path.join(DIR, "..", "assets", "broll", src + ".mp4"), "-frames:v", "1",
                    "-vf", "scale=640:360:force_original_aspect_ratio=increase,crop=640:360", "-q:v", "4", os.path.join(DIR, "out", "thumbs", src + ".jpg")], check=True)
    print("thumb", src)
