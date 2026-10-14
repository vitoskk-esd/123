#!/usr/bin/env python3
"""Генерация картинок Gemini (Nano Banana) для гибридных роликов «Арбузова» (владелец 14.10: «давай попробуем гибрид»).
Ключ — сетевой секрет окружения «Gemini» (заголовок x-goog-api-key, хост generativelanguage.googleapis.com): скрипт ключа
не видит, прокси подставляет его сам. Бесплатная квота ≈ 50 картинок в день (по обзорам, проверить) — счётчик в .gemini_quota.json.

  python3 tools/gemini_image.py "промпт" out.png [--ref a.png --ref b.jpg] [--aspect 16:9] [--model имя]
  python3 tools/gemini_image.py --batch youtube/characters/hybrid/library.json      # всё, чего ещё нет на диске
  python3 tools/gemini_image.py --models                                            # какие модели с картинками доступны
"""
import argparse, base64, datetime, json, mimetypes, os, sys, urllib.request, urllib.error

API = "https://generativelanguage.googleapis.com/v1beta"
PREFER = ["gemini-3.1-flash-image", "gemini-3-pro-image", "gemini-2.5-flash-image"]     # по порядку: Nano Banana 2, Pro, старый
QUOTA_F = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".gemini_quota.json")
DAILY = int(os.environ.get("GEMINI_DAILY", 50))


def call(url, body=None):
    req = urllib.request.Request(url, json.dumps(body).encode() if body else None, {"Content-Type": "application/json"})
    try:
        return json.loads(urllib.request.urlopen(req, timeout=300).read())
    except urllib.error.HTTPError as e:
        raise SystemExit(f"Gemini {e.code}: {e.read().decode()[:400]}")


def image_models():
    d = call(f"{API}/models?pageSize=200")
    return [m["name"].split("/", 1)[1] for m in d.get("models", []) if "image" in m["name"] and "generateContent" in m.get("supportedGenerationMethods", [])]


def pick_model(name=None):
    if name: return name
    have = image_models()
    for p in PREFER:
        for m in have:
            if m.startswith(p): return m
    if have: return have[0]
    raise SystemExit("нет моделей с генерацией картинок для этого ключа")


def quota(add=0):
    q = json.load(open(QUOTA_F)) if os.path.exists(QUOTA_F) else {}
    day = datetime.date.today().isoformat()
    q[day] = q.get(day, 0) + add
    json.dump(q, open(QUOTA_F, "w"), indent=1)
    return q[day]


def generate(prompt, out, refs=(), aspect="16:9", model=None):
    if quota() >= DAILY: raise SystemExit(f"дневной лимит {DAILY} исчерпан — продолжу завтра")
    model = pick_model(model)
    parts = [{"text": prompt}]
    for r in refs:
        parts.append({"inline_data": {"mime_type": mimetypes.guess_type(r)[0] or "image/png", "data": base64.b64encode(open(r, "rb").read()).decode()}})
    body = {"contents": [{"parts": parts}], "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": aspect}}}
    d = call(f"{API}/models/{model}:generateContent", body)
    quota(1)
    for c in d.get("candidates", []):
        for p in c.get("content", {}).get("parts", []):
            data = p.get("inline_data") or p.get("inlineData")
            if data:
                os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
                open(out, "wb").write(base64.b64decode(data["data"]))
                print(f"{out}  ({model}, сегодня {quota()}/{DAILY})", flush=True)
                return out
    raise SystemExit(f"картинки нет в ответе: {json.dumps(d)[:400]}")


def batch(spec):
    S = json.load(open(spec)); base = os.path.dirname(os.path.abspath(spec))
    style, refs = S.get("style", ""), [os.path.join(base, r) for r in S.get("refs", [])]
    for it in S["items"]:
        out = os.path.join(base, it["out"])
        if os.path.exists(out): continue
        generate(f"{it['prompt']} {style}", out, refs + [os.path.join(base, r) for r in it.get("refs", [])], it.get("aspect", S.get("aspect", "16:9")))


if __name__ == "__main__":
    a = argparse.ArgumentParser()
    a.add_argument("prompt", nargs="?"); a.add_argument("out", nargs="?")
    a.add_argument("--ref", action="append", default=[]); a.add_argument("--aspect", default="16:9"); a.add_argument("--model")
    a.add_argument("--batch"); a.add_argument("--models", action="store_true")
    x = a.parse_args()
    if x.models: print("\n".join(image_models())); sys.exit()
    if x.batch: batch(x.batch); sys.exit()
    if not (x.prompt and x.out): a.error("нужны промпт и файл")
    generate(x.prompt, x.out, x.ref, x.aspect, x.model)
