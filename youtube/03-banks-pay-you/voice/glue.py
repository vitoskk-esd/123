#!/usr/bin/env python3
"""Склейка голоса ролика №3 из готовых фраз voice_e (voice/out/phrases.json): чисто и ровно, как у рилса #12 (fx="clean", темп 0,96).
  <python с chatterbox> voice/glue.py [N] → voice/out/voice.wav (N — первые N фраз, для черновой первой минуты)."""
import json, os, sys
sys.path.insert(0, "/home/user/123/tools"); sys.path.insert(0, "/home/user/123/reels/zero-card-07")
import tts_v5 as T
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "out")
meta = json.load(open(os.path.join(D, "phrases.json")))
n = int(sys.argv[1]) if len(sys.argv) > 1 else len(meta)
parts = [meta[str(i)]["e"] for i in range(n)]
print(T.humanize(parts, os.path.join(D, "voice.wav"), breath_db=None, fx="clean", tempo=.96))
