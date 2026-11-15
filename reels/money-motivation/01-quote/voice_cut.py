"""Сжимает длинные паузы голоса до PAUSE с, лёгкая обработка, пишет voice.wav и lines.json (начало/конец каждой строки)."""
import json, re, subprocess, sys
SRC, PAUSE, TEMPO = "voice/g_Charon.wav", 0.62, 1.06
log = subprocess.run(["ffmpeg","-hide_banner","-i",SRC,"-af","silencedetect=noise=-40dB:d=0.35","-f","null","-"],capture_output=True,text=True).stderr
st = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", log)]; en = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]
dur = float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",SRC],capture_output=True,text=True).stdout)
# речь = промежутки между тишинами; паузы короче 0.8 с оставляем (дыхание внутри строки)
sil = [(a,b) for a,b in zip(st,en) if b-a >= 0.8]
speech, t = [], 0.0
for a,b in sil: speech.append((t, a)); t = b
speech.append((t, dur))
lead = 0.25
parts = [(max(0, s - (0 if i == 0 else 0.12)), e + 0.12) for i,(s,e) in enumerate(speech)]
filt, labels, timeline, cur = [], [], [], lead
for i,(s,e) in enumerate(parts):
    filt.append(f"[0]atrim={s:.3f}:{e:.3f},asetpts=PTS-STARTPTS[p{i}]"); labels.append(f"[p{i}]")
    timeline.append((cur, cur + (e - s))); cur += (e - s) + (PAUSE if i < len(parts) - 1 else 0)
# тишина между кусками
chain = [f"aevalsrc=0:d={lead}:s=24000[l0]"] + [f"aevalsrc=0:d={PAUSE}:s=24000[g{i}]" for i in range(len(parts)-1)]
seq = "[l0]" + "".join(labels[i] + (f"[g{i}]" if i < len(parts)-1 else "") for i in range(len(parts)))
fc = ";".join(filt + chain) + f";{seq}concat=n={1 + 2*len(parts) - 1}:v=0:a=1,atempo={TEMPO},highpass=f=70,acompressor=threshold=-20dB:ratio=3:attack=8:release=120,aecho=0.8:0.5:60:0.12,apad=pad_dur=1.2,loudnorm=I=-16:TP=-1.5[out]"
subprocess.run(["ffmpeg","-v","error","-y","-i",SRC,"-filter_complex",fc,"-map","[out]","-ar","48000","voice.wav"],check=True)
lines = open("script.txt").read().strip().split("\n")
segs = [(a/TEMPO, b/TEMPO) for a,b in timeline]
print(len(segs), "кусков речи:", [(round(a,2), round(b,2)) for a,b in segs])
json.dump({"segments": segs, "lines": lines}, open("segments.json","w"), ensure_ascii=False, indent=1)
