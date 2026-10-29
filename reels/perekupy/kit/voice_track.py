# голос на свою дорожку 48 кГц длиной в ролик: сдвиг LEAD, для «разрезанных» сценариев вторая часть переносится (split)
# python voice_track.py <voice.wav> <score.json> <out.wav>
import json, subprocess, sys
import numpy as np
src, score, out = sys.argv[1:4]
sc = json.load(open(score))
raw = subprocess.run(["ffmpeg", "-v", "quiet", "-i", src, "-f", "f32le", "-ac", "1", "-ar", "48000", "-"], capture_output=True).stdout
v = np.frombuffer(raw, np.float32)
SR = 48000
y = np.zeros(int(sc["dur"] * SR), np.float32)
def place(seg, at):
    i = int(at * SR); n = min(len(seg), len(y) - i)
    if n > 0: y[i:i + n] += seg[:n]
lead = sc.get("lead", 0)
if sc.get("split"):
    cut = int((sc["split"]["at"] - .12) * SR)               # режем в паузе перед второй фразой
    fade = np.linspace(1, 0, 960, dtype=np.float32)
    a = v[:cut].copy(); a[-960:] *= fade
    place(a, lead); place(v[cut:], lead + (cut / SR) + sc["split"]["shift"])
else:
    place(v, lead)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", "48000", "-ac", "1", "-i", "-", out], input=y.tobytes(), check=True)
print("voice", out, round(len(y) / SR, 2))
