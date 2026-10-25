"""Кворки-образцы пользователя. Удобнее всего — одна ссылка на профиль Kwork (или на любой
свой кворк): список кворков продавца берём тем же запросом, что и страница профиля, а каждый
кворк — из JSON на его странице. Без ИИ. Можно и вставить текст кворка."""

from __future__ import annotations

import html
import json
import re
import urllib.request
from urllib.parse import urlparse

from . import db

URL_RE = re.compile(r"https?://(?:www\.)?kwork\.ru/[^\s<>\"']+", re.IGNORECASE)
PROFILE_RE = re.compile(r"https?://(?:www\.)?kwork\.ru/user/([A-Za-z0-9_.-]{1,64})", re.IGNORECASE)
USERNAME_RE = re.compile(r"[A-Za-z0-9_.-]{1,64}")
MAX_EXAMPLES = 5
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36"}


def find_urls(text: str) -> list[str]:
    """Ссылки на кворки (ссылка на профиль сюда не входит — её ищет find_profile)."""
    return [u.rstrip(".,;)") for u in URL_RE.findall(text or "") if not PROFILE_RE.match(u)]


def find_profile(text: str) -> str | None:
    m = PROFILE_RE.search(text or "")
    return m.group(1) if m else None


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
        "username": data.get("username", ""),
    }


def seller_kworks(username: str) -> tuple[int, list[str]]:
    """(сколько активных кворков у продавца, ссылки на первые 10) — запрос страницы профиля.
    Больше 10 за раз Kwork не отдаёт (limit > 10 → ошибка)."""
    if not USERNAME_RE.fullmatch(username or ""):
        raise ValueError("непонятное имя продавца в ссылке")
    req = urllib.request.Request(
        f"https://kwork.ru/user_kworks/{username.lower()}",
        json.dumps({"username": username, "offset": 0, "limit": 10}).encode(),
        {**UA, "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest",
         "Origin": "https://kwork.ru"},
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        data = json.load(resp)
    if not data.get("success") or not isinstance(data.get("data"), dict):
        raise ValueError("не нашёл такого продавца на Kwork — проверьте ссылку на профиль")
    items = data["data"].get("data") or []
    urls = [f"https://kwork.ru{i['url']}" for i in items if str(i.get("url", "")).startswith("/")]
    return int(data["data"].get("total") or len(urls)), urls


def seller_kwork_count(username: str) -> int | None:
    """Сколько активных кворков у продавца; None — если узнать не получилось."""
    try:
        return seller_kworks(username)[0]
    except Exception:  # noqa: BLE001 — запасной путь: число со страницы профиля
        pass
    if not USERNAME_RE.fullmatch(username or ""):
        return None
    page = _get(f"https://kwork.ru/user/{username.lower()}", 3_000_000).decode("utf-8", "replace")
    m = re.search(r'"totalKworks"\s*:\s*(\d+)', page)
    return int(m.group(1)) if m else None


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


def add_example(uid: int, example: dict) -> int:
    """Добавляет образец в профиль. Возвращает, сколько образцов теперь."""
    profile = db.load_profile(uid)
    examples = profile.setdefault("examples", [])
    if any(e["title"] == example["title"] for e in examples) or len(examples) >= MAX_EXAMPLES:
        return len(examples)
    examples.append(example)
    db.save_profile(uid, profile)
    return len(examples)

