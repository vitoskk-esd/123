"""CLI бота.

    python -m fashion_bot cycle            # один проход: найти новость, написать пост, опубликовать
    python -m fashion_bot run              # работать постоянно по расписанию (для сервера)
    python -m fashion_bot preview [N]      # подготовить N постов без публикации (проверка)
    python -m fashion_bot collect          # показать свежие новости из источников
    python -m fashion_bot watermark FILE   # наложить водяной знак на своё фото (проверить вид)
    python -m fashion_bot check            # проверить настройки Telegram, Instagram и источники
    python -m fashion_bot status           # последние посты
"""

from __future__ import annotations

import sys
from collections import Counter
from pathlib import Path

from . import storage
from .config import CONFIG


def collect() -> None:
    from .sources import collect_all, fresh_items

    items = fresh_items(collect_all(), storage.load_history())
    print(f"Свежих новостей: {len(items)}")
    for it in items[:40]:
        print(f"  [{it.source}] {it.title}  ({len(it.images)} фото)\n      {it.url}")


def watermark(src: str, dst: str | None) -> None:
    from .watermark import prepare_images

    out = Path(dst) if dst else storage.path("watermark_test")
    tg, ig = prepare_images([Path(src).read_bytes()], out)
    print(f"Готово:\n  Telegram: {tg[0]}\n  Instagram: {ig[0]}")


def check() -> int:
    from .sources import read_sources

    import os

    problems = 0
    if os.getenv("ANTHROPIC_API_KEY"):
        print(f"Claude: ключ задан, модель {CONFIG.model}")
    else:
        print("Claude: НЕТ ANTHROPIC_API_KEY — посты писать нечем")
        problems += 1
    rss, channels = read_sources()
    print(f"Источники: {len(rss)} RSS, {len(channels)} Telegram-каналов ({CONFIG.sources_file})")
    print(f"Режим: {'ПРОВЕРКА (ничего не публикуется)' if CONFIG.dry_run else 'публикация'}")
    print(f"Водяной знак: {CONFIG.watermark_logo or repr(CONFIG.mark_text)}, позиция {CONFIG.watermark_position}")

    if CONFIG.telegram_token:
        from .telegram import Telegram

        tg = Telegram()
        try:
            me = tg.call("getMe")
            print(f"Telegram-бот: @{me['username']}")
            if CONFIG.telegram_channel:
                chat = tg.call("getChat", {"chat_id": CONFIG.telegram_channel})
                member = tg.call("getChatMember", {"chat_id": CONFIG.telegram_channel, "user_id": me["id"]})
                can_post = member.get("status") == "creator" or member.get("can_post_messages")
                print(f"Канал: {chat.get('title')} — {'бот может публиковать' if can_post else 'НЕТ прав на публикацию'}")
                problems += not can_post
            else:
                print("TELEGRAM_CHANNEL не задан — в Telegram публиковать не будет")
            if CONFIG.telegram_admin_chat:
                tg.send_message(CONFIG.telegram_admin_chat, "✅ Бот на связи: сюда будут приходить ошибки и посты на проверку.", html=False)
                print("Тестовое сообщение отправлено в TELEGRAM_ADMIN_CHAT")
        except Exception as e:  # noqa: BLE001
            print(f"Telegram: ОШИБКА — {e}")
            problems += 1
    else:
        print("Telegram: не настроен (TELEGRAM_BOT_TOKEN)")

    if CONFIG.instagram_enabled:
        try:
            from .instagram import Instagram

            info = Instagram().whoami()
            print(f"Instagram: @{info.get('username')}, хостинг фото: {CONFIG.image_host}")
        except Exception as e:  # noqa: BLE001
            print(f"Instagram: ОШИБКА — {e}")
            problems += 1
    else:
        print("Instagram: не настроен (INSTAGRAM_USER_ID, INSTAGRAM_ACCESS_TOKEN)")
    return 1 if problems else 0


def status() -> None:
    posts = storage.load_posts()
    hist = storage.load_history()
    print(f"Новостей обработано: {len(hist)} — {dict(Counter(h['status'] for h in hist.values()))}")
    print(f"Постов в истории: {len(posts)}")
    for p in posts[-10:]:
        flags = ", ".join(f"{k}: {'ошибка' if 'error' in v else 'ok'}" for k, v in p["results"].items())
        print(f"  {p['at'][:16]} {'[проверка] ' if p.get('dry_run') else ''}{p['headline']} — {flags}")


def main(argv: list[str]) -> int:
    cmd = argv[0] if argv else "cycle"
    if cmd == "cycle":
        from .pipeline import run_cycle
        from .telegram import notify_admin
        try:
            run_cycle()
        except Exception as e:
            notify_admin(f"⚠️ Ошибка бота: {type(e).__name__}: {e}")
            raise
    elif cmd == "run":
        from .pipeline import run_forever
        run_forever()
    elif cmd == "preview":
        from .pipeline import run_cycle
        run_cycle(posts=int(argv[1]) if len(argv) > 1 else 1, dry_run=True)
    elif cmd == "collect":
        collect()
    elif cmd == "watermark" and len(argv) > 1:
        watermark(argv[1], argv[2] if len(argv) > 2 else None)
    elif cmd == "check":
        return check()
    elif cmd == "status":
        status()
    else:
        print(__doc__)
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
