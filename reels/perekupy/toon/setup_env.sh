#!/usr/bin/env bash
# bash reels/perekupy/toon/setup_env.sh — окружение для мультроликов (как «Перекупы») в НОВОМ контейнере / новой сессии.
# Ставит python-venv с распознаванием речи (faster-whisper) и проверяет инструменты. После — везде PY=~/reels-venv/bin/python.
# Chromium + Playwright и ffmpeg в облачной среде Claude уже стоят. Модели Whisper (small/medium) скачаются сами при первом запуске (~1,5 ГБ).
set -e
VENV="${VENV:-$HOME/reels-venv}"
[ -x "$VENV/bin/python" ] || python3 -m venv "$VENV"
"$VENV/bin/python" -m pip install -q --upgrade pip
"$VENV/bin/python" -m pip install -q faster-whisper numpy scipy pillow
command -v ffmpeg >/dev/null || { echo "нет ffmpeg: apt-get install -y ffmpeg"; exit 1; }
node -e "require('playwright')" 2>/dev/null || echo "внимание: нет playwright (в облаке Claude он предустановлен)"
"$VENV/bin/python" -c "import faster_whisper, numpy, scipy, PIL; print('venv ok:', '$VENV')"
