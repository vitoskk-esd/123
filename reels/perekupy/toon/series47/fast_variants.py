# python3 fast_variants.py ep47 — быстрые уникализации (владелец 12.11: «вариант 2»): у каждой своя заставка (текст и цвет) — рендерим только первые
# HEAD секунд; остальное — кадры основного видео final/perekupy_<id>.mp4; на весь ролик — своя цветокоррекция и лёгкий зум со сдвигом центра (кадрирование).
# Звук — из основного видео без изменений. ~2–3 мин на вариант вместо ~25. → final/perekupy_<id>b|c|h.mp4 (h — всегда розовая)
import json, os, shutil, subprocess, sys

BASE = sys.argv[1]; HEAD = 2.4; FPS = 30; N = int(HEAD * FPS)
V = {   # заставка (две плашки и цвета) · цвет ffmpeg · зум и сдвиг центра (доли запаса по x, y: 0 — левый/верхний край, .5 — центр)
 "b": dict(name="Архив", t=("ОТ 100 000 ДО МИЛЛИОНА", "ФИНАЛ ИСТОРИИ", "#2f4fb8", "#fbfaf3"),
   color="colorchannelmixer=.86:.14:0:0:.08:.86:.06:0:.04:.1:.78:0,eq=contrast=1.05:saturation=1.05", zoom=1.04, at=(.5, .5)),
 "c": dict(name="Неон", t=("15 СДЕЛОК — МИЛЛИОН", "ЧЕМ ВСЁ ЗАКОНЧИЛОСЬ", "#ffd23f", "#151515"),
   color="eq=contrast=1.1:saturation=1.3:brightness=-0.02,hue=h=12", zoom=1.06, at=(.5, .25)),
 "h": dict(name="Пастель", t=("ОН КУПИЛ МЕЧТУ", "ТОЛЯН · ФИНАЛ", "#ff6fae", "#151515"),
   color="colorbalance=rs=.10:gs=-.04:bs=.08:rm=.08:gm=-.03:bm=.06,eq=saturation=.9:brightness=.03", zoom=1.05, at=(.3, .5)),
}
PY = os.environ.get("PY", "python3")
main = f"final/perekupy_{BASE}.mp4"; assert os.path.exists(main), main
js, css, ep = open(f"{BASE}.js").read(), open(f"{BASE}.css").read(), json.load(open(f"{BASE}.json"))
for k, v in V.items():
    if len(sys.argv) > 2 and k not in sys.argv[2:]: continue
    vid = BASE + k
    json.dump(dict(ep, id=vid), open(f"{vid}.json", "w"), ensure_ascii=False, indent=1)
    if os.path.exists(f"vo/{vid}"): shutil.rmtree(f"vo/{vid}")
    shutil.copytree(f"vo/{BASE}", f"vo/{vid}")
    open(f"{vid}.css", "w").write(css)
    t1, t2, c1, c2 = v["t"]
    open(f"{vid}.js", "w").write(js + f'''
// ── {vid} «{v["name"]}»: быстрая уникализация — меняется только заставка ──
$("#title .a").textContent = {json.dumps(t1, ensure_ascii=False)}; $("#title .a").style.cssText = "font-size:110px;background:{c1};color:{c2}";
$("#title .b").textContent = {json.dumps(t2, ensure_ascii=False)}; $("#title .b").style.cssText = "font-size:60px;background:{c2};color:{c1}";
{{ const L = document.querySelector("#lbx"); if (L) {{ const a = L.querySelector(".lbt"), b = L.querySelector(".lbb");   // кинорамка вместо плашки (ep56)
  a.textContent = {json.dumps(t1, ensure_ascii=False)}; b.textContent = {json.dumps(t2, ensure_ascii=False)}; a.style.background = b.style.background = "{c1}"; a.style.color = b.style.color = "{c2}"; }} }}
''')
    subprocess.run(["python3", "build2.py", vid], check=True, stdout=subprocess.DEVNULL)
    subprocess.run(["node", "../../kit/render.js", f"{vid}.html", "video", f"head_{vid}.mp4", str(FPS), "2"], check=True,
                   env=dict(os.environ, MAXT=str(HEAD)), stdout=subprocess.DEVNULL)
    z, (ax, ay) = v["zoom"], v["at"]
    crop = f"crop=iw/{z}:ih/{z}:(iw-iw/{z})*{ax}:(ih-ih/{z})*{ay},scale=1080:1920:flags=lanczos,setsar=1"
    fc = (f"[0:v]setpts=PTS-STARTPTS[h];[1:v]trim=start_frame={N},setpts=PTS-STARTPTS[m];[h][m]concat=n=2:v=1:a=0,{v['color']},{crop},format=yuv420p[v]")
    os.makedirs("final", exist_ok=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"head_{vid}.mp4", "-i", main, "-filter_complex", fc, "-map", "[v]", "-map", "1:a",
                    "-c:v", "libx264", "-preset", "medium", "-crf", "16", "-r", str(FPS), "-c:a", "copy", "-movflags", "+faststart", f"final/perekupy_{vid}.mp4"], check=True)
    for f in (f"head_{vid}.mp4", f"head_{vid}.events.json"): os.path.exists(f) and os.remove(f)
    print(vid, v["name"], "→", f"final/perekupy_{vid}.mp4")

# YD_FOLDER="История Толяна часть 12" (или «Простой ролик 2») — после сборки сразу кладём основное видео и уникализации на Яндекс Диск
# той же фоновой командой: без отдельных шагов (владелец 12.11: «тратится много лимита на отправку файлов»).
if os.environ.get("YD_FOLDER"):
    names = [f"final/perekupy_{BASE}.mp4"] + [f"final/perekupy_{BASE}{k}.mp4" for k in V if len(sys.argv) <= 2 or k in sys.argv[2:]]
    subprocess.run(["python3", "../../kit/ydisk.py", os.environ["YD_FOLDER"], *[n for n in names if os.path.exists(n)]], check=True)
