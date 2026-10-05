"""CLI агента.

    python -m bank_agent init               # создать каталог продуктов из примера
    python -m bank_agent check              # проверить настройки и каталог (ничего не тратит)
    python -m bank_agent serve              # всё сразу: боты, счётчик кликов, расписание (для VPS)
    python -m bank_agent daily              # один ежедневный цикл (для cron, если без serve)
    python -m bank_agent research           # только исследование интернета
    python -m bank_agent reflect            # только обновление стратегии
    python -m bank_agent generate           # подготовить посты на сегодня
    python -m bank_agent publish            # опубликовать посты, чьё время пришло
    python -m bank_agent conversions F.csv  # загрузить конверсии из кабинета партнёрки
    python -m bank_agent link <id> <метка>  # ссылка для посева с отдельной меткой источника
    python -m bank_agent report             # отчёт о движении к цели
"""

from __future__ import annotations

import datetime as dt
import shutil
import sys
from pathlib import Path

from . import storage
from .config import CONFIG
from .db import DB


def _llm():
    from .llm import LLM

    return LLM()


def check() -> int:
    from .channels import bot_transports
    from .products import EXAMPLE_FILE, load_catalog, problems, sellable
    from .publish import enabled_channels

    ok = True
    print(f"Модель: {CONFIG.model}; данные: {CONFIG.data_dir}")
    print(f"Цель: {CONFIG.goal} оформлений до {CONFIG.deadline(dt.date.today())}")
    try:
        catalog = load_catalog()
    except FileNotFoundError as e:
        print(f"✗ {e}\n  Быстро: python -m bank_agent init (пример: {EXAMPLE_FILE})")
        return 1
    for p in catalog:
        issues = problems(p)
        mark = "✓" if not issues else "✗"
        print(f"{mark} {p.id}: {p.name} ({p.bank}), выплата {p.payout_rub:.0f} ₽{'' if p.active else ' [выключен]'}")
        for i in issues:
            print(f"    – {i}")
    if not sellable(catalog):
        ok = False
        print("✗ Нет ни одного продукта, готового к продвижению")
    channels = enabled_channels()
    print("Каналы публикации: " + ", ".join(channels))
    if set(channels) <= {"dzen", "shorts"}:
        print("  ! Автопубликация выключена: задайте TELEGRAM_*/VK_*/MAX_* (см. BANK_AGENT.md)")
    bots = [t.platform for t in bot_transports()]
    print("Боты: " + (", ".join(bots) or "нет (нужны ключи ботов)"))
    print("Счётчик кликов: " + (CONFIG.tracker_url or "не настроен — ссылки ведут напрямую, клики не считаются"))
    print(f"Режим проверки (ничего не публикуется): {'да' if CONFIG.dry_run else 'нет'}")
    return 0 if ok else 1


def status() -> None:
    from .products import load_catalog
    from .report import daily_report

    print(daily_report(DB(), load_catalog()))


def main(argv: list[str]) -> int:
    cmd = argv[0] if argv else "check"
    if cmd == "init":
        from .products import EXAMPLE_FILE

        if CONFIG.products_file.exists():
            print(f"{CONFIG.products_file} уже есть — не перезаписываю")
            return 1
        CONFIG.products_file.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy(EXAMPLE_FILE, CONFIG.products_file)
        print(f"Создан {CONFIG.products_file}. Впишите свои ссылки, erid и условия, затем: python -m bank_agent check")
        return 0
    if cmd == "check":
        return check()
    if cmd == "serve":
        from .serve import serve

        serve()
        return 0
    if cmd == "daily":
        from .cycle import run_daily

        return run_daily(_llm(), DB())
    if cmd in ("report", "status"):
        status()
        return 0

    from .products import load_catalog, sellable

    catalog = load_catalog()
    db = DB()
    if cmd == "research":
        from .research import run_research

        run_research(_llm(), catalog)
    elif cmd == "reflect":
        from .funnel import goal_status
        from .report import avg_payout
        from .strategy import run_reflection

        run_reflection(_llm(), db, goal_status(db, dt.date.today(), avg_payout(catalog)))
    elif cmd == "generate":
        from .content import generate_day
        from .publish import enabled_channels

        for r in generate_day(_llm(), db, sellable(catalog), enabled_channels()):
            print(f"[{r['status']}] {r['channel']} {r['scheduled_at']} — {r['idea']}")
    elif cmd == "publish":
        from .publish import publish_due

        publish_due(db, catalog)
    elif cmd == "link":
        from .products import link

        products = {p.id: p for p in catalog}
        if len(argv) < 3 or argv[1] not in products:
            print("Формат: python -m bank_agent link <id продукта> <метка>. Продукты: " + ", ".join(products))
            return 2
        print(link(products[argv[1]], argv[2]))
        return 0
    elif cmd == "conversions":
        from .report import import_conversions

        if len(argv) < 2:
            print("Укажите CSV-файл: python -m bank_agent conversions export.csv")
            return 2
        print(import_conversions(db, Path(argv[1]), catalog))
    else:
        print(__doc__)
        return 2
    storage.log(f"Команда {cmd} выполнена")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
