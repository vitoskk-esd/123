"""Импорт готовых объявлений из архива Telegram-бота (kwork_bot) в очередь публикации."""

from __future__ import annotations

import json
import zipfile
from pathlib import Path

from . import storage
from .config import CONFIG

REQUIRED = ("id", "title", "category_hint", "description", "requirements", "price_rub", "days", "tags")


def import_archive(path: Path) -> int:
    """Добавляет объявления из ZIP (listings.json + covers/<id>.png). Возвращает, сколько добавлено."""
    listings = storage.load_listings()
    known = {l["id"] for l in listings}
    covers = CONFIG.data_dir / "covers"
    covers.mkdir(parents=True, exist_ok=True)
    added = 0
    with zipfile.ZipFile(path) as z:
        for item in json.loads(z.read("listings.json").decode("utf-8")):
            missing = [k for k in REQUIRED if k not in item]
            if missing:
                storage.log(f"Пропущено «{item.get('title', '?')}»: нет полей {', '.join(missing)}")
                continue
            if item["id"] in known:
                continue
            cover = f"covers/{item['id']}.png"
            if cover in z.namelist():
                (covers / f"{item['id']}.png").write_bytes(z.read(cover))
            item.setdefault("idea", item["title"])
            item.setdefault("cover_text", item["title"])
            item.update(status="draft", attempts=0, created=storage.today())
            listings.append(item)
            known.add(item["id"])
            added += 1
    storage.save_listings(listings)
    storage.log(f"Импортировано объявлений: {added} из {path.name}")
    return added
