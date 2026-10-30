# python wordlevel.py vo/ep04/tolyan_fast.wav … — громкость каждого слова; тихие (проглоченные TTS) — с пометкой
import sys, subprocess, numpy as np
sys.path.insert(0, "../.."); import asr
SR = 48000
for f in sys.argv[1:]:
    x = np.frombuffer(subprocess.run(["ffmpeg", "-v", "quiet", "-i", f, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True).stdout, np.float32)
    ws = asr.words(f, "small")
    lv = [(w, 20 * np.log10(np.sqrt(np.mean(x[int(a * SR):int(b * SR)] ** 2)) + 1e-9)) for w, a, b in ws if b - a > .06]
    med = np.median([l for _, l in lv])
    bad = [f"{w}({l:.0f})" for w, l in lv if l < med - 14]
    print(f, "медиана", round(med, 1), "дБ; тихие слова:", bad or "нет")
