"""Постоянно работающий процесс (на VPS): счётчик кликов, боты, публикация по расписанию,
напоминания и ежедневный цикл в заданное время. Запуск: python -m bank_agent serve
"""

from __future__ import annotations

import datetime as dt
import os
import threading
import time

from . import storage
from .channels import bot_transports
from .config import CONFIG
from .consultant import Consultant
from .cycle import run_daily
from .db import DB
from .funnel import goal_status
from .products import load_catalog, sellable
from .publish import publish_due
from .report import status_text
from .tracker import start as start_tracker

DAILY_AT = os.getenv("BANK_DAILY_AT", "07:40")  # местное время запуска ежедневного цикла


def _local_now() -> dt.datetime:
    try:
        from zoneinfo import ZoneInfo
        return dt.datetime.now(ZoneInfo(CONFIG.timezone))
    except Exception:  # noqa: BLE001
        return dt.datetime.now(dt.timezone(dt.timedelta(hours=3)))


def _bot_loop(transport, consultant: Consultant, stop: threading.Event) -> None:
    storage.log(f"Бот {transport.platform}: запущен")
    while not stop.is_set():
        try:
            incoming = transport.poll()
        except Exception as e:  # noqa: BLE001 — сеть мигнула: ждём и пробуем снова
            storage.log(f"Бот {transport.platform}: ошибка получения сообщений: {e}")
            time.sleep(10)
            continue
        for inc in incoming:
            try:
                transport.ack(inc)
            except Exception:  # noqa: BLE001
                pass
            try:
                for out in consultant.handle(inc):
                    transport.send(inc.user_id, out)
            except Exception as e:  # noqa: BLE001
                storage.log(f"Бот {transport.platform}: ошибка ответа {inc.user_id}: {type(e).__name__}: {e}")


def serve() -> None:
    from .llm import LLM

    llm, db = LLM(), DB()
    catalog = load_catalog()
    mtime = CONFIG.products_file.stat().st_mtime
    catalog_ref = {"products": {p.id: p for p in catalog}}
    consultant = Consultant(llm, db, sellable(catalog),
                            status_fn=lambda: status_text(goal_status(db, dt.date.today(), catalog)))
    start_tracker(db, catalog_ref, CONFIG.tracker_host, CONFIG.tracker_port)
    storage.log(f"Счётчик переходов слушает {CONFIG.tracker_host}:{CONFIG.tracker_port}")

    stop = threading.Event()
    transports = {t.platform: t for t in bot_transports()}
    for t in transports.values():
        threading.Thread(target=_bot_loop, args=(t, consultant, stop), daemon=True, name=f"bot-{t.platform}").start()
    if not transports:
        storage.log("Боты не запущены: нет ключей (TELEGRAM_BOT_TOKEN / MAX_BOT_TOKEN / VK_GROUP_TOKEN)")

    daily_thread: threading.Thread | None = None
    try:
        while True:
            # Каталог правят руками — подхватываем изменения без перезапуска.
            if CONFIG.products_file.stat().st_mtime != mtime:
                mtime = CONFIG.products_file.stat().st_mtime
                try:
                    catalog[:] = load_catalog()
                    catalog_ref["products"] = {p.id: p for p in catalog}
                    consultant.set_products(sellable(catalog))
                    storage.log("Каталог продуктов перечитан")
                except Exception as e:  # noqa: BLE001
                    storage.log(f"Каталог с ошибкой, оставляю прежний: {e}")
            try:
                publish_due(db, catalog)
            except Exception as e:  # noqa: BLE001
                storage.log(f"Публикация по расписанию: {e}")
            for platform, user_id, msg, rid in consultant.due_reminders():
                t = transports.get(platform)
                if not t:  # бот этой площадки выключен — не копим очередь
                    consultant.mark_sent(rid)
                    continue
                try:
                    t.send(user_id, msg)
                except Exception as e:  # noqa: BLE001
                    storage.log(f"Напоминание {platform}:{user_id} не ушло: {e}")
                consultant.mark_sent(rid)  # не долбим человека повторами при ошибке
            local = _local_now()
            if (local.strftime("%H:%M") >= DAILY_AT and db.get("daily_done") != local.date().isoformat()
                    and not (daily_thread and daily_thread.is_alive())):
                db.set("daily_done", local.date().isoformat())
                daily_thread = threading.Thread(target=run_daily, args=(llm, db, False), daemon=True, name="daily")
                daily_thread.start()
            time.sleep(60)
    except KeyboardInterrupt:
        stop.set()
        storage.log("Остановлено")
