# python3 tts_split.py ep22 lis 6 — длинная роль частями по N реплик (один огромный запрос Google иногда возвращает пустой ответ),
# части склеиваются через 1,2 с тишины в vo/<герой>.wav — place2.py режет по словам, ему всё равно
import json, os, subprocess, sys, time
ep, who, n = sys.argv[1], sys.argv[2], int(sys.argv[3])
V = json.load(open("voices.json"))[who]
lines = [l["text"] for l in json.load(open(f"{ep}.json"))["lines"] if l["who"] == who]
style = (f"# AUDIO PROFILE: {V['profile']}\n## DIRECTOR NOTES\n{V['notes']}\nKeep a full, loud, clear voice to the very last word "
         f"of every line — never whisper, mumble or trail off.\nSpeak ONLY the transcript, in Russian.\n## TRANSCRIPT")
model = os.environ.get("MODEL", "gemini-3.1-flash-tts-preview")
parts = []
for k in range(0, len(lines), n):
    out = f"vo/{who}_part{k // n}.wav"
    for attempt in range(5):
        if os.path.exists(out) and os.path.getsize(out) > 1000:
            break
        r = subprocess.run(["python3", "../../gtts/tts.py", model, V["voice"], out, style, "\n\n".join(lines[k:k + n])], capture_output=True, text=True)
        print(who, k // n, attempt, (r.stdout + r.stderr).strip()[-120:]); sys.stdout.flush()
        if r.returncode != 0:
            time.sleep(70)
    parts.append(out)
    time.sleep(20)
args = []
for p in parts:
    args += ["-i", p]
flt = "".join(f"[{i}:a]apad=pad_dur=1.2[a{i}];" for i in range(len(parts))) + "".join(f"[a{i}]" for i in range(len(parts))) + f"concat=n={len(parts)}:v=0:a=1"
subprocess.run(["ffmpeg", "-v", "error", "-y", *args, "-filter_complex", flt, f"vo/{who}.wav"], check=True)
print("ok", f"vo/{who}.wav")
