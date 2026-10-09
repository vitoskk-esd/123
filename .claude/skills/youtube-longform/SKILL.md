---
name: youtube-longform
description: "Production of full-length horizontal YouTube videos (8–20 min, target 12–15, 16:9) for the owner's channel about bank bonuses for 18–25: topic and title research, script with hook and open loops, owner's voice recording + VC, faceless motion-graphics editing in the style of the owner's chosen references, music/SFX, thumbnail, description, chapters, Shorts cut-downs, QA. Use for any task in youtube/ or any request for a 'ролик на ютуб', long-form video, YouTube script, thumbnail or title. For vertical Reels/Shorts use reel-production."
---

# YouTube long-form production (this repo)

Style references the owner picked (2026-10-07): `youtube/references/` — read
`README.md` there first. Both are **faceless voice-over videos**: dark animated
background, content in rounded cards, big colour-coded text, a picture change
every 1.5–3 s, SFX on every change, open loops, Telegram CTA. Ref 1 is a
"full guide from zero" (10:37), ref 2 is a "tier list" (6:55).

Everything from `reel-production` still applies — **read it too**: owner's
voice + VC "variant 5" (§2), cutting a recording (§3), VC quality (§4b),
Instagram/safety wording (§1b — same words are risky on YouTube for this
niche), facts verified, no invented stats or stories, recordings never committed.

Layout: `youtube/<NN-slug>/` per video (e.g. `youtube/01-bonus-tierlist/`),
with `script.md`, `rec/` (gitignored), `sections/<NN>/` builds, `out/`
(gitignored), `thumb/`, `publish.md` (title, description, chapters, tags).

## Length rule (owner, 2026-10-08): every video from #2 on is **8–20 min, aim for 12–15**

- Pick topics that genuinely carry 12–15 min (several banks/steps/cases, a full walkthrough, a myth list
  with proof) — never pad a 6-minute idea. If a topic only holds < 8 min, merge it with a related one.
- Owner's measured pace (video #1, after cuts): **≈ 160 words/min** → 12 min ≈ 1 900 words,
  13 min ≈ 2 100, 15 min ≈ 2 400. Write the script to the target, then time a read-through.
- Long video ≠ slow video: sub-hook every ~3 min, open loop every 1.5–2 min, a chapter every 2–3 min
  (5–7 chapters), payoff of the title promise in the last third.
- Video #1 (bank tier list, ≈ 7 min) predates the rule and stays as is.

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

## 0. Approval gates (the owner wants to see before the full build)

1. Topic + 3 title options + thumbnail idea → owner picks.
2. Script (`script.md`) → owner reads, then records.
3. **Style frames**: 6–10 stills of the key scene types (hook, section title,
   list, number reveal, phone mockup, CTA) as one contact sheet → owner approves
   the look before the long render. (For reels he asked for a slideshow first.)
4. First 60 s rendered with sound → approval → full render.
Never spend hours of render before gates 3–4.

## 0b. Night production (owner, 2026-10-08: «вечером выбираю тему, визуалы, записываю голос — к утру ролик готов»)

**Evening, together with the owner (≈ 30–40 min of his time):**
1. Topic: he picks one (from the morning «3 темы» or his own). Claude replies with 3 titles + the script
   (`script.md` by the 2026 checklist in §2, ≈ 2 100 words for 13 min) within ~30 min.
2. Visuals: Claude sends a stills sheet of 6–8 key scenes in the desk style + 3–4 thumbnails;
   the owner picks the thumbnail and says what to change. Bank logos/real numbers only if verified.
   **Thumbnail rules from the owner (08.10):** it must hook — a metaphor or curiosity gap (mousetrap, bait on a hook,
   «48 % → 0 %»), not a plain statement of fact; give 6+ variants. **No system emoji** («дешёвые смайлики» look cheap and
   spoil the thumbnail). Any icon or object must be premium 3D: lit, with metal or glass materials, highlights and a real
   shadow. **Reference the owner approved («это то, что я искал, такие превью мне нравятся»):** `youtube/02-bank-earns/thumb/thumb11.html` (v=a) — a metaphor object (a gold bank card hanging on a 3D steel fishing hook threaded through a real hole), 2-line question headline «БОНУС — / НАЖИВКА?» (white plus gold gradient), one green benefit plate («как не клюнуть»), a deep underwater background with light rays, bubbles and grain. New thumbnails: this level of finish — a metaphor, a 3D object with materials, ≤ 6 words. **The message must not contradict the channel** (the owner, 08.10): the channel earns on referral bonuses, so a thumbnail never says «don't take bonuses» or «don't take the bait». The viewer is the smart one who takes the bonus and dodges the bank's hook. Final for video #2: a **real-3D** vault (`youtube/02-bank-earns/thumb/vault3d.html` — three.js r169 from `youtube/kit/vendor/three`, PBR metal and gold, RoomEnvironment reflections, soft shadows, bloom; render with `node kit/shot3d.js <page> <png>` from `youtube/`). The owner asked to «сделай 3д и картинку более реальной» — for hero objects prefer a three.js scene over CSS/SVG drawings.
3. Voice: he records the script in one file (retakes are fine — they are cut automatically) and sends it.
   **Claude starts the build immediately** — don't wait for the night routine.

**Night pipeline (resumable; state in `youtube/<NN-slug>/night.json`: stage, timestamps, notes):**
| Stage | Command / tool | ≈ time (7 min of speech; ×1.9 for 13 min) |
|---|---|---|
| 1. Transcribe in chunks, find retakes/false starts | Whisper medium by pieces (as `words_v2m.json`) + `audit_voice.py` spots | 15 min |
| 2. Edit voice without denoiser: cut retakes, keep the last clean take | `voice_v2.py edit` (CUTS from step 1) | 5 min |
| 3. VC «вариант 5», 4 attempts per piece, phrase-level best, phrase patches for anything < 0.93 | `voice_v2.py vc → composite → build → patch → build` | 2–2.5 h |
| 4. Voice audit: unclear words, repeats, meaning flips, joints | `audit_voice.py` — **repeat until clean; read every flag by hand** | 20 min ×2 |
| 5. Desk timeline from the words, stills check of every section; motion review (`review-animations` skill on desk.js/engine changes + new timeline kinds) and readability lint (`lint_desk.js`) | copy `build_desk.py` pattern, `render.js --stills` | 45 min |
| 6. Music/SFX, full render in 4 parallel chunks, mix −14 LUFS | `audio.js`, `render.js`, `mix.sh` | 75 min |
| 7. QA of the final file: re-transcribe the mix, frame sheet, loudness, duration; `publish.md` with chapters | | 15 min |
Whole pipeline ≈ 5 h for 7 min of speech, ≈ 9–9.5 h for 13 min, ≈ 10–11 h for 15 min. Latest voice
arrival for a 07:00 delivery: 8 min → 23:00, 12–13 min → 21:30, 15 min → 21:00, 20 min → 19:30.
If the voice comes later, say at once when the video will be ready. Speed-ups for long videos:
first VC pass with 2 attempts [(1.0,0),(.85,0)], extra attempts/patches only for pieces < 0.95;
render chunks while the final audit is read by hand. CPU has 4 cores: don't run two Whisper/VC jobs at once; the
reels lab at 02:47 only does light work (web search, small experiments) while the build runs.
**Morning deliverables:** `final.mp4` sent via SendUserFile, `thumbnail.jpg`, `publish.md` (title,
description with chapters, ad-marking placeholders), list of what was cut/fixed in the voice and anything
that needs a re-record (meaning-changing slips must be reported, never silently "fixed" with invented words).
**Never publish** — uploading to YouTube is the owner's action.

## 1. Topic, title, packaging (before the script)

- Formats proven by the references, adapted to the niche:
  - **Tier list**: «Я проверил бонусы всех банков для новых клиентов: тир-лист
    2026». Levels D→S, best at the end, each level its own neon colour.
  - **Full guide from zero**: «Как получать бонусы банков с нуля: вся механика».
  - **Mistakes / myths list**: «7 ошибок, из-за которых банк не платит бонус».
  - **Experiment / case**: «Месяц открывал карты ради бонусов — сколько вышло»
    (only with the owner's real numbers and screenshots).
- vidIQ (free plan, 150 cr/month, check `vidiq_balance` first):
  `vidiq_keyword_research` (ru, country RU) for the title phrase;
  `vidiq_outliers` (language `ru`, keyword) to see what over-performs;
  `vidiq_generate_titles` / `vidiq_score_title` (5 cr each) only for the final
  2–3 candidates. Budget a long video at ≤ 30 credits.
- Title: the promise + a number/year/brackets, ≤ 60 chars visible.
  Avoid «схема», «без вложений», «лёгкие деньги», «обнал», «дропы», «продать
  карту». Use «бонусы банков новым клиентам», «кэшбэк», «как получить», «2026».
- Thumbnail = 3 words max + one object/face-emoji + contrast colour; it must not
  repeat the title.
  Owner's taste (video #1, picked v8 of 10): a money result in big green
  (`+5 500 ₽`), before/after («было 0 ₽ → стало»), phone or bank cards as the
  object, real bank logos, short white plate («ТОЛЬКО ТЕЛЕФОН»). Liked: phone
  with push notifications, fanned bank cards, 0 → 5 500. Not picked: tier
  board, giant tier letter. Build 3, then 3–4 more remixing the ones he likes;
  keep the bottom-right corner clear (duration badge); check the 320×180 glance. 1280×720, made from HTML like TG covers (`tg-posts/*/shot.js`),
  3 variants; `vidiq_score_thumbnail` only after upload (needs a video id).

## 2. Script (`script.md`)

Length: target 12–15 min (see «Length rule»). Owner's pace ≈ 160 words/min (measured on video #1)
→ 13 min ≈ 2 100 words. References speak 143–174 words/min.

Before writing (Kallaway, `youtube/references/tutorials.md`): packaging first (idea = viewer's pain,
title fixed, thumbnail loose) → bullet outline where every point is checked for "is it new to the
viewer?" (if not — research more, don't record) → intro → body → outro.
- **Intro formula**: 1) click confirmation — the first line repeats and beats the title's promise;
  2) the common belief; 3) the contrarian take; 4) proof why to trust us (owner's real experience);
  5) the plan («разберу 5 уровней»). No greeting.
- **Body order**: 2nd-best point first, the best second, then the rest (value keeps rising);
  each point = context → application with examples → why it matters in the whole picture.
- **Re-hook between points**: «это важно, но без следующего пункта не сработает».
- **CTA native**: the Telegram resource as the solution inside a point, not an ad at the end.
- Audio is primary: viewers listen first — simple words, jokes, talk like to a friend.

**Script checklist 2026** (most-liked 2026 tutorials — Isaac, Tube Sensei, Mirko Vigna, DecodingYT;
details and what commenters praised: `youtube/references/tutorials.md` «Волна 2026»):
- [ ] Click confirmation in 3–6 s, spoken AND shown; then a curiosity gap (tease what's coming).
- [ ] Intro = viewer's pain → consequence → open question → specific numbered promise. No greeting.
- [ ] Surface problem + deeper problem (e.g. "which banks pay" / "how not to let the bank earn on you");
      viewer's point A → point B.
- [ ] Domino: every point ends with a question/limitation that the next point answers ("but…, therefore…").
- [ ] Viewer is the hero: their situation in second person ("оформил, купил, а бонус не пришёл — знакомо?").
- [ ] 2–3 labels for key ideas («ловушка баллов», «правило 31 дня»), one analogy per hard idea, stakes as loss.
- [ ] Every 30–45 s something shifts: question to viewer, owner's story, twist, joke, viewer's objection aloud.
- [ ] Experience before theory where possible; callbacks to earlier parts; each block closes with a one-line takeaway.
- [ ] Value rhythm unique → known → unique; a sub-hook every ~3 min.
- [ ] Outro: short recap + a need for the next video (end-screen loop), not just "like and subscribe".
- [ ] Edit notes in the script for every line (what is on screen); vary sentence length; final compression pass.
- [ ] Owner's own experience is the strongest "shock value" (doing > analysing > consuming) — real payouts,
      screenshots, mistakes. Never invent them. Don't cut useful complex parts just for retention.

Structure (both references):
1. **Hook 20–35 s**, five beats: pain question → why other guides are bad →
   right to speak (owner's real experience only) → full promise («от нуля до
   первого бонуса, что работает и что нет») → «досмотри до конца» → name →
   «Поехали». Tier-list variant: «Я проверил…» → 3 criteria on a card →
   blurred final tier list (open loop to the end).
2. **4–6 sections**, value grows towards the end. Each section: title card →
   point → proof (owner's case, screenshot, verified number) → viewer objection
   voiced («Ну я же студент, мне не одобрят…») → answer → one-line takeaway.
3. **Open loop every 1.5–2 min**: «но сначала момент, который решает всё»,
   «почему бонус может не прийти — разберём чуть позже». Write down in the
   script where each loop opens and where it closes; every loop must close.
4. **Mid CTA ~40–50%**: soft, useful («шаблон/список банков — в Telegram»),
   never a fake promise.
5. **Outro**: recap as 3 things («что бы я сказал себе в начале») → like/sub →
   Telegram «то, что не попало в видео» → question for comments.
- Spoken style: short sentences, "ты", no reading-voice; mark in the script
  where on-screen numbers/plashkas appear (`[ЦИФРА: 3 000 ₽]`, `[МЕМ: …]`).
- Finance = advertising in RF: referral links in the description need
  «Реклама», advertiser and erid; on-screen disclaimer «Условия на дату записи,
  проверяй на сайте банка»; bank names and amounts only if verified on the
  bank's site that week (write the source + date in `script.md`).

## 3. Voice

- **Default since 2026-10-09: voice «E», no recording** — `tools/voice_e.py` (reel-production §2): script lines →
  TTS from the owner's live-speech sample → VC «вариант 5» → humanize. ~2–3 min CPU per phrase: a 10-min video is ~120
  phrases ≈ 5–6 h, run in chunks under the 2 h background limit (the tool skips phrases already voiced). Whisper-check
  every phrase; stresses come from RUAccent + `STRESS_FIX` — add new problem words there, not in the script.
- Recorded path (when the owner wants to record):
- Owner records **per section** (`rec/sec01.m4a`, …): retakes stay local,
  VC and render run per section and in parallel, a bad take re-does one file.
- Each section goes through the reel pipeline: copy `reels/zero-card-07/voice.py`
  (`vc_by_phrases`, `rec_edit.json` cuts, Whisper medium with/without VAD).
  Long form: `VC_TRIES=2` first, re-try only pieces below 0.93. Run in the
  background with timeout 7200000 ms; ~10 min of speech is many VC pieces — time
  the first section and extrapolate before promising a deadline.
- Write `script.md` lines so they don't produce one-word phrases between pauses
  (VC garbles them, reel-production §4b).
- Loudness: voice-led mix at −14 LUFS integrated, music ducked under speech.

## 4. Visual system (16:9, 1920×1080, 30 fps)

**Since 2026-10-09 the direction for new long videos is «Ночной офис»** (owner picked documentary A from 3 prototypes, then the
night-office style from a 6-style carousel: `reels/lab/experiments/2026-10-09-yt-directions/a_doc.html?theme=night`). One big
night desk-world with real-looking objects (contract with highlighter, phone with the bank app, statement, monitor with charts,
index-card conclusions); the camera flies between them with motion blur and depth of field. Engine: `youtube/kit/yt/` (being
built, plan Y1–Y7 in `reels/lab/engine-roadmap.md`). «Студия» below stays for reels and for video #2; don't mix them.
Show style choices to the owner as a carousel of stills, not test videos (owner, 09.10).

**Since 2026-10-08 (video #2) the long-form engine is «Студия» v6 — `youtube/kit/studio.js` + `studio.css`.** Owner: desk.js
«выглядит базовым и простым… представь, что ты монтажёр с 10 годами стажа в Альфа-Банке / OpenAI» → studio v6 approved
(«монтаж нравится, но нужно ещё улучшать, учись каждый день»). Full-frame scenes, one designed composition per beat:
kinetic typography from the voice (mask-reveal per word, accent word with glow, auto-fit ≤ 1600 px), hero count-ups that grow
with the value, 3D phone and bank card, bar races, split comparisons, lists with marks, calendar, calc, chat/meme, Telegram CTA,
summary table, warning stamp; light orbs by meaning (green money / red loss / yellow rule), grain, vignette; cuts on the beat
(100 BPM), zoom/whip transitions with blur, flash + chromatic hit + camera kick on impacts; every scene has a slow push and drift.
Fonts must be preloaded (`document.fonts.load`) or auto-fit measures the fallback font. Demo: `youtube/02-bank-earns/studio_v6.mp4`.
desk.js stays for video #1 and Shorts cut-downs.

**Since v4 (2026-10-07) long-form is edited in the desk language — `youtube/kit/desk.js`, see
`retention-editing` §"Long-form ≠ reel".** The owner rejected v3 (engine.js: centred cards, karaoke
captions, emoji, punch every 1.6 s) as «как для рилса». The table below is the old v1–v3 scene list
(still used by engine.js for Shorts cut-downs).

Build once into `youtube/kit/` (HTML/CSS/JS, same `renderAt(t)` contract as
reels, or HyperFrames — read `hyperframes` skill first), then reuse per video.
Scene types, all from the references:

| Scene | Look |
|---|---|
| Background | dark navy/black, slow animated perspective grid + dust particles, vignette |
| Card | 16:9 window, radius 24 px, soft glow; holds screenshot/stock/meme; slow zoom 100→106% |
| Section title | black, huge bold word, neon underline, sub-bass hit |
| Interstitial | black, «ЧТО ДЕЛАТЬ?» / «НО ЕСТЬ НЮАНС» with glow, 0.8–1.2 s |
| Number reveal | counter rolls up, green for money, cash-register SFX |
| List | items 1-2-3 pop in with pop SFX, current item highlighted |
| Phone mockup | real screenshots in a phone frame, 3D tilt, tap circles, blur personal data |
| Chat mockup | Telegram/SMS bubbles typing in (send SFX) |
| Tier board | rows D/C/B/A/S coloured red/orange/yellow/blue/purple, items fly into rows |
| Split screen | 50/50 «до/после», «плохо/хорошо» |
| Reaction | own meme-card or sticker 1–2 s (never film/TV clips) |
| Lower CTA | «Ссылка на Telegram в описании ↓» bar |

- Text: bold grotesque (Montserrat Black / Unbounded, local fonts as in reels),
  white base, **green = money/success, red = error/risk**, key words on plates.
  On-screen text is a keyword, not a subtitle; full burned-in subtitles are off
  (YouTube has CC — upload the `.srt` from Whisper instead). v2/v3 broke this rule — don't repeat.
- Pace: **something changes every 1.5–3 s** (cut, zoom, text pop, new card);
  never a static frame > 4 s. Check with the scene-change counter (§6).
- Animations are anchored to words (`W(section, "слово")`), never absolute seconds.
- Assets: owner's own phone screenshots (personal data blurred), code-drawn
  graphics, free-licence stock, AI images. No film/TV/game clips and no
  copyrighted music — Content ID blocks monetization. Keep `assets/LICENSES.md`.

## 4b. Retention editing — mandatory

Read `retention-editing` skill before building a timeline. Long-form: shot 3–8 s, something moves
inside it every 1.5–2.5 s (highlighter, cursor, push, counter, new window), camera moves between
objects on a change of thought, keywords instead of subtitles, tactile UI sound.
History: v1 (one static scene per 4.5 s) — «скучно»; v2/v3 (reel stimulation) — «как для рилса».

## 5. Sound

- Background: dark electronic/phonk-style bed, synthesized as in reels
  `audio.js` or licence-free; changes energy per section, peaks at the finale.
- SFX: whoosh on every scene change, pop on text, cash register on money
  numbers, sub-bass drop on section titles, UI taps/send for mockups. Keep SFX
  2–4 dB under the voice; no SFX on top of a key word.
- Music ducks under voice (sidechain as in `add_voice.sh`).

## 6. Render and QA

- 10 min = 18 000 frames; reels render ~1000 frames / 7 min at 1080×1920 on
  this 4-CPU box → **render each section as its own process (2–3 in parallel)**,
  then concat with ffmpeg. Time section 1 first and tell the owner the estimate.
- Before the full render: stills contact sheet (gate 3) and the first 60 s (gate 4).
- QA every time:
  - Whisper of the final voice ≥ 0.95 similarity to `script.md`; no pause > 0.8 s.
  - Scene changes: `ffmpeg -vf "select='gt(scene,0.08)',showinfo"` → no gap > 4 s.
  - Frame at 0.1 s and 30 s readable at 25% size (thumbnail-size glance test).
  - −14 LUFS, audio/video durations equal, no clipping.
  - Every open loop closed; every number has a source line in `script.md`.
  - You cannot watch or listen: say what was checked and how.

## 7. Packaging (`publish.md`)

- Title (chosen at gate 1), description: first 2 lines = promise + Telegram link;
  then chapters (00:00 Вступление …, from section starts — exact, ≥ 3 chapters,
  first at 00:00), «Реклама» block for referral links, 3–5 hashtags.
- Tags from keyword research; `.srt` subtitles; end screen (last 20 s: next
  video + subscribe) — leave the last 20 s visually calm for it.
- «Altered or synthetic content» checkbox: the voice timbre is changed by AI —
  tick it when in doubt (cheap, avoids a strike).
- Publishing is the owner's action. Never upload or change YouTube via vidIQ
  without an explicit request.

## 8. Shorts / Reels from the long video

- One long video → 5–7 vertical clips (ref 1 does this). Pick self-contained
  30–45 s moments (a number reveal, a mistake, a tier verdict), re-render them in
  9:16 with the reel kit and the same voice segment; first frame must carry the
  hook (reel-production §5b). Shorts link to the long video ("related video").

## 9. After publishing

- At 48 h and 7 days: `vidiq_video_stats` / channel analytics (check credit cost
  first) → CTR, average view duration, retention dips. Log in
  `youtube/<NN-slug>/README.md` and add lessons here.

**Dead-screen check (09.10, video #2).** In an anchor-driven edit the scene opened on its anchor while its main element (a count,
a stamp, a list) arrived only with its own word, leaving up to 5 s of empty background. Fixes:
- `build_studio.py` starts each scene 0.35 s before its first element, and the previous scene holds until then;
- after rendering, find dark stretches longer than 1 s: `fps=4,signalstats` with YMAX < 130.

**Retake check with short windows (09.10, video #2).** Whisper on long chunks (~40 s) swallows repeated takes: «Запомни одну
мысль. Запомни одну мысль», «Возьмёшь на телефон 30 тысяч» ×2, «И первый самый рот. И первый самый дорогой». The owner caught
them after delivery. Before VC, always run `youtube/02-bank-earns/recheck_cuts.py` and `recheck_analyze.py`:
- source transcription in 3–7 s windows cut at quiet points;
- alignment against read.txt, flagging repeated n-grams within 20 s, insertions and cut-off words;
- the flag list is read by hand. "…" at a window boundary is a false alarm, and so is a repeat that the script itself
  contains. Every real flag is cut via CUTS/POST_CUTS.
