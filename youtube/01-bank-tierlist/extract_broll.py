"""Кадры видеовставок для video.html: out/bfr/<id>/00001.jpg… (30 к/с, 1920×1080, обрезка по центру).
Берёт список из timeline.js (сцены type=broll: id, src, ss, frames)."""
import json, os, re, subprocess
DIR = os.path.dirname(os.path.abspath(__file__))
tl = json.loads(re.search(r"window\.TL = (.*);\s*$", open(os.path.join(DIR, "timeline.js")).read(), re.S).group(1))
for s in tl["scenes"]:
    if s["type"] != "broll": continue
    out = os.path.join(DIR, "out", "bfr", s["id"]); os.makedirs(out, exist_ok=True)
    for f in os.listdir(out): os.remove(os.path.join(out, f))
    src = os.path.join(DIR, "..", "assets", "broll", s["src"] + ".mp4")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(s["ss"]), "-i", src, "-frames:v", str(s["frames"]),
                    "-vf", "fps=30,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,eq=saturation=1.15:contrast=1.05",
                    "-q:v", "4", os.path.join(out, "%05d.jpg")], check=True)
    print(s["id"], s["src"], len(os.listdir(out)), "кадров")
