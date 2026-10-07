---
name: youtube-longform
description: "Production of full-length horizontal YouTube videos (6–15 min, 16:9) for the owner's channel about bank bonuses for 18–25: topic and title research, script with hook and open loops, owner's voice recording + VC, faceless motion-graphics editing in the style of the owner's chosen references, music/SFX, thumbnail, description, chapters, Shorts cut-downs, QA. Use for any task in youtube/ or any request for a 'ролик на ютуб', long-form video, YouTube script, thumbnail or title. For vertical Reels/Shorts use reel-production."
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

## 0. Approval gates (the owner wants to see before the full build)

1. Topic + 3 title options + thumbnail idea → owner picks.
2. Script (`script.md`) → owner reads, then records.
3. **Style frames**: 6–10 stills of the key scene types (hook, section title,
   list, number reveal, phone mockup, CTA) as one contact sheet → owner approves
   the look before the long render. (For reels he asked for a slideshow first.)
4. First 60 s rendered with sound → approval → full render.
Never spend hours of render before gates 3–4.

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
  repeat the title. 1280×720, made from HTML like TG covers (`tg-posts/*/shot.js`),
  3 variants; `vidiq_score_thumbnail` only after upload (needs a video id).

## 2. Script (`script.md`)

Length: the owner's reading pace × target minutes. References speak 143–174
words/min; until measured on the owner, assume ~150 → 8 min ≈ 1200 words.

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
  (YouTube has CC — upload the `.srt` from Whisper instead).
- Pace: **something changes every 1.5–3 s** (cut, zoom, text pop, new card);
  never a static frame > 4 s. Check with the scene-change counter (§6).
- Animations are anchored to words (`W(section, "слово")`), never absolute seconds.
- Assets: owner's own phone screenshots (personal data blurred), code-drawn
  graphics, free-licence stock, AI images. No film/TV/game clips and no
  copyrighted music — Content ID blocks monetization. Keep `assets/LICENSES.md`.

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
