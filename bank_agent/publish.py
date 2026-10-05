"""Публикация постов из очереди в каналы, когда подошло их время."""

from __future__ import annotations

import datetime as dt

from . import storage
from .channels import VK, Button, Max, Outgoing, Telegram, with_retries
from .config import CONFIG
from .db import DB, iso, now
from .products import Product, link, problems


def enabled_channels() -> list[str]:
    """Каналы, для которых есть ключи. Черновики (Дзен, видео) доступны всегда."""
    out = []
    if CONFIG.telegram_bot_token and CONFIG.telegram_channel:
        out.append("telegram")
    if CONFIG.vk_user_token and CONFIG.vk_group_id:
        out.append("vk")
    if CONFIG.max_bot_token and CONFIG.max_channel_id:
        out.append("max")
    return out + ["dzen", "shorts"]


class Publisher:
    def __init__(self):
        self.tg = Telegram(CONFIG.telegram_bot_token) if CONFIG.telegram_bot_token else None
        self.max = Max(CONFIG.max_bot_token, CONFIG.max_api_base) if CONFIG.max_bot_token else None
        self.vk = VK(CONFIG.vk_group_token, CONFIG.vk_group_id, CONFIG.vk_user_token, CONFIG.vk_api_version)

    def publish(self, channel: str, text: str, button_url: str) -> str:
        msg = Outgoing(text, [[Button("Подробнее и оформить", url=button_url)]])
        if channel == "telegram":
            return self.tg.send(CONFIG.telegram_channel, msg)
        if channel == "max":
            return self.max.post_channel(CONFIG.max_channel_id, msg)
        if channel == "vk":
            return self.vk.post_wall(text)
        raise ValueError(f"канал {channel} не публикуется автоматически")


def publish_due(db: DB, catalog: list[Product], publisher=None, at: dt.datetime | None = None) -> tuple[int, int]:
    """Публикует посты, чьё время пришло. Возвращает (попыток, успешно)."""
    at = at or now()
    rows = db.all("SELECT * FROM posts WHERE status='queued' AND scheduled_at<=? ORDER BY scheduled_at", (iso(at),))
    if not rows:
        return 0, 0
    if CONFIG.dry_run:
        for r in rows:
            db.execute("UPDATE posts SET status='dry_run', note='BANK_DRY_RUN=1: не опубликовано' WHERE id=?", (r["id"],))
        storage.log(f"Режим проверки: {len(rows)} постов готовы, но не опубликованы (BANK_DRY_RUN=1)")
        return len(rows), 0
    publisher = publisher or Publisher()
    products = {p.id: p for p in catalog}
    ok = 0
    for r in rows:
        product = products.get(r["product_id"])
        blockers = problems(product) if product else ["продукт удалён из каталога"]
        if not product or not product.active or blockers:
            note = "; ".join(blockers) or "продукт отключён"
            db.execute("UPDATE posts SET status='rejected', note=? WHERE id=?", (note[:500], r["id"]))
            continue
        try:
            ext = with_retries(lambda: publisher.publish(r["channel"], r["text"], link(product, r["channel"], r["id"])))
        except Exception as e:  # noqa: BLE001 — сбой одного поста не останавливает остальные
            db.execute("UPDATE posts SET status='failed', note=? WHERE id=?", (f"{type(e).__name__}: {e}"[:500], r["id"]))
            storage.log(f"Не удалось опубликовать {r['id']} в {r['channel']}: {e}")
            continue
        db.execute("UPDATE posts SET status='published', published_at=?, external_id=? WHERE id=?",
                   (iso(now()), ext, r["id"]))
        ok += 1
    storage.log(f"Публикация: {ok}/{len(rows)}")
    return len(rows), ok
