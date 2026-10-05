#!/usr/bin/env bash
# Рендер визуалов «Без переплат» из src/*.html в out/*.png точно в размер.
# Нужен Chromium headless shell (в Playwright: chromium_headless_shell-*/chrome-linux/headless_shell).
set -euo pipefail
cd "$(dirname "$0")"
SHELL_BIN="${HEADLESS_SHELL:-$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell 2>/dev/null | tail -1)}"
mkdir -p out
render() {  # render файл.html ширина высота масштаб имя.png
  "$SHELL_BIN" --no-sandbox --disable-gpu --hide-scrollbars --force-device-scale-factor="$4" \
    --window-size="$2,$3" --virtual-time-budget=3000 --screenshot="out/$5" "file://$PWD/src/$1" >/dev/null 2>&1
  echo "out/$5"
}
render avatar.html       400  400  2 avatar-800x800.png
render cover-dark.html   1920 768  1 cover-dark-1920x768.png
render cover-light.html  1920 768  1 cover-light-1920x768.png
render post-card.html    1080 1350 1 post-card-1080x1350.png
render clip-cover.html   1080 1920 1 clip-cover-1080x1920.png
