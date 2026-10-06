"""Сбор новостей: RSS-ленты сайтов и публичные Telegram-каналы (через веб-превью t.me/s/…)."""

from __future__ import annotations

import calendar
import datetime as dt
import html
import re
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass, field
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urljoin, urlsplit, urlunsplit

import requests

from . import storage
from .config import CONFIG

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/126.0 Safari/537.36"
)
TIMEOUT = 20
_TRACKING = re.compile(r"^(utm_|fbclid|gclid|yclid|mc_|ref$|ref_src$|_ga$)", re.IGNORECASE)
_TG_NAME = re.compile(r"^(?:@|(?:https?://)?(?:t|telegram)\.me/(?:s/)?)([A-Za-z0-9_]{4,})/?$")


@dataclass
class NewsItem:
    url: str
    title: str
    summary: str
    source: str
    published: dt.datetime | None = None
    images: list[str] = field(default_factory=list)
    # Для Telegram-постов текст поста и есть статья — страницу скачивать не нужно.
    is_telegram: bool = False


def session() -> requests.Session:
    s = requests.Session()
    s.headers.update({"User-Agent": USER_AGENT, "Accept-Language": "en-US,en;q=0.9,ru;q=0.8"})
    return s


def canonical_url(url: str) -> str:
    """Убирает utm-метки, якорь и хвостовой слэш — чтобы одна новость не считалась двумя."""
    parts = urlsplit(url.strip())
    query = urlencode([(k, v) for k, v in parse_qsl(parts.query) if not _TRACKING.match(k)])
    path = parts.path.rstrip("/") or "/"
    return urlunsplit((parts.scheme.lower() or "https", parts.netloc.lower(), path, query, ""))


def strip_html(text: str) -> str:
    text = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", text or "", flags=re.S | re.I)
    text = re.sub(r"<br\s*/?>|</p>", "\n", text, flags=re.I)
    text = html.unescape(re.sub(r"<[^>]+>", " ", text))
    return re.sub(r"[ \t\xa0]+", " ", re.sub(r"\n\s*\n+", "\n", text)).strip()


def read_sources(path: Path | None = None) -> tuple[list[tuple[str, str]], list[tuple[str, str]]]:
    """Читает sources.txt. Возвращает ([(rss_url, имя)], [(канал, имя)]); имя может быть пустым.

    Формат строки: `ссылка` или `ссылка | Название источника для подписи в постах`.
    """
    rss, channels = [], []
    for line in (path or CONFIG.sources_file).read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        target, _, name = (part.strip() for part in line.partition("|"))
        m = _TG_NAME.match(target)
        if m:
            channels.append((m.group(1), name))
        else:
            rss.append((target, name))
    return rss, channels


def _short_name(title: str, url: str) -> str:
    """«Fashion News and Trends … - Vogue» → «Vogue»: длинные названия лент в подписи не нужны."""
    title = strip_html(title)
    if len(title) > 30:
        title = re.split(r"\s[-|–—]\s", title)[-1].strip()
    return title if 0 < len(title) <= 30 else urlsplit(url).netloc.removeprefix("www.")


# --- RSS ----------------------------------------------------------------------

def _entry_images(entry: dict, base: str) -> list[str]:
    urls: list[str] = []
    for key in ("media_content", "media_thumbnail"):
        for m in entry.get(key) or []:
            if m.get("url") and (m.get("medium") in (None, "image") or "image" in (m.get("type") or "image")):
                urls.append(m["url"])
    for enc in entry.get("enclosures") or []:
        if (enc.get("type") or "").startswith("image") and enc.get("href"):
            urls.append(enc["href"])
    raw = entry.get("summary", "") + "".join(c.get("value", "") for c in entry.get("content") or [])
    urls += re.findall(r"<img[^>]+src=[\"']([^\"']+)", raw, flags=re.I)
    return [urljoin(base, html.unescape(u)) for u in urls]


def _entry_date(entry: dict) -> dt.datetime | None:
    for key in ("published_parsed", "updated_parsed"):
        t = entry.get(key)
        if t:
            return dt.datetime.fromtimestamp(calendar.timegm(t), dt.timezone.utc)
    return None


def parse_rss(content: bytes, feed_url: str, name: str = "") -> list[NewsItem]:
    import feedparser

    feed = feedparser.parse(content)
    source = name or _short_name(feed.feed.get("title", ""), feed_url)
    items = []
    for e in feed.entries:
        link = e.get("link")
        title = strip_html(e.get("title", ""))
        if not link or not title:
            continue
        summary = strip_html(e.get("summary", "") or "".join(c.get("value", "") for c in e.get("content") or []))
        items.append(NewsItem(
            url=canonical_url(link), title=title, summary=summary[:600], source=source,
            published=_entry_date(e), images=_entry_images(e, link),
        ))
    return items


# --- Telegram -----------------------------------------------------------------

_BG_URL = re.compile(r"background-image:\s*url\(['\"]?([^'\")]+)")


def parse_telegram(page: str, channel: str, name: str = "") -> list[NewsItem]:
    """Разбирает веб-превью публичного канала https://t.me/s/<channel>. Берём только посты с фото."""
    from bs4 import BeautifulSoup

    soup = BeautifulSoup(page, "html.parser")
    title_tag = soup.select_one(".tgme_channel_info_header_title") or soup.select_one("meta[property='og:title']")
    source = name or (
        (title_tag.get("content") if title_tag.name == "meta" else title_tag.get_text(strip=True)) if title_tag else ""
    )
    items = []
    for msg in soup.select(".tgme_widget_message[data-post]"):
        photos = []
        for wrap in msg.select(".tgme_widget_message_photo_wrap"):
            m = _BG_URL.search(wrap.get("style", ""))
            if m:
                photos.append(urljoin("https://t.me/", m.group(1)))
        text_tag = msg.select_one(".tgme_widget_message_text")
        if not photos or not text_tag:
            continue
        for br in text_tag.find_all("br"):
            br.replace_with("\n")
        text = text_tag.get_text().strip()
        time_tag = msg.select_one(".tgme_widget_message_date time[datetime]")
        published = dt.datetime.fromisoformat(time_tag["datetime"]) if time_tag else None
        first_line = next((l.strip() for l in text.splitlines() if l.strip()), "")
        items.append(NewsItem(
            url=f"https://t.me/{msg['data-post']}", title=first_line[:150], summary=text[:3000],
            source=source or channel, published=published, images=photos, is_telegram=True,
        ))
    return items


# --- Всё вместе ---------------------------------------------------------------

def _fetch(kind: str, target: str, name: str) -> list[NewsItem]:
    s = session()
    if kind == "rss":
        r = s.get(target, timeout=TIMEOUT)
        r.raise_for_status()
        return parse_rss(r.content, target, name)
    r = s.get(f"https://t.me/s/{target}", timeout=TIMEOUT)
    r.raise_for_status()
    return parse_telegram(r.text, target, name)


def collect_all() -> list[NewsItem]:
    rss, channels = read_sources()
    jobs = [("rss", *src) for src in rss] + [("tg", *src) for src in channels]
    items: list[NewsItem] = []
    with ThreadPoolExecutor(max_workers=8) as pool:
        futures = {pool.submit(_fetch, kind, target, name): target for kind, target, name in jobs}
        for fut, target in futures.items():
            try:
                got = fut.result()
                items += got
            except Exception as e:  # noqa: BLE001 — один упавший источник не мешает остальным
                storage.log(f"Источник {target} недоступен: {type(e).__name__}: {e}")
    unique: dict[str, NewsItem] = {}
    for it in items:
        unique.setdefault(it.url, it)
    return list(unique.values())


def fresh_items(items: list[NewsItem], history: dict, max_age_hours: int | None = None) -> list[NewsItem]:
    """Свежие и ещё не использованные новости, новые первыми."""
    max_age = dt.timedelta(hours=max_age_hours or CONFIG.max_age_hours)
    seen = storage.first_seen([it.url for it in items])
    now = storage.now()
    out = []
    for it in items:
        if it.url in history:
            continue
        when = it.published or seen[it.url]
        if when.tzinfo is None:
            when = when.replace(tzinfo=dt.timezone.utc)
        if now - when <= max_age:
            it.published = when
            out.append(it)
    return sorted(out, key=lambda it: it.published, reverse=True)
