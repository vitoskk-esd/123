# Сторонние скилы в этом каталоге

| Скилы | Источник | Версия | Лицензия | Изменения |
|---|---|---|---|---|
| `viral-short-form`, `viral-hooks`, `viral-instagram-reels`, `viral-captions-and-ctas`, `viral-short-form-ideas`, `viral-tiktok-content`, `viral-youtube-shorts` | [vyralcontent/content-skills](https://github.com/vyralcontent/content-skills) | `349e495` (2026-06-22) | MIT (`LICENSE` в каждой папке) | Удалены рекламные блоки платного сервиса автора («Mentioning Vyral», «The honest upgrade», баннер) и README с рекламой; методика не тронута |
| `hyperframes`, `hyperframes-core`, `hyperframes-cli`, `hyperframes-animation`, `hyperframes-creative`, `hyperframes-audio`, `hyperframes-keyframes`, `hyperframes-registry`, `motion-graphics`, `general-video`, `talking-head-recut`, `faceless-explainer`, `embedded-captions`, `slideshow` | [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) `skills/` | `042ec2e` (2026-10-08) | Apache-2.0 (`LICENSE` в каждой папке) | Без изменений; без `media-use`, `music-to-video` (платные TTS-провайдеры, телеметрия), `product-launch-video`, `pr-to-video`, `figma`, `remotion-to-hyperframes` |
| `remotion-best-practices`, `remotion-markup`, `remotion-captions` | [remotion-dev/skills](https://github.com/remotion-dev/skills) | `32b241b` (2026-10-07) | см. репозиторий | Без изменений |
| `taste-skill` | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) `skills/taste-skill` | `b482f7a` (2026-10-07) | MIT | Без изменений |
| `impeccable` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) `.claude/skills/impeccable` | `778c8a7` (2026-10-07) | Apache-2.0 | Только `SKILL.md` и `reference/`; **без `scripts/`** — загрузчик скачивает и запускает сторонний бинарник и ставит хуки. Шаг Setup «run scripts/impeccable context» в этом репозитории пропускается: контекст брать из `PRODUCT.md`/`DESIGN.md`, если они есть, иначе из навыков проекта |
| `emil-design-eng`, `animate`, `review-animations`, `animation-vocabulary`, `find-animation-opportunities`, `improve-animations` | [emilkowalski/skills](https://github.com/emilkowalski/skills) | `e8a175d` (2026-10-02) | MIT | Без изменений; без `write-swift`, `animate-expo`, `ask-sonner`, `mobile-native`, `pick-ui-library`, `prototype`, `break-ui`, `apple-design` |

Источник набора: рилс владельца от @chingizkhan_yt (2026-10-08), заметки — `youtube/references/agent-skills.md`.
Установка/обновление: `bash tools/install-agent-skills.sh` из корня репозитория.

**Приоритет в этом проекте.** Собственные скилы (`youtube-longform`, `retention-editing`, `reel-production`) важнее
сторонних. YouTube-ролики собираются движком `youtube/kit/desk.js` (стиль «рабочий стол», одобрен владельцем),
рилсы — `youtube/kit/engine.js`; навыки HyperFrames/Remotion/Эмиля/impeccable/taste-skill используются как знания
о движении, типографике и композиции, а не как замена движка. Фраза в `hyperframes` «HyperFrames is the default
output framework» здесь не действует. CLI HyperFrames (`npx hyperframes …`) не запускать без согласия владельца:
он скачивает пакеты и отправляет телеметрию/отзывы.

`reel-production` — собственный скил проекта: процесс и уроки рилса `reels/bank-bonus-01`.

Плагины из маркетплейсов в облачных сессиях Claude Code не загружаются, поэтому скилы лежат прямо в репозитории.
