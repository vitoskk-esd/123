"""Файловое хранилище: база знаний, стратегия, черновики для ручной публикации, логи."""

from __future__ import annotations

import datetime as dt
import json
from pathlib import Path
from typing import Any

from .config import CONFIG

MAX_INSIGHTS = 300
MAX_IDEAS = 200


def today() -> str:
    return dt.date.today().isoformat()


def path(name: str) -> Path:
    CONFIG.data_dir.mkdir(parents=True, exist_ok=True)
    return CONFIG.data_dir / name


def load_json(name: str, default: Any) -> Any:
    p = path(name)
    if not p.exists():
        return default
    return json.loads(p.read_text(encoding="utf-8"))


def save_json(name: str, data: Any) -> None:
    p = path(name)
    tmp = p.with_suffix(".tmp")
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    tmp.replace(p)


# --- База знаний -----------------------------------------------------------

def load_knowledge() -> dict:
    kb = load_json("knowledge_base.json", {})
    for key in ("insights", "hot_offers", "legal_alerts", "content_ideas",
                "audience_questions", "research_questions", "research_log"):
        kb.setdefault(key, [])
    return kb


def save_knowledge(kb: dict) -> None:
    kb["insights"] = kb["insights"][-MAX_INSIGHTS:]
    ideas = kb["content_ideas"]
    if len(ideas) > MAX_IDEAS:
        unused = [i for i in ideas if not i.get("used")][-MAX_IDEAS:]
        room = MAX_IDEAS - len(unused)
        used = [i for i in ideas if i.get("used")][-room:] if room else []
        kb["content_ideas"] = used + unused
    kb["hot_offers"] = kb["hot_offers"][-60:]
    kb["legal_alerts"] = kb["legal_alerts"][-40:]
    kb["audience_questions"] = kb["audience_questions"][-150:]
    kb["research_questions"] = kb["research_questions"][-20:]
    kb["research_log"] = kb["research_log"][-60:]
    save_json("knowledge_base.json", kb)


# --- Стратегия -------------------------------------------------------------

DEFAULT_STRATEGY = """# Стратегия продвижения (начальная версия)

Источник: исследование рынка, октябрь 2026 — см. BANK_STRATEGY.md.

## Принципы
- Мы не банк, а независимый помощник: честно сравниваем карты, говорим об условиях
  и ограничениях. Доверие — главный актив, без него партнёрские ссылки не жмут.
- Продаём выгоду, понятную за 3 секунды: «бонус X ₽ при первой покупке»,
  «кэшбэк на продукты и такси», «бесплатное обслуживание при условии…».
- Каждый пост — одна мысль, один продукт, один призыв. Условия бонуса — по шагам.
- Никаких выдуманных отзывов, «я сам пользуюсь», гарантий одобрения, «бесплатных денег».

## Что работает
- Подборки «какую карту выбрать студенту / пенсионеру / для такси / для маркетплейсов».
- Разборы «как получить бонус за карту: 3 шага, чтобы банк засчитал».
- Сравнения 2–3 карт по одному признаку (кэшбэк на продукты, обслуживание 0 ₽).
- Сезонные поводы: категории кэшбэка месяца, распродажи маркетплейсов, сессия, зарплата.
- Ответы на частые вопросы людей (их собирает исследование) — короткими постами.

## Каналы (по приоритету для России осенью 2026)
1. VK (сообщество + Клипы) — крупнейшая аудитория, реклама законна при маркировке.
2. MAX (канал + бот) — быстро растёт, подписчик в 3–10 раз дешевле, чем в Telegram.
3. Telegram — ещё 70+ млн, но работает с ограничениями; ФАС не штрафует за
   рекламу там только до конца 2026 года — держим как временный канал.
4. Дзен — статьи-гайды под поиск Яндекса (партнёрские ссылки — после одобрения).
5. Короткие видео (VK Клипы, Shorts) — бесплатный охват, ведём в бот/канал.

## Конверсия
- Ведём людей не сразу в банк, а в бота: он подбирает карту под человека, объясняет
  условия бонуса и напоминает об активации — именно на шаге «оформил → активировал»
  теряется больше половины выплат.
"""


def load_strategy() -> str:
    p = path("strategy.md")
    if not p.exists():
        p.write_text(DEFAULT_STRATEGY, encoding="utf-8")
    return p.read_text(encoding="utf-8")


def save_strategy(text: str) -> None:
    path("strategy.md").write_text(text, encoding="utf-8")
    hist = path("strategy_history")
    hist.mkdir(exist_ok=True)
    (hist / f"{today()}.md").write_text(text, encoding="utf-8")


def outbox_dir() -> Path:
    d = path("outbox") / today()
    d.mkdir(parents=True, exist_ok=True)
    return d


def log(msg: str) -> None:
    line = f"[{dt.datetime.now().isoformat(timespec='seconds')}] {msg}"
    print(line, flush=True)
    logs = path("logs")
    logs.mkdir(exist_ok=True)
    with (logs / f"{today()}.log").open("a", encoding="utf-8") as f:
        f.write(line + "\n")
