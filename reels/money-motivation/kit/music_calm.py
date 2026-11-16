"""Своя спокойная мечтательная подложка (без авторских прав) под нарезку «богатой жизни»: ~108 BPM, мягкие электро-клавиши
Am–F–C–G, тёплый саб, тихая бочка на 1 и 3, щелчок на 2 и 4, шейкер восьмыми, реверб. Склейки ролика — на долю.
  python3 kit/music_calm.py длительность out.wav [bpm]"""
import numpy as np, subprocess, sys, wave
SR = 48000; DUR = float(sys.argv[1]); OUT = sys.argv[2]; BPM = float(sys.argv[3]) if len(sys.argv) > 3 else 108
b = 60 / BPM; n = int(SR * DUR); t = np.arange(n) / SR; out = np.zeros(n); rng = np.random.default_rng(11)
def hz(m): return 440 * 2 ** ((m - 69) / 12)
def add(sig, at, g=1.0):
    i = int(at * SR); j = min(n, i + len(sig))
    if 0 <= i < n: out[i:j] += sig[: j - i] * g
def keys(m, L, v):
    tt = np.arange(int(SR * L)) / SR; f = hz(m)
    s = np.sin(2 * np.pi * f * tt + .5 * np.sin(2 * np.pi * f * 2 * tt) * np.exp(-tt * 4)) * np.exp(-tt * 1.1)
    return s * v * np.minimum(1, tt / .008) * np.clip((L - tt) / .4, 0, 1)
CH = [[57, 60, 64, 67], [53, 57, 60, 64], [48, 55, 60, 64], [55, 59, 62, 67]]   # Am7, Fmaj7, C, G
bar = 4 * b
for k in range(int(DUR / bar) + 2):
    ch = CH[k % 4]; t0 = k * bar
    for j, m in enumerate(ch): add(keys(m, bar + .6, .06), t0 + j * .012)
    for j, m in enumerate([ch[0] + 12, ch[2] + 12, ch[1] + 12, ch[3] + 12]): add(keys(m, 1.2, .035), t0 + (j * 2 + 1) * b / 2)   # мягкое арпеджио
    tt = np.arange(int(SR * bar)) / SR; add(np.sin(2 * np.pi * hz(ch[0] - 24) * tt) * np.minimum(1, tt / .05) * np.exp(-tt * .6) * .22, t0)
def kick():
    tt = np.arange(int(SR * .35)) / SR; f = 50 + 70 * np.exp(-tt * 28); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9) * .28
def snap():
    tt = np.arange(int(SR * .18)) / SR; x = np.diff(rng.standard_normal(len(tt)), prepend=0); return x * np.exp(-tt * 30) * .05
def shaker(v):
    tt = np.arange(int(SR * .07)) / SR; x = np.diff(rng.standard_normal(len(tt)), prepend=0); return x * np.sin(np.pi * tt / .07) * v
for k in range(int(DUR / b) + 2):
    tb = k * b
    if k % 2 == 0: add(kick(), tb)
    else: add(snap(), tb)
    add(shaker(.018), tb); add(shaker(.011), tb + b / 2)
out *= np.minimum(1, t / 1.2) * np.minimum(1, (DUR - t) / 1.5)
out /= np.abs(out).max() * 1.1
w = wave.open(OUT + ".raw.wav", "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype(np.int16).tobytes()); w.close()
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", OUT + ".raw.wav", "-af", "aecho=0.8:0.7:90|210|360:0.3|0.22|0.15,lowpass=f=8000,highpass=f=35", "-ar", "48000", "-ac", "2", OUT], check=True)
import os; os.remove(OUT + ".raw.wav"); print(OUT, DUR, "с,", BPM, "BPM")
