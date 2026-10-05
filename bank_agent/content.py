"""Генерация постов, сценариев видео и статей под план дня — с проверкой на закон и повторы."""

from __future__ import annotations

import datetime as dt
import random
import re
import uuid
from difflib import SequenceMatcher

from . import storage
from .compliance import assemble, check_body, check_final
from .config import CONFIG
from .db import DB, iso
from .funnel import allocate, avg_payout, performance, prior_cr
from .llm import LLM
from .products import Product, link

AUTO_CHANNELS = ("telegram", "vk", "max")      # публикуются через API
DRAFT_CHANNELS = ("dzen", "shorts")            # черновики в outbox для ручной публикации

FORMATS = {
    "telegram": "пост для Telegram-канала: 400–1200 знаков, цепляющая первая строка, абзацы по 1–3 "
                "строки, 1–3 уместных эмодзи, без хэштегов.",
    "max": "пост для канала в MAX: 400–1200 знаков, разговорный тон, короткие абзацы, 1–3 эмодзи.",
    "vk": "пост для сообщества VK: 500–1500 знаков, первая строка — выгода или вопрос, списки шагов, "
          "в конце 2–4 хэштега на русском.",
    "dzen": "статья для Дзена: 3500–7000 знаков, заголовок под поисковый запрос, подзаголовки, "
            "сравнение/инструкция по шагам, честные минусы, вывод. Первая строка — заголовок.",
    "shorts": "сценарий короткого вертикального видео на 15–30 секунд для VK Клипов, который можно снять "
              "без лица на телефон (экран с расчётом, текст поверх простого видео, руки и чек). Структура: "
              "ХУК на 0–3 секунде (вопрос или неожиданный факт, ради которого досматривают), текст закадра "
              "по секундам, крупные надписи на экране, один призыв в конце: «напишите слово КАРТА в "
              "сообщения сообщества — бот всё объяснит». Затем ОПИСАНИЕ к видео (2–3 строки + 3–5 хэштегов). "
              "В кадре обязательно надпись «Реклама» и название банка.",
}

SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "required": ["posts"],
    "properties": {"posts": {"type": "array", "items": {
        "type": "object", "additionalProperties": False,
        "required": ["slot", "idea", "from_idea", "body", "cta"],
        "properties": {
            "slot": {"type": "integer", "description": "номер слота из задания"},
            "idea": {"type": "string", "description": "тема в 5–10 словах"},
            "from_idea": {"type": "string",
                          "description": "точное название использованной идеи из списка ИДЕИ ТЕМ или пустая строка"},
            "body": {"type": "string", "description": "текст без ссылок и без маркировки"},
            "cta": {"type": "string", "description": "призыв к действию перед ссылкой, 2–6 слов"},
        }}}},
}

REVIEW_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "required": ["reviews"],
    "properties": {"reviews": {"type": "array", "items": {
        "type": "object", "additionalProperties": False,
        "required": ["slot", "ok", "issues"],
        "properties": {"slot": {"type": "integer"}, "ok": {"type": "boolean"},
                       "issues": {"type": "array", "items": {"type": "string"}}}}}},
}

SYSTEM = """Ты — автор контента независимого финансового блога. Ты помогаешь людям выбрать
банковскую карту и получить бонусы банка, а блог зарабатывает на партнёрских ссылках.

Жёсткие правила (нарушение = пост выбрасывается):
- Факты об условиях — ТОЛЬКО из карточки продукта. Не придумывай ставки, проценты, суммы, сроки.
  Если в карточке нет цифры — пиши без неё.
- Ты не банк и не сотрудник банка. Не пиши «наш банк», «официальный представитель».
- Не выдумывай личный опыт («я пользуюсь»), отзывы, истории клиентов, скриншоты.
- Не обещай одобрение, доход, «бесплатные деньги», «без отказа», «без проверок».
- Для кредиток не уговаривай брать в долг: польза — льготный период и кэшбэк при дисциплине.
  Если упоминаешь любое условие кредита (дни без процентов, ставку, лимит) — в том же тексте
  дай фразу со ставкой и ПСК из карточки (ст. 28 закона о рекламе). Не обращайся к
  несовершеннолетним. Соблюдай «Обязательные правила текста» из карточки.
- Не вставляй ссылки, @упоминания и маркировку — их добавит система.
- Называй условия бонуса честно и по шагам: что сделать, до какого срока.
- Пиши живо и конкретно, как человек, который разобрался в теме. Без канцелярита и воды."""


def similarity(a: str, b: str) -> float:
    words = lambda s: {w[:6] for w in re.findall(r"[а-яёa-z0-9]{3,}", s.lower())}  # noqa: E731
    wa, wb = words(a), words(b)
    jac = len(wa & wb) / len(wa | wb) if wa and wb else 0.0
    return max(jac, SequenceMatcher(None, a[:300].lower(), b[:300].lower()).ratio() * 0.8)


def _schedule(n: int, today: dt.date) -> list[dt.datetime]:
    """Раскладывает n постов канала по слотам дня (местное время → UTC)."""
    try:
        from zoneinfo import ZoneInfo
        tz = ZoneInfo(CONFIG.timezone)
    except Exception:  # noqa: BLE001 — нет базы часовых поясов: считаем МСК
        tz = dt.timezone(dt.timedelta(hours=3))
    times = CONFIG.post_times or ["12:00"]
    out = []
    for i in range(n):
        h, m = map(int, times[i % len(times)].split(":"))
        local = dt.datetime.combine(today, dt.time(h, m), tzinfo=tz) + dt.timedelta(minutes=7 * (i // len(times)))
        out.append(local.astimezone(dt.timezone.utc))
    return out


def plan_slots(db: DB, products: list[Product], enabled: list[str], rng: random.Random | None = None) -> list[dict]:
    """Слоты дня: канал + продукт. Продукты выбираются по доходу с клика с долей разведки."""
    rng = rng or random.Random()
    by_product = performance(db, "product_id")
    prior_epc = avg_payout(products) * prior_cr(products)
    slots = []
    for channel in enabled:
        n = CONFIG.channel_posts.get(channel, 0)
        picks = allocate(n, [p.id for p in products], by_product, prior_epc, CONFIG.explore_share, rng)
        slots += [{"channel": channel, "product_id": pid} for pid in picks]
    for i, s in enumerate(slots):
        s["slot"] = i + 1
    return slots


def _brief(slots: list[dict], products: dict[str, Product], kb: dict, recent: list[str]) -> str:
    ideas = [i for i in kb["content_ideas"] if not i.get("used")][-25:]
    lines = ["ЗАДАНИЕ: напиши по одному материалу на каждый слот.\n"]
    for s in slots:
        lines.append(f"Слот {s['slot']}: канал {s['channel']}, продукт {s['product_id']}. Формат: {FORMATS[s['channel']]}")
    lines.append("\nКАРТОЧКИ ПРОДУКТОВ:")
    for pid in sorted({s["product_id"] for s in slots}):
        lines.append(products[pid].fact_sheet() + "\n")
    if ideas:
        lines.append("ИДЕИ ТЕМ (можно брать и комбинировать):")
        lines += [f"- {i['title']} — {i['angle']} (аудитория: {i['audience']})" for i in ideas]
    if kb["audience_questions"]:
        lines.append("\nВОПРОСЫ ЛЮДЕЙ (отличные темы):")
        lines += [f"- {q}" for q in kb["audience_questions"][-20:]]
    if kb["hot_offers"]:
        lines.append("\nАКЦИИ ИЗ ИССЛЕДОВАНИЯ (упоминать только если совпадает с карточкой продукта):")
        lines += [f"- {o['bank']} {o['product']}: {o['offer']} (до {o['valid_until']})" for o in kb["hot_offers"][-10:]]
    if recent:
        lines.append("\nУЖЕ ВЫХОДИЛО (не повторяй темы и заходы):")
        lines += [f"- {t}" for t in recent]
    lines.append("\nРазные слоты — разные темы и заходы, даже для одного продукта.")
    return "\n".join(lines)


def _review(llm: LLM, drafts: list[dict], products: dict[str, Product]) -> dict[int, list[str]]:
    payload = "\n\n".join(
        f"СЛОТ {d['slot']} (продукт {d['product_id']}):\nКАРТОЧКА:\n{products[d['product_id']].fact_sheet()}\n"
        f"ТЕКСТ:\n{d['body']}" for d in drafts)
    res = llm.ask(
        "Проверь каждый текст как юрист по рекламе финансовых услуг и как редактор. Не ок, если: есть "
        "факты/цифры, которых нет в карточке; обещания одобрения или дохода; выдуманный личный опыт или "
        "отзывы; вводящие в заблуждение формулировки; скрыты важные условия бонуса; выдача себя за банк.\n\n"
        + payload,
        schema=REVIEW_SCHEMA, effort="medium", max_tokens=16000,
    )
    return {r["slot"]: r["issues"] for r in res["reviews"] if not r["ok"]}


def generate_day(llm: LLM, db: DB, products: list[Product], enabled: list[str],
                 today: dt.date | None = None, rng: random.Random | None = None) -> list[dict]:
    """Готовит материалы на день и ставит их в очередь. Возвращает записи постов."""
    today = today or dt.date.today()
    if not products:
        storage.log("Нет продуктов, готовых к продвижению — см. `python -m bank_agent check`")
        return []
    slots = plan_slots(db, products, enabled, rng)
    if not slots:
        return []
    by_id = {p.id: p for p in products}
    kb = storage.load_knowledge()
    strategy = storage.load_strategy()
    recent_rows = db.all("SELECT idea, text FROM posts ORDER BY created_at DESC LIMIT 200")
    recent = [r["idea"] for r in recent_rows[:40] if r["idea"]]

    accepted: dict[int, dict] = {}
    pending = slots
    feedback = ""
    for attempt in range(3):
        if not pending:
            break
        res = llm.ask(
            "СТРАТЕГИЯ:\n" + strategy + "\n\n" + _brief(pending, by_id, kb, recent) + feedback,
            system=SYSTEM, schema=SCHEMA, effort=CONFIG.content_effort,
        )
        slot_map = {s["slot"]: s for s in pending}
        drafts = []
        for post in res["posts"]:
            s = slot_map.get(post["slot"])
            if not s or s["slot"] in accepted:
                continue
            draft = {**s, **post}
            issues = check_body(draft["body"], by_id[s["product_id"]], s["channel"])
            dup = next((r for r in recent_rows if similarity(draft["body"], r["text"]) > 0.6), None)
            if dup:
                issues.append(f"слишком похоже на уже вышедший пост «{dup['idea']}»")
            draft["issues"] = issues
            drafts.append(draft)
        if CONFIG.llm_review:
            clean = [d for d in drafts if not d["issues"]]
            if clean:
                for slot, issues in _review(llm, clean, by_id).items():
                    for d in clean:
                        if d["slot"] == slot:
                            d["issues"] += issues
        for d in drafts:
            if not d["issues"]:
                accepted[d["slot"]] = d
        pending = [s for s in pending if s["slot"] not in accepted]
        rejected = [d for d in drafts if d["issues"]]
        feedback = "\n\nПРОШЛАЯ ПОПЫТКА ОТКЛОНЕНА, ИСПРАВЬ:\n" + "\n".join(
            f"- слот {d['slot']}: {'; '.join(d['issues'])}" for d in rejected)
        if pending:
            storage.log(f"Попытка {attempt + 1}: не прошли проверку слоты {[s['slot'] for s in pending]}")

    records = []
    per_channel: dict[str, list[dict]] = {}
    for d in accepted.values():
        per_channel.setdefault(d["channel"], []).append(d)
    for channel, items in per_channel.items():
        for d, when in zip(items, _schedule(len(items), today)):
            product = by_id[d["product_id"]]
            post_id = uuid.uuid4().hex[:8]
            text = assemble(d["body"], product, link(product, channel, post_id), d["cta"])
            final_issues = check_final(text, product)
            status = "queued" if channel in AUTO_CHANNELS else "outbox"
            if final_issues:
                status, note = "rejected", "; ".join(final_issues)
            else:
                note = None
            rec = {"id": post_id, "created_at": iso(dt.datetime.now(dt.timezone.utc)), "channel": channel,
                   "product_id": product.id, "idea": d["idea"], "text": text, "status": status,
                   "scheduled_at": iso(when), "note": note}
            db.execute("INSERT INTO posts(id, created_at, channel, product_id, idea, text, status, scheduled_at, note) "
                       "VALUES(:id,:created_at,:channel,:product_id,:idea,:text,:status,:scheduled_at,:note)", rec)
            if status == "outbox":
                (storage.outbox_dir() / f"{channel}-{post_id}.md").write_text(
                    f"# {d['idea']}\n\nКанал: {channel}. Продукт: {product.name}.\n"
                    "Опубликуйте вручную; пометка «Реклама» и erid — обязательны.\n\n---\n\n" + text,
                    encoding="utf-8")
            records.append(rec)

    used_titles = {d["from_idea"].lower() for d in accepted.values() if d["from_idea"]}
    for idea in kb["content_ideas"]:
        if idea["title"].lower() in used_titles:
            idea["used"] = True
    storage.save_knowledge(kb)
    storage.log(f"Контент: готово {len(records)} из {len(slots)} слотов "
                f"({sum(r['status'] == 'outbox' for r in records)} — черновики для ручной публикации)")
    return records
