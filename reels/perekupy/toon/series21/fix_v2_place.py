# venv/python fix_v2_place.py — ставит новый дубль v2 (vo/v2_take2.wav) на место старого в копии дорожки: vo/ep30fix/{voice.wav,timeline.js}.
# Основной ролик (vo/ep30) не трогаем — с vo/ep30fix собираются только пересъёмки ep30b–h. Пауза внутри дубля укорочена до 0,2 с, реплика начинается на 0,1 с раньше, громкость — как у старой реплики.
import json, os, re, subprocess, sys
import numpy as np
sys.path.insert(0, "../.."); import asr
SR = 48000
rd = lambda f, sr=SR: np.frombuffer(subprocess.run(["ffmpeg", "-v", "quiet", "-i", f, "-f", "f32le", "-ac", "1", "-ar", str(sr), "-"], capture_output=True).stdout, np.float32).copy()
x = rd("vo/ep30/voice.wav"); tk = rd("vo/v2_take2.wav")
js = open("vo/ep30/timeline.js").read()
TT = json.loads(re.search(r"window.TT=(\{.*?\});window.LIP=", js, re.S).group(1)); LIP = json.loads(re.search(r"window.LIP=(\{.*?\});window.DURATION", js, re.S).group(1))
a, b = TT["start"]["v2"], TT["end"]["v2"]
a0 = a; a = round(a - .1, 3); TT["start"]["v2"] = a
# дубль: «Капот тёплый» [0, 1.30] + 0.3 с тишины + «Вы её уже грели?» [1.95, конец]
part1, part2 = tk[:int(1.30 * SR)], tk[int(1.95 * SR):]
part1 = part1[np.argmax(np.abs(part1) > 2e-3):]
nz = lambda s: s[np.abs(s) > 1e-3]
part2 = part2[:len(part2) - np.argmax(np.abs(part2[::-1]) > 2e-3)]
new = np.concatenate([part1, np.zeros(int(.2 * SR), np.float32), part2])
fade = int(.01 * SR); new[:fade] *= np.linspace(0, 1, fade); new[-fade:] *= np.linspace(1, 0, fade)
old = x[int(a0 * SR):int(b * SR)]
new *= np.sqrt(np.mean(nz(old) ** 2)) / np.sqrt(np.mean(nz(new) ** 2))
lim = TT["start"]["t2"] - .15; assert a + len(new) / SR < lim, (a + len(new) / SR, lim)
x[int((a - .15) * SR):int(lim * SR)] = 0; x[int(a * SR):int(a * SR) + len(new)] = new
os.makedirs("vo/ep30fix", exist_ok=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", "vo/ep30fix/voice.wav"], input=x.tobytes(), check=True)
# губы Вики в окне реплики — по новому звуку, в масштабе старых
fr = SR // 30; f0, f1 = int((a - .15) * 30), int(lim * 30)
seg = x[f0 * fr:f1 * fr]; rms = np.sqrt(np.mean(seg[:len(seg) // fr * fr].reshape(-1, fr) ** 2, axis=1))
oldv = np.array(LIP["vika"][int(a0 * 30):int(b * 30)]); ref = np.percentile(oldv[oldv > 0], 95) if (oldv > 0).any() else 1
k = ref / (np.percentile(rms[rms > 1e-4], 95) or 1)
LIP["vika"][f0:f0 + len(rms)] = [round(float(min(1, v * k)), 2) for v in rms]
TT["end"]["v2"] = round(a + len(new) / SR, 3)
ws = asr.words("vo/ep30fix/voice.wav", "small")
TT["words"]["v2"] = [[w, round(s, 3), round(e, 3)] for w, s, e in ws if a - .2 <= s < lim]
print(TT["words"]["v2"], TT["end"]["v2"])
open("vo/ep30fix/timeline.js", "w").write(js[:js.index("window.TT=")] + "window.TT=" + json.dumps(TT, ensure_ascii=False) + ";window.LIP=" + json.dumps(LIP) + js[js.index(";window.DURATION"):])
