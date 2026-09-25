"""Простое файловое хранилище: база знаний, стратегия, объявления, логи."""

from __future__ import annotations

import datetime as dt
import json
from pathlib import Path
from typing import Any

from .config import CONFIG

MAX_INSIGHTS = 400
MAX_IDEAS = 300


def today() -> str:
    return dt.date.today().isoformat()


def _path(name: str) -> Path:
    CONFIG.data_dir.mkdir(parents=True, exist_ok=True)
    return CONFIG.data_dir / name


def load_json(name: str, default: Any) -> Any:
    p = _path(name)
    if not p.exists():
        return default
    return json.loads(p.read_text(encoding="utf-8"))


def save_json(name: str, data: Any) -> None:
    p = _path(name)
    tmp = p.with_suffix(".tmp")
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    tmp.replace(p)


# --- База знаний -----------------------------------------------------------

def load_knowledge() -> dict:
    kb = load_json("knowledge_base.json", {})
    kb.setdefault("insights", [])
    kb.setdefault("service_ideas", [])
    kb.setdefault("keywords", {})
    kb.setdefault("tools", {})
    kb.setdefault("research_questions", [])
    kb.setdefault("research_log", [])
    return kb


def save_knowledge(kb: dict) -> None:
    kb["insights"] = kb["insights"][-MAX_INSIGHTS:]
    # Неиспользованные идеи важнее, их храним в первую очередь.
    ideas = kb["service_ideas"]
    if len(ideas) > MAX_IDEAS:
        unused = [i for i in ideas if not i.get("used")][-MAX_IDEAS:]
        room = MAX_IDEAS - len(unused)
        used = [i for i in ideas if i.get("used")][-room:] if room else []
        kb["service_ideas"] = used + unused
    kb["research_questions"] = kb["research_questions"][-30:]
    kb["research_log"] = kb["research_log"][-60:]
    save_json("knowledge_base.json", kb)


def top_items(counter: dict, n: int) -> list[str]:
    return [k for k, _ in sorted(counter.items(), key=lambda kv: -kv[1])[:n]]


# --- Стратегия -------------------------------------------------------------

DEFAULT_STRATEGY = """# Стратегия объявлений (начальная версия)

- Пишем для владельцев малого и среднего бизнеса, а не для айтишников: результат
  в деньгах и часах, а не в технологиях.
- Название: начинается с глагола («Настрою», «Создам», «Автоматизирую»),
  содержит конкретный результат и ключевое слово, по которому ищут покупатели.
- Описание: боль клиента → что конкретно получит → как проходит работа →
  почему нам можно доверять. Без воды и без обещаний, которые нельзя проверить.
- Никаких контактов, ссылок и упоминаний сторонних площадок — это запрещено
  правилами Kwork.
- Каждое объявление решает одну узкую задачу для одной аудитории.
- Цена стартовая и понятная, сложные проекты — через доп. опции/обсуждение.
"""


def load_strategy() -> str:
    p = _path("strategy.md")
    if not p.exists():
        p.write_text(DEFAULT_STRATEGY, encoding="utf-8")
    return p.read_text(encoding="utf-8")


def save_strategy(text: str) -> None:
    _path("strategy.md").write_text(text, encoding="utf-8")
    hist = _path("strategy_history")
    hist.mkdir(exist_ok=True)
    (hist / f"{today()}.md").write_text(text, encoding="utf-8")


# --- Объявления ------------------------------------------------------------

def load_listings() -> list[dict]:
    return load_json("listings.json", [])


def save_listings(items: list[dict]) -> None:
    save_json("listings.json", items)


def log(msg: str) -> None:
    line = f"[{dt.datetime.now().isoformat(timespec='seconds')}] {msg}"
    print(line, flush=True)
    logs = _path("logs")
    logs.mkdir(exist_ok=True)
    with (logs / f"{today()}.log").open("a", encoding="utf-8") as f:
        f.write(line + "\n")
