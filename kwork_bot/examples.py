"""Кворки-образцы пользователя: по ссылке читаем страницу Kwork (без ИИ — данные лежат
в JSON на странице) или принимаем вставленный текст кворка."""

from __future__ import annotations

import html
import json
import re
import urllib.request
from pathlib import Path
from urllib.parse import urlparse

from . import db

URL_RE = re.compile(r"https?://(?:www\.)?kwork\.ru/[^\s<>\"']+", re.IGNORECASE)
MAX_EXAMPLES = 5
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36"}


def find_urls(text: str) -> list[str]:
    return [u.rstrip(".,;)") for u in URL_RE.findall(text or "")]


def _kwork_host(url: str) -> bool:
    host = (urlparse(url).hostname or "").lower()
    return urlparse(url).scheme == "https" and (host == "kwork.ru" or host.endswith(".kwork.ru"))


def _get(url: str, limit: int) -> bytes:
    # Ходим только на kwork.ru и его CDN — ссылки присылают пользователи.
    if not _kwork_host(url):
        raise ValueError("принимаю только ссылки на kwork.ru")
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=20) as resp:
        if not _kwork_host(resp.geturl()):
            raise ValueError("ссылка ведёт не на kwork.ru")
        return resp.read(limit)


def html_to_text(s: str) -> str:
    s = re.sub(r"(?i)<br\s*/?>|</p>|</li>", "\n", s or "")
    s = html.unescape(re.sub(r"<[^>]+>", "", s))
    return re.sub(r"\n{3,}", "\n\n", re.sub(r"[ \t]+", " ", s)).strip()


def _meta(page: str, prop: str) -> str:
    m = re.search(rf'<meta (?:property|name)="{prop}" content="([^"]*)"', page)
    return html.unescape(m.group(1)) if m else ""


def parse_page(page: str, url: str) -> dict:
    """Достаёт кворк из HTML страницы Kwork. Бросает ValueError, если это не страница кворка."""
    i = page.find('"kwork":{')
    data: dict = {}
    if i != -1:
        try:
            data, _ = json.JSONDecoder().raw_decode(page[i + len('"kwork":'):])
        except ValueError:
            data = {}
    title = data.get("gtitle") or _meta(page, "og:title").split(" за ")[0]
    description = html_to_text(data.get("gdesc", "")) or _meta(page, "og:description")
    if not title or not description:
        raise ValueError("не нашёл на странице кворк — проверьте ссылку")
    try:
        price = int(data.get("price") or 0)
    except (TypeError, ValueError):
        price = 0
    try:
        days = int(data.get("days") or 0)
    except (TypeError, ValueError):
        days = 0
    return {
        "title": title.strip(),
        "description": description,
        "requirements": html_to_text(data.get("ginst", "")),
        "price_rub": price,
        "days": days,
        "category_hint": data.get("categoryTitle", ""),
        "cover_url": _meta(page, "og:image"),
        "url": url,
    }


def fetch_kwork(url: str) -> dict:
    return parse_page(_get(url, 3_000_000).decode("utf-8", "replace"), url)


def from_text(text: str) -> dict:
    """Кворк, вставленный текстом: первая строка — название, остальное — описание."""
    lines = [l.strip() for l in text.strip().splitlines() if l.strip()]
    if len(lines) < 2 or len(text) < 150:
        raise ValueError("слишком коротко — пришлите название и описание кворка целиком")
    prices = [int(p.replace(" ", "")) for p in re.findall(r"(\d[\d ]{2,6})\s*(?:₽|руб)", text)]
    return {"title": lines[0][:120], "description": "\n".join(lines[1:]), "requirements": "",
            "price_rub": min(prices) if prices else 0, "days": 0, "category_hint": "", "cover_url": "", "url": ""}


def save_cover(uid: int, example: dict, n: int) -> Path | None:
    """Скачивает обложку образца — она нужна как образец стиля для ИИ-фонов."""
    if not example.get("cover_url"):
        return None
    try:
        data = _get(example["cover_url"], 5_000_000)
    except Exception:  # noqa: BLE001 — без обложки образец всё равно полезен
        return None
    path = db.user_dir(uid) / "examples" / f"{n}.jpg"
    path.parent.mkdir(exist_ok=True)
    path.write_bytes(data)
    return path


def add_example(uid: int, example: dict) -> int:
    """Добавляет образец в профиль. Возвращает, сколько образцов теперь."""
    profile = db.load_profile(uid)
    examples = profile.setdefault("examples", [])
    if any(e["title"] == example["title"] for e in examples) or len(examples) >= MAX_EXAMPLES:
        return len(examples)
    cover = save_cover(uid, example, len(examples) + 1)
    example["cover_file"] = cover.name if cover else ""
    examples.append(example)
    db.save_profile(uid, profile)
    return len(examples)


def cover_paths(uid: int) -> list[Path]:
    d = db.user_dir(uid) / "examples"
    return [d / e["cover_file"] for e in db.load_profile(uid).get("examples", [])
            if e.get("cover_file") and (d / e["cover_file"]).exists()]
