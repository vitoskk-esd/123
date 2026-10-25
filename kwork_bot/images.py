"""Обложки: несколько ИИ-фонов на пользователя (Higgsfield API) + текст, который рисуем сами.

Почему так дёшево: на 300 кворков генерируется всего KWORK_BOT_BACKGROUNDS картинок
(по умолчанию 4 × Recraft V4.1 ≈ $0.035 = $0.14 на человека), а заголовок и цену
на каждую обложку накладывает Pillow — бесплатно и без «кривых» русских букв, которые
нейросети рисуют плохо. Если ключа Higgsfield нет или генерация не удалась, обложки
получаются градиентными (как раньше), тоже бесплатно.
"""

from __future__ import annotations

import json
import tempfile
import time
from concurrent.futures import ThreadPoolExecutor
import urllib.request
from pathlib import Path

from kwork_agent.cover import PALETTES, SIZE, draw_texts, make_cover

from . import db
from .config import BOT_CONFIG

API = "https://api.higgsfield.ai"

# Промпты на английском: модели картинок понимают его лучше.
VARIANTS = [
    "objects related to the niche on the right side, calm dark empty space on the left",
    "close-up of one object related to the niche on the right, soft studio light",
    "abstract shapes and flowing lines in the niche colors, accent on the right",
    "top-down view of a specialist's desk for this niche, items on the right",
    "minimalism, one bright object on the right, lots of empty space on the left",
    "3D rendered elements related to the niche on the right",
]


def _hf(method: str, url: str, body: dict | None = None) -> dict:
    headers = {"Authorization": f"Key {BOT_CONFIG.hf_key}", "Content-Type": "application/json"}
    req = urllib.request.Request(url, json.dumps(body).encode() if body is not None else None, headers, method=method)
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.load(resp)


def first_url(x) -> str | None:
    """Первая ссылка на результат в ответе Higgsfield (images[0].url, image.url и т. п.)."""
    if isinstance(x, str):
        return x if x.startswith("https://") else None
    if isinstance(x, dict):
        for k in ("images", "image", "output", "url"):
            if k in x and (u := first_url(x[k])):
                return u
    if isinstance(x, list):
        for v in x:
            if (u := first_url(v)):
                return u
    return None


def hf_generate(model: str, args: dict, out: Path, timeout: int = 300) -> Path:
    """Отправляет задание в Higgsfield, ждёт готовности и сохраняет картинку."""
    job = _hf("POST", f"{API}/{model}", args)
    status_url = job.get("status_url") or f"{API}/requests/{job['request_id']}/status"
    deadline = time.monotonic() + timeout
    while True:
        data = _hf("GET", status_url)
        if data["status"] == "completed":
            break
        if data["status"] in ("failed", "nsfw", "canceled"):
            raise RuntimeError(f"Higgsfield: {data['status']}")
        if time.monotonic() > deadline:
            raise TimeoutError("Higgsfield не успел за отведённое время")
        time.sleep(3)
    url = first_url(data)
    if not url:
        raise RuntimeError("Higgsfield не вернул ссылку на картинку")
    out.parent.mkdir(parents=True, exist_ok=True)
    with urllib.request.urlopen(url, timeout=60) as resp:
        out.write_bytes(resp.read())
    return out


def backgrounds_dir(uid: int) -> Path:
    return db.user_dir(uid) / "backgrounds"


def backgrounds(uid: int) -> list[Path]:
    d = backgrounds_dir(uid)
    return sorted(d.glob("bg*.png")) if d.exists() else []


def background_prompt(brief: str, i: int) -> str:
    return (f"Background image for a freelance service cover. Theme: {brief or 'professional services'}. "
            f"{VARIANTS[i % len(VARIANTS)]}. Modern, clean, professional, high quality. "
            "Absolutely no text, letters, numbers, typography, signs, logos or watermarks. No people, no hands. "
            "The left half must be calm and dark: a large white headline will be placed there.")


def make_backgrounds(uid: int, progress: dict | None = None) -> list[Path]:
    """Генерирует фоны параллельно. Ошибки не роняют работу — останутся градиентные обложки."""
    if not BOT_CONFIG.images_enabled:
        return []
    brief = db.load_profile(uid).get("visual_brief", "")
    n = BOT_CONFIG.backgrounds
    progress = progress if progress is not None else {}
    progress.update(stage="images", done=0, total=n)

    def one(i: int) -> Path | None:
        path = backgrounds_dir(uid) / f"bg{i + 1}.png"
        if not path.exists():
            try:
                hf_generate(BOT_CONFIG.image_model, {"prompt": background_prompt(brief, i), "aspect_ratio": "3:2"}, path)
            except Exception as e:  # noqa: BLE001
                progress["error"] = f"картинки: {type(e).__name__}: {e}"[:300]
                return None
        progress["done"] = progress.get("done", 0) + 1
        return path

    with ThreadPoolExecutor(max_workers=n) as pool:
        return [p for p in pool.map(one, range(n)) if p]


def _cover_on_background(listing: dict, bg: Path, accent: tuple, out: Path) -> Path:
    from PIL import Image, ImageDraw, ImageOps

    img = ImageOps.fit(Image.open(bg).convert("RGB"), SIZE, Image.LANCZOS)
    # Затемняем левую часть, чтобы белый текст читался на любом фоне:
    # до половины ширины — плотная тень, к 85% ширины она сходит на нет.
    w, h = SIZE
    mask = Image.new("L", SIZE)
    draw = ImageDraw.Draw(mask)
    for x in range(w):
        t = min(1.0, max(0.0, (x / w - 0.5) / 0.35))
        draw.line([(x, 0), (x, h)], fill=int(235 * (1 - t)))
    img = Image.composite(Image.new("RGB", SIZE, (8, 10, 18)), img, mask)
    draw_texts(img, listing, accent, max_w=int(w * 0.62))
    return _save_jpeg(img, out)


def _save_jpeg(img, out: Path) -> Path:
    img.convert("RGB").save(out, "JPEG", quality=90, optimize=True, progressive=True)
    return out


def render_cover(uid: int, listing: dict) -> Path:
    """Рисует обложку кворка: на ИИ-фоне (если есть) или градиентную."""
    from PIL import Image

    bgs = backgrounds(uid)
    style = listing.get("palette", 0)
    out = db.cover_path(uid, listing["id"])
    if not bgs:
        with tempfile.TemporaryDirectory() as tmp:
            return _save_jpeg(Image.open(make_cover(listing, out_dir=Path(tmp), palette=style)), out)
    accent = PALETTES[style % len(PALETTES)][1]
    bg = bgs[listing.get("bg", 0) % len(bgs)]
    return _cover_on_background(listing, bg, accent, out)
