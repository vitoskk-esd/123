"""Ежедневное исследование рынка в интернете: акции банков, вопросы людей, закон, тренды."""

from __future__ import annotations

import json
import random

from . import storage
from .config import CONFIG
from .llm import LLM
from .products import Product

SEED_TOPICS = [
    "новые акции и повышенные бонусы банков за оформление дебетовых карт в этом месяце",
    "категории повышенного кэшбэка банков в этом месяце (Т-Банк, Альфа, ВТБ, Сбер, Озон Банк, Яндекс)",
    "какие вопросы про банковские карты задают люди на форумах, в VK, Дзене, на Пикабу",
    "что работает в продвижении финансовых партнёрских офферов: VK, MAX, Telegram, Дзен, короткие видео",
    "изменения закона о рекламе, маркировки (erid), правил ФАС и ЦБ для рекламы банковских продуктов",
    "условия партнёрских программ банков и CPA-сетей: ставки, запреты на источники трафика",
    "форматы постов и видео о картах, которые набирают больше всего просмотров",
    "сезонные поводы этого месяца для рекламы карт: распродажи, зарплаты, сессия, праздники",
]

SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "required": ["insights", "hot_offers", "legal_alerts", "content_ideas",
                 "audience_questions", "next_research_questions"],
    "properties": {
        "insights": {"type": "array", "items": {
            "type": "object", "additionalProperties": False,
            "required": ["topic", "insight", "source"],
            "properties": {"topic": {"type": "string"}, "insight": {"type": "string"},
                           "source": {"type": "string"}}}},
        "hot_offers": {"type": "array", "items": {
            "type": "object", "additionalProperties": False,
            "required": ["bank", "product", "offer", "valid_until", "source"],
            "properties": {"bank": {"type": "string"}, "product": {"type": "string"},
                           "offer": {"type": "string"}, "valid_until": {"type": "string"},
                           "source": {"type": "string"}}}},
        "legal_alerts": {"type": "array", "items": {
            "type": "object", "additionalProperties": False,
            "required": ["alert", "source"],
            "properties": {"alert": {"type": "string"}, "source": {"type": "string"}}}},
        "content_ideas": {"type": "array", "items": {
            "type": "object", "additionalProperties": False,
            "required": ["title", "angle", "audience", "product_type"],
            "properties": {"title": {"type": "string"}, "angle": {"type": "string"},
                           "audience": {"type": "string"},
                           "product_type": {"type": "string",
                                            "enum": ["debit", "credit", "business", "savings", "invest", "other"]}}}},
        "audience_questions": {"type": "array", "items": {"type": "string"}},
        "next_research_questions": {"type": "array", "items": {"type": "string"}},
    },
}

SYSTEM = (
    "Ты — аналитик рынка банковских продуктов в России и специалист по партнёрскому маркетингу "
    "финансовых офферов. Ты ведёшь базу знаний агента, который продвигает карты по партнёрским "
    "ссылкам. Ищи проверяемые факты с датами и ссылками, а не общие слова. Отличай свежие данные "
    "(этот и прошлый месяц) от устаревших. Не советуй серые методы: спам, накрутки, мотивированный "
    "трафик, брендовый контекст, выдуманные отзывы — их запрещают банки и закон."
)


def run_research(llm: LLM, catalog: list[Product]) -> dict:
    kb = storage.load_knowledge()
    focus = kb["research_questions"][-3:] + random.sample(SEED_TOPICS, k=3)
    products = "\n".join(f"- {p.name} ({p.bank})" for p in catalog if p.active) or "(каталог пуст)"
    known = "\n".join(f"- {i['insight']}" for i in kb["insights"][-50:]) or "(пока пусто)"

    storage.log(f"Исследование: фокус — {focus}")
    report = llm.ask(
        f"Сегодня {storage.today()}. Проведи исследование в интернете (русскоязычные источники: "
        "vc.ru, Партнеркин, Pampadu, banki.ru, sravni.ru, ppc.world, sostav.ru, официальные сайты банков "
        "и партнёрских программ, Т—Ж, Пикабу, VK).\n\n"
        "Мы продвигаем:\n" + products + "\n\n"
        "Сегодняшний фокус:\n" + "\n".join(f"- {f}" for f in focus) + "\n\n"
        "Обязательно выясни:\n"
        "1. Свежие акции и бонусы по нашим продуктам и у конкурентов (с датами окончания).\n"
        "2. О чём сейчас спрашивают люди, выбирая карту/кредитку/счёт — дословные формулировки.\n"
        "3. Что нового в законе о рекламе, маркировке, правилах площадок (VK, MAX, Telegram, Дзен).\n"
        "4. Какие форматы и подходы сейчас реально приносят оформления (кейсы с цифрами).\n\n"
        "Уже известно (не повторяй, ищи новое):\n" + known + "\n\n"
        "Напиши подробный отчёт с фактами и ссылками на источники.",
        system=SYSTEM, web=True, max_searches=CONFIG.research_max_searches, effort="high",
    )

    data = llm.ask(
        "Преобразуй отчёт в структурированные данные. content_ideas — не меньше 8 конкретных тем "
        "постов/видео (разные аудитории: студенты, семьи, пенсионеры, водители и курьеры, фрилансеры, "
        "предприниматели, любители маркетплейсов). audience_questions — дословные вопросы людей. "
        "hot_offers — только с источником; если срок неизвестен, пиши «не указан». "
        "next_research_questions — 3–5 вопросов на завтра.\n\nОТЧЁТ:\n" + report,
        schema=SCHEMA, effort="medium",
    )

    date = storage.today()
    kb["insights"] += [{**i, "date": date} for i in data["insights"]]
    kb["hot_offers"] += [{**o, "date": date} for o in data["hot_offers"]]
    kb["legal_alerts"] += [{**a, "date": date} for a in data["legal_alerts"]]
    known_titles = {i["title"].lower() for i in kb["content_ideas"]}
    for idea in data["content_ideas"]:
        if idea["title"].lower() not in known_titles:
            kb["content_ideas"].append({**idea, "date": date, "used": False})
            known_titles.add(idea["title"].lower())
    seen_q = set(kb["audience_questions"])
    kb["audience_questions"] += [q for q in data["audience_questions"] if q not in seen_q]
    kb["research_questions"] = data["next_research_questions"]
    kb["research_log"].append({"date": date, "focus": focus})
    storage.save_knowledge(kb)

    reports = storage.path("research")
    reports.mkdir(exist_ok=True)
    (reports / f"{date}.md").write_text(report, encoding="utf-8")
    (reports / f"{date}.json").write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    storage.log(f"Исследование готово: {len(data['insights'])} фактов, {len(data['content_ideas'])} идей, "
                f"{len(data['hot_offers'])} акций, {len(data['legal_alerts'])} правовых новостей")
    return data
