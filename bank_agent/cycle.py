"""Ежедневный цикл: исследование → стратегия → контент → публикация → отчёт владельцу."""

from __future__ import annotations

import datetime as dt

from . import storage
from .config import CONFIG
from .db import DB
from .funnel import goal_status
from .products import load_catalog, sellable


def run_daily(llm, db: DB, publish: bool = True) -> int:
    """publish=False — когда публикацией по расписанию занимается процесс `serve`."""
    from .content import generate_day
    from .publish import enabled_channels, publish_due
    from .report import daily_report, notify_owner
    from .research import run_research
    from .strategy import run_reflection

    storage.log("=== Ежедневный цикл ===")
    catalog = load_catalog()
    products = sellable(catalog)
    status = goal_status(db, dt.date.today(), catalog)

    stages = []
    if CONFIG.research:
        stages.append(("исследование", lambda: run_research(llm, catalog)))
    stages += [
        ("стратегия", lambda: run_reflection(llm, db, status, products)),
        ("контент", lambda: generate_day(llm, db, products, enabled_channels())),
    ]
    if publish:
        stages.append(("публикация", lambda: publish_due(db, catalog)))
    failures = 0
    for name, fn in stages:
        try:
            fn()
        except Exception as e:  # noqa: BLE001 — один сбой не должен ронять весь цикл
            failures += 1
            storage.log(f"Этап «{name}» упал: {type(e).__name__}: {e}")
    report = daily_report(db, catalog)
    (storage.path("reports")).mkdir(exist_ok=True)
    (storage.path("reports") / f"{storage.today()}.md").write_text(report, encoding="utf-8")
    delivered = notify_owner(report)
    storage.log(f"Отчёт сохранён{' и отправлен' if delivered else ''}. === Цикл завершён, ошибок: {failures} ===")
    return 1 if failures == len(stages) else 0
