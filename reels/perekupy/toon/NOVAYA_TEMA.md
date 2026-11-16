# Как делать такие же ролики на другую тему (новая ветка / новая сессия)

Движок мультроликов «Перекупов» — общий: персонажи, фоны, камера, озвучка, рендер, варианты. Новая тематика = новая папка серии
со своими героями, фонами, реквизитом и финальной фразой. Все правила монтажа владельца — в `.claude/skills/perekupy-series/SKILL.md`
(читать целиком перед первой серией) и `.claude/skills/reel-production/SKILL.md`.

## 0. Старт новой сессии
1. Ветка — от `claude/relaxed-volta-sbdy88` (в `main` движка может не быть): `git fetch origin claude/relaxed-volta-sbdy88 && git checkout -b <новая-ветка> origin/claude/relaxed-volta-sbdy88`.
2. Окружение: `bash reels/perekupy/toon/setup_env.sh`, дальше везде `PY=~/reels-venv/bin/python` (вместо `$S/venv/bin/python`).
3. Ключи озвучки (Gemini — бесплатно ~10 запросов в сутки, дальше OpenRouter) подставляет прокси облачной среды: новую сессию открывать
   в ТОЙ ЖЕ среде (environment), что и «Перекупы». Ключи в чат не писать.

## 1. Папка серии (шаблон — последняя серия, например `series64`)
```
cd reels/perekupy/toon && mkdir seriesNN && cd seriesNN
for f in shoot.js props.js base.tpl.html common.css common.js make2.sh place2.py build2.py fast_variants.py; do cp ../series64/$f .; done
sed -i 's/props73/propsXX/g' build2.py          # имя своего файла реквизита
```
- Фоны: `../gen_bgsNN.py` по образцу `gen_bgs65.py` (SVG 1080×1920, 3 новых фона на серию; имя фона не должно повторяться — проверить `grep` по `gen_bgs*.py`),
  затем `bgs.js`: `window.BGS={...}` из `../bg_<имя>.svg.part`.
- `propsXX.js` — герои (`ch("perekup"|"vika", …)` + перекраска), реквизит, карточка бота (`BOTH` + `CARD`), `TITLE`, финальная карточка `CTA`.
- Машины — вырезки в `../../kit/img/<марка>/`; перед использованием проверять крупно: без тени под кузовом, колёса целые, без белых клочков.

## 2. Порядок работы (правило владельца)
1. **Карусель первой**: `board.html` (5–6 слайдов A/B) → `node shoot.js board.html 6 board` → слайды владельцу. Видео — только после «собирай».
2. Сценарий `epXX.json` (15–17 реплик, 1:05–1:15; две реплики одного героя подряд нельзя — tts_pairs их не разрежет) + `voices.json` (голос Gemini, темп, профиль).
3. Озвучка и раскладка: `$PY ../tts_pairs.py epXX && $PY place2.py epXX && python3 ../voice_qa.py epXX` (шум ≤ 0,21; Whisper medium — сверить текст).
4. Сцены `epXX.js` (образец — `series64/ep73.js`): обложка кадр 0 = герой держит телефон с ботом + плашка `#title` (видна с 0, гаснет к 1,6 с),
   говорящий всегда в кадре (или в кружке PIP), последняя реплика — продающая фраза про продукт, последний кадр — только карточка.
5. `python3 build2.py epXX` → кадры `node ../../kit/render.js epXX.html stills 0.05,5,10 st` → проверить глазами.
6. Рендер: `MUSIC_VOL=0 PY=$PY bash make2.sh epXX`, затем `rm -f out_*.mp4 final/*.wav final/*_nomusic.mp4`.
7. Варианты b/c/h (h — розовый): заголовки в `fast_variants.py`, `PY=$PY python3 fast_variants.py epXX`.
8. Whisper medium по финалу (`asr.words(path, 'medium')`), отправить 4 ролика, коммит и пуш.

## 3. Что поменять под новую тему
- Рубрика сериала: плашка `ПЕРЕКУПЫ` и тег (`#tag`) в `base.tpl.html`/`common.css`, логотип лиса — `../../brand/`.
- Рассказчик (Лис, голос Charon) и сквозной антигерой (Жора) — свои; продающая фраза и карточка — про свой продукт.
- Завести свой скилл: копия `perekupy-series/SKILL.md` под новым именем, правила владельца сохранить.
