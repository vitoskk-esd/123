"""Свой lo-fi бит 75 BPM (без авторских прав): родес Fmaj7–Em7–Dm7–Cmaj7, бочка/малый/хэт со свингом, винил.
Под голосом (0..VOICE_END) — только родес + тихий хэт, затем «дроп»: полный бит на чёрном экране."""
import numpy as np, subprocess, wave, sys
SR = 48000; VOICE_END = float(sys.argv[1]); DUR = float(sys.argv[2])
BPM = 75; beat = 60 / BPM
t = np.arange(int(SR * DUR)) / SR; out = np.zeros_like(t)
rng = np.random.default_rng(7)
def hz(n): return 440 * 2 ** ((n - 69) / 12)
def add(sig, start):
    i = int(start * SR); j = min(len(out), i + len(sig))
    if i < len(out): out[i:j] += sig[: j - i]
def rhodes(n, dur, vel=0.12):
    tt = np.arange(int(SR * dur)) / SR; f = hz(n)
    s = np.sin(2*np.pi*f*tt + 0.6*np.sin(2*np.pi*f*tt) * np.exp(-tt*3)) * np.exp(-tt * 0.9)
    return s * vel * np.minimum(1, tt / 0.01) * np.clip((dur - tt) / 0.3, 0, 1)
chords = [[53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 60], [48, 52, 55, 59]]
bar = 4 * beat
for k in range(int(DUR / bar) + 1):
    for j, n in enumerate(chords[k % 4]): add(rhodes(n, bar + 0.4, 0.09), k * bar + j * 0.018)
    add(rhodes(chords[k % 4][0] - 24, bar, 0.22), k * bar)                     # бас
def kick():
    tt = np.arange(int(SR * 0.45)) / SR; f = 48 + 90 * np.exp(-tt * 30)
    return np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-tt * 7) * 0.9
def snare():
    tt = np.arange(int(SR * 0.3)) / SR
    return (rng.standard_normal(len(tt)) * 0.35 + np.sin(2*np.pi*190*tt) * 0.3) * np.exp(-tt * 16)
def hat(v):
    tt = np.arange(int(SR * 0.06)) / SR
    n = rng.standard_normal(len(tt)); n = np.diff(n, prepend=0)
    return n * np.exp(-tt * 70) * v
nb = int(DUR / beat) + 1
for b in range(nb):
    tb = b * beat; full = tb >= VOICE_END - 0.05
    for h in (0, 0.58):                                   # свинг восьмых
        add(hat(0.10 if full else 0.045), tb + h * beat)
    if full:
        if b % 4 in (0,) or (b % 4 == 2 and True): add(kick(), tb)
        if b % 4 == 2: add(kick() * 0.6, tb + 0.58 * beat)
        if b % 4 in (1, 3): add(snare(), tb)
crack = (rng.random(len(t)) > 0.9993) * rng.standard_normal(len(t)) * 0.25 + rng.standard_normal(len(t)) * 0.004
out += crack
out[t < VOICE_END] *= 0.55                                 # под голосом тише
out *= np.minimum(1, (DUR - t) / 1.2)
out /= np.abs(out).max() * 1.1
w = wave.open("lofi_raw.wav", "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((out * 32767).astype(np.int16).tobytes()); w.close()
subprocess.run(["ffmpeg","-v","error","-y","-i","lofi_raw.wav","-af","lowpass=f=5200,aecho=0.8:0.6:90:0.2,acompressor=threshold=-18dB:ratio=2.5",
                "-ar","48000","-ac","2","lofi.wav"], check=True)
print("lofi.wav", DUR)
