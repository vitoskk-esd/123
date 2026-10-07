---
name: retention-editing
description: "Editing for viewer retention in faceless YouTube videos and Reels made with the repo's HTML engine (youtube/kit/engine.js): a visual change every ≤ 2 s via camera punch-ins, varied transitions (whip, glitch, flash, zoom, slide, blur), kinetic word-synced captions, reaction stickers, particle bursts, screen shake, tier-colour tints, progress bar and matching SFX. Use whenever building or reviewing the edit of a long video or reel, when the owner says the edit is 'simple', 'boring', 'не цепляет', or asks for more editing techniques. Pairs with youtube-longform (pipeline) and hyperframes-animation (motion recipes)."
---

# Retention editing (монтаж на удержание)

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

## Next techniques to add (not yet in the engine)

Speed-ramped zoom-through between chapters, split-flap / slot counters for amounts
(`hyperframes-animation` rules `vertical-spring-ticker`, `counting-dynamic-scale`), hand-drawn
circle/underline markers on numbers (`css-marker-patterns`), 3D card flip transitions (`transitions/css-3d.md`),
screen-recording B-roll of the bank apps (owner's own phone, personal data blurred), meme-style
freeze-frame + zoom on a punchline.
