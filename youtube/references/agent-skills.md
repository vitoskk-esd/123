# Agent skills from the reel @chingizkhan_yt (2026-10-08)

Owner sent the reel https://www.instagram.com/reel/Dd9ZpETRx3C/ — caption: «Claude Code собирает ролик
без монтажа — 5 бесплатных плагинов: HyperFrames, Remotion, taste-skill, impeccable и скиллы Эмиля
Ковальски» (2 «бонусных» plugins are only in the author's Telegram — not reviewed).

Official sources (read on GitHub 2026-10-08; installing/cloning into the session was blocked by the
sandbox's safety check, so the rules below were read, filtered and rewritten for our engine — no third-party
code was copied or executed):

| Source | What it is | Useful for us |
|---|---|---|
| [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) (Apache-2.0) | HTML → MP4, GSAP timeline seeked per frame in headless Chrome — the same idea as our `desk.js`/`render.js` | motion rules, velocity-matched transitions, video type scale, density, beat planning, narration pace |
| [remotion-dev/skills](https://github.com/remotion-dev/skills) | React video framework skills | confirms our approach: animation from the frame number, never CSS transitions; clamp all interpolations; premount media 1 s early |
| [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) (MIT) | anti-«AI-look» web design | one accent per page; no purple gradients; no three equal cards; no em-dash in on-screen text |
| [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | design command set (critique/polish/animate/typeset/colorize) | motion only with a purpose; durations by role; no bounce/elastic by default; colour for hierarchy |
| [emilkowalski/skills](https://github.com/emilkowalski/skills) | animation craft (animate, review-animations) | exact curves, durations, «never from scale(0)», exit faster than enter, stagger 30–80 ms |

## Rules adopted (video, 1920×1080 and 1080×1920)

**Motion**
- Easing: enter/exit = ease-out (strong: `cubic-bezier(0.23,1,0.32,1)` or `(0.16,1,0.3,1)`), moving on screen =
  ease-in-out (`(0.77,0,0.175,1)`), constant motion = linear. Never ease-in on an entrance. Use ≥ 3 different
  eases/directions per scene: one shared «rise 30 px + fade» for everything reads as unchoreographed.
- Durations: UI feedback 100–160 ms; card/window entrance 300–600 ms; authored focal entrance 500–800 ms;
  exits faster than entrances (ours: in .55 s, out .4 s).
- Never enter from `scale(0)`: start at .9–.97 with opacity 0 (pops/stamps may overshoot from .3–.6).
- Stagger 30–80 ms per item, whole group ≤ 0.5 s.
- **Velocity-matched cuts:** outgoing accelerates (power2/3.in) + blur ramps up, incoming decelerates
  (power2/3.out) + blur clears; the fastest points meet at the cut. Presets: whip pan ±400 px, blur 24 px,
  .3 s in / .3 s out; zoom-through scale 1→1.2 out (.2 s) and .75→1 in (.5 s expo.out), blur 20 px.
- **Motion blur peaks at max speed and is 0 at rest** (now automatic in `desk.js`: camera blur from speed,
  ≤ 9 px; entrances clear from 10 px blur). Blur > 20 px is muddy; keep it bounded.
- Shader-style transitions (flash, light-leak, glitch, zoom) — 1–2 per video for the hero reveal and CTA;
  more flattens the impact. Hard cuts for rapid lists and on-beat edits.
- Static decoratives look dead: every background element gets slow ambient motion (breathe/drift/pulse),
  vary the pattern per chapter. Subtle motion reads as static at 30 fps — err toward visible.
- Audio-reactive: text/logos ≤ 4–5 % scale on bass, glow ≤ 30 %; no equalizer bars or strobing.
- Animate transforms and opacity only (+ filter/clip-path for reveals); deterministic (no random/Date).

**Type and layout for video**
- Sizes on screen (after camera zoom): headlines 64–120 px, body 28–42 px, labels 18–24 px; anything < 24 px
  needs a reason; < 20 px is unreadable on a phone. In-feed vertical: body ≥ 32, headline ≥ 90.
  `node ../kit/lint_desk.js desk.html 0.5 22` lists every text that stays under the threshold ≥ 1 s.
- 3 s on screen must be readable in 2 s: fewer words, bigger type; the first element to appear is the most important.
- Weight contrast extreme (300 vs 900, not 400 vs 700); tracking −0.03…−0.05 em on display sizes;
  on dark backgrounds +0.05–0.1 line-height. `tabular-nums` on every counter (now in `desk.css`).
- Composition: ≥ 2 focal points; hero text 60–80 % of frame width; anchor to edges/zones rather than a
  centred floating stack; dividers that draw (scaleX 0→1) create a visual path.
- Looks like a web page (avoid): centred stacks, web-size type, 1 px borders and faint shadows (use 2–4 px),
  dead grey neutrals, decorative opacity < 10 % (video: 12–25 %), one identical entrance on everything.
- Colour: one accent hue per scene/chapter, neutrals tinted toward it, no pure #000/#fff for large areas,
  no full-screen linear gradients on dark (they band in H.264 — use radial glows); green = money, red = risk stays.
- No em-dash «—» as decoration in on-screen text (taste-skill); in Russian keep it only where grammar needs it.

**Planning (beats)**
- Before building a section, write its rhythm in one line (e.g. fast-fast-SLOW-fast-hold) and give every
  element a motion verb (slams / slides / draws / counts up / types on / breathes). No verb → not designed yet.
- Energy peak where the narration's heaviest emphasis is. Count how many beats the time holds; don't cram.
- Narration: hook in the first 3 s (bold claim, question, contrast, number — vary the type);
  script should feel shorter than the video so visuals breathe; screen shows exact figures, voice may round.
