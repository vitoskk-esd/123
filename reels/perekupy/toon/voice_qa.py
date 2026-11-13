# python3 ../voice_qa.py epNN — проверка озвучки на шипение/помехи ДО сборки ролика (владелец 13.11 про ep50 «Эво»: «когда говорит голос, слышны
# помехи, это невозможно смотреть»). Синтез иногда отдаёт дубль со сплошным шумом под речью — он заполняет даже паузы между словами.
# Метрика — «ровность» спектра 1,5–9 кГц в громких кадрах реплики (геом./арифм. среднее): у живого голоса спектр с формантами (≈0,07–0,18),
# шипение раскладывает ровный ковёр (ep50 Лис — 0,21–0,33, ep46 Лис/Эрик — до 0,29). Плохие реплики — переозвучить (fix-папка, см. навык).
import json, subprocess, sys
import numpy as np

FLAT = .21                       # порог: чистые серии ep47–ep52 — до 0,20; шипящие дубли ep50/ep46 — 0,21–0,33


def load(p, sr=24000):
    r = subprocess.run(["ffmpeg", "-v", "quiet", "-i", p, "-f", "f32le", "-ac", "1", "-ar", str(sr), "-"], capture_output=True).stdout
    return np.frombuffer(r, np.float32)


def check(ep, verbose=True):
    t = open(f"vo/{ep}/timeline.js").read(); TT = json.loads(t[t.index("{"):t.index("};") + 1])
    who = {l["id"]: l["who"] for l in json.load(open(f"{ep}.json"))["lines"]}
    x, sr, n = load(f"vo/{ep}/voice.wav"), 24000, 480
    bad = []
    for lid in TT["start"]:
        seg = x[int(TT["start"][lid] * sr):int(TT["end"][lid] * sr)]
        fr = seg[:len(seg) // n * n].reshape(-1, n)
        if len(fr) < 10:
            continue
        db = 20 * np.log10(np.sqrt((fr ** 2).mean(1)) + 1e-9)
        sp = np.abs(np.fft.rfft(fr * np.hanning(n), axis=1)) ** 2; f = np.fft.rfftfreq(n, 1 / sr)
        bs = sp[:, (f > 1500) & (f < 9000)] + 1e-12; flat = np.exp(np.log(bs).mean(1)) / bs.mean(1)
        fl = float(flat[db > db.max() - 20].mean())
        noisy = fl > FLAT
        if noisy:
            bad.append((lid, who.get(lid, "?")))
        if verbose:
            print(f"{'✗' if noisy else '✓'} {lid:5} {who.get(lid, '?'):8} шум {fl:.3f}")
    return bad


if __name__ == "__main__":
    bad = check(sys.argv[1])
    print("ШУМ в репликах:", ", ".join(f"{l} ({w})" for l, w in bad) if bad else "нет — озвучка чистая")
    sys.exit(1 if bad else 0)
