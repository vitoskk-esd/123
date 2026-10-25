"""Обложки: несколько ИИ-фонов на пользователя (Higgsfield API) + текст, который рисуем сами.

Дёшево: на клиента ИИ рисует только 4 фона (Recraft V4.1, ≈ $0.035 за фон), а уникальной
каждую обложку делает бесплатная обработка (фрагмент, поворот, оттенок, декор, зерно) и
свой заголовок. Отпечаток каждой обложки сверяется со всеми остальными и с прошлыми
партиями — при сходстве обработка меняется. Текст на фон накладывает Pillow — без «кривых»
русских букв, которые нейросети рисуют плохо. Если ключа Higgsfield нет или генерация не удалась, обложки
получаются градиентными (как раньше), тоже бесплатно.
"""

from __future__ import annotations

import json
import random
import tempfile
import time
from concurrent.futures import ThreadPoolExecutor
import urllib.request
from pathlib import Path

from kwork_agent.cover import PALETTES, SIZE, draw_texts

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
    return sorted(d.glob("bg*.jpg")) if d.exists() else []


def background_prompt(brief: str, i: int) -> str:
    return (f"Background image for a freelance service cover. Theme: {brief or 'professional services'}. "
            f"{VARIANTS[i % len(VARIANTS)]}. Modern, clean, professional, high quality. "
            "Absolutely no text, letters, numbers, typography, signs, logos or watermarks. No people, no hands. "
            "The left half must be calm and dark: a large white headline will be placed there.")


# --- Уникальность: «отпечаток» картинки -------------------------------------------------------
# Средний хэш 16×16: картинку уменьшаем до 16×16 в оттенках серого, каждый пиксель — бит
# «светлее/темнее среднего». У разных картинок отпечатки отличаются на ~половину битов,
# у почти одинаковых — на единицы. Ближе SIMILAR_BITS считаем повтором.
HASH_SIDE = 16
SIMILAR_BITS = 40  # из 256


def fingerprint(source) -> int:
    from PIL import Image

    img = source if isinstance(source, Image.Image) else Image.open(source)
    pixels = list(img.convert("L").resize((HASH_SIDE, HASH_SIDE), Image.LANCZOS).tobytes())
    mean = sum(pixels) / len(pixels)
    return sum(1 << i for i, v in enumerate(pixels) if v > mean)


def too_similar(a: int, b: int) -> bool:
    return bin(a ^ b).count("1") <= SIMILAR_BITS


# Обложки сравниваем по видимой части фона — правым 45%: слева у всех одинаковая раскладка
# (тень и белый заголовок), она забивала бы разницу. Повтор — отличие меньше ~10% отпечатка.
# Проверено 25.10 на 4 настоящих фонах Recraft: 300 обложек, ни одной пары ближе 24 бит.
COVER_SIMILAR_BITS = 24


def cover_fingerprint(path: Path) -> int:
    from PIL import Image

    img = Image.open(path)
    return fingerprint(img.crop((int(img.width * 0.55), 0, img.width, img.height)))


def covers_similar(a: int, b: int) -> bool:
    return bin(a ^ b).count("1") <= COVER_SIMILAR_BITS


def make_backgrounds(uid: int, progress: dict | None = None) -> list[Path]:
    """4 общих ИИ-фона на клиента (~$0.14). Уникальной каждую обложку делает обработка
    фона в vary() и проверка отпечатков в unique_covers()."""
    if not BOT_CONFIG.images_enabled:
        return []
    brief = db.load_profile(uid).get("visual_brief", "")
    n = BOT_CONFIG.backgrounds
    progress = progress if progress is not None else {}
    progress.update(stage="images", done=0, total=n)

    def one(i: int) -> Path | None:
        out = backgrounds_dir(uid) / f"bg{i + 1}.jpg"
        if not out.exists():
            try:
                with tempfile.TemporaryDirectory() as tmp:
                    raw = hf_generate(BOT_CONFIG.image_model,
                                      {"prompt": background_prompt(brief, i), "aspect_ratio": "3:2"}, Path(tmp) / "raw.png")
                    _store(raw, out)
            except Exception as e:  # noqa: BLE001
                progress["error"] = f"картинки: {type(e).__name__}: {e}"[:300]
                return None
        progress["done"] = progress.get("done", 0) + 1
        return out

    with ThreadPoolExecutor(max_workers=n) as pool:
        return [p for p in pool.map(one, range(n)) if p]


def _store(raw: Path, out: Path) -> Path:
    """Фон храним в JPEG 1320×880: запас для кадрирования, а места в разы меньше, чем PNG."""
    from PIL import Image, ImageOps

    out.parent.mkdir(parents=True, exist_ok=True)
    ImageOps.fit(Image.open(raw).convert("RGB"), (1320, 880), Image.LANCZOS).save(out, "JPEG", quality=90)
    return out


def vary(bg: Path, seed: str):
    """Своя обработка общего фона для каждой обложки: фрагмент и масштаб, лёгкий поворот,
    оттенок, яркость, контраст, насыщенность, декоративные круги, зерно. Без отражения:
    главный предмет фона должен остаться справа, слева — тень под заголовком."""
    from PIL import Image, ImageDraw, ImageEnhance

    r = random.Random(seed)
    w, h = SIZE
    src = Image.open(bg).convert("RGB")
    zoom = r.uniform(1.0, 1.45)
    cw, ch = int(src.width / zoom), int(src.height / zoom)
    x, y = r.randint((src.width - cw) // 3, src.width - cw), r.randint(0, src.height - ch)
    img = src.crop((x, y, x + cw, y + ch)).resize((w, h), Image.LANCZOS)
    img = img.rotate(r.uniform(-5, 5), resample=Image.BICUBIC).resize((int(w * 1.12), int(h * 1.12)), Image.LANCZOS)
    ox, oy = r.randint(0, int(w * .12)), r.randint(0, int(h * .12))
    img = img.crop((ox, oy, ox + w, oy + h))
    hue, sat, val = img.convert("HSV").split()
    shift = r.randint(-30, 30)
    img = Image.merge("HSV", (hue.point(lambda p: (p + shift) % 256), sat, val)).convert("RGB")
    img = ImageEnhance.Brightness(img).enhance(r.uniform(0.85, 1.15))
    img = ImageEnhance.Contrast(img).enhance(r.uniform(0.85, 1.2))
    img = ImageEnhance.Color(img).enhance(r.uniform(0.8, 1.25))
    over = Image.new("RGBA", SIZE, (0, 0, 0, 0))
    draw = ImageDraw.Draw(over)
    for _ in range(r.randint(1, 3)):
        cx, cy, rad = r.randint(int(w * .55), w), r.randint(0, h), r.randint(30, 140)
        color = (r.randint(120, 255), r.randint(120, 255), r.randint(120, 255))
        box = [cx - rad, cy - rad, cx + rad, cy + rad]
        if r.random() < .5:
            draw.ellipse(box, fill=color + (r.randint(25, 60),))
        else:
            draw.ellipse(box, outline=color + (90,), width=r.randint(2, 6))
    img = Image.alpha_composite(img.convert("RGBA"), over).convert("RGB")
    return Image.blend(img, Image.effect_noise(SIZE, r.uniform(8, 18)).convert("RGB"), 0.04)


def _previous_fingerprints(uid: int) -> list[int]:
    """Отпечатки обложек прошлых партий клиента — новые не должны на них походить."""
    return [h["fp"] for h in db.load_history(uid) if h.get("fp") is not None]


MAX_TRIES = 15


def unique_covers(uid: int, listings: list[dict], progress: dict | None = None) -> int:
    """Рисует обложки так, чтобы каждая заметно отличалась от остальных и от прошлых партий:
    при сходстве меняет обработку фона (listing["variant"]). Возвращает, сколько не удалось развести."""
    progress = progress if progress is not None else {}
    progress.update(stage="covers", done=0, total=len(listings))
    taken = _previous_fingerprints(uid)
    failed = 0
    for l in listings:
        for attempt in range(MAX_TRIES):
            mark = cover_fingerprint(render_cover(uid, l))
            if not any(covers_similar(mark, other) for other in taken):
                break
            l["variant"] = l.get("variant", 0) + 1
        else:
            failed += 1
        l["fp"] = mark
        taken.append(mark)
        progress["done"] += 1
    db.save_listings(uid, listings)
    return failed


def new_look(uid: int, listing: dict, listings: list[dict]) -> None:
    """Кнопка «Другой фон»: другая обработка фона, тоже непохожая на остальные обложки."""
    if listing.get("own_photo"):
        from .bulk import new_look_photo

        return new_look_photo(uid, listing, listings)
    taken = _previous_fingerprints(uid) + [o["fp"] for o in listings if o["id"] != listing["id"] and "fp" in o]
    for _ in range(MAX_TRIES):
        listing["variant"] = listing.get("variant", 0) + 1
        mark = cover_fingerprint(render_cover(uid, listing))
        if not any(covers_similar(mark, other) for other in taken):
            break
    listing["fp"] = mark


def _cover_on_background(listing: dict, bg: Path, accent: tuple, out: Path) -> Path:
    from PIL import Image, ImageDraw

    img = vary(bg, f"{listing['id']}:{listing.get('variant', 0)}")
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


def gradient_background(uid: int, palette: int) -> Path:
    """Фон без ИИ (нет ключа Higgsfield): градиент цвета палитры. Дальше — та же уникальная
    обработка, что и у ИИ-фонов, поэтому обложки и без ИИ не повторяются."""
    from PIL import Image, ImageDraw

    out = backgrounds_dir(uid) / f"gradient{palette % len(PALETTES)}.jpg"
    if not out.exists():
        bg, accent = PALETTES[palette % len(PALETTES)]
        w, h = 1320, 880
        img = Image.new("RGB", (w, h), bg)
        draw = ImageDraw.Draw(img)
        for y in range(0, h, 2):
            for x in range(0, w, 8):
                t = min(1.0, (x / w * 0.5 + y / h * 0.5) ** 2 * 0.8)
                draw.rectangle([x, y, x + 8, y + 2], fill=tuple(int(bg[i] + (accent[i] - bg[i]) * t) for i in range(3)))
        out.parent.mkdir(parents=True, exist_ok=True)
        img.save(out, "JPEG", quality=90)
    return out


def render_cover(uid: int, listing: dict) -> Path:
    """Обложка кворка: общий фон (ИИ или градиент) со своей обработкой и заголовком.
    У кворков с фото клиента (own_photo) обложка — само фото, её не перерисовываем."""
    if listing.get("own_photo"):
        return db.cover_path(uid, listing["id"])
    style = listing.get("palette", 0)
    bgs = backgrounds(uid) or [gradient_background(uid, style)]
    bg = bgs[(listing.get("idea_no", 1) - 1) % len(bgs)]
    return _cover_on_background(listing, bg, PALETTES[style % len(PALETTES)][1], db.cover_path(uid, listing["id"]))
