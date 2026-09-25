"""Саморазвитие: агент ежедневно переписывает свою стратегию на основе новых знаний и результатов."""

from __future__ import annotations

from collections import Counter

from . import storage
from .llm import LLM


def _listing_stats(listings: list[dict]) -> str:
    if not listings:
        return "Объявлений ещё не было."
    status = Counter(l.get("status", "?") for l in listings)
    cats = Counter(l.get("category_hint", "?") for l in listings)
    recent = listings[-15:]
    lines = [
        f"Всего объявлений: {len(listings)}; по статусам: {dict(status)}",
        f"Категории: {dict(cats.most_common(10))}",
        "Последние объявления:",
    ]
    for l in recent:
        note = f" — {l['publish_note']}" if l.get("publish_note") else ""
        lines.append(f"- [{l.get('status')}] {l['title']} ({l['price_rub']} ₽){note}")
    return "\n".join(lines)


def run_reflection(llm: LLM) -> str:
    kb = storage.load_knowledge()
    current = storage.load_strategy()
    insights = "\n".join(f"- ({i['date']}) {i['insight']}" for i in kb["insights"][-50:])
    stats = _listing_stats(storage.load_listings())

    new_strategy = llm.ask(
        "Вот твоя текущая стратегия написания объявлений для Kwork:\n\n"
        f"{current}\n\n"
        "Свежие знания о рынке:\n"
        f"{insights or '(пока нет)'}\n\n"
        "Популярные ключевые слова: " + ", ".join(storage.top_items(kb["keywords"], 30)) + "\n"
        "Популярные инструменты: " + ", ".join(storage.top_items(kb["tools"], 20)) + "\n\n"
        "Результаты публикаций:\n"
        f"{stats}\n\n"
        "Перепиши стратегию, чтобы следующие объявления продавали лучше. Сохрани то, что "
        "работает, убери устаревшее, добавь выводы из новых знаний и из ошибок публикации "
        "(например, отклонения модерацией). Включи: целевые аудитории, приоритетные "
        "направления услуг, правила названия и описания, ценообразование, список фраз и "
        "обещаний, которых избегать. Не больше 900 слов. Ответь только текстом стратегии "
        "в Markdown, начиная с заголовка.",
        system="Ты — опытный продавец услуг на Kwork и маркетолог ниши ИИ-автоматизации.",
        effort="high",
        max_tokens=16000,
    )
    storage.save_strategy(new_strategy)
    storage.log("Стратегия обновлена")
    return new_strategy
