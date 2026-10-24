---
name: reel-production
description: "End-to-end production of short vertical videos (Reels / Shorts / TikTok) in this repo: script, voiceover, editing a voice recording, code-rendered visuals, subtitles synced to words, music/SFX mix, QA and delivery. Use for any task in reels/ — a new reel, re-voicing, re-cutting a recording, fixing sync or sound, changing the script. Encodes the owner's decisions and the pitfalls already hit on reel #1 (bank-bonus-01)."
---

# Reel production (this repo)

Reference builds: `reels/bank-bonus-01/` (README there describes every file) and
`reels/card-bonus-02/` (owner's voice + VC, newer `voice.py`; start new reels
from a copy of this one).
Pipeline: `voice.py` → `timeline.js` → `audio.js` (music+SFX) → `render.js`
(reel.html → frames) → mux → `add_voice.sh` → `reel_final.mp4`. Full rebuild: `build.sh`.

## Installed agent skills — which to load at which stage (owner, 2026-10-08)

Our own engines stay (`kit/desk.js` for YouTube, `kit/engine.js` for reels); these skills are knowledge for them.
| Stage | Load | For |
|---|---|---|
| Script / hook | `viral-hooks`, `viral-short-form` (reels), `hyperframes-creative` → `references/narration.md`, `story-spine.md` | opening line, beats, pace |
| Planning scenes | `hyperframes-creative` → `beat-direction.md`, `video-composition.md`, `house-style.md`; `find-animation-opportunities` | rhythm per section, motion verbs, density |
| Building motion | `hyperframes-animation` (`rules-index.md`, `techniques.md`, `transitions/`), `hyperframes-keyframes`, `animate`, `emil-design-eng` | curves, durations, transitions, camera moves |
| Type, colour, thumbnails, TG covers | `hyperframes-creative` → `typography.md`; `taste-skill`; `impeccable` (critique/typeset/colorize/bolder) | readable on a phone, not «AI-looking» |
| Sound | `hyperframes-audio` (ducking, voice carve, fades) | music under the voice |
| QA (every build) | `review-animations` on engine/timeline changes; `lint_desk.js`; `improve-animations` once per new engine feature | motion craft, small text |
Not used in our pipeline: `remotion-*` (we don't render with Remotion; only as reference for caption ideas), `embedded-captions` and
`talking-head-recut` (only if the owner films himself), `slideshow`, `hyperframes-cli`/`hyperframes-registry` (CLI not installed —
see THIRD_PARTY.md), `faceless-explainer`/`general-video`/`motion-graphics` workflows (HyperFrames projects; read for ideas only).

## 1. Script — load the writing skills first

- `viral-instagram-reels` (primary surface), `viral-hooks` for the first 3 s,
  `viral-captions-and-ctas` for on-screen text, caption and CTA,
  `viral-short-form-ideas` for topics. They are English and pattern-based:
  adapt examples to Russian speech and the Russian market.
- Structure that worked: hook in second 0 (word + flash) → promise → pattern
  break → pain → solution → CTA. New scene every 2–4 s. On-screen text must
  carry the idea with sound off.
- Finance/referral content in RF is advertising: «Реклама», advertiser, erid in
  posts; no bank names or exact amounts in video unless verified; disclaimer on
  screen. Never promise virality or income.
- Voice «E» mispronounces «дебетовая» as «дебютовая» (5 seeds of 5, 09.10; Whisper hears the owner fine) — say «обычная карта» in voice, keep «Дебетовая» on screen.
- Write voiceover phrases short; mark stress with `+` before the vowel when
  synthesis is used (`пл+атишь`).

## 1b. Instagram safety (owner's account lost reach after reel #6)

Reel #6 «20 000 за карту?» got 1 view; the next reel got 0 — likely not eligible
for recommendations. Meta does not publish trigger words, so treat these as risky
in speech, on-screen text and captions:
- «дроп(ы)», «продать/купить карту», «обнал», «схема», «заработок/деньги без
  вложений», «лёгкие деньги»; never show the scam offer itself («Плачу 20 000 ₽
  за карту») as a hook.
- Use instead: «мошенники», «как защитить карту», «бонусы банков новым
  клиентам», «кэшбэк», «акции банков». Anti-fraud topics are framed as
  education («как распознать мошенника»).
- Every reel gets a caption (what it is + keywords + CTA), never just the handle.
- Before publishing a sensitive topic, the owner can check «Статус аккаунта» and
  use trial reels.

**Reels v2 from reel #11 (owner, 2026-10-10):** scenes use the YouTube modes in 9:16 — scrapbook collage, search, editorial
infographic, AI assistant, night-office document with highlighter, phone close-up with **the owner's real Telegram channel**
(real name, avatar, 2–3 slightly blurred posts — ask him for them; never invent a channel name); cut every 1.5–2 s; captions
v2 (2–3 words, key word bigger and coloured). Lock-screen hook, swipe cards, marker board and the lock-screen loop were
rejected. Reference frames and rules: `reels/lab/experiments/2026-10-10-reels-v2/README.md`.

**Format frozen (owner, 2026-10-09: «рилсы отлично, оставь»):** reels = «Студия» 9:16 (`youtube/kit/studio.js`, full-screen scenes,
word captions, no progress bar) + voice «E». Don't redesign the reel format; engine experiments go to the YouTube engine
(`youtube/kit/yt/`), and `studio.js` gets only fixes so reels don't break.

## 2. Voice — owner's decision

**Since 2026-10-09 the default is voice «E» — no recording by the owner** (owner: «мне не нравится, что каждый раз
нужно записывать свой голос» → probes A–E → «мне нравится звук E»):

```bash
<python-with-chatterbox> tools/voice_e.py <reel>/phrases.txt <reel>/out/voice   # → out/voice/voice.wav, phrases.json
```

Per phrase: Chatterbox Multilingual TTS from a 15 s sample of the owner's *live* speech (prosody, not his timbre;
`scratchpad/ref_3.0.wav`, never committed; fallback `tools/voice_e_ref_v5.wav` — the same sample already converted to
«вариант 5») → Whisper check, best of 3 seeds → Chatterbox VC to «вариант 5» → `tts_v5.humanize` (varied pauses,
breaths, tempo jitter, room mic). Stress: RUAccent + `STRESS_FIX` in `tools/tts_v5.py`; owner's rule «на́чал/на́чала».
Check the logged stresses (`N ударения: …`) before trusting the take. No room tone and no progress bar (owner, 09.10: «убери фоновый шум… и полосу сверху») —
`humanize` has `room_db=None` by default and an `afftdn` denoiser; `TL.progress` stays off in reels. No synthetic breaths either, and every phrase is trimmed (`voice_e.trim`): TTS/VC
leave junk after the last word (babble, clicks, up to −4 dB) and clicks before the first one — owner, 09.10: «между фразами
слышатся посторонние звуки». The phrase check runs on the trimmed file, i.e. exactly what goes into the video. One line = one whole phrase; numbers in words.
First reel on it: `reels/first-steps-09/` (Studio 9:16).

**Clarity (owner, reel #12, 11.10: «слова в звуке не внятные и жуются»).** Whisper medium guesses smeared words, so the
`voice_e.py` check (medium, fuzzy) passed «chewed» takes. Measured with a weak ear (Whisper base/small, share of correct
words): TTS 0.972 → after VC 0.917; the `afftdn` + `aecho` chain and tempo jitter smear consonants too; the VC seed changes
the result (0.934…0.953 on one phrase). After `voice_e.py`, always run
`tools/voice_e_clear.py <reel>/out/voice` (2 best TTS takes × VC seeds 0–3, scored by Whisper small, glued with
`humanize(fx="clean", tempo=.96)`), then re-run `build.py words`. Report the small-model score before/after to the owner. On reel #12 the owner heard A (VC, strict selection, 0.935) and B (same TTS without VC, 0.963) and **chose A** — keep the «вариант 5» timbre; fix clarity by selection and wording (avoid «Ты о-», «ради бонуса»-type joints), not by dropping VC. The owner's own recording + VC (below) stays as the
alternative when he wants to record.

Earlier decision, kept for the recorded path:

The owner rejected every synthetic voice as "sounds like AI" (edge-tts Dmitry,
Microsoft multilingual, Chatterbox TTS incl. a clone of his voice). **Chosen:**
his own live reading + timbre replaced by Chatterbox VC to
`reels/bank-bonus-01/voice_target_v5.wav` ("variant 5"). Live intonation is the
point; do not "improve" it with TTS.

```bash
VOICE_REC=<file> VOICE_REC_EDIT=rec_edit.json VOICE_FX=vc \
  <python-with-chatterbox> voice.py && node audio.js && node render.js && …
```

Recordings (`my_voice*`) are private: gitignored, never commit them. Uploads
arrive under `/root/.claude/uploads/…`; copy into the reel folder.

## 3. Cutting a recording (stumbles, repeated takes)

1. Transcribe with **Whisper medium** + word timestamps (small mis-times short
   words: it once put «Стоп!» and «Банки» both at 0.0 s).
2. Map pauses: `silencedetect=n=-38dB:d=0.12`. Cut **inside pauses only**.
3. Keep the **last** take of a repeated phrase; drop false starts; re-transcribe
   suspicious long words in isolation (a 2 s «телеграмме» hid a broken take).
4. **Never end a cut at Whisper's word end** — soft endings («-сь», «-ть») and
   breath run 0.3–1 s longer. Check the RMS profile and cut where it falls below
   ~-45 dB. A clipped tail + VC at the file edge = "chewed" ending.
5. Last segment: 0.25 s fade-out and 0.6 s silence pad before VC.
6. Whisper hallucinates repeats on trailing silence: drop words that start
   after the real voice end (energy), and size the reel by the last real word.
7. Record the cut list in `rec_edit.json` with a note of what was removed.
8. Transcribe twice (Whisper VAD on and off) and keep the run closer to the
   script: on reel #2 VAD garbled the last phrase, on reel #1 it was needed.
9. If the owner adds a word while reading («кредитные карты»), add it to
   `SCRIPT` so subtitles match the speech.
10. Repeated takes often stack at the hardest line (reel #2: five takes of
    the credit-card line). Keep the last clean one, cut by pauses.

## 4. Visuals and sync

- `reel.html` animations are anchored to words via `TIMELINE.W(scene, "слово")`,
  scene bounds via `S(i)`/`E(i)`; SFX are derived in `timeline.js`. Never put
  absolute seconds in animations.
- New reels may use HyperFrames (installed skills `hyperframes*`,
  `motion-graphics`, `talking-head-recut`; CLI `npx hyperframes`), which is the
  same HTML→video idea with a richer toolkit. Read `hyperframes` skill first.

## 4b. Timbre change (VC) quality

- VC can blur words on fast speech: reel #1 intelligibility 0.97 → 0.98,
  reel #2 0.98 → 0.91. Measure it every time (script similarity of the VC
  track vs the cleaned recording).
- `voice.py` runs VC `VC_TRIES` times (default 4) and keeps the most
  intelligible; timings don't change, so frames need no re-render, only remix.
- If the drop stays large, offer the owner the `formant` version as an
  alternative alongside (on reel #2 he still chose VC, "variant 5").
- Reel #4: whole-file VC garbled the hook and the CTA (0.87 vs 0.99 clean).
  Fix that works: `vc_by_phrases` — cut at pause midpoints (≥3 s pieces),
  VC each piece with 0.3 s context, best of `VC_TRIES` per piece by Whisper
  against that piece's script words, put back at the same samples → 0.98.
  It is now the default VC path in `reels/bank-calc-04/voice.py`; copy that
  file for new reels.
- Reel #5: VC garbles short isolated words between pauses («Коровы.»,
  «Верблюд.», «Ссылка в шапке») — 0.93 vs 0.98 clean even after 13 tries per
  piece; more seeds and wider context (0.6 s) barely help. When the script
  has one-word lines, ask the owner to read them in a phrase («Коровы — у меня
  даже кота нет»), or offer his natural voice as an alternative alongside VC.
  Run VC jobs with a long background timeout (≥ 1 h): a 5-piece re-run hit
  the 30-min default and was killed.

## 5. QA before sending (do all, every time)

- Contact sheet of stills at each scene end and at 0.1 s: first frame must show
  the hook word, subtitles must match speech.
- Whisper the final voice track: text matches script (similarity ≥ 0.95), no
  pause > 0.6 s, ending word complete.
- Loudness of final mix ≈ -14 LUFS; video and audio durations equal.
- You cannot listen: say so, and report what was verified and how.
- Music grid vs accents: with fixed 120 BPM from scene 1, impacts and swipes land
  on the beat only by chance (~50% within ±40 ms). Fitting tempo (100–140 BPM)
  and phase to the accents puts ~85% on the beat for any reel
  (`reels/lab/experiments/2026-10-07-beat-grid/beat_grid.js`). Verified by
  calculation only, not by ear: offer the owner both mixes to compare.

## 5b. First frame

- Frame 0 is what Instagram shows before playback: it must already read as the
  hook (title visible, no white flash). Reel #4 shipped with a flash at t=0 —
  found by `reels/lab/analyze.py`, fixed by flashing only on later beats.
- Run `python3 reels/lab/analyze.py reel_final.mp4 name` on every finished reel
  and look at `sheet_hook.jpg` before sending.
- Frame 0 must carry the whole hook, not its first two words (reel #4 showed
  «СКОЛЬКО БАНК» until 2.0 s). Glance test: view frame 0 at 25% size — only
  text from ~90 px and 1–2 big elements survive; small UI copy is texture
  (`reels/lab/experiments/2026-10-06-hook-frame0`). For "taken from you /
  you can still get" topics a two-column contrast frame reads best muted.
- On-screen hook text: 3–7 words that sharpen the spoken line, not repeat it
  (meme formats like reel #5 are the exception).

## 5c. Transitions

- Shape match cut: when neighbouring scenes have objects of the same shape (coin → the
  «0» of «0 ₽», card → phone screen), align their centre and size and morph 0.3–0.4 s
  (easeInOut); change the headline with a hard cut in the middle of the morph. Never
  cross-fade two headlines: both are unreadable for ~0.3 s; a whip blur loses ~0.23 s
  of text. Measured on frames in `reels/lab/experiments/2026-10-08-match-cut` (not yet
  on stats or by ear).
- VC input: convert the voice from the edit WITHOUT the denoiser — on the long video
  (07.10) denoised input garbled words (0.58→0.79, 0.68→0.94 on the worst pieces).

## 5d. Motion craft from agent skills (owner's reel, 2026-10-08)

Rules from HyperFrames / Emil Kowalski / impeccable / taste-skill / Remotion, rewritten for our HTML→MP4
engines — full list in `youtube/references/agent-skills.md`. For vertical 1080×1920 reels:
- On-screen text: headline ≥ 90 px, body ≥ 32 px, nothing < 24 px; 3 s on screen must read in 2 s.
- Ease-out for entrances (`cubic-bezier(0.23,1,0.32,1)`), never ease-in on an entrance; exits faster;
  never from scale(0); stagger 30–80 ms. Fast moves get motion blur that peaks mid-move and is 0 at rest.
- Whip/zoom transitions only as velocity-matched pairs; 1–2 big transitions per reel, hard cuts on the beat
  for lists. Keep the shape match cut rule from §5c (headlines never cross-fade).
- Every background decoration moves slowly (breathe/drift); one accent colour per scene; no em-dash
  decoration in captions; tabular-nums on counting amounts.

## 6. Environment gotchas

- edge-tts pins certifi: override `edge_tts.communicate._SSL_CTX` with
  `/root/.ccr/ca-bundle.crt`; pass `proxy=$HTTPS_PROXY`.
- Chatterbox needs a venv with fresh setuptools (old Debian setuptools breaks
  the antlr4 wheel); torch CPU from download.pytorch.org.
- `pkill -f <pattern>` kills your own shell when the pattern is in the command
  line; wait on a marker file (`BUILD_EXIT` in a log) instead.
- Rendering ~1000 frames takes ~7 min; run it in the background.
- ElevenLabs engine exists in `voice.py` (needs `ELEVENLABS_API_KEY`), unused.
- `difflib.SequenceMatcher` needs `autojunk=False` on texts > 200 chars, or
  similarity collapses (reel #2 showed 0.05 for a correct transcript).
- edge-tts sometimes returns `NoAudioReceived` for a phrase (e.g. «…кредитные:
  если…»); a period instead of the colon fixed it. It is only for previews.
- Copying the sfx block in voice.py's `TEMPLATE`: check `timeline.js` loads
  (`node -e "require('./timeline.js')"`) — a doubled `};` broke it once.
- Anchors in `reel.html` must use words that exist in `SCRIPT`
  (`W()` throws otherwise); render stills right after editing the HTML.

**Arbuzov reels (owner, 14.10).** Engine `reels/arb-kit/` (story.js storyboard → `build_arb.py` → `reel.html` → `make_reel.sh`), voice №7.
Owner's path: «вяло» (slow push-ins only) → «слишком часто переходы» (a transition on every 1.4 s cut) → «используй этот скил» = the installed
`motion-graphics` / `hyperframes-animation` skills. Load `hyperframes-animation` → `transitions/overview.md` before touching reel motion:
one primary scene transition (push slide 0.35 s, outgoing and incoming move together) + 1–2 accents (zoom-through at the open and before the CTA);
inside a phrase no cuts — multi-phase camera stations (wide → object → Arbuzov's face → object, 1.6–2.4 s, 0.55 s eased moves + drift);
spring-pop entrances, stamps slam with shake, numbers as kinetic beat slam over the scene (coins only for ₽). Crisp flat look: bright
gradients, hard offset shadows, tube limbs (`ArbuzHD tube:true`), no grain.

## Рилсы-истории с Арбузовым (новый формат, владелец 15.10)
- Формат: Арбузов — парень (образ d01, `reels/arb-story-20/hf/d01.png`), проходит схемы с банками; рассказ от 3-го лица, голос №2 denis
  с интонацией (`arb-kit/narrator_voice.py`). Рисунки и живые вставки — Higgsfield (`tools/higgsfield/gen.py`, цены — бесплатный `/estimate`).
- Отзыв на первый монтаж (story.html: камера по рисункам + пуши/плашки/цифры/субтитры поверх): «нужно всё намного лучше,
  **без этих субтитров**… мне нужны **не шаблонные** ролики». Понравилось одно: **надпись от руки на доске** — «прикольный нюанс».
  Значит: никаких субтитров, UI-карточек, плашек и «цифр-слэмов» поверх кадра; текст — только внутри мира (маркер на доске,
  экран телефона в рисунке, записка), рукописные пометки — фирменный приём.
- Отзыв на рилс 20 v3 (16.10): «кадров стало больше — прикольно, но менялись слишком быстро, я как зритель не успевал» → план
  **2,5–4 с** (не 1,7), внутри — движение камеры, а не новая склейка. «Нужно максимально прорабатывать мелкие детали — если нужно больше
  фото, генерируй без проблем». «Стремимся к рисовке как у амоБлога — у них видео цельное, у нас пока сыро»: единый стиль и свет на весь рилс,
  одна цветокоррекция, сквозная музыка, мотивированные склейки. Понравилось: вставка-доска «ТЕОРИЯ» («разбавляет контент») — держать в каждом рилсе.
  **Каждый рилс — в новой обстановке**, не повторять кухню/комнату из прошлых серий.
- Рилс 21 (16.10): владелец заметил на пробном кадре столовой, что **гречка лежит прямо на подносе, а не в тарелке** — смотрит мелочи.
  Правило: перед использованием каждый кадр проверять крупно на бытовую логику (еда в посуде, руки держат предметы, ничего не висит
  в воздухе, текст не «каракули»); кадр-образец места (ref) проверять особенно — его ошибки копируются во все сцены. Исправлять точечной
  правкой Qwen edit (`"raw": true` в задании, ref = готовый кадр), а не перегенерацией. Модель сцен — Qwen Image 3 edit (проба 16.10:
  мир богаче, свет мягче, ближе к амоБлогу, чем у Grok).
- Рилс 22 (16.10, новый формат): владелец — «криво: экран телефона, ушло время; перечисляемые вещи должны быть В коробке, а не рядом».
  Причины и правила: (1) при смене позы (poses) у телефона свои углы экрана — движок обязан брать углы и верхний слой позы, а не исходного кадра;
  крупные цифры на экране (часы) — с запасом по ширине. (2) Предметы-слои кладём туда, куда их «кладут» по смыслу: размечаем проём
  контейнера по сетке, низ предмета прячем за передним бортом (clipY), падение начинаем ниже головы персонажа, чтобы не пролетало сквозь неё.
  Проверка: кадры stills.js в момент приземления каждого предмета и после смены позы.
- **Живое видео в каждом кадре (владелец 17–19.10).** «Наши рилсы похожи на комиксы… мне нужно, чтобы в каждом кадре было плавное и чётко
  прорисованное движение… текст и просто фото — не нужно, нужно живое видео». Значит: каждый план — клип Kling 3.0 (`clip_app`
  `kling-video/v3.0/pro/image-to-video`), действие задаём двумя ключевыми кадрами Qwen edit (`from` → `to` = `last_image_url`):
  предмет сначала в руках, потом в коробке — это в кадрах A/B, а не в надежде на промпт. Маркеров, плашек, неподвижных рисунков нет;
  экран телефона — отдельным крупным планом. Проба `reels/live-test` (v_box, 8 с, $0,76).
- **Плавность (владелец 19.10 о пробе: «движения не плавные, когда кладёт вещи — очень размыты»).** Замер `arb-kit/clip_qa.py`:
  (1) Kling рисовал «на двойках» — каждый рисунок держался 2 кадра (12 рисунков/с, рывки); так же у v04 рилса 22. Слова «hand-drawn
  animation» в промпте это провоцируют. (2) 4 действия за 8 с → резкие взмахи → смаз рук и предметов (≈ 0,5 с брака).
  Правила: действия — списком `"beats"` в задании клипа, не чаще одного на 3 с (gen.py не отправит клип с 4 действиями на 8 с);
  слова hand-drawn/cartoon animation, fast, quickly запрещены; к каждому промпту Kling 3.0 gen.py добавляет блок MOTION (24 уникальных
  рисунка в секунду, медленные короткие движения, без смаза, последняя секунда — спокойная пауза, а не замер).
  После генерации каждый клип — через `clip_qa.py`: «смаз»/«рывок» → перегенерировать; «двойки» → `arb-kit/smooth.py` (RIFE 4.26
  дорисовывает промежуточные кадры: на v_box двойки 99 % → 8 %, без «призраков»; ffmpeg minterpolate — нельзя, даёт призраки рук);
  замер в конце (последний кадр «прибит» ~0,7 с) — обрезать в монтаже.
- **Монтаж — по `kinetic-reel-edit` (владелец 19.10 прислал два рилса-референса: «хочу такой же монтаж»).** Берём их приёмы:
  пиксельные/глитч-переходы, панчи камеры, звук на каждое событие, крупный кинетический текст в кадре (белый + красный акцент,
  слово за персонажем). Но **текст — только 2–4 момента за ролик** (владелец 19.10: «не хочу, чтобы каждое слово вылазило как
  субтитры — круто пару раз или раза 4 за ролик в определённый момент»); в остальное время слов на экране нет, субтитров нет.
  Новые референсы разбирать по `ref-reel-analysis`. Под текстовые моменты на раскадровке оставлять свободное место.
- **Готовый рилс — владельцу в Телеграм файлом** (владелец 19.10): `python3 tools/tg_send.py <reel_1080p.mp4> "подпись"`.
  Токен бота — переменная окружения TELEGRAM_BOT_TOKEN (видна только в сессиях, открытых после её добавления); чат берётся из `/start`.
- **Стиль v2 и разнообразие (владелец 23.10, рилс 24 `reels/arb-scroll-24`).** «Хочу рисовку как у амоБлога — у них нет кривых кадров»
  и «хватит одного тусклого фона и одних форматов, везде дряхлая однушка и Арбузов». Разбор — `reels/lab/breakdowns/amo-vs-arb-2026-10-23.md`.
  Правила: стиль-промпт v2 из `arb-scroll-24/hf_jobs.json` (контур, насыщенный цвет, одна главная краска на план, крупный герой, мало значимых
  предметов; никаких «muted/desaturated»); **каждый план — новое место и своя краска**, чередовать форматы (сцена → экран кодом → метафора →
  сцена без Арбузова → крупная эмоция → закулисье → доска → покупка → ТГ → финал-метафора); в сценах без Арбузова образцом стиля давать
  кадр БЕЗ него (иначе Qwen раздаёт красные кепки и арбузные головы чужим героям — a07 рилса 24); каждый кадр A/B смотреть крупно до клипов.
- **Клипы: проверка глазами, не только clip_qa.** Лист из 7 кадров на клип: кепка на месте, руки/ноги не тонут и не множатся, фон не «отклеивается».
  Брак лечить окном src (взять чистые секунды), переделкой без конечного кадра (только мягкое движение) или наездом — но наезд не должен резать
  смысловой предмет (рилс 24: наезд срезал плюсы на доске; «тень» оказалась тенью героя — норма).
- **Текст моментов:** live_cut сам ужимает слово шире кадра (с учётом наезда); маска «за героем» путает бирюзовый/зелёный фон с головой —
  на зелёных и бирюзовых фонах ставить текст над головой без `behind`.
- **Ресурсы:** RIFE ≈ 7,5 мин на клип, два потока не быстрее; фоновые задачи до 2 ч — обработчик пишет клипы по одному, недописанный файл удалять.
  Тяжёлое (clips60, мастер live.mp4) — ссылками на /dev/shm. Пустой API-баланс Higgsfield gen.py теперь распознаёт и останавливается.
