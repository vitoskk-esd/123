"""Своя эмоциональная подложка (без авторских прав): фортепиано-арпеджио + струнный пэд, C-минор, Ab–Eb–Bb–Cm.
  python3 piano.py длительность out.wav"""
import numpy as np, subprocess, sys, wave
SR = 48000; DUR = float(sys.argv[1]); OUT = sys.argv[2]
t = np.arange(int(SR * DUR)) / SR; out = np.zeros_like(t)
def hz(m): return 440 * 2 ** ((m - 69) / 12)
def add(sig, at):
    i = int(at * SR); j = min(len(out), i + len(sig))
    if i < len(out): out[i:j] += sig[: j - i]
def piano(m, L=3.0, v=0.18):
    tt = np.arange(int(SR * L)) / SR; f = hz(m)
    s = sum(a * np.sin(2 * np.pi * f * k * tt) * np.exp(-tt * (1.2 + 0.9 * k)) for k, a in ((1, 1), (2, 0.45), (3, 0.2), (4, 0.08)))
    return s * v * np.minimum(1, tt / 0.006)
chords = [[56, 60, 63], [51, 55, 58], [58, 62, 65], [48, 51, 55]]          # Ab, Eb, Bb, Cm
bar = 2.4; eighth = bar / 8
for k in range(int(DUR / bar) + 1):
    ch = chords[k % 4]; t0 = k * bar
    add(piano(ch[0] - 12, 4, 0.16), t0)
    pat = [ch[0], ch[1], ch[2], ch[1] + 12, ch[2], ch[1], ch[0] + 12, ch[1]]
    for j, m in enumerate(pat): add(piano(m + 12, 2.2, 0.07 + 0.02 * (j == 0)), t0 + j * eighth)
pad = np.zeros_like(t)
for k in range(int(DUR / bar) + 1):
    ch = chords[k % 4]; m = (t >= k * bar) & (t < (k + 1) * bar + 0.8); tt = t[m] - k * bar
    e = np.minimum(1, tt / 0.9) * np.clip((bar + 0.8 - tt) / 0.8, 0, 1)
    for n in ch:
        for det in (-0.08, 0.07): pad[m] += e * np.sin(2 * np.pi * hz(n + det) * tt + 0.8 * np.sin(2 * np.pi * hz(n) * 0.5 * tt)) * 0.03
swell = np.minimum(1, t / (DUR * 0.6)) * 0.7 + 0.3                          # струнные нарастают
out += pad * swell
out *= np.minimum(1, t / 1.0) * np.minimum(1, (DUR - t) / 1.5)
out /= np.abs(out).max() * 1.1
w = wave.open(OUT + ".raw.wav", "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype(np.int16).tobytes()); w.close()
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", OUT + ".raw.wav", "-af", "aecho=0.8:0.75:110|240|390|560:0.35|0.28|0.2|0.14,lowpass=f=7000,highpass=f=50",
                "-ar", "48000", "-ac", "2", OUT], check=True)
import os; os.remove(OUT + ".raw.wav")
