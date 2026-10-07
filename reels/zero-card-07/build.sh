#!/usr/bin/env bash
# Полная сборка: ./build.sh  ->  reel_final.mp4 (своя музыка) и reel_final_no_music.mp4 (голос + SFX)
# PYTHON — интерпретатор с chatterbox-tts и faster-whisper (см. reels/setup_env.sh).
set -e
cd "$(dirname "$0")"
VOICE_REC="${VOICE_REC:-my_voice_script.m4a}" VOICE_FX="${VOICE_FX:-vc}" "${PYTHON:-python3}" voice.py
node audio.js                  # out/music_sfx.wav
NO_MUSIC=1 node audio.js       # out/sfx_only.wav
node render.js                 # out/frames.mp4
for v in music_sfx:reel_no_voice.mp4:reel_final.mp4 sfx_only:reel_sfx_no_voice.mp4:reel_final_no_music.mp4; do
  IFS=: read -r bed mid fin <<< "$v"
  ffmpeg -y -v error -i out/frames.mp4 -i "out/$bed.wav" -map 0:v -map 1:a -c:v copy \
    -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart "$mid"
  ./add_voice.sh out/voice.wav "$mid" "$fin"
done
