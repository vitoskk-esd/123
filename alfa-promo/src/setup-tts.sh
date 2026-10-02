#!/usr/bin/env bash
# Скачивает офлайн-синтезатор речи Piper и русские голоса в alfa-promo/.tts:
# мужские ruslan / denis / dmitri (зеркало sherpa-onnx на GitHub) и женский irina.
set -euo pipefail
DIR="$(cd "$(dirname "$0")/.." && pwd)/.tts"
mkdir -p "$DIR/ru"
cd "$DIR"
[ -x piper/piper ] || curl -sSL https://github.com/rhasspy/piper/releases/download/2023.11.14-2/piper_linux_x86_64.tar.gz | tar xz
[ -f ru/ru-irinia-medium.onnx ] || curl -sSL https://github.com/rhasspy/piper/releases/download/v0.0.2/voice-ru-irinia-medium.tar.gz | tar xz -C ru
for v in ruslan denis dmitri; do
  d="vits-piper-ru_RU-$v-medium"
  [ -d "$d" ] || curl -sSL "https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/$d.tar.bz2" | tar xj
  # Модели сохранены как ONNX IR 9, а onnxruntime в Piper понимает максимум IR 8.
  # Операторы совместимы, поэтому достаточно поменять байт версии в заголовке.
  if [ ! -f "$d/ru_RU-$v-medium.ir8.onnx" ]; then
    python3 - "$d/ru_RU-$v-medium.onnx" <<'PY'
import sys
p = sys.argv[1]
b = bytearray(open(p, "rb").read())
assert b[0] == 0x08 and b[1] in (0x08, 0x09), "неожиданный заголовок ONNX"
b[1] = 0x08
open(p.replace(".onnx", ".ir8.onnx"), "wb").write(b)
PY
    cp "$d/ru_RU-$v-medium.onnx.json" "$d/ru_RU-$v-medium.ir8.onnx.json"
  fi
done
echo "TTS готов: $DIR"
