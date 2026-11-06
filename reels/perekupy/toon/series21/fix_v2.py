# venv/python fix_v2.py — перезапись реплики Вики v2 «Капот тёплый…» (владелец 06.11: неверное ударение в «тёплый»), только для пересъёмок ep30b–h.
# Один запрос Gemini TTS = три дубля подряд; дубли режем по паузам, лучший по Whisper ставим на место v2 (та же длина окна) в vo/ep30fix/voice.wav.
import base64, json, subprocess, sys
import numpy as np
sys.path.insert(0, "../.."); import asr
V = json.load(open("voices.json"))["vika"]; SR = 24000
style = ("# AUDIO PROFILE\n### Vika\n" + V["profile"] + "\n## DIRECTOR NOTES\nCalm, cold, a little ironic; her hand is on a warm car hood. "
         "Read the same line three times, with a clear 2-second pause between takes. IMPORTANT stress: «тёплый» is said ТЁП-лый — stress on the FIRST syllable, "
         "the vowel is «ё» (as in «тёмный»), never «теплЫй». «грели» — ГРЕ-ли. Speak ONLY the transcript, in Russian.\n## TRANSCRIPT")
text = "\n".join(["Капот тёплый. Вы её уже грели?"] * 3)
body = {"contents": [{"parts": [{"text": f"{style}\n\n{text}"}]}], "generationConfig": {"responseModalities": ["AUDIO"],
        "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": V["voice"]}}}}}
r = subprocess.run(["curl", "-sS", "-m", "600", "-X", "POST", "-H", "Content-Type: application/json",
                    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-tts-preview:streamGenerateContent?alt=sse", "--data-binary", "@-"],
                   input=json.dumps(body, ensure_ascii=False).encode(), capture_output=True).stdout.decode()
ev = [json.loads(x[5:]) for x in r.splitlines() if x.startswith("data:")]
pcm = b"".join(base64.b64decode(p["inlineData"]["data"]) for e in ev for c in e.get("candidates", []) for p in c.get("content", {}).get("parts", []) if "inlineData" in p)
assert pcm, r[:300]
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "1", "-i", "-", "vo/v2_takes.wav"], input=pcm, check=True)
w = asr.words("vo/v2_takes.wav", "medium"); print([x[0] for x in w], round(len(pcm) / 2 / SR, 1))
