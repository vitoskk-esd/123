# python3 tts_batch.py ep06 ep07 — озвучка пачки серий: один запрос на героя (все его реплики из всех серий по порядку)
# → vo/<героя>.wav и vo/index.json (какие реплики в каком порядке). Лимит Gemini TTS — ~10 запросов в день на модель.
import json, os, subprocess, sys, time
eps = sys.argv[1:]; V = json.load(open("voices.json")); os.makedirs("vo", exist_ok=True)
order = {}
for e in eps:
    for ln in json.load(open(f"{e}.json"))["lines"]:
        order.setdefault(ln["who"], []).append([e, ln["id"], ln["text"]])
json.dump(order, open("vo/index.json", "w"), ensure_ascii=False, indent=1)
models = [os.environ.get("MODEL", "gemini-3.1-flash-tts-preview"), "gemini-2.5-flash-preview-tts"]
for who, lines in order.items():
    out = f"vo/{who}.wav"
    if os.path.exists(out) and os.path.getsize(out) > 1000: continue
    v = V[who]
    style = (f"# AUDIO PROFILE: {v['profile']}\n## DIRECTOR NOTES\n{v['notes']}\nKeep a full, loud, clear voice to the very last word "
             f"of every line — never whisper, mumble or trail off.\nSpeak ONLY the transcript, in Russian.\n## TRANSCRIPT")
    text = "\n\n".join(t for _, _, t in lines)
    for m in models:
        r = subprocess.run(["python3", "../../gtts/tts.py", m, v["voice"], out, style, text], capture_output=True, text=True)
        print(who, m, (r.stdout + r.stderr).strip()[-200:]); sys.stdout.flush()
        if r.returncode == 0: break
    time.sleep(8)
