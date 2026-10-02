#!/usr/bin/env bash
# Скачивает офлайн-синтезатор речи Piper и русский голос «Ирина» в alfa-promo/.tts
set -euo pipefail
DIR="$(cd "$(dirname "$0")/.." && pwd)/.tts"
mkdir -p "$DIR/ru"
cd "$DIR"
[ -x piper/piper ] || curl -sSL https://github.com/rhasspy/piper/releases/download/2023.11.14-2/piper_linux_x86_64.tar.gz | tar xz
[ -f ru/ru-irinia-medium.onnx ] || curl -sSL https://github.com/rhasspy/piper/releases/download/v0.0.2/voice-ru-irinia-medium.tar.gz | tar xz -C ru
echo "TTS готов: $DIR"
