"""Публичная папка Яндекс Диска: список файлов и скачивание. Ключ не нужен — достаточно
публичной ссылки (https://disk.yandex.ru/d/…), API для публичных ресурсов открытый."""

from __future__ import annotations

import json
import re
import urllib.parse
import urllib.request
from pathlib import Path

API = "https://cloud-api.yandex.net/v1/disk/public/resources"
LINK_RE = re.compile(r"https?://(?:disk\.yandex\.(?:ru|com|by|kz|uz)|yadi\.sk)/[^\s<>\"']+", re.IGNORECASE)
MAX_FILE = 25_000_000  # больше — точно не обложка и не таблица


def find_link(text: str) -> str | None:
    m = LINK_RE.search(text or "")
    return m.group(0).rstrip(".,;)") if m else None


def _get_json(url: str) -> dict:
    try:
        with urllib.request.urlopen(url, timeout=30) as resp:
            return json.load(resp)
    except urllib.error.HTTPError as e:
        if e.code == 404:
            raise ValueError("папка не найдена — проверьте ссылку и что доступ открыт «для всех, у кого есть ссылка»") from e
        raise


def list_dir(public_key: str, path: str = "/") -> list[dict]:
    """Файлы и папки внутри: [{"name", "type": "dir"|"file", "path", "file": ссылка на скачивание, "size"}]."""
    items: list[dict] = []
    offset = 0
    while True:
        query = urllib.parse.urlencode({"public_key": public_key, "path": path, "limit": 1000, "offset": offset})
        data = _get_json(f"{API}?{query}")
        if data.get("type") == "file":  # ссылка не на папку, а на один файл
            return [data]
        batch = data.get("_embedded", {}).get("items", [])
        items += batch
        total = data.get("_embedded", {}).get("total", len(items))
        offset += len(batch)
        if not batch or offset >= total:
            return items


def download(item: dict, out: Path) -> Path:
    url = item.get("file")
    if not url:
        raise ValueError(f"«{item.get('name')}» нельзя скачать")
    if (item.get("size") or 0) > MAX_FILE:
        raise ValueError(f"«{item.get('name')}» больше 25 МБ")
    out.parent.mkdir(parents=True, exist_ok=True)
    with urllib.request.urlopen(url, timeout=120) as resp:
        out.write_bytes(resp.read(MAX_FILE + 1))
    return out
