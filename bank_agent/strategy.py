"""Саморазвитие: каждый день агент переписывает стратегию по новым знаниям и своей статистике."""

from __future__ import annotations

from . import storage
from .db import DB
from .funnel import GoalStatus, performance
from .config import CONFIG
from .llm import LLM
from .products import Product

SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "required": ["strategy_markdown", "actions_today", "owner_actions"],
    "properties": {
        "strategy_markdown": {"type": "string"},
        "actions_today": {"type": "array", "items": {"type": "string"},
                          "description": "3–5 приоритетов агента на сегодня"},
        "owner_actions": {"type": "array", "items": {"type": "string"},
                          "description": "что может сделать только владелец (бюджет, ручная публикация, договорённости)"},
    },
}


def _fmt_perf(stats: dict[str, dict]) -> str:
    if not stats:
        return "(данных пока нет)"
    lines = []
    for k, s in sorted(stats.items(), key=lambda kv: -kv[1]["clicks"]):
        epc = s["revenue"] / s["clicks"] if s["clicks"] else 0
        lines.append(f"- {k}: кликов {s['clicks']}, оформлений {s['conv']}, доход {s['revenue']:.0f} ₽, "
                     f"доход с клика {epc:.1f} ₽")
    return "\n".join(lines)


def top_posts(db: DB, limit: int = 8) -> str:
    rows = db.all(
        "SELECT p.channel, p.idea, COUNT(c.id) clicks FROM posts p LEFT JOIN clicks c ON c.post_id=p.id "
        "WHERE p.status='published' GROUP BY p.id ORDER BY clicks DESC LIMIT ?", (limit,))
    return "\n".join(f"- [{r['channel']}] {r['idea']} — {r['clicks']} кликов" for r in rows) or "(пока нет)"


def _budget_rule() -> str:
    if CONFIG.ads_budget_rub:
        return f"БЮДЖЕТ НА ПЛАТНУЮ РЕКЛАМУ: до {CONFIG.ads_budget_rub} ₽ в месяц."
    return ("БЮДЖЕТА НА РЕКЛАМУ НЕТ (0 ₽) — это челлендж: прийти к цели только временем и контентом. "
            "Не предлагай платные размещения. Рычаги: короткие видео (VK Клипы) с цепляющим началом и "
            "досмотром; названия сообществ и каналов под поисковые запросы; ответы людям, которые сами "
            "спрашивают про кредитки (вручную, без ссылок в чужих сообществах); взаимопиар с каналами "
            "похожего размера; статьи в Дзене, ведущие в канал и бот; тёплый круг владельца; бот, которым "
            "хочется поделиться. Без спама, накруток, фейковых аккаунтов и мотивации деньгами.")


def run_reflection(llm: LLM, db: DB, status: GoalStatus, products: list[Product]) -> dict:
    kb = storage.load_knowledge()
    current = storage.load_strategy()
    insights = "\n".join(f"- ({i['date']}) {i['insight']}" for i in kb["insights"][-40:]) or "(пока нет)"
    alerts = "\n".join(f"- ({a['date']}) {a['alert']}" for a in kb["legal_alerts"][-10:]) or "(нет)"
    offers = "\n".join(f"- {o['bank']} {o['product']}: {o['offer']} (до {o['valid_until']})"
                       for o in kb["hot_offers"][-15:]) or "(нет)"

    result = llm.ask(
        "Твоя текущая стратегия продвижения банковских продуктов по партнёрским ссылкам:\n\n"
        f"{current}\n\n"
        "ПРОДУКТЫ, КОТОРЫЕ СЕЙЧАС ПРОДВИГАЕМ (стратегия — только про них):\n"
        + "\n\n".join(p.fact_sheet() for p in products) + "\n\n"
        f"ЦЕЛЬ: {status.goal} засчитанных оформлений до {status.deadline}. Сейчас {status.done} "
        f"(+{status.pending} в обработке), осталось {status.days_left} дн. Нужно ~{status.clicks_needed_per_day} "
        f"кликов в день при конверсии {status.cr:.1%} ({'факт' if status.cr_is_measured else 'допущение'}). "
        f"Прогноз при текущем темпе: {status.projection}. Безубыточная цена клика: {status.break_even_cpc:.0f} ₽.\n\n"
        "Результаты по каналам за 30 дней:\n" + _fmt_perf(performance(db, "source")) + "\n\n"
        "Результаты по продуктам:\n" + _fmt_perf(performance(db, "product_id")) + "\n\n"
        "Лучшие посты:\n" + top_posts(db) + "\n\n"
        "Свежие знания о рынке:\n" + insights + "\n\nАкции банков:\n" + offers +
        "\n\nПравовые новости:\n" + alerts + "\n\n"
        + _budget_rule() + "\n\n"
        "Перепиши стратегию, чтобы быстрее прийти к цели: сохрани то, что приносит оформления, "
        "урежь то, что не работает, учти правовые новости. Включи: приоритет каналов и продуктов, "
        "аудитории и темы, форматы постов, правила текстов, чего избегать. До 900 слов, Markdown. "
        "Отдельно дай приоритеты агента на сегодня и конкретные действия для владельца "
        "(например: снять 3 клипа по сценариям из outbox, ответить на найденные вопросы людей, "
        "договориться о взаимопиаре с каналом похожего размера"
        + ("; купить посев в канале такой-то тематики, если цена клика ниже безубыточной" if CONFIG.ads_budget_rub else "")
        + ").",
        system="Ты — руководитель отдела перфоманс-маркетинга финансовых продуктов. Решения — от цифр. "
               "Только законные методы: маркировка, честные условия, без спама и мотивированного трафика.",
        schema=SCHEMA, effort="high", max_tokens=16000,
    )
    storage.save_strategy(result["strategy_markdown"])
    storage.save_json("today_actions.json", {"date": storage.today(), **result})
    storage.log("Стратегия обновлена")
    return result
