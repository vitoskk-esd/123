#!/usr/bin/env python3
"""Проба 3 (владелец: «всё ещё похоже на ИИ, добавь реалистичного»): образец — живая речь владельца (15 с из записи
ролика №2, только локально, не коммитится). D — синтез по живому образцу + «живая запись»; E — D, перекрашенный в «вариант 5»."""
import os, sys
sys.path.insert(0, "/home/user/123/tools"); sys.path.insert(0, "/home/user/123/reels/zero-card-07")
import tts_v5 as T, voice as V, torch, torchaudio
D = os.path.dirname(os.path.abspath(__file__)); O = os.path.join(D, "out3"); os.makedirs(O, exist_ok=True)
REF = "/tmp/claude-0/-home-user-123/8ca4fbe8-9858-5867-9610-cc1983112730/scratchpad/ref_3.0.wav"
PHR = ["Если бы мне снова было восемнадцать и на карте было ноль рублей, я бы начал с этих трёх шагов.",
       "И банки платили бы мне, а не наоборот.",
       "Шаг первый: дебетовая карта с бонусом за первые покупки. Кредитного риска нет вообще, а банк платит просто за то, что ты пришёл."]
partsD = []
for i, p in enumerate(PHR):
    f = T.synth(p, os.path.join(O, f"D{i}.wav"), seed=2, exaggeration=.55, cfg_weight=.4, temperature=.85, ref=REF)
    f16 = f[:-4] + ".16.wav"; os.system(f"ffmpeg -v error -y -i {f} -ar 16000 -ac 1 {f16}")
    got = V.transcribe(f16, "medium"); print(f"D{i}: {V.similarity(p, got):.2f} — {' '.join(w['w'] for w in got)}", flush=True)
    partsD.append(f)
T.humanize(partsD, os.path.join(O, "D.wav"))
os.system(f"ffmpeg -v error -y -i {os.path.join(O, 'D.wav')} -c:a aac -b:a 128k {os.path.join(D, 'proba3_D.m4a')}")
from chatterbox.vc import ChatterboxVC
vc = ChatterboxVC.from_pretrained("cpu"); vc.set_target_voice(V.VC_TARGET)
partsE = []
for i, f in enumerate(partsD):
    e = os.path.join(O, f"E{i}.wav"); torch.manual_seed(0); torchaudio.save(e, vc.generate(audio=f), vc.sr); partsE.append(e)
T.humanize(partsE, os.path.join(O, "E.wav"))
os.system(f"ffmpeg -v error -y -i {os.path.join(O, 'E.wav')} -c:a aac -b:a 128k {os.path.join(D, 'proba3_E.m4a')}")
print("готово", flush=True)
