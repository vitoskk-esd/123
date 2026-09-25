"""Ежедневное исследование ниши в интернете и пополнение базы знаний."""

from __future__ import annotations

import json
import random

from . import storage
from .config import CONFIG
from .llm import LLM

EXTRACT_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "required": ["insights", "service_ideas", "keywords", "tools", "next_research_questions"],
    "properties": {
        "insights": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties": False,
                "required": ["topic", "insight", "source"],
                "properties": {
                    "topic": {"type": "string"},
                    "insight": {"type": "string"},
                    "source": {"type": "string"},
                },
            },
        },
        "service_ideas": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties": False,
                "required": ["name", "audience", "problem", "deliverable", "tools", "price_rub"],
                "properties": {
                    "name": {"type": "string"},
                    "audience": {"type": "string"},
                    "problem": {"type": "string"},
                    "deliverable": {"type": "string"},
                    "tools": {"type": "string"},
                    "price_rub": {"type": "integer"},
                },
            },
        },
        "keywords": {"type": "array", "items": {"type": "string"}},
        "tools": {"type": "array", "items": {"type": "string"}},
        "next_research_questions": {"type": "array", "items": {"type": "string"}},
    },
}

SYSTEM = (
    "Ты — аналитик рынка фриланс-услуг в нише: {niche}. Ты ведёшь базу знаний, "
    "по которой потом пишутся объявления (кворки) для биржи Kwork. Ищи факты, а не "
    "общие слова: что именно заказывают, за сколько, какими словами покупатели "
    "описывают задачу, какие новые инструменты и подходы появились. Указывай источники."
)


def _pick_focus(kb: dict) -> list[str]:
    """Темы на сегодня: вопросы, которые агент сам себе оставил вчера, + ротация базовых тем."""
    own = kb["research_questions"][-4:]
    seeds = random.sample(CONFIG.seed_topics, k=min(3, len(CONFIG.seed_topics)))
    return own + seeds


def run_research(llm: LLM, min_ideas: int = 8) -> dict:
    kb = storage.load_knowledge()
    focus = _pick_focus(kb)
    known = "\n".join(f"- {i['insight']}" for i in kb["insights"][-60:]) or "(пока пусто)"
    ideas_known = "\n".join(f"- {i['name']}" for i in kb["service_ideas"][-80:]) or "(пока пусто)"

    storage.log(f"Исследование: фокус — {focus}")
    report = llm.ask(
        f"Сегодня {storage.today()}. Проведи исследование в интернете (ищи на русском и "
        f"английском) по нише «{CONFIG.niche}».\n\n"
        "Сегодняшний фокус:\n" + "\n".join(f"- {f}" for f in focus) + "\n\n"
        "Обязательно выясни:\n"
        "1. Что нового за последние недели (инструменты, модели, подходы, кейсы).\n"
        "2. Какие услуги по этой нише реально покупают на Kwork, FL.ru, YouDo, Upwork и "
        "какие цены там встречаются.\n"
        "3. Какими словами заказчики формулируют задачи (для ключевых слов).\n"
        "4. Незанятые или слабо закрытые ниши — узкие услуги, которые мало кто предлагает.\n\n"
        "Уже известно (не повторяй, ищи новое):\n" + known + "\n\n"
        "Уже есть идеи услуг:\n" + ideas_known + "\n\n"
        "Напиши подробный отчёт с фактами и ссылками на источники.",
        system=SYSTEM.format(niche=CONFIG.niche),
        web=True,
        max_searches=CONFIG.research_max_searches,
        effort="high",
    )

    data = llm.ask(
        "Преобразуй отчёт исследования в структурированные данные. Идеи услуг — "
        "конкретные, узкие и продаваемые на Kwork (одна услуга = одна задача клиента); "
        f"дай не меньше {max(8, min_ideas)} идей, которых нет в списке уже известных "
        "(разные аудитории и отрасли: розница, услуги, производство, e-commerce, B2B, эксперты). Ключевые слова — фразы, "
        "которыми заказчики ищут услугу. next_research_questions — 3–5 вопросов, "
        "которые стоит изучить завтра, чтобы стать лучше в этой нише.\n\n"
        "Уже известные идеи:\n" + ideas_known + "\n\nОТЧЁТ:\n" + report,
        schema=EXTRACT_SCHEMA,
        effort="medium",
        max_tokens=32000,
    )

    date = storage.today()
    for ins in data["insights"]:
        kb["insights"].append({**ins, "date": date})
    known_names = {i["name"].lower() for i in kb["service_ideas"]}
    for idea in data["service_ideas"]:
        if idea["name"].lower() not in known_names:
            kb["service_ideas"].append({**idea, "date": date, "used": False})
            known_names.add(idea["name"].lower())
    for kw in data["keywords"]:
        kw = kw.strip().lower()
        if kw:
            kb["keywords"][kw] = kb["keywords"].get(kw, 0) + 1
    for tool in data["tools"]:
        tool = tool.strip()
        if tool:
            kb["tools"][tool] = kb["tools"].get(tool, 0) + 1
    kb["research_questions"] = data["next_research_questions"]
    kb["research_log"].append({"date": date, "focus": focus})
    storage.save_knowledge(kb)

    reports = storage.CONFIG.data_dir / "research"
    reports.mkdir(exist_ok=True)
    (reports / f"{date}.md").write_text(report, encoding="utf-8")
    (reports / f"{date}.json").write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    storage.log(
        f"Исследование готово: {len(data['insights'])} фактов, "
        f"{len(data['service_ideas'])} идей, {len(data['keywords'])} ключевых слов"
    )
    return data
