"""Люди, которые сами спрашивают про кредитки: поиск по VK и черновики честных ответов.

Агент только находит вопросы и готовит ответы. Публикует их человек со своего
аккаунта и по своему решению: автоматические комментарии были бы спамом, за
который банят и площадка, и партнёрская сеть.
"""

from __future__ import annotations

import datetime as dt
import re

from . import net, storage
from .config import CONFIG
from .llm import LLM
from .products import Product

QUERIES = {
    "credit": [
        "посоветуйте кредитную карту", "какую кредитку оформить", "какую кредитную карту выбрать",
        "кредитка без процентов", "кредитная карта беспроцентный период", "снять наличные с кредитки",
        "закрыть кредитку другого банка", "перекредитовать кредитную карту",
    ],
    "debit": ["посоветуйте дебетовую карту", "какую карту оформить кэшбэк", "карта с бесплатным обслуживанием"],
}
# Похоже на вопрос, а не на рекламу или новость.
_ASK_RE = re.compile(r"\?|посоветуй|подскаж|какую|какой банк|стоит ли|кто пользовал|кто знает|помогите",
                     re.IGNORECASE)
MAX_CANDIDATES = 25

SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "required": ["answers"],
    "properties": {"answers": {"type": "array", "items": {
        "type": "object", "additionalProperties": False,
        "required": ["id", "relevant", "reply"],
        "properties": {
            "id": {"type": "string"},
            "relevant": {"type": "boolean",
                         "description": "человек правда ищет кредитку/карту или совет по ней, и ответ будет уместен"},
            "reply": {"type": "string", "description": "черновик ответа; пусто, если не relevant"},
        }}}},
}

SYSTEM = """Ты помогаешь владельцу честно отвечать людям, которые во ВКонтакте спрашивают совета
про банковские карты. Отвечать будет он сам, от своего имени. Он — партнёр банков.

Как писать ответ:
- По делу и коротко, 2–5 предложений, живым языком, без канцелярита. Сначала — польза для человека:
  на что смотреть (ПСК, условия льготного периода, обслуживание, снятие наличных).
- Если человек просит конкретный совет и продукт из карточки ему подходит — назови его и главный
  плюс, честно назови условие (льгота только при минимальном платеже и полном погашении в срок).
- Раскрывай интерес: «у меня есть партнёрская ссылка, если нужно — скину в личку».
- Никаких ссылок в ответе. Никакого выдуманного личного опыта («я пользуюсь»). Без обещаний одобрения.
- Если человек в долгах и ищет, чем закрыть кредит, — не толкай новую кредитку, посоветуй
  осторожность. Если вопрос не про карты, это реклама или спор — relevant=false."""


def vk_search(query: str, start_time: int) -> list[dict]:
    res = net.request("POST", "https://api.vk.com/method/newsfeed.search", form={
        "q": query, "count": 50, "start_time": start_time, "access_token": CONFIG.vk_user_token,
        "v": CONFIG.vk_api_version})
    if "error" in res:
        raise RuntimeError(f"VK newsfeed.search: {res['error'].get('error_msg')}")
    return res["response"].get("items", [])


def find_questions(llm: LLM, products: list[Product], search=None, hours: int = 48) -> list[dict]:
    """Свежие вопросы людей + черновики ответов. Пишет их в outbox и возвращает подходящие."""
    if search is None:
        if not CONFIG.vk_user_token:
            return []
        search = vk_search
    types = {p.type for p in products} or {"credit"}
    queries = [q for t in sorted(types) for q in QUERIES.get(t, [])]
    start = int((dt.datetime.now(dt.timezone.utc) - dt.timedelta(hours=hours)).timestamp())
    seen = set(storage.load_json("questions_seen.json", []))

    found: dict[str, dict] = {}
    for q in queries:
        try:
            items = search(q, start)
        except Exception as e:  # noqa: BLE001 — один запрос не должен ронять поиск
            storage.log(f"Поиск вопросов «{q}»: {e}")
            continue
        for it in items:
            key = f"{it.get('owner_id')}_{it.get('id')}"
            text = (it.get("text") or "").strip()
            if (key in seen or key in found or not _ASK_RE.search(text) or len(text) > 1500
                    or it.get("marked_as_ads") or it.get("comments", {}).get("can_post") == 0):
                continue
            found[key] = {"id": key, "url": f"https://vk.com/wall{key}", "text": text[:800]}
        if len(found) >= MAX_CANDIDATES:
            break
    candidates = list(found.values())[:MAX_CANDIDATES]
    if not candidates:
        storage.log("Вопросов людей не найдено")
        return []

    cards = "\n\n".join(p.fact_sheet() for p in products)
    res = llm.ask(
        "КАРТОЧКИ ПРОДУКТОВ:\n" + cards + "\n\nВОПРОСЫ ЛЮДЕЙ:\n" +
        "\n\n".join(f"[{c['id']}]\n{c['text']}" for c in candidates),
        system=SYSTEM, schema=SCHEMA, effort="medium", max_tokens=16000,
    )
    by_id = {c["id"]: c for c in candidates}
    relevant = [{**by_id[a["id"]], "reply": a["reply"].strip()}
                for a in res["answers"] if a["relevant"] and a["id"] in by_id and a["reply"].strip()]
    storage.save_json("questions_seen.json", (list(seen) + list(by_id))[-3000:])
    if relevant:
        lines = ["# Вопросы людей во VK — ответьте сами, со своего аккаунта", "",
                 "Ссылки в чужих постах не оставляйте; если человек попросит — отправьте в личку.", ""]
        for i, r in enumerate(relevant, 1):
            quote = r["text"][:300].replace("\n", " ")
            lines += [f"## {i}. {r['url']}", "", f"> {quote}", "", r["reply"], ""]
        (storage.outbox_dir() / "questions.md").write_text("\n".join(lines), encoding="utf-8")
    storage.log(f"Вопросы людей: найдено {len(candidates)}, подходящих {len(relevant)}")
    return relevant
