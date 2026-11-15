"""Звук рилса №4: голос спикера + свой тёмный трэп-бит 140 BPM (без авторских прав) + звук на каждое событие.
Музыка замолкает на «наоборот» и возвращается ударом на вставке."""
import numpy as np, subprocess, wave
SR, DUR = 48000, 13.7
rng = np.random.default_rng(3)
n = int(SR * DUR); t = np.arange(n) / SR
def buf(): return np.zeros(n)
def add(dst, sig, at, g=1.0):
    i = int(at * SR); j = min(n, i + len(sig))
    if 0 <= i < n: dst[i:j] += sig[: j - i] * g
def env(L, a=0.005, dcy=6.0):
    tt = np.arange(int(SR * L)) / SR; return np.minimum(1, tt / a) * np.exp(-tt * dcy), tt
def hz(m): return 440 * 2 ** ((m - 69) / 12)
def lp(x, a):
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)): acc += a * (x[i] - acc); y[i] = acc
    return y
# ---- бит ----
BPM = 140; b = 60 / BPM
mus = buf()
def e808(note, L):
    e, tt = env(L, 0.003, 1.6); f = hz(note) * (1 + 1.5 * np.exp(-tt * 40))
    return np.tanh(2.2 * np.sin(2 * np.pi * np.cumsum(f) / SR)) * e * 0.55
def clap():
    e, tt = env(0.25, 0.001, 18); x = rng.standard_normal(len(tt)); return np.diff(x, prepend=0) * e * 0.35
def hat(v=0.12):
    e, tt = env(0.05, 0.001, 90); x = np.diff(rng.standard_normal(len(tt)), prepend=0); return x * e * v
bass = [26, 26, 29, 24]                             # D, D, F, C (на октаву ниже)
for bar in range(int(DUR / (4 * b)) + 1):
    t0 = bar * 4 * b
    add(mus, e808(bass[bar % 4] + 12, 1.6), t0); add(mus, e808(bass[bar % 4] + 12, 0.6), t0 + 2.5 * b)
    add(mus, clap(), t0 + 2 * b)
    for k in range(8): add(mus, hat(0.10 if k % 2 == 0 else 0.07), t0 + k * b / 2)
    if bar % 2 == 1:                               # трель хэтов
        for k in range(6): add(mus, hat(0.06), t0 + 3 * b + k * b / 6)
pad = buf()
for m in (50, 53, 57, 62):
    pad += np.sin(2 * np.pi * hz(m) * t + 0.3 * np.sin(2 * np.pi * 0.2 * t)) * 0.04
mus += pad
# пауза музыки на «наоборот» (7.26) → удар на вставке (8.20)
gate = np.ones(n); gate[(t >= 7.26) & (t < 8.20)] = 0.0
gate = lp(gate, 0.004); mus *= gate
mus *= np.minimum(1, t / 0.05) * np.minimum(1, (DUR - t) / 0.4)
# ---- эффекты ----
fx = buf()
def whoosh(L=0.45, up=True):
    tt = np.arange(int(SR * L)) / SR; x = rng.standard_normal(len(tt))
    a = 0.02 + 0.25 * (tt / L if up else 1 - tt / L); y = lp(x, 0.1) * 0 + x
    out = np.empty_like(x); acc = 0
    for i in range(len(x)): acc += a[i] * (x[i] - acc); out[i] = acc
    return out * np.sin(np.pi * tt / L) ** 2 * 0.9
def impact():
    e, tt = env(1.2, 0.002, 3.2); f = 70 * np.exp(-tt * 6) + 38
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * 1.0 + rng.standard_normal(len(tt)) * np.exp(-tt * 25) * 0.4) * e
def riser(L):
    tt = np.arange(int(SR * L)) / SR; f = 200 + 1800 * (tt / L) ** 2
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.15 + lp(rng.standard_normal(len(tt)), 0.25) * 0.4) * (tt / L) ** 2
def pop():
    e, tt = env(0.09, 0.001, 45); return np.sin(2 * np.pi * (900 - 4000 * tt) * tt) * e * 0.5
add(fx, impact(), 0.0, 0.5)
for at in (0.70, 2.16, 3.82, 5.62): add(fx, whoosh(0.28), at - 0.12, 0.35)
add(fx, riser(0.8), 5.04, 0.7); add(fx, impact(), 5.84, 0.9)
add(fx, whoosh(0.5), 6.80, 0.7)
add(fx, whoosh(0.3, False), 7.20, 0.5)
add(fx, impact(), 8.20, 0.9); add(fx, whoosh(0.35), 8.06, 0.5)
for at in (8.62, 9.20, 10.0): add(fx, pop(), at, 0.8)
add(fx, whoosh(0.35), 10.50, 0.5)
for at in (11.0, 11.35, 11.7, 12.05, 12.4, 12.75): add(fx, pop(), at, 0.6)
add(fx, impact(), 12.28, 0.6)
def wr(name, x):
    x = x / (np.abs(x).max() + 1e-9) * 0.9
    w = wave.open(name, "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype(np.int16).tobytes()); w.close()
wr("music.wav", mus); wr("sfx.wav", fx)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "video.mp4", "-ss", "0", "-t", "13.2", "-i", "../03-margulan/src/clip.mp4", "-i", "music.wav", "-i", "sfx.wav",
    "-filter_complex",
    "[1:a]highpass=f=70,acompressor=threshold=-20dB:ratio=3:attack=8:release=120,afade=t=out:st=13.08:d=0.12,loudnorm=I=-14:TP=-1.5,apad[vo];"
    "[2:a]loudnorm=I=-27:TP=-6[mu];[3:a]loudnorm=I=-22:TP=-3[fx];"
    "[vo][mu][fx]amix=inputs=3:duration=first:normalize=0,atrim=duration=13.7,alimiter=limit=0.89[a]",
    "-map", "0:v", "-map", "[a]", "-c:v", "libx264", "-preset", "slow", "-crf", "19", "-maxrate", "14M", "-bufsize", "28M", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", "-t", "13.7", "reel.mp4"], check=True)
print("reel.mp4 ok")
