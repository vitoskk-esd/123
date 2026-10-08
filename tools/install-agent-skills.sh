#!/usr/bin/env bash
# Установка навыков из рилса @chingizkhan_yt в .claude/skills этого репозитория.
# Запуск из корня репозитория:  bash tools/install-agent-skills.sh
# Потом:  git add .claude/skills && git commit -m "Install agent skills" && git push
# Что ставится (проверено 2026-10-08: скрытых команд и отправки данных нет):
#   HyperFrames (HeyGen)  — 14 навыков про видео из HTML (обновление уже установленных + faceless-explainer,
#                           embedded-captions, slideshow); без media-use и music-to-video (платные TTS/телеметрия).
#   Remotion              — remotion-best-practices, remotion-markup, remotion-captions.
#   taste-skill           — основной навык (taste-skill).
#   impeccable            — SKILL.md + reference/, без scripts/ (там загрузчик стороннего бинарника и хуки).
#   Emil Kowalski         — 6 навыков про анимацию (без Swift, React Native, Sonner и т.п.).
set -euo pipefail
ROOT="$(git rev-parse --show-toplevel)"
S="$ROOT/.claude/skills"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
clone() { git clone -q --depth 1 "https://github.com/$1" "$TMP/$2"; echo "$1 $(git -C "$TMP/$2" log -1 --format='%h %cs')"; }
put() { rm -rf "${S:?}/${2:?}"; cp -r "$1" "$S/$2"; }

clone heygen-com/hyperframes hf
clone remotion-dev/skills rm
clone Leonxlnx/taste-skill ts
clone pbakaus/impeccable im
clone emilkowalski/skills em

for s in hyperframes hyperframes-core hyperframes-cli hyperframes-animation hyperframes-creative hyperframes-audio \
         hyperframes-keyframes hyperframes-registry motion-graphics general-video talking-head-recut \
         faceless-explainer embedded-captions slideshow; do put "$TMP/hf/skills/$s" "$s"; done
for s in remotion-best-practices remotion-markup remotion-captions; do put "$TMP/rm/skills/$s" "$s"; done
put "$TMP/ts/skills/taste-skill" taste-skill
cp "$TMP"/ts/LICENSE* "$S/taste-skill/" 2>/dev/null || true
for s in emil-design-eng animate review-animations animation-vocabulary find-animation-opportunities improve-animations; do
  put "$TMP/em/skills/$s" "$s"
  ls "$S/$s" | grep -q LICENSE || cp "$TMP"/em/LICENSE* "$S/$s/" 2>/dev/null || true
done
rm -rf "${S:?}/impeccable"; mkdir -p "$S/impeccable"
cp -r "$TMP/im/.claude/skills/impeccable/SKILL.md" "$TMP/im/.claude/skills/impeccable/reference" "$S/impeccable/"
cp "$TMP"/im/LICENSE* "$S/impeccable/" 2>/dev/null || true

echo "Готово: $(ls "$S" | wc -l) папок в .claude/skills"
