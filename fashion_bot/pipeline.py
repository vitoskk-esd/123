"""Один цикл работы бота: собрать новости → выбрать → написать пост → водяной знак → опубликовать."""

from __future__ import annotations

import datetime as dt
import re
import shutil
import time
from dataclasses import dataclass
from pathlib import Path

from . import storage
from .article import download_photos, fetch_article
from .config import CONFIG
from .llm import LLM
from .sources import NewsItem, collect_all, fresh_items
from .watermark import prepare_images
from .writer import instagram_caption, select_news, telegram_html, write_post

# Сколько запасных новостей просить у Claude: часть может отсеяться (нет фото и т.п.).
SPARE_PICKS = 3
# Сколько дней хранить готовые картинки постов.
KEEP_IMAGES_DAYS = 7


@dataclass
class Post:
    item: NewsItem
    topic: str
    headline: str
    telegram_html: str
    telegram_len: int
    instagram_caption: str
    tg_images: list[Path]
    ig_images: list[Path]
    folder: Path


def _slug(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")[:40] or "post"


def prepare_post(llm: LLM, item: NewsItem, topic: str) -> tuple[Post | None, str]:
    """Готовит пост целиком. Возвращает (пост, "") или (None, причина отказа)."""
    text, urls = fetch_article(item)
    photos = download_photos(urls, item.url)
    if not photos:
        return None, "нет подходящих фото"
    data = write_post(llm, item, text, photos)
    if not data["suitable"]:
        return None, data["reject_reason"] or "не подошла"
    chosen = [photos[i - 1].data for i in data["image_indexes"]]
    stamp = dt.datetime.now().strftime("%Y%m%d-%H%M%S")
    folder = storage.path("images") / f"{stamp}-{_slug(topic or item.title)}"
    tg_images, ig_images = prepare_images(chosen, folder)
    html, tg_len = telegram_html(data, item)
    caption = instagram_caption(data, item)
    (folder / "telegram.html").write_text(html, encoding="utf-8")
    (folder / "instagram.txt").write_text(caption, encoding="utf-8")
    return Post(
        item=item, topic=topic, headline=data["headline"], telegram_html=html, telegram_len=tg_len,
        instagram_caption=caption, tg_images=tg_images, ig_images=ig_images, folder=folder,
    ), ""


class PreviewPublisher:
    """Режим проверки: ничего не публикует, присылает пост вам в личку (если задан чат)."""

    name = "preview"

    def publish(self, post: Post) -> dict:
        from .telegram import Telegram

        result = {"folder": str(post.folder)}
        if CONFIG.telegram_token and CONFIG.telegram_admin_chat:
            tg = Telegram()
            tg.send_post(CONFIG.telegram_admin_chat, post.tg_images, post.telegram_html, post.telegram_len)
            tg.send_post(
                CONFIG.telegram_admin_chat, post.ig_images[:10],
                "<b>Так будет в Instagram:</b>", 0,
            )
            tg.send_message(CONFIG.telegram_admin_chat, post.instagram_caption, html=False)
            result["sent_to_admin"] = True
        return result


def make_publishers(dry_run: bool) -> list:
    if dry_run:
        return [PreviewPublisher()]
    publishers = []
    if CONFIG.telegram_enabled:
        from .telegram import TelegramPublisher
        publishers.append(TelegramPublisher())
    if CONFIG.instagram_enabled:
        from .instagram import InstagramPublisher
        publishers.append(InstagramPublisher())
    return publishers


def _publish(post: Post, publishers: list, dry_run: bool) -> dict:
    results = {}
    for pub in publishers:
        try:
            results[pub.name] = pub.publish(post)
            storage.log(f"  ✓ {pub.name}: {results[pub.name]}")
        except Exception as e:  # noqa: BLE001 — сбой одной площадки не отменяет другую
            results[pub.name] = {"error": f"{type(e).__name__}: {e}"}
            storage.log(f"  ✗ {pub.name}: {e}")
    record = {
        "at": storage.now().isoformat(timespec="seconds"),
        "url": post.item.url,
        "source": post.item.source,
        "title": post.item.title,
        "topic": post.topic,
        "headline": post.headline,
        "folder": str(post.folder),
        "results": results,
    }
    if dry_run:
        record["dry_run"] = True
    storage.add_post(record)
    return results


def cleanup_images() -> None:
    cutoff = time.time() - KEEP_IMAGES_DAYS * 86400
    for folder in storage.path("images").glob("*"):
        if folder.is_dir() and folder.stat().st_mtime < cutoff:
            shutil.rmtree(folder, ignore_errors=True)


def today_start() -> dt.datetime:
    from zoneinfo import ZoneInfo

    local = dt.datetime.now(ZoneInfo(CONFIG.timezone))
    return local.replace(hour=0, minute=0, second=0, microsecond=0).astimezone(dt.timezone.utc)


def run_cycle(llm: LLM | None = None, *, posts: int | None = None, dry_run: bool | None = None,
              publishers: list | None = None) -> int:
    """Один проход. Возвращает число подготовленных/опубликованных постов."""
    from .telegram import notify_admin

    dry_run = CONFIG.dry_run if dry_run is None else dry_run
    posts = posts or CONFIG.posts_per_cycle
    if not dry_run:
        left = CONFIG.max_posts_per_day - storage.posts_since(today_start())
        if left <= 0:
            storage.log(f"Дневной лимит {CONFIG.max_posts_per_day} постов уже выбран")
            return 0
        posts = min(posts, left)
    publishers = make_publishers(dry_run) if publishers is None else publishers
    if not publishers:
        storage.log("Некуда публиковать: задайте TELEGRAM_* и/или INSTAGRAM_* или включите FASHION_DRY_RUN=1")
        return 0

    cleanup_images()
    items = fresh_items(collect_all(), storage.load_history())
    storage.log(f"Свежих новостей: {len(items)}")
    if not items:
        return 0
    llm = llm or LLM()
    picks = select_news(llm, items, posts + SPARE_PICKS)
    storage.log(f"Claude выбрал: {[t for _, t in picks]}")

    done = 0
    for item, topic in picks:
        if done >= posts:
            break
        storage.log(f"Готовлю: {item.title} ({item.source})")
        try:
            post, reason = prepare_post(llm, item, topic)
        except Exception as e:  # noqa: BLE001 — пробуем следующую новость
            storage.log(f"  ошибка подготовки: {type(e).__name__}: {e}")
            storage.mark(item.url, "error", reason=f"{type(e).__name__}: {e}")
            continue
        if post is None:
            storage.log(f"  пропущена: {reason}")
            storage.mark(item.url, "rejected", reason=reason)
            continue
        results = _publish(post, publishers, dry_run)
        ok = [name for name, r in results.items() if "error" not in r]
        failed = {name: r["error"] for name, r in results.items() if "error" in r}
        # Даже при частичном сбое новость считается использованной — чтобы не задублить пост.
        status = "preview" if dry_run else ("posted" if ok else "failed")
        storage.mark(item.url, status, topic=topic)
        if failed:
            notify_admin(f"⚠️ Пост «{post.headline}»: не вышло в {', '.join(failed)}\n{failed}")
        if ok:
            done += 1
    storage.log(f"Готово постов: {done}")
    return done


def _in_active_hours(now: dt.datetime) -> bool:
    start, _, end = CONFIG.active_hours.partition("-")
    return int(start) <= now.hour < int(end or 24)


def run_forever() -> None:
    """Режим сервера: каждые FASHION_INTERVAL_MIN минут в активные часы выпускает пост."""
    from zoneinfo import ZoneInfo

    from .telegram import notify_admin

    storage.log(
        f"Бот запущен: каждые {CONFIG.interval_min} мин, часы {CONFIG.active_hours} ({CONFIG.timezone}), "
        f"режим {'проверки' if CONFIG.dry_run else 'публикации'}"
    )
    llm = LLM()
    while True:
        now = dt.datetime.now(ZoneInfo(CONFIG.timezone))
        if _in_active_hours(now):
            try:
                run_cycle(llm)
            except Exception as e:  # noqa: BLE001 — бот должен жить дальше
                storage.log(f"Цикл упал: {type(e).__name__}: {e}")
                notify_admin(f"⚠️ Ошибка бота: {type(e).__name__}: {e}")
            time.sleep(CONFIG.interval_min * 60)
        else:
            time.sleep(600)
