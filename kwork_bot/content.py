"""Генерация контента для пользователя бота: идеи услуг → тексты кворков → обложки.

Функции синхронные (бот вызывает их в отдельном потоке) и сообщают прогресс через
словарь progress: {"stage": ..., "done": ..., "total": ...}.
"""

from __future__ import annotations

import copy
import threading
import uuid
from concurrent.futures import ThreadPoolExecutor

from kwork_agent.config import CONFIG
from kwork_agent.cover import PALETTES, make_cover
from kwork_agent.generator import LISTING_SCHEMA, validate
from kwork_agent.uniqueness import find_duplicate, title_similarity

from . import db
from .config import BOT_CONFIG

IDEAS_PER_CALL = 50
LISTINGS_PER_CALL = 5
ROUNDS = 3  # столько раз переписываем объявления, не прошедшие проверку

IDEAS_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "required": ["ideas"],
    "properties": {
        "ideas": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties": False,
                "required": ["name", "audience", "result"],
                "properties": {
                    "name": {"type": "string", "description": "Узкая услуга, 3–8 слов"},
                    "audience": {"type": "string", "description": "Кто покупает"},
                    "result": {"type": "string", "description": "Что покупатель получит"},
                },
            },
        }
    },
}

# Та же схема, что у агента, плюс номер идеи — чтобы связать ответ с идеей.
BOT_LISTING_SCHEMA = copy.deepcopy(LISTING_SCHEMA)
_item = BOT_LISTING_SCHEMA["properties"]["listings"]["items"]
_item["properties"]["idea_no"] = {"type": "integer", "description": "Номер идеи из списка"}
_item["required"].append("idea_no")

SYSTEM = ("Ты — сильный копирайтер, который помогает фрилансерам продавать услуги на Kwork. "
          "Пишешь по-русски, живо и конкретно, без воды и канцелярита.")


def _llm():
    from kwork_agent.llm import LLM

    return LLM(model=BOT_CONFIG.model)


def _about(profile: dict) -> str:
    return (f"Навыки и услуги: {profile.get('skills', '')}\n"
            f"Опыт: {profile.get('experience') or 'не указан'}\n"
            f"Минимальная цена кворка: {profile.get('min_price', CONFIG.price_min)} ₽")


# --- Идеи --------------------------------------------------------------------

def generate_ideas(uid: int, n: int, progress: dict, llm=None) -> list[dict]:
    llm = llm or _llm()
    profile = db.load_profile(uid)
    ideas: list[dict] = []
    progress.update(stage="ideas", done=0, total=n)
    for _ in range(n // IDEAS_PER_CALL + 4):
        need = min(IDEAS_PER_CALL, n - len(ideas))
        if need <= 0:
            break
        taken = "\n".join(f"- {i['name']}" for i in ideas) or "(пока нет)"
        data = llm.ask(
            f"""Фрилансер хочет выложить на Kwork много разных кворков. О нём:
{_about(profile)}

Придумай {need} НОВЫХ узких услуг, которые он реально может выполнить.
Каждая услуга — отдельная задача: другой результат, формат, площадка или объём работы.
НЕ делай вариации одной услуги под разные ниши («логотип для кафе», «логотип для
салона») — Kwork считает такие кворки дублями и отклоняет. Ориентируйся на то, что
реально ищут покупатели на Kwork.

Уже есть (не повторяй ни по смыслу, ни по формулировке):
{taken}""",
            system=SYSTEM, schema=IDEAS_SCHEMA, effort=BOT_CONFIG.effort, max_tokens=32000,
        )
        for idea in data["ideas"]:
            if any(title_similarity(idea["name"], i["name"]) >= 0.8 for i in ideas):
                continue
            ideas.append({**idea, "no": len(ideas) + 1})
            if len(ideas) >= n:
                break
        progress["done"] = len(ideas)
    profile["ideas"] = ideas
    db.save_profile(uid, profile)
    return ideas


# --- Тексты кворков ---------------------------------------------------------------

def _listing_prompt(profile: dict, ideas: list[dict], hints: dict[int, str]) -> str:
    ideas_txt = "\n".join(
        f"{i['no']}. {i['name']} | аудитория: {i['audience']} | результат: {i['result']}"
        + (f"\n   ПРОШЛАЯ ПОПЫТКА ОТКЛОНЕНА: {hints[i['no']]}" if i["no"] in hints else "")
        for i in ideas
    )
    return f"""Напиши по одному кворку для Kwork на каждую идею ниже ({len(ideas)} шт.).

О ФРИЛАНСЕРЕ:
{_about(profile)}

ИДЕИ (в поле idea_no укажи номер идеи, в idea — её название):
{ideas_txt}

ТРЕБОВАНИЯ KWORK:
- Название до {CONFIG.title_max} символов, начинается с глагола в 1-м лице («Сделаю…», «Напишу…»),
  содержит слово, по которому покупатель ищет такую услугу.
- Описание {CONFIG.description_min}–{CONFIG.description_max} символов, с абзацами: задача клиента →
  что именно он получит → как идёт работа → почему можно доверять. Первые фразы у
  разных кворков должны отличаться.
- Никаких контактов, ссылок, e-mail, телефонов и названий мессенджеров — Kwork это запрещает.
- requirements — что покупатель присылает для старта (до {CONFIG.requirements_max} символов).
- Цена в рублях не ниже {profile.get('min_price', CONFIG.price_min)} и не выше {CONFIG.price_max},
  срок 1–30 дней — реалистично для объёма работы.
- cover_text — 2–5 слов крупно на обложку.
- Обещай только то, что фрилансер реально сделает; без гарантий дохода и позиций."""


def _new_listing(uid: int, cand: dict, idea: dict, palette: int, lid: str | None = None) -> dict:
    cand = {k: v for k, v in cand.items() if k != "idea_no"}
    cand.update(id=lid or uuid.uuid4().hex[:10], idea_no=idea["no"], idea=idea["name"], palette=palette)
    make_cover(cand, out_dir=db.covers_dir(uid), palette=palette)
    return cand


def missing_ideas(uid: int) -> list[dict]:
    done = {l["idea_no"] for l in db.load_listings(uid)}
    return [i for i in db.load_profile(uid)["ideas"] if i["no"] not in done and not i.get("skipped")]


def generate_listings(uid: int, progress: dict, llm=None) -> list[dict]:
    """Пишет кворки для всех идей, у которых ещё нет объявления. Можно перезапускать."""
    llm = llm or _llm()
    profile = db.load_profile(uid)
    palette = profile.get("palette", 0)
    listings = db.load_listings(uid)
    lock = threading.Lock()
    hints: dict[int, str] = {}
    progress.update(stage="listings", done=len(listings), total=len(listings) + len(missing_ideas(uid)))

    def work(batch: list[dict]) -> None:
        data = llm.ask(_listing_prompt(profile, batch, hints), system=SYSTEM, schema=BOT_LISTING_SCHEMA,
                       effort=BOT_CONFIG.effort, max_tokens=32000)
        by_no = {i["no"]: i for i in batch}
        for cand in data["listings"]:
            idea = by_no.pop(cand.get("idea_no"), None)
            if idea is None:
                continue
            errors = validate(cand)
            if cand["price_rub"] < profile.get("min_price", 0):
                errors.append(f"цена ниже {profile['min_price']} ₽")
            with lock:
                dup = find_duplicate(cand, listings)
                if dup:
                    errors.append(f"слишком похоже на «{dup['title']}»")
                if errors:
                    hints[idea["no"]] = "; ".join(errors)
                    continue
                listings.append(_new_listing(uid, cand, idea, palette))
                hints.pop(idea["no"], None)
                db.save_listings(uid, listings)
                progress["done"] = len(listings)

    for _ in range(ROUNDS):
        todo = missing_ideas(uid)
        if not todo:
            break
        batches = [todo[i:i + LISTINGS_PER_CALL] for i in range(0, len(todo), LISTINGS_PER_CALL)]
        with ThreadPoolExecutor(max_workers=BOT_CONFIG.parallel) as pool:
            for f in [pool.submit(work, b) for b in batches]:
                try:
                    f.result()
                except Exception as e:  # noqa: BLE001 — одна упавшая пачка не должна ронять остальные
                    progress["error"] = f"{type(e).__name__}: {e}"[:300]
    return listings


# --- Правки одного кворка -----------------------------------------------------------

def _find(listings: list[dict], lid: str) -> dict:
    return next(l for l in listings if l["id"] == lid)


def rewrite_listing(uid: int, lid: str, wish: str = "", llm=None) -> dict:
    llm = llm or _llm()
    profile = db.load_profile(uid)
    listings = db.load_listings(uid)
    old = _find(listings, lid)
    idea = next((i for i in profile["ideas"] if i["no"] == old["idea_no"]),
                {"no": old["idea_no"], "name": old["idea"], "audience": "", "result": ""})
    others = [l for l in listings if l["id"] != lid]
    hint = f"Напиши заново и по-другому, чем «{old['title']}»." + (f" Пожелание: {wish}" if wish else "")
    for _ in range(ROUNDS):
        data = llm.ask(_listing_prompt(profile, [idea], {idea["no"]: hint}), system=SYSTEM,
                       schema=BOT_LISTING_SCHEMA, effort=BOT_CONFIG.effort, max_tokens=16000)
        cand = data["listings"][0]
        errors = validate(cand)
        dup = find_duplicate(cand, others)
        if dup:
            errors.append(f"слишком похоже на «{dup['title']}»")
        if not errors:
            new = _new_listing(uid, cand, idea, old.get("palette", 0), lid=lid)
            listings[listings.index(old)] = new
            db.save_listings(uid, listings)
            return new
        hint += " Прошлая попытка отклонена: " + "; ".join(errors)
    raise ValueError("не получилось переписать без ошибок, попробуйте ещё раз")


def next_cover(uid: int, lid: str) -> dict:
    listings = db.load_listings(uid)
    l = _find(listings, lid)
    l["palette"] = (l.get("palette", 0) + 1) % len(PALETTES)
    make_cover(l, out_dir=db.covers_dir(uid), palette=l["palette"])
    db.save_listings(uid, listings)
    return l


def set_price(uid: int, lid: str, price: int) -> dict:
    if not CONFIG.price_min <= price <= CONFIG.price_max:
        raise ValueError(f"цена должна быть от {CONFIG.price_min} до {CONFIG.price_max} ₽")
    listings = db.load_listings(uid)
    l = _find(listings, lid)
    l["price_rub"] = price
    make_cover(l, out_dir=db.covers_dir(uid), palette=l.get("palette", 0))  # цена есть на обложке
    db.save_listings(uid, listings)
    return l


def delete_listing(uid: int, lid: str) -> None:
    listings = db.load_listings(uid)
    gone = _find(listings, lid)
    # Помечаем идею, чтобы «Продолжить» не написал удалённый кворк заново.
    profile = db.load_profile(uid)
    for idea in profile["ideas"]:
        if idea["no"] == gone["idea_no"]:
            idea["skipped"] = True
    db.save_profile(uid, profile)
    (db.covers_dir(uid) / f"{lid}.png").unlink(missing_ok=True)
    db.save_listings(uid, [l for l in listings if l["id"] != lid])
