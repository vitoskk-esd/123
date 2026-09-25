"""CLI агента.

    python -m kwork_agent daily       # полный ежедневный цикл (для расписания)
    python -m kwork_agent research    # только исследование интернета
    python -m kwork_agent reflect     # только обновление стратегии
    python -m kwork_agent generate 5  # сгенерировать N объявлений
    python -m kwork_agent publish     # опубликовать черновики
    python -m kwork_agent login       # войти в Kwork вручную и сохранить сессию
    python -m kwork_agent status      # статистика
"""

from __future__ import annotations

import sys
from collections import Counter

from . import storage


def _llm():
    from .llm import LLM

    return LLM()


def daily() -> int:
    from .generator import generate_listings
    from .publisher import publish_pending
    from .research import run_research
    from .strategy import run_reflection

    llm = _llm()
    storage.log("=== Ежедневный цикл ===")
    failures = 0
    stages = [
        ("исследование", lambda: run_research(llm)),
        ("стратегия", lambda: run_reflection(llm)),
        ("генерация", lambda: generate_listings(llm)),
        ("публикация", lambda: publish_pending(llm)),
    ]
    for name, fn in stages:
        try:
            fn()
        except Exception as e:  # noqa: BLE001 — один сбой не должен ронять весь цикл
            failures += 1
            storage.log(f"Этап «{name}» упал: {type(e).__name__}: {e}")
    storage.log(f"=== Цикл завершён, ошибок: {failures} ===")
    return 1 if failures == len(stages) else 0


def status() -> None:
    kb = storage.load_knowledge()
    listings = storage.load_listings()
    print(f"Фактов в базе знаний: {len(kb['insights'])}")
    print(f"Идей услуг: {len(kb['service_ideas'])} (не использовано: "
          f"{sum(1 for i in kb['service_ideas'] if not i.get('used'))})")
    print(f"Дней исследований: {len(kb['research_log'])}")
    print(f"Объявлений: {len(listings)} — {dict(Counter(l['status'] for l in listings))}")
    for l in listings[-10:]:
        print(f"  [{l['status']}] {l['title']} — {l['price_rub']} ₽")


def main(argv: list[str]) -> int:
    cmd = argv[0] if argv else "daily"
    if cmd == "daily":
        return daily()
    if cmd == "research":
        from .research import run_research
        run_research(_llm())
    elif cmd == "reflect":
        from .strategy import run_reflection
        run_reflection(_llm())
    elif cmd == "generate":
        from .generator import generate_listings
        generate_listings(_llm(), int(argv[1]) if len(argv) > 1 else None)
    elif cmd == "publish":
        from .publisher import publish_pending
        publish_pending(_llm(), int(argv[1]) if len(argv) > 1 else None)
    elif cmd == "login":
        from .publisher import KworkBrowser
        b = KworkBrowser(headless=False)
        try:
            b.login_interactive()
        finally:
            b.close()
    elif cmd == "status":
        status()
    else:
        print(__doc__)
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
