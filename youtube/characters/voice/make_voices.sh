#!/bin/bash
# Голос Арбузова: пять «характеров» из базовых голосов SpeechKit (raw/, base.py) — сдвиг высоты с формантами (asetrate),
# темп и тембр. out/v1..v5.wav, громкость −16 LUFS.
set -e; cd "$(dirname "$0")"; mkdir -p out
shift_v() {  # in out полутоны темп [доп. фильтры]
  local r; r=$(python3 -c "print(2**($3/12))")
  ffmpeg -v error -y -i "raw/$1.wav" -af "aresample=48000,asetrate=$(python3 -c "print(round(48000*$r))"),aresample=48000,atempo=$(python3 -c "print(round($4/$r,4))")${5:+,$5},highpass=f=70,loudnorm=I=-16:TP=-1.5" -ar 48000 "out/$2.wav"
}
shift_v denis  v1_sochny    2.0 1.03 "equalizer=f=220:t=q:w=1:g=2,equalizer=f=4500:t=q:w=1:g=2"
shift_v sergey v2_multik    4.0 1.06 "equalizer=f=3000:t=q:w=1:g=2"
shift_v vasily v3_barhat    1.0 1.00 "equalizer=f=160:t=q:w=1:g=3,equalizer=f=6000:t=q:w=1:g=-2"
shift_v anton  v4_derzky    3.0 1.10 "equalizer=f=2500:t=q:w=1:g=3"
shift_v ermil  v5_sochny_2x 2.5 1.04 "chorus=0.85:0.9:22:0.25:0.4:2,equalizer=f=250:t=q:w=1:g=2"
ls -la out
