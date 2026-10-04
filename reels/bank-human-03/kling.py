#!/usr/bin/env python3
"""Генерация клипов рилса №3 через Kling API.

Ключи — только из переменных окружения (в чат их не вставлять):
  KLING_ACCESS_KEY + KLING_SECRET_KEY  — официальный API Kling (JWT HS256)
  или KLING_API_KEY                    — Bearer-ключ сервиса-посредника
  KLING_API_BASE   — адрес API (по умолчанию https://api-singapore.klingai.com)
  KLING_IMAGE_MODEL / KLING_VIDEO_MODEL / KLING_MODE — модели и качество

python3 kling.py check            проверить ключ (запрос статуса, без списания)
python3 kling.py ref [N]          N кадров-образцов героев  -> out/ref/ref_*.png
python3 kling.py video 3 [4 ...]  клипы сцен по выбранному образцу -> out/clips/sceneN_*.mp4
python3 kling.py all              образец (если нет) + все сцены

Выбранные клипы копируются в clips/sceneN.mp4 (их и монтирует сборка).
"""
import base64
import hashlib
import hmac
import json
import os
import sys
import time
import urllib.request

DIR = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(DIR, "out")
BASE = os.environ.get("KLING_API_BASE", "https://api-singapore.klingai.com").rstrip("/")
IMAGE_MODEL = os.environ.get("KLING_IMAGE_MODEL", "kling-v2")
VIDEO_MODEL = os.environ.get("KLING_VIDEO_MODEL", "kling-v2-1")
MODE = os.environ.get("KLING_MODE", "pro")  # pro = 1080p, std = 720p

STYLE = ("Same characters as the reference image, same lighting and style. "
         "Cinematic, realistic, shallow depth of field, 35mm, subtle film grain. ")
NEGATIVE = ("text, subtitles, letters, logo, watermark, brand colors, distorted hands, extra fingers, "
            "deformed face, blurry, low quality, cartoon")

REF_PROMPT = (
    "Cinematic photo, vertical 9:16. A charming middle-aged banker, about 45, slicked-back silver hair, "
    "navy pinstripe three-piece suit, gold tie clip, exaggerated customer-service smile, standing behind a "
    "glossy black bank counter. Opposite him a young man, about 20, grey hoodie, white sneakers, holding a "
    "phone. Cold modern bank lobby, teal and amber lighting, shallow depth of field, 35mm lens, realistic "
    "skin texture, subtle film grain. No logos, no text, no brand colors.")

# Сцены: номер -> движение в кадре (стартовый кадр — выбранный образец героев).
SCENES = {
    1: "Slow dolly-in on the banker's face, his smile slowly widens a bit too much, he tilts his head politely.",
    2: "The banker gently takes a banknote out of the young man's open wallet with two fingers, smiling and "
       "nodding as if it is a favor. The young man looks confused. Medium shot.",
    3: "The banker shows the young man a phone screen with a notification, then calmly takes a coin from the "
       "young man's palm and puts it in his own pocket. Close-up on hands, then faces.",
    4: "The banker ceremoniously places one tiny coin into the young man's open palm and bows theatrically, "
       "like giving a tip. The young man stares at the tiny coin. Close-up.",
    5: "The banker and the young man take a friendly selfie together; while smiling at the camera, the "
       "banker's hand is slipped into the young man's hoodie pocket. Playful, slightly absurd mood.",
    6: "A bright futuristic bank hall with warm light. A friendly smiling woman in a light suit hands the "
       "young man a glowing card; golden coins softly fall from above like confetti. The young man smiles, "
       "amazed. Wide shot, slow push-in.",
    7: "The young man turns and walks away from the counter holding a glowing card; behind him the "
       "silver-haired banker freezes with a shocked expression. Camera stays on the banker.",
}


def _b64url(b):
    return base64.urlsafe_b64encode(b).rstrip(b"=").decode()


def token():
    if os.environ.get("KLING_API_KEY"):
        return os.environ["KLING_API_KEY"]
    ak, sk = os.environ.get("KLING_ACCESS_KEY"), os.environ.get("KLING_SECRET_KEY")
    if not (ak and sk):
        sys.exit("нет ключей: задайте KLING_ACCESS_KEY и KLING_SECRET_KEY (или KLING_API_KEY) в настройках окружения")
    now = int(time.time())
    head = _b64url(json.dumps({"alg": "HS256", "typ": "JWT"}, separators=(",", ":")).encode())
    body = _b64url(json.dumps({"iss": ak, "exp": now + 1800, "nbf": now - 5}, separators=(",", ":")).encode())
    sig = _b64url(hmac.new(sk.encode(), f"{head}.{body}".encode(), hashlib.sha256).digest())
    return f"{head}.{body}.{sig}"


def api(method, path, payload=None):
    req = urllib.request.Request(BASE + path, method=method,
                                 data=json.dumps(payload).encode() if payload is not None else None,
                                 headers={"Authorization": "Bearer " + token(), "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            d = json.load(r)
    except urllib.error.HTTPError as e:
        sys.exit(f"HTTP {e.code} {path}: {e.read().decode(errors='replace')[:500]}")
    if d.get("code", 0) != 0:
        sys.exit(f"Kling {path}: code={d.get('code')} {d.get('message')}")
    return d["data"]


def wait(kind, task_id, every=10, limit=1800):
    t0 = time.time()
    while time.time() - t0 < limit:
        d = api("GET", f"/v1/{kind}/{task_id}")
        st = d.get("task_status")
        if st == "succeed":
            return d["task_result"]
        if st == "failed":
            sys.exit(f"задача {task_id} не удалась: {d.get('task_status_msg')}")
        time.sleep(every)
    sys.exit(f"задача {task_id}: не дождались за {limit} с")


def download(url, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with urllib.request.urlopen(url, timeout=300) as r, open(path, "wb") as f:
        f.write(r.read())
    print(path, flush=True)


def ref(n=2):
    d = api("POST", "/v1/images/generations", {
        "model_name": IMAGE_MODEL, "prompt": REF_PROMPT, "negative_prompt": NEGATIVE,
        "aspect_ratio": "9:16", "n": n})
    res = wait("images/generations", d["task_id"], every=5)
    for i, im in enumerate(res["images"], 1):
        download(im["url"], os.path.join(OUT, "ref", f"ref_{i}.png"))


def ref_image():
    """Выбранный образец: clips/ref.png, иначе первый сгенерированный."""
    for p in (os.path.join(DIR, "clips", "ref.png"), os.path.join(OUT, "ref", "ref_1.png")):
        if os.path.exists(p):
            return base64.b64encode(open(p, "rb").read()).decode()
    sys.exit("нет образца героев: сначала python3 kling.py ref")


def video(scene, variant=1):
    d = api("POST", "/v1/videos/image2video", {
        "model_name": VIDEO_MODEL, "mode": MODE, "duration": "5",
        "image": ref_image(), "prompt": STYLE + SCENES[scene], "negative_prompt": NEGATIVE, "cfg_scale": 0.5})
    print(f"сцена {scene}: задача {d['task_id']}", flush=True)
    res = wait("videos/image2video", d["task_id"])
    download(res["videos"][0]["url"], os.path.join(OUT, "clips", f"scene{scene}_{variant}.mp4"))


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "check"
    if cmd == "check":
        token()
        req = urllib.request.Request(BASE + "/v1/videos/image2video/0", headers={"Authorization": "Bearer " + token()})
        try:
            urllib.request.urlopen(req, timeout=30)
        except urllib.error.HTTPError as e:
            body = e.read().decode(errors="replace")[:300]
            # 401/403 — ключ не принят; 400/404 «задача не найдена» — ключ принят
            print("ключ НЕ принят:" if e.code in (401, 403) else "ключ принят (ответ на несуществующую задачу):", e.code, body)
    elif cmd == "ref":
        ref(int(sys.argv[2]) if len(sys.argv) > 2 else 2)
    elif cmd == "video":
        for s in sys.argv[2:]:
            video(int(s))
    elif cmd == "all":
        if not os.path.exists(os.path.join(OUT, "ref", "ref_1.png")) and not os.path.exists(os.path.join(DIR, "clips", "ref.png")):
            ref(2)
        for s in SCENES:
            video(s)
