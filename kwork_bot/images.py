"""Обложки: несколько ИИ-фонов на пользователя (Higgsfield API) + текст, который рисуем сами.

У каждого кворка свой фон (по его теме) — одинаковых обложек Kwork не любит. Фон без
текста; заголовок и цену накладывает Pillow — без «кривых» русских букв, которые нейросети
рисуют плохо. Новый фон сравнивается с уже готовыми по «отпечатку» и при сходстве
перерисовывается. Recraft V4.1 ≈ $0.035 за фон. Если ключа Higgsfield нет или генерация не удалась, обложки
получаются градиентными (как раньше), тоже бесплатно.
"""

from __future__ import annotations

import json
import tempfile
import threading
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


def background_path(uid: int, lid: str) -> Path:
    return backgrounds_dir(uid) / f"{lid}.jpg"


def background_prompt(brief: str, i: int) -> str:
    return (f"Background image for a freelance service cover. Theme: {brief or 'professional services'}. "
            f"{VARIANTS[i % len(VARIANTS)]}. Modern, clean, professional, high quality. "
            "Absolutely no text, letters, numbers, typography, signs, logos or watermarks. No people, no hands. "
            "The left half must be calm and dark: a large white headline will be placed there.")


# --- Уникальность: «отпечаток» картинки -------------------------------------------------------
# Средний хэш 16×16: картинку уменьшаем до 16×16 в оттенках серого, каждый пиксель — бит
# «светлее/темнее среднего». У разных картинок отпечатки отличаются на ~половину битов,
# у почти одинаковых — на единицы. Ближе SIMILAR_BITS считаем повтором и перерисовываем.
HASH_SIDE = 16
SIMILAR_BITS = 40  # из 256


def fingerprint(path: Path) -> int:
    from PIL import Image

    pixels = list(Image.open(path).convert("L").resize((HASH_SIDE, HASH_SIDE), Image.LANCZOS).getdata())
    mean = sum(pixels) / len(pixels)
    return sum(1 << i for i, v in enumerate(pixels) if v > mean)


def too_similar(a: int, b: int) -> bool:
    return bin(a ^ b).count("1") <= SIMILAR_BITS


def _store(raw: Path, out: Path) -> Path:
    """Фон храним в JPEG 990×660: для обложки 660×440 хватает, а места в 10 раз меньше, чем PNG."""
    from PIL import Image, ImageOps

    out.parent.mkdir(parents=True, exist_ok=True)
    ImageOps.fit(Image.open(raw).convert("RGB"), (990, 660), Image.LANCZOS).save(out, "JPEG", quality=90)
    return out


def make_background(uid: int, listing: dict, taken: dict[str, int], lock: threading.Lock,
                    attempt_offset: int = 0) -> Path:
    """Рисует фон этого кворка, не похожий ни на один уже готовый (taken: id → отпечаток)."""
    brief = listing.get("visual_brief") or db.load_profile(uid).get("visual_brief", "")
    out = background_path(uid, listing["id"])
    with tempfile.TemporaryDirectory() as tmp:
        for attempt in range(3):
            variant = listing.get("idea_no", 0) + attempt_offset + attempt
            raw = hf_generate(BOT_CONFIG.image_model,
                              {"prompt": background_prompt(brief, variant), "aspect_ratio": "3:2"},
                              Path(tmp) / f"raw{attempt}.png")
            mark = fingerprint(raw)
            with lock:
                twin = next((lid for lid, other in taken.items()
                             if lid != listing["id"] and too_similar(mark, other)), None)
                if twin is None or attempt == 2:
                    taken[listing["id"]] = mark
                    return _store(raw, out)
    raise AssertionError("недостижимо")


def _previous_fingerprints(uid: int) -> dict[str, int]:
    """Отпечатки фонов прошлых партий клиента — новые фоны не должны на них походить."""
    return {f"history-{i}": h["fp"] for i, h in enumerate(db.load_history(uid)) if h.get("fp") is not None}


def make_backgrounds(uid: int, listings: list[dict], progress: dict | None = None) -> int:
    """Уникальный фон каждому кворку без фона; обложка перерисовывается сразу.
    Ошибки не роняют работу — у таких кворков останется градиентная обложка."""
    if not BOT_CONFIG.images_enabled:
        return 0
    progress = progress if progress is not None else {}
    todo = [l for l in listings if not background_path(uid, l["id"]).exists()]
    progress.update(stage="images", done=0, total=len(todo))
    taken = _previous_fingerprints(uid)
    taken.update({l["id"]: fingerprint(background_path(uid, l["id"]))
                  for l in listings if background_path(uid, l["id"]).exists()})
    lock = threading.Lock()

    def one(listing: dict) -> bool:
        try:
            make_background(uid, listing, taken, lock)
            render_cover(uid, listing)
        except Exception as e:  # noqa: BLE001
            progress["error"] = f"картинки: {type(e).__name__}: {e}"[:300]
            return False
        with lock:
            progress["done"] = progress.get("done", 0) + 1
        return True

    with ThreadPoolExecutor(max_workers=BOT_CONFIG.image_parallel) as pool:
        return sum(pool.map(one, todo))


def new_background(uid: int, listing: dict) -> Path:
    """Кнопка «Новый фон»: другой уникальный фон для одного кворка."""
    others = _previous_fingerprints(uid)
    for path in backgrounds_dir(uid).glob("*.jpg") if backgrounds_dir(uid).exists() else []:
        if path.stem != listing["id"]:
            others[path.stem] = fingerprint(path)
    listing["bg_round"] = listing.get("bg_round", 0) + 1
    path = make_background(uid, listing, others, threading.Lock(), attempt_offset=listing["bg_round"] * 3)
    render_cover(uid, listing)
    return path


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
    """Рисует обложку кворка: на его собственном ИИ-фоне (если он уже есть) или градиентную."""
    from PIL import Image

    bg = background_path(uid, listing["id"])
    style = listing.get("palette", 0)
    out = db.cover_path(uid, listing["id"])
    if not bg.exists():
        with tempfile.TemporaryDirectory() as tmp:
            return _save_jpeg(Image.open(make_cover(listing, out_dir=Path(tmp), palette=style)), out)
    return _cover_on_background(listing, bg, PALETTES[style % len(PALETTES)][1], out)
