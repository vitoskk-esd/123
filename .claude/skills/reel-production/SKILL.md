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
- Write voiceover phrases short; mark stress with `+` before the vowel when
  synthesis is used (`пл+атишь`).

## 2. Voice — owner's decision

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

## 5. QA before sending (do all, every time)

- Contact sheet of stills at each scene end and at 0.1 s: first frame must show
  the hook word, subtitles must match speech.
- Whisper the final voice track: text matches script (similarity ≥ 0.95), no
  pause > 0.6 s, ending word complete.
- Loudness of final mix ≈ -14 LUFS; video and audio durations equal.
- You cannot listen: say so, and report what was verified and how.

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
