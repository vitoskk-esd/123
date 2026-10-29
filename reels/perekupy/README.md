# «Перекупы» — мультсериал для рилсов бота «Перехват»

Взрослая уличная комедия про перекупов: вертикальное видео 1080×1920, 40–48 с, голоса Gemini TTS, мат запикан.
Описание формата, решения владельца и план — в скилле `.claude/skills/perekupy-series/SKILL.md`.

## Что где
- `kit/` — движок: `engine.js` (сцена на GSAP с покадровой перемоткой), `render.js` (Playwright → кадры → mp4),
  `audio.js` (музыка и звуковые эффекты синтезом), `mix.sh` (голос + музыка + эффекты, −14 LUFS, версия без музыки),
  `fonts/` (Unbounded, Onest, JetBrains Mono, Tektur, Russo One — лицензия SIL OFL), `img/fox.png` (лис-маскот).
- `gtts/tts.py` — Gemini TTS; `asr.py` — Whisper (faster-whisper) для нарезки реплик и проверки текста.
- `toon/chars.js` — Толян, Серёга, машина; `toon/chars2.js` — Вика, Михалыч. `toon/bg_*.svg.part` — локации:
  `night` (авторынок ночью), `market`, `winter` (двор панелек зимой, снег), `sto` (СТО с подъёмником).
- `toon/series/` — сезон 1, рубрика «В объявлении / на деле»: сценарий `epNN.json` → один шаблон `ep.tpl.html` + `ep.js`
  с блоками «на деле» (`gauge` толщиномер, `doc` документ, `stat` счётчик, `chart` рынок, `dash` приборка).
- `toon/series2/` — сезон 2, разные рубрики: каркас `base.tpl.html` + `common.js/.css`, у серии своя сцена
  `epNN.js/.css` и сценарий `epNN.json` (реплики героев по порядку). `ep06` — «Схемы», `ep07` — «Торг».

## Как собрать серию (сезон 2)
```bash
cd kit && npm ci && cd ..                           # gsap
pip install faster-whisper numpy                    # нарезка по словам и проверка
cd toon/series2
python3 tts_batch.py ep06 ep07                      # озвучка пачки: один запрос на героя (voices.json); GEMINI_API_KEY в окружении
python3 place2.py ep06                              # реплики по словам, «блин» → «пииип», таймлайн и губы → vo/ep06/
python3 wordlevel.py vo/*_fast.wav                  # нет ли «проглоченных» TTS слов
./make2.sh ep06                                     # рендер (~7 мин) и микс → final/perekupy_ep06.mp4 и _nomusic.mp4
```
Сезон 1: `voice.sh epNN` → `place.py epNN` → `make.sh epNN` в `toon/series/`.
Кадры для проверки: `node ../../kit/render.js ep06.html stills 0.5,9,20 qa` и `python3 ../../kit/sheet.py qa qa/sheet.jpg 3`.

Лимит бесплатного Gemini TTS — около 10 запросов в день на модель; `tts_batch.py` сам переходит на запасную модель.
Всё сгенерированное (vo/, final/, mp4, wav, собранные epNN.html) — в `.gitignore`.
