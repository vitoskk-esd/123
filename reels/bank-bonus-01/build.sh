#!/usr/bin/env bash
# Полная сборка ролика с озвучкой: ./build.sh  ->  reel_final.mp4
# Нужны: python3 + edge-tts, faster-whisper, chatterbox-tts; node + playwright; ffmpeg.
set -e
cd "$(dirname "$0")"
"${PYTHON:-python3}" voice.py   # out/voice.wav + timeline.js под реальную речь (PYTHON — интерпретатор с chatterbox-tts)
node audio.js           # out/music_sfx.wav
node render.js          # out/frames.mp4
ffmpeg -y -v error -i out/frames.mp4 -i out/music_sfx.wav -map 0:v -map 1:a -c:v copy \
  -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart reel_bank_bonus_no_voice.mp4
./add_voice.sh out/voice.wav
