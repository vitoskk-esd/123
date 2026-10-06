"""Страница новости: текст статьи и фото-кандидаты, скачивание и отсев фото."""

from __future__ import annotations

import base64
import io
import re
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass
from urllib.parse import urljoin, urlsplit

from .config import CONFIG
from .sources import TIMEOUT, NewsItem, session

MAX_ARTICLE_CHARS = 8000
_SKIP_IMG = re.compile(r"(logo|avatar|icon|sprite|placeholder|pixel|blank|badge|emoji|gravatar|author)", re.I)
_DROP_TAGS = ["script", "style", "noscript", "nav", "footer", "header", "aside", "form", "iframe", "svg"]


@dataclass
class Photo:
    url: str
    data: bytes  # исходный файл
    width: int
    height: int


def _largest_from_srcset(srcset: str) -> str | None:
    best, best_w = None, -1
    for part in srcset.split(","):
        bits = part.strip().split()
        if not bits:
            continue
        w = 0
        if len(bits) > 1 and bits[1][:-1].replace(".", "").isdigit():
            w = float(bits[1][:-1]) * (1000 if bits[1].endswith("x") else 1)
        if w > best_w:
            best, best_w = bits[0], w
    return best


def parse_article(page: str, url: str) -> tuple[str, list[str]]:
    """Возвращает (текст статьи, ссылки на фото в порядке важности)."""
    from bs4 import BeautifulSoup

    soup = BeautifulSoup(page, "html.parser")
    images: list[str] = []
    for prop in ("og:image", "og:image:url", "twitter:image", "twitter:image:src"):
        tag = soup.find("meta", attrs={"property": prop}) or soup.find("meta", attrs={"name": prop})
        if tag and tag.get("content"):
            images.append(tag["content"])

    for t in soup(_DROP_TAGS):
        t.decompose()
    body = soup.find("article") or soup.find("main") or soup.body or soup

    for img in body.find_all(["img", "source"]):
        src = None
        for attr in ("data-srcset", "srcset", "data-lazy-srcset"):
            if img.get(attr):
                src = _largest_from_srcset(img[attr])
                break
        src = src or img.get("data-src") or img.get("data-lazy-src") or img.get("data-original") or img.get("src")
        if not src or src.startswith("data:"):
            continue
        width = img.get("width", "")
        if width.isdigit() and int(width) < 300:
            continue
        images.append(src)

    paragraphs = []
    for el in body.find_all(["h1", "h2", "h3", "p", "li"]):
        text = re.sub(r"\s+", " ", el.get_text(" ", strip=True))
        if len(text) > 30 and text not in paragraphs:
            paragraphs.append(text)
    text = "\n".join(paragraphs)[:MAX_ARTICLE_CHARS]

    seen, clean = set(), []
    for src in images:
        full = urljoin(url, src.strip())
        path = urlsplit(full).path.lower()
        if not full.startswith("http") or path.endswith((".svg", ".gif")) or _SKIP_IMG.search(path):
            continue
        key = urlsplit(full)._replace(query="").geturl()
        if key not in seen:
            seen.add(key)
            clean.append(full)
    return text, clean


def fetch_article(item: NewsItem) -> tuple[str, list[str]]:
    """Текст и фото новости. Для Telegram-постов страница не нужна."""
    if item.is_telegram:
        return item.summary, list(item.images)
    try:
        r = session().get(item.url, timeout=TIMEOUT)
        r.raise_for_status()
        text, images = parse_article(r.text, r.url)
    except Exception:  # noqa: BLE001 — сайт мог закрыться от ботов, тогда работаем по RSS
        text, images = "", []
    # Если со страницы мало текста (сайт не отдал статью ботам) — добавляем описание из RSS.
    if len(text) < 800 and item.summary and item.summary[:100] not in text:
        text = f"{item.summary}\n\n{text}".strip()
    # Фото из RSS обычно главное — ставим первым.
    ordered = []
    for u in item.images + images:
        if u not in ordered:
            ordered.append(u)
    return text, ordered


# --- Скачивание и отбор фото ---------------------------------------------------

def _download(url: str, referer: str) -> Photo | None:
    from PIL import Image

    try:
        r = session().get(url, timeout=TIMEOUT, headers={"Referer": referer})
        r.raise_for_status()
        if len(r.content) > 25_000_000:
            return None
        with Image.open(io.BytesIO(r.content)) as img:
            img.load()
            w, h = img.size
    except Exception:  # noqa: BLE001 — битая ссылка или не картинка
        return None
    return Photo(url=url, data=r.content, width=w, height=h)


def average_hash(data: bytes) -> int:
    """Простой перцептивный хеш: одинаковые фото разных размеров дают близкие значения."""
    from PIL import Image

    with Image.open(io.BytesIO(data)) as img:
        small = img.convert("L").resize((8, 8))
        pixels = list(small.getdata())
    avg = sum(pixels) / len(pixels)
    return sum(1 << i for i, p in enumerate(pixels) if p > avg)


def _similar(a: int, b: int, threshold: int = 6) -> bool:
    return bin(a ^ b).count("1") <= threshold


def download_photos(urls: list[str], referer: str) -> list[Photo]:
    """Скачивает фото-кандидаты, выкидывает мелкие, слишком вытянутые и дубли."""
    urls = urls[: CONFIG.max_image_candidates * 2]
    with ThreadPoolExecutor(max_workers=6) as pool:
        photos = list(pool.map(lambda u: _download(u, referer), urls))
    result: list[Photo] = []
    hashes: list[int] = []
    for p in photos:
        if p is None or min(p.width, p.height) < CONFIG.min_image_side:
            continue
        if not 0.4 <= p.width / p.height <= 2.5:
            continue
        h = average_hash(p.data)
        dup = next((i for i, other in enumerate(hashes) if _similar(h, other)), None)
        if dup is not None:
            # Оставляем вариант побольше.
            if p.width * p.height > result[dup].width * result[dup].height:
                result[dup], hashes[dup] = p, h
            continue
        result.append(p)
        hashes.append(h)
        if len(result) >= CONFIG.max_image_candidates:
            break
    return result


def thumbnail_b64(photo: Photo, size: int = 768) -> str:
    """Уменьшенная JPEG-копия для Claude (экономит токены)."""
    from PIL import Image

    with Image.open(io.BytesIO(photo.data)) as img:
        img = img.convert("RGB")
        img.thumbnail((size, size))
        buf = io.BytesIO()
        img.save(buf, "JPEG", quality=80)
    return base64.standard_b64encode(buf.getvalue()).decode()
