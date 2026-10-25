"""Обложки: несколько ИИ-фонов на пользователя (Gemini) + текст, который рисуем сами.

Почему так дёшево: на 300 кворков генерируется всего KWORK_BOT_BACKGROUNDS картинок
(по умолчанию 4), а заголовок и цену на каждую обложку накладывает Pillow — бесплатно
и без «кривых» русских букв, которые нейросети рисуют плохо. Если Gemini не настроен,
обложки получаются градиентными (как раньше), тоже бесплатно.
"""

from __future__ import annotations

import base64
import json
import mimetypes
import urllib.request
from pathlib import Path

from kwork_agent.cover import PALETTES, SIZE, draw_texts, make_cover

from . import db
from .config import BOT_CONFIG

API = "https://generativelanguage.googleapis.com/v1beta/models"

VARIANTS = [
    "композиция: предметы ниши справа, слева спокойный тёмный фон",
    "композиция: крупный план одного предмета ниши справа, мягкий свет",
    "композиция: абстрактные формы и линии в цветах ниши, справа акцент",
    "композиция: рабочее место специалиста этой ниши, вид сверху, справа",
    "композиция: минимализм, один яркий объект справа, много пустого места слева",
    "композиция: объёмные 3D-элементы по теме ниши справа",
]


def generate_image(prompt: str, refs: list[Path], out: Path) -> Path:
    parts: list[dict] = [{"text": prompt}]
    for r in refs[:3]:
        parts.append({"inline_data": {"mime_type": mimetypes.guess_type(r.name)[0] or "image/jpeg",
                                      "data": base64.b64encode(r.read_bytes()).decode()}})
    body = {"contents": [{"parts": parts}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "3:2"}}}
    headers = {"Content-Type": "application/json"}
    if BOT_CONFIG.gemini_key:
        headers["x-goog-api-key"] = BOT_CONFIG.gemini_key
    req = urllib.request.Request(f"{API}/{BOT_CONFIG.image_model}:generateContent",
                                 json.dumps(body).encode(), headers)
    with urllib.request.urlopen(req, timeout=180) as resp:
        data = json.load(resp)
    for cand in data.get("candidates", []):
        for part in cand.get("content", {}).get("parts", []):
            inline = part.get("inline_data") or part.get("inlineData")
            if inline:
                out.parent.mkdir(parents=True, exist_ok=True)
                out.write_bytes(base64.b64decode(inline["data"]))
                return out
    raise RuntimeError("Gemini не вернул картинку")


def backgrounds_dir(uid: int) -> Path:
    return db.user_dir(uid) / "backgrounds"


def backgrounds(uid: int) -> list[Path]:
    d = backgrounds_dir(uid)
    return sorted(d.glob("bg*.png")) if d.exists() else []


def make_backgrounds(uid: int, refs: list[Path], progress: dict | None = None) -> list[Path]:
    """Генерирует фоны в стиле обложек пользователя. Ошибки не роняют работу — будут градиенты."""
    if not BOT_CONFIG.images_enabled:
        return []
    profile = db.load_profile(uid)
    niche = profile.get("skills", "")[:400]
    style = ("Повтори стиль, цвета и настроение приложенных обложек, но не копируй их. " if refs else "")
    n = BOT_CONFIG.backgrounds
    if progress is not None:
        progress.update(stage="images", done=0, total=n)
    out = []
    for i in range(n):
        path = backgrounds_dir(uid) / f"bg{i + 1}.png"
        if not path.exists():
            prompt = (f"Фон для обложки услуги фрилансера на бирже Kwork. Ниша: {niche}. {style}"
                      f"{VARIANTS[i % len(VARIANTS)]}. Современно, чисто, профессионально. "
                      "Никакого текста, букв, цифр, логотипов и водяных знаков. Без лиц людей. "
                      "Левая половина — спокойная и тёмная: поверх будет крупный белый заголовок.")
            try:
                generate_image(prompt, refs, path)
            except Exception as e:  # noqa: BLE001
                if progress is not None:
                    progress["error"] = f"картинки: {type(e).__name__}: {e}"[:300]
                continue
        out.append(path)
        if progress is not None:
            progress["done"] = len(out)
    return out


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
    img.save(out)
    return out


def render_cover(uid: int, listing: dict) -> Path:
    """Рисует обложку кворка: на ИИ-фоне (если есть) или градиентную."""
    bgs = backgrounds(uid)
    style = listing.get("palette", 0)
    if not bgs:
        return make_cover(listing, out_dir=db.covers_dir(uid), palette=style)
    accent = PALETTES[style % len(PALETTES)][1]
    bg = bgs[listing.get("bg", 0) % len(bgs)]
    return _cover_on_background(listing, bg, accent, db.covers_dir(uid) / f"{listing['id']}.png")
