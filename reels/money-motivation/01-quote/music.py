"""Свой тёмный эмбиент-фон (без авторских прав): пэд Dm–B♭–Gm–A, саб, редкие «пиано»-ноты, удар-«бум» на кадре 0 и перед последней строкой."""
import json, numpy as np, subprocess, wave
SR, DUR = 48000, 24.0
t = np.arange(int(SR*DUR)) / SR
def hz(n): return 440 * 2 ** ((n - 69) / 12)
def lp(x, a):                      # однополюсный ФНЧ, a = 0..1 (меньше — темнее)
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)): acc += a * (x[i] - acc); y[i] = acc
    return y
chords = [[50, 57, 62, 65], [46, 53, 58, 62], [43, 50, 55, 58], [45, 52, 57, 61]]   # Dm, B♭, Gm, A
seg = 6.0
pad = np.zeros_like(t); sub = np.zeros_like(t)
for k in range(int(DUR / seg) + 1):
    ch = chords[k % 4]; s, e = k*seg, (k+1)*seg + 1.5
    m = (t >= s) & (t < e); tt = t[m] - s
    env = np.minimum(1, tt / 1.8) * np.clip((e - s - tt) / 1.5, 0, 1)
    for n in ch:
        for det in (-0.12, 0.0, 0.11):
            f = hz(n + det); pad[m] += env * (2 * ((f * tt) % 1) - 1) * 0.05
    sub[m] += env * np.sin(2*np.pi*hz(ch[0]-12)*tt) * 0.35
pad = lp(pad, 0.035)
keys = np.zeros_like(t)
for when, n in [(1.0, 74), (4.6, 72), (7.3, 69), (9.8, 70), (12.7, 69), (16.0, 74), (19.2, 73), (21.0, 69)]:
    m = t >= when; tt = t[m] - when
    keys[m] += (np.sin(2*np.pi*hz(n)*tt) + 0.3*np.sin(4*np.pi*hz(n)*tt)) * np.exp(-tt * 1.6) * 0.16
boom = np.zeros_like(t)
for when in (0.0, 19.1):
    m = (t >= when) & (t < when + 2.5); tt = t[m] - when
    f = 55 * np.exp(-tt * 1.2) + 32; ph = 2*np.pi*np.cumsum(f) / SR
    boom[m] += np.sin(ph) * np.exp(-tt * 1.4) * 0.8
mix = pad + sub + keys + boom
mix *= np.minimum(1, (DUR - t) / 1.5)
mix /= np.abs(mix).max() * 1.12
w = wave.open("music_raw.wav", "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((mix * 32767).astype(np.int16).tobytes()); w.close()
subprocess.run(["ffmpeg","-v","error","-y","-i","music_raw.wav","-af",
  "aecho=0.8:0.7:120|260|430:0.35|0.25|0.18,highpass=f=28,loudnorm=I=-26:TP=-3","-ar","48000","-ac","2","music.wav"], check=True)
print("music.wav ok")
