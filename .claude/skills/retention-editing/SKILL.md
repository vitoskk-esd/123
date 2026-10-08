---
name: retention-editing
description: "Editing for viewer retention. Long-form YouTube uses the 'desk' language (youtube/kit/desk.js): one canvas with windows, phone mockups, documents with a highlighter, live counters, a cursor, camera moves between objects, chapter stings, tactile UI sound, no karaoke captions or emoji. Reels/Shorts use the stimulation kit (youtube/kit/engine.js): punch-ins, whip/glitch transitions, word captions, stickers, bursts. Use whenever building or reviewing an edit, when the owner says it is 'simple', 'boring', 'как для рилса', 'не цепляет', or asks for more editing techniques. Pairs with youtube-longform (pipeline) and hyperframes-animation (motion recipes)."
---

# Retention editing (монтаж на удержание)

## ⚠️ Long-form ≠ reel (owner, 2026-10-07, video #1 v3: «монтаж очень простой, как для рилса»)

The v2/v3 layers below (punch every 1.6 s, karaoke captions, emoji stickers, bursts, shake, flashes,
neon grid) are **short-form stimulation**. On a 6–15 min YouTube video they read as a reel. Studied
5 tutorials + a frame-by-frame breakdown of a 153k finance long-form — notes in
`youtube/references/tutorials.md`. For long-form use the **desk language** (`youtube/kit/desk.js`,
`desk.css`, example `youtube/01-bank-tierlist/build_desk.py`):

| | Long-form (desk.js) | Reel / Shorts (engine.js) |
|---|---|---|
| Cut / camera move | on a change of thought, shot lives 3–8 s | every 1.5–2 s |
| Something moves inside the shot | every 1.5–2.5 s: highlighter, cursor click, push, counter, new window, new row | — |
| Text | keywords ≤ 3 words and numbers inside the graphics; full subtitles via YouTube CC (.srt) | word-by-word karaoke captions |
| Graphics | one canvas, macOS-style windows, phone with bank app and pushes, paper documents with yellow highlighter, odometer counters, tier board, diagrams | centred card, emoji, stickers |
| Proof | the source itself in a window (post, conditions, document), marker over the exact phrase | flash of a screenshot |
| Continuity | objects stay on the canvas and move (board slides left, criteria come in on the right); camera pans to the next "station"; zoom-through into the board row before a chapter sting | hard scene swaps |
| B-roll | stock in a window with source credit, packs of 3–6 s shots | full-screen slams |
| Memes | rare: 1 per 1–1.5 min, small window as a reaction | in every block |
| Sound | quiet bed per chapter, tactile UI (window lands, click, push chime, marker, stamp), pan air on camera moves, riser only before a chapter/reveal, music stops for a key moment | whoosh on every cut, risers in a row |
| Chapters | 2–3 s sting (tier letter + title) + lower-third «Уровень D · …» | — |

desk.js objects: `win` (bodies `doc`, `frames`, `img`, `yt`, `tg`, `board` (+`unblur` per row, `focus`), `crit`, `dots`, `gauge`,
`rows` (checklist/comparison rows with ✓/✕ marks), `cats` (category cards with thumbnails, `sel`, `hl`), `cap` (bar hitting a limit), `html`),
`label` (heavy name plate for a key idea: kicker + title + chips), `takeaway` (one-line block conclusion),
`phone` (balance counter, rows, pushes, banner, button), `text` (word-timed keywords), `num` (odometer),
`cursor` (clicks), `stamp`, `bank` (logo card, blur for open loops), `sting` (chapter), `lower` (lower third).
Every object has `kf` keyframes (x, y, w, h, s, r, ry, o) → moves smoothly; `cam` keyframes move the camera.
`build_desk.py` prints the event gap: the longest pause without any change should be < 2.5 s except stings.

2026 additions (most-liked tutorials, `youtube/references/tutorials.md` «Волна 2026»):
- **A picture for every script line** — check the timeline against `script.md` line by line.
- **Labels on screen**: name plates for key ideas («ловушка баллов», «правило 31 дня») — heavy animated style;
  regular text stays simple (typography system: 2–3 weights of one style).
- **Close each block visually**: one-line takeaway card + the tier board gets its new row (callback to the
  board from the hook).
- **Texture** (grain, paper, halftone) so screens don't look flat; **outro loops** into the next video via end screen.

Workflow: `python build_desk.py` → `python extract_desk.py` (video frames for windows) → `python build_desk.py`
→ stills sheet (`node render.js --page desk.html --stills …`) → audio `node ../kit/audio.js timeline_desk.js music_desk.wav`
→ render chunks in parallel → `mix.sh`.

---

# Reel / Shorts kit (engine.js) — v2/v3 notes

Owner's verdict on video #1 v1 (2026-10-07): «слишком просто, много моментов, когда зрителю
скучно; кадры почти каждые 2 секунды должны меняться». v1 had one animated scene per 4.5 s.
v2 fixed it with the layers below — use them by default on every video.

## The rule

**Something visibly changes at least every 2 s** (target 0.7–1.5 s on average). A "change" is
any of: new scene, camera punch, new caption chunk, element pop, sticker, burst, flash. Check it:
`build_timeline.py` prints "визуальных событий N, в среднем каждые X с, самая длинная пауза Y с";
Y > 2.5 s is a bug unless it's a deliberate dramatic hold (warning stamp, tier title).

## Layers (all in youtube/kit/engine.js, data from build_timeline.py)

| Layer | What | Data in TL | Notes |
|---|---|---|---|
| Scene | one idea per 2–6 s, one of 13 types | `scenes` | still anchored to spoken words |
| Transition | per scene: `whip`/`slide`/`zoom`/`blur`/`glitch`/`flash` | `scene.tr`, `scene.dir` | tier titles = glitch, «Что делать?» = flash, big words = zoom, others rotate; direction alternates |
| Camera | punch-in / reframe on a spoken word every ~1.6–2 s, 0.14 s snap, micro drift | `cam` [{t,s,x,y,r}] | 5 framings (scale 1.0–1.16, x ±70, tilt ±1°); big-text scenes only pulse 1.0↔1.06 |
| Shake | damped shake on impacts | `shake` [{t,a}] | tier titles, warning stamp, money reveal, total |
| Captions | 2–4 words, current word green + bigger, spoken words dim→white | `caps` | from Whisper words with an index→fix map (`CAP_FIX`); never on big-text scenes; ≤ 24 chars per chunk |
| Stickers | reaction emoji pops in a corner on punchlines, lives 1.5 s | `stickers` | ~1 per 15 s; corners rotate; tie to a word (`REACT` list) |
| Bursts | 16 emoji particles, ballistic | `bursts` | money moments only (💰/🪙/💵) |
| Flash | white frame 0.2 s | `flash`, `tr:"flash"` | tier changes |
| Tint | grid + horizon colour per tier | `tint` | D red, C orange, B yellow, A blue, S purple, total green |
| Grain | 7 % film noise, shifts per frame | — | always on, kills the "flat vector" look |
| Progress | bar at the bottom with chapter ticks | `chapters` | viewer sees how much is left |
| Tier bar | D C B A S, current lit | `tier` | tier-list format only |
| Marker | highlighter sweeps under icon titles | engine | automatic |

## Inserts: memes and B-roll (v3 — owner: «посмотри ролики на ютубе, там мемы, картинки»)

Top niche video (H1_a3qg3cT4, 103k views, breakdown in `youtube/references/H1_a3qg3cT4.md`) cuts to an
insert on every emotion: memes, real footage, screenshots, 2–4 s each. Ours (`build_timeline.py` → `INS`):

- **Meme** (`type: meme`): imgflip template in `youtube/assets/memes/` (Drake, Gru's Plan, Expanding Brain,
  Distracted Boyfriend, Two Buttons, Trade Offer, Waiting Skeleton, Epic Handshake, Is This A Pigeon,
  Change My Mind, Always Has Been), Russian labels in % boxes that pop on the beat, white card, slight tilt,
  slam-in + bass «boom». Template images are fine; **no film/TV/streamer clips** (Content ID).
- **B-roll** (`type: broll`): Pexels stock via `vidiq_generate_broll` (1 credit = 4 clips, mp4 link + author),
  saved to `youtube/assets/broll/` (gitignored; `list.tsv` + `CREDITS.md` kept; credit authors in the
  description). `extract_broll.py` cuts frames to `out/bfr/<id>/`; the engine flips `<img>` per frame and
  waits for decode. Full screen, darkened, big slam label bottom-left, slow zoom, invert-glitch or whip in.
- Phrase → insert: money → cash counting; lottery → casino; «crowd» → crowd; burned points → burning paper;
  absurd categories → cows / yacht / tractor; purchase → card terminal; friends → students; scammers → hacker;
  criminal liability → handcuffs; courier → courier; «only a phone» → surprised person with phone.
- Inserts split the host scene (the rest continues with a zoom-in); no fragment shorter than 0.8 s.
- Stickers inside a B-roll go top-right, inside a meme to the side.

## Sound follows picture

Every visual event gets a sound (`kit/audio.js`): whoosh on scene cuts, **swish** on camera
punches, **pop** on element/sticker pops, **riser** 1.1 s into each tier title + **impact**, **glitch**
crackle on glitch transitions, **coin** on money and bursts. Music: intro (pad) → main (beat) →
break (warnings) → main.

## Writing captions right

- Whisper misspells names and slang («Ураус хип», «УТП», «терлист», «самознание»). Dump
  `out/words_final.json` with indices and fill `CAP_FIX` (index → text, "" hides a word, e.g. a
  stub that was cut). Read the whole caption text once before rendering.
- Brand names exactly: Т-Банк, Альфа-Банк, ОТП Банк, Уралсиб.

## Review checklist (before sending a preview)

- Contact sheet of a still per scene (`render.js --stills …`) — no overflow, captions don't cover content
  (`.sc` has padding-bottom for the caption band).
- Stills at random times inside long scenes — camera framing never crops key text.
- The event-gap stat from `build_timeline.py`.
- Render the first 60 s with sound and send it before the full render.
- Readability lint: `node ../kit/lint_desk.js desk.html 0.5 22` — fix every text that stays < 22 px on
  screen for ≥ 1 s (raise font or zoom the camera in) and every text that overflows its plate.

## Motion craft (owner's reel with agent skills, 2026-10-08 — full notes: `youtube/references/agent-skills.md`)

From HyperFrames (HeyGen), Emil Kowalski's animation skills, impeccable, taste-skill, Remotion skills:
- Ease-out on enter/exit, ease-in-out for moves on screen, never ease-in on an entrance; exit faster than enter.
- Never enter from scale(0) (.9–.97 + fade); stagger 30–80 ms, a group ≤ 0.5 s.
- Motion blur peaks at max speed, 0 at rest — `desk.js` now does it automatically for camera moves
  (`TL.mblur=false` to switch off) and clears a 10 px blur on entrances (`TL.blurIn=false`).
- Velocity-matched cuts (out accelerates + blur, in decelerates + blur clears) for chapter changes;
  1–2 «big» transitions (flash/zoom-through) per video, for the hero reveal and CTA only.
- ≥ 3 different eases/directions per scene; give each element a motion verb before building.
- Video type scale on screen: headline 64–120, body 28–42, labels ≥ 18–24 px; extreme weight contrast;
  tabular-nums on counters; decorative opacity 12–25 % (under 10 % is invisible); 2–4 px borders.
- No full-screen linear gradients on dark backgrounds (H.264 banding) — radial glows only.

## Next techniques to add (not yet in the engine)

From the niche reference: focus frame (red dashed box) on screenshots of offers, money-flow infographic with
arrows, formula card (1 000 000 / 11 500 = 86 человек), highlighter over a law excerpt, 2.5D collage
(person with a bank logo as head), owner's own POV phone footage in the hook.


Speed-ramped zoom-through between chapters, split-flap / slot counters for amounts
(`hyperframes-animation` rules `vertical-spring-ticker`, `counting-dynamic-scale`), hand-drawn
circle/underline markers on numbers (`css-marker-patterns`), 3D card flip transitions (`transitions/css-3d.md`),
screen-recording B-roll of the bank apps (owner's own phone, personal data blurred), meme-style
freeze-frame + zoom on a punchline.
