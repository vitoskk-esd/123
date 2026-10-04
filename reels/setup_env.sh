#!/usr/bin/env bash
# Установка инструментов для сборки рилсов в новой облачной сессии (~5 минут).
# Создаёт venv ~/.venv-reels с torch (CPU), chatterbox-tts, faster-whisper, edge-tts.
# Использование: ./reels/setup_env.sh && export PYTHON=~/.venv-reels/bin/python
set -e
V="$HOME/.venv-reels"
[ -x "$V/bin/python" ] || python3 -m venv --system-site-packages "$V"
"$V/bin/pip" install -q -U pip setuptools wheel
"$V/bin/pip" install -q torch==2.6.0 torchaudio==2.6.0 --index-url https://download.pytorch.org/whl/cpu
"$V/bin/pip" install -q chatterbox-tts faster-whisper edge-tts --extra-index-url https://download.pytorch.org/whl/cpu
"$V/bin/python" -c "from chatterbox.vc import ChatterboxVC; import faster_whisper, edge_tts; print('reels env ok')"
