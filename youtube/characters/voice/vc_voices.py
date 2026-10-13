"""Голос Арбузова через перенос тембра (Chatterbox VC): живая интонация LiveTTS «vasily» + тембр-«маска», которой нет у
стандартных голосов (собран из обработанных проб out/v2, out/v1). Результат — out/v6_*.wav, out/v7_*.wav."""
import torchaudio, subprocess
from chatterbox.vc import ChatterboxVC
vc = ChatterboxVC.from_pretrained("cpu")
for src, tgt, name in [("raw/vasily.wav", "out/v2_multik.wav", "v6_zhivoy_multik"), ("raw/sergey.wav", "out/v1_sochny.wav", "v7_zhivoy_sochny")]:
    vc.set_target_voice(tgt)
    w = vc.generate(audio=src)
    torchaudio.save(f"out/{name}_raw.wav", w, vc.sr)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"out/{name}_raw.wav", "-af", "highpass=f=70,loudnorm=I=-16:TP=-1.5", "-ar", "48000", f"out/{name}.wav"], check=True)
    print(name, flush=True)
