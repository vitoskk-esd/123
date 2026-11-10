# venv/python ../tts_pairs.py ep24 [ep25 …] — озвучка ПАРАМИ героев: один запрос Gemini TTS = два голоса (multiSpeakerVoiceConfig).
# Бесплатный лимит основной модели — 10 запросов в сутки. Раньше уходило по запросу на героя (+2 на длинную роль Лиса) = 6–7 на серию;
# парами — ceil(героев / 2): 5 героев = 3 запроса, т. е. 3 серии в день. Ответ пары режем по словам Whisper на реплики и раскладываем
# в привычные vo/<герой>.wav + vo/index.json (по 1,2 с тишины между репликами) — place2.py работает как раньше.
# Запросы — с паузой 70 с (поминутный лимит); 429 не тратит дневную квоту, на нём ждём и повторяем.
import base64, json, os, re, subprocess, sys, time, difflib
import numpy as np
sys.path.insert(0, "../..")
import asr

EPS = sys.argv[1:]; V = json.load(open("voices.json")); os.makedirs("vo", exist_ok=True)
MODEL = os.environ.get("MODEL", "gemini-3.1-flash-tts-preview")
# TTS=auto (по умолчанию, владелец 10.11): сначала бесплатный ключ Google (10 запросов в сутки, пары голосов), а когда дневная квота кончилась —
# оставшихся героев дописываем через OpenRouter (та же модель, платно ~$1 за серию, без лимита, один голос на запрос → по одному герою).
# TTS=gemini — только Google; TTS=openrouter — сразу OpenRouter. Оба ключа подставляет прокси.
PROVIDER = os.environ.get("TTS", "auto")
USE_OR = PROVIDER == "openrouter"


class Quota(Exception):
    """Дневная квота бесплатного Google исчерпана."""
SR = 24000
norm = lambda s: re.sub(r"[^а-я0-9a-z]", "", s.lower().replace("ё", "е"))
# для сопоставления слов Whisper со сценарием — с поправкой на аканье: «Талян» = «Толян», «Сереге» = «Серёге»
loose = lambda s: norm(s).replace("о", "а").replace("е", "и").replace("ь", "").replace("ъ", "")
# Whisper пишет числа цифрами («120») — для сопоставления со сценарием раскладываем их в слова («сто двадцать»)
_U = "ноль один два три четыре пять шесть семь восемь девять".split(); _T = "десять одиннадцать двенадцать тринадцать четырнадцать пятнадцать шестнадцать семнадцать восемнадцать девятнадцать".split()
_D = ",,двадцать тридцать сорок пятьдесят шестьдесят семьдесят восемьдесят девяносто".split(","); _D = ["", ""] + _D[2].split()
_H = ["", "сто", "двести", "триста", "четыреста", "пятьсот", "шестьсот", "семьсот", "восемьсот", "девятьсот"]
def _w999(n):
    out = [_H[n // 100]] if n >= 100 else []; n %= 100
    if 10 <= n < 20: out.append(_T[n - 10])
    else:
        if n >= 20: out.append(_D[n // 10])
        if n % 10 or not out: out.append(_U[n % 10])
    return [w for w in out if w]
def num_words(tok):
    d = re.sub(r"\D", "", tok)
    if not d or len(d) > 6: return [tok]
    n = int(d); th, rest = divmod(n, 1000)
    return (_w999(th) + ["тысяч"] if th else []) + (_w999(rest) if rest or not th else [])
lines = [(e, ln["id"], ln["who"], ln["text"]) for e in EPS for ln in json.load(open(f"{e}.json"))["lines"]]
cnt = {}
for _, _, w, t in lines: cnt[w] = cnt.get(w, 0) + len(t)
# пары: самого «многословного» (обычно Лис) ставим с самым немногословным — запросы выходят ровнее по длине
order = sorted(cnt, key=lambda w: -cnt[w]); pairs = []
if USE_OR: pairs, order = [[w] for w in order], []
while order:
    a = order.pop(0); b = order.pop(-1) if order else None; pairs.append([a] + ([b] if b else []))
print("пары:", pairs, "→ запросов:", len(pairs))


def request_or(who, out, text):
    """OpenRouter /audio/speech: тот же промпт (профиль, указания режиссёра, реплики), один голос, ответ — PCM 24 кГц моно."""
    body = {"model": "google/" + MODEL, "voice": V[who[0]]["voice"], "response_format": "pcm", "input": text}
    for attempt in range(5):
        rr = subprocess.run(["curl", "-sS", "-m", "600", "-o", out + ".pcm", "-w", "%{http_code}", "-X", "POST", "-H", "Content-Type: application/json",
                             "https://openrouter.ai/api/v1/audio/speech", "--data-binary", "@-"], input=json.dumps(body, ensure_ascii=False).encode(), capture_output=True)
        code = rr.stdout.decode().strip()
        if code == "200" and os.path.getsize(out + ".pcm") > 2000:
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "1", "-i", out + ".pcm", out], check=True); os.remove(out + ".pcm")
            print(who, out, round(os.path.getsize(out) / 2 / SR, 1), "с (OpenRouter)"); return True
        err = open(out + ".pcm", "rb").read()[:300] if os.path.exists(out + ".pcm") else rr.stderr[:300]
        print(who, "OpenRouter", code, err, "— повтор через 20 с"); time.sleep(20)
    return False


def request(who, out):
    names = {w: w.capitalize() for w in who}
    prof = "\n".join(f"### {names[w]}\n{V[w]['profile']}\n{V[w]['notes']}" for w in who)
    style = (f"# AUDIO PROFILES\n{prof}\n## DIRECTOR NOTES\nRead the dialogue below; each speaker keeps their own voice and character. Leave a clear 1-second pause "
             f"between lines. Keep a full, loud, clear voice to the very last word of every line — never whisper, mumble or trail off. "
             f"Speak ONLY the transcript, in Russian.\n## TRANSCRIPT")
    text = "\n".join(f"{names[w]}: {t}" for _, _, w, t in lines if w in who)
    if USE_OR: return request_or(who, out, f"{style}\n\n{text}")
    sc = ({"multiSpeakerVoiceConfig": {"speakerVoiceConfigs": [{"speaker": names[w], "voiceConfig": {"prebuiltVoiceConfig": {"voiceName": V[w]["voice"]}}} for w in who]}}
          if len(who) == 2 else {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": V[who[0]]["voice"]}}})
    body = {"contents": [{"parts": [{"text": f"{style}\n\n{text}"}]}], "generationConfig": {"responseModalities": ["AUDIO"], "speechConfig": sc}}
    for attempt in range(6):
        rr = subprocess.run(["curl", "-sS", "-m", "600", "-w", "\n__HTTP__%{http_code} %{time_total}", "-X", "POST", "-H", "Content-Type: application/json",
                            f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:streamGenerateContent?alt=sse", "--data-binary", "@-"],
                           input=json.dumps(body, ensure_ascii=False).encode(), capture_output=True)
        r, _, meta = rr.stdout.rpartition(b"\n__HTTP__")
        try:   # поток SSE (прокси рвёт ответ дольше 30 с): склеиваем куски звука из всех «data:»
            ev = [json.loads(x[5:]) for x in r.decode().splitlines() if x.startswith("data:")]
            j = ev[-1] if ev and all("candidates" in e for e in ev) else (next((e for e in ev if "error" in e), None) or json.loads(r))
            if "candidates" in j:
                parts = [p["inlineData"]["data"] for e in ev for c in e.get("candidates", []) for p in c.get("content", {}).get("parts", []) if "inlineData" in p]
                j = {"pcm": b"".join(base64.b64decode(p) for p in parts)}
        except Exception:
            print(who, "пустой ответ", meta.decode(), rr.stderr.decode()[:200], r[:200], "— повтор через 70 с"); time.sleep(70); continue
        if "error" in j:
            msg = j["error"].get("message", "")
            if j["error"].get("code") == 429 and "free_tier_requests" in msg and "PerDay" in json.dumps(j):
                raise Quota()
            print(who, "ошибка", j["error"].get("code"), msg[:120]); time.sleep(75); continue
        pcm = j["pcm"]
        with open(out, "wb") as f:
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "1", "-i", "-", out], input=pcm, check=True)
        print(who, out, round(len(pcm) / 2 / SR, 1), "с"); return True
    return False


def cut(path, who):
    """реплики пары по словам Whisper → (who, ep, id, кусок звука); граница — самая длинная пауза между репликами"""
    x = np.frombuffer(subprocess.run(["ffmpeg", "-v", "quiet", "-i", path, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True).stdout, np.float32)
    words = asr.words(path, "small")
    mine = [(e, i, w, t) for e, i, w, t in lines if w in who]
    exp, owner = [], []
    for k, (_, _, _, t) in enumerate(mine):
        for w in t.split():
            if norm(w): exp.append(loose(w)); owner.append(k)
    words = [(nw, a, b) for w, a, b in words for nw in (num_words(w) if re.search(r"\d", w) else [w])]   # «120» → «сто», «двадцать» (тайминг тот же)
    got = [loose(w) for w, _, _ in words]
    first, last = {}, {}
    for blk in difflib.SequenceMatcher(None, exp, got, autojunk=False).get_matching_blocks():
        for d in range(blk.size):
            k, j = owner[blk.a + d], blk.b + d; first.setdefault(k, j); last[k] = j
    for k in range(len(mine)):
        if k not in first and k - 1 in last and k + 1 in first and last[k - 1] + 1 < first[k + 1]:
            first[k], last[k] = last[k - 1] + 1, first[k + 1] - 1
    miss = sorted(set(range(len(mine))) - set(first))
    assert not miss, f"{who}: не нашёл реплики {[mine[k][1] for k in miss]}"
    cuts = []
    for k in range(1, len(mine)):
        i0, j0 = last[k - 1], first[k]; assert i0 < j0, f"{who}: реплики {mine[k - 1][1]} и {mine[k][1]} перепутаны"
        m = max(range(i0, j0), key=lambda m: words[m + 1][1] - words[m][2]); cuts.append((words[m][2] + words[m + 1][1]) / 2)
    b = [0.0] + cuts + [len(x) / SR]
    return [(w, e, i, x[int(b[k] * SR):int(b[k + 1] * SR)]) for k, (e, i, w, t) in enumerate(mine)]


def main():
  global USE_OR
  per, todo, queue = {}, [], [list(p) for p in pairs]
  while queue:
      who = queue.pop(0)
      out = f"vo/pair_{'_'.join(who)}.wav"
      if not (os.path.exists(out) and os.path.getsize(out) > 1000):
          if todo and not USE_OR: time.sleep(70)
          try:
              ok = request(who, out)
          except Quota:
              if PROVIDER != "auto": sys.exit("дневная квота бесплатного Google исчерпана (TTS=gemini)")
              print("бесплатный лимит Google на сегодня кончился — дальше пишу через OpenRouter, по одному герою")
              USE_OR = True; queue = [[w] for w in who] + [[w] for p in queue for w in p]; continue
          if not ok: sys.exit(f"не записал {who}")
          todo.append(out)
      for w, e, i, seg in cut(out, who): per.setdefault(w, []).append((e, i, seg))
  gap = np.zeros(int(1.2 * SR), np.float32); idx = {}
  for w, segs in per.items():
      y = np.concatenate([np.concatenate([s, gap]) for _, _, s in segs]).astype(np.float32)
      subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", f"vo/{w}.wav"], input=y.tobytes(), check=True)
      idx[w] = [[e, i, t] for e, i, ww, t in lines if ww == w]
  json.dump(idx, open("vo/index.json", "w"), ensure_ascii=False, indent=1)
  print("готово:", {w: len(v) for w, v in per.items()})


if __name__ == "__main__":
    main()
