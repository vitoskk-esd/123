"""Звуковая подпись Арбузова: сочный «хрум» (откусили арбуз) + три ноты-маримба. out/sting.wav (≈1,6 с)."""
import numpy as np, wave
sr = 48000; out = np.zeros(int(sr * 1.7))
rng = np.random.default_rng(7)
def add(sig, t): i = int(t * sr); out[i:i + len(sig)] += sig[:len(out) - i]
# хрум: три коротких хрустящих шумовых удара с «сочным» низом
for k, t in enumerate([0.0, 0.07, 0.15]):
    n = int(sr * .09); x = rng.standard_normal(n)
    x = np.convolve(x, np.ones(3) / 3, "same") - np.convolve(x, np.ones(40) / 40, "same")     # грубый полосовой 1–8 кГц
    env = np.exp(-np.linspace(0, 9, n)) * (1 - .25 * k)
    juice = np.sin(2 * np.pi * (140 - 40 * np.linspace(0, 1, n)) * np.arange(n) / sr) * np.exp(-np.linspace(0, 6, n)) * .5
    add(.9 * x * env + juice, t)
# маримба: до–ми–соль (C5 E5 G5) + октава вверх
for f, t in [(523.25, .38), (659.25, .52), (783.99, .66), (1046.5, .80)]:
    n = int(sr * .8); tt = np.arange(n) / sr
    s = (np.sin(2 * np.pi * f * tt) + .35 * np.sin(2 * np.pi * f * 4 * tt) * np.exp(-tt * 30)) * np.exp(-tt * 6)
    add(.55 * s, t)
out = out / np.abs(out).max() * .89
with wave.open("out/sting.wav", "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes((out * 32767).astype(np.int16).tobytes())
