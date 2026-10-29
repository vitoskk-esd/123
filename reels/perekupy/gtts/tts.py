# Gemini TTS: текст + режиссура → wav 24 кГц. Ключ — GEMINI_API_KEY (в облачной сессии его подставляет прокси). python3 tts.py model voice out.wav "указание" "текст"
import base64, json, os, subprocess, sys, wave
model, voice, out, style, text = sys.argv[1:6]
body = {"contents": [{"parts": [{"text": f"{style}\n\n{text}"}]}],
        "generationConfig": {"responseModalities": ["AUDIO"],
                             "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voice}}}}}
r = subprocess.run(["curl", "-s", "-m", "300", "-X", "POST", "-H", "Content-Type: application/json",
                    f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent" + (f"?key={os.environ['GEMINI_API_KEY']}" if os.environ.get("GEMINI_API_KEY") else ""), "--data-binary", "@-"],
                   input=json.dumps(body, ensure_ascii=False).encode(), capture_output=True).stdout
j = json.loads(r)
if "error" in j:
    sys.exit(f"ERR {j['error'].get('code')} {j['error'].get('message','')[:300]}")
pcm = base64.b64decode(j["candidates"][0]["content"]["parts"][0]["inlineData"]["data"])
with wave.open(out, "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(24000); w.writeframes(pcm)
print(out, round(len(pcm) / 48000, 2), "s")
