"""Генерация контента для пользователя бота: разбор его кворков → идеи → тексты → обложки.

Функции синхронные (бот вызывает их в отдельном потоке) и сообщают прогресс через
словарь progress: {"stage": ..., "done": ..., "total": ...}.

Экономия: разбор образцов и идеи (несколько запросов) — на BOT_CONFIG.ideas_model,
тексты (десятки запросов) — на дешёвой BOT_CONFIG.model. Образцы кворков идут в
кэшируемую часть промпта: каждый следующий запрос читает их в ~10 раз дешевле.
"""

from __future__ import annotations

import copy
import threading
import uuid
from concurrent.futures import ThreadPoolExecutor

from kwork_agent.config import CONFIG
from kwork_agent.cover import PALETTES
from kwork_agent.generator import LISTING_SCHEMA, validate
from kwork_agent.uniqueness import find_duplicate, title_similarity

from . import db, images
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

# Генераторы картинок рисуют русский текст из промпта «каракулями» — поэтому нишу
# описываем им по-английски и только предметами, цветами и материалами.
VISUAL_BRIEF_HINT = ("In ENGLISH: 1–2 sentences describing objects, materials and colors that visually "
                     "represent this niche for a background image. No words to render, no brand names.")

PROFILE_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "required": ["skills", "style", "summary", "visual_brief"],
    "properties": {
        "skills": {"type": "string", "description": "Что продавец умеет и в какой нише работает, 1–3 предложения"},
        "style": {"type": "string", "description": "Как написаны его кворки: тон, структура, приёмы"},
        "summary": {"type": "string", "description": "Одна фраза для продавца: что ты понял о нём"},
        "visual_brief": {"type": "string", "description": VISUAL_BRIEF_HINT},
    },
}

VISUAL_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "required": ["visual_brief"],
    "properties": {"visual_brief": {"type": "string", "description": VISUAL_BRIEF_HINT}},
}

# Та же схема, что у агента, плюс номер идеи — чтобы связать ответ с идеей.
BOT_LISTING_SCHEMA = copy.deepcopy(LISTING_SCHEMA)
_item = BOT_LISTING_SCHEMA["properties"]["listings"]["items"]
_item["properties"]["idea_no"] = {"type": "integer", "description": "Номер идеи из списка"}
_item["required"].append("idea_no")

SYSTEM = ("Ты — сильный копирайтер, который помогает фрилансерам продавать услуги на Kwork. "
          "Пишешь по-русски, живо и конкретно, без воды и канцелярита.")


def _llm(model: str | None = None):
    from kwork_agent.llm import LLM

    return LLM(model=model or BOT_CONFIG.model)


def _about(profile: dict) -> str:
    text = (f"Навыки и услуги: {profile.get('skills', '')}\n"
            f"Минимальная цена кворка: {profile.get('min_price', CONFIG.price_min)} ₽")
    if profile.get("experience"):
        text += f"\nОпыт: {profile['experience']}"
    if profile.get("style"):
        text += f"\nСтиль его текстов: {profile['style']}"
    return text


def examples_block(profile: dict) -> str:
    """Кворки продавца целиком — общая (кэшируемая) часть промптов."""
    items = profile.get("examples", [])
    if not items:
        return ""
    parts = [f"--- Кворк {n} ---\nНазвание: {e['title']}\nРубрика: {e.get('category_hint') or '—'}\n"
             f"Цена: {e.get('price_rub') or '—'} ₽, срок: {e.get('days') or '—'} дн.\n"
             f"Описание:\n{e['description']}\nЧто нужно от покупателя:\n{e.get('requirements') or '—'}"
             for n, e in enumerate(items, 1)]
    return ("АКТИВНЫЕ КВОРКИ ПРОДАВЦА. Это образец его стиля, тона, структуры и уровня цен. "
            "Новые кворки пиши так же, но про ДРУГИЕ услуги — эти не повторяй.\n\n" + "\n\n".join(parts))


# --- Разбор образцов -----------------------------------------------------------

def analyze_examples(uid: int, llm=None) -> dict:
    """По кворкам продавца понимает нишу и стиль. Цену берём из самих кворков."""
    profile = db.load_profile(uid)
    llm = llm or _llm(BOT_CONFIG.ideas_model)
    data = llm.ask("Изучи кворки продавца и опиши его нишу и стиль.\n\n" + examples_block(profile),
                   system=SYSTEM, schema=PROFILE_SCHEMA, effort=BOT_CONFIG.effort, max_tokens=8000)
    prices = [e["price_rub"] for e in profile["examples"] if e.get("price_rub")]
    profile.update(skills=data["skills"], style=data["style"], summary=data["summary"],
                   visual_brief=data["visual_brief"],
                   min_price=max(CONFIG.price_min, min(prices)) if prices else CONFIG.price_min)
    db.save_profile(uid, profile)
    return profile


# --- Идеи --------------------------------------------------------------------

def generate_ideas(uid: int, n: int, progress: dict, llm=None) -> list[dict]:
    llm = llm or _llm(BOT_CONFIG.ideas_model)
    profile = db.load_profile(uid)
    ideas: list[dict] = []
    progress.update(stage="ideas", done=0, total=n)
    own = [e["title"] for e in profile.get("examples", [])]
    for _ in range(n // IDEAS_PER_CALL + 4):
        need = min(IDEAS_PER_CALL, n - len(ideas))
        if need <= 0:
            break
        taken = "\n".join(f"- {t}" for t in own + [i["name"] for i in ideas]) or "(пока нет)"
        data = llm.ask(
            f"""Фрилансер хочет выложить на Kwork много разных кворков. О нём:
{_about(profile)}

Придумай {need} НОВЫХ узких услуг в его направлении, которые он реально может выполнить.
Каждая услуга — отдельная задача: другой результат, формат, площадка или объём работы.
НЕ делай вариации одной услуги под разные ниши («логотип для кафе», «логотип для
салона») — Kwork считает такие кворки дублями и отклоняет. Ориентируйся на то, что
реально ищут покупатели на Kwork.

Уже есть (не повторяй ни по смыслу, ни по формулировке):
{taken}""",
            system=SYSTEM, schema=IDEAS_SCHEMA, effort=BOT_CONFIG.effort, max_tokens=32000,
            cached_context=examples_block(profile),
        )
        for idea in data["ideas"]:
            if any(title_similarity(idea["name"], t) >= 0.8 for t in own + [i["name"] for i in ideas]):
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
    style = ("- Пиши в стиле кворков продавца выше: тот же тон, структура и уровень цен.\n"
             if profile.get("examples") else "")
    return f"""Напиши по одному кворку для Kwork на каждую идею ниже ({len(ideas)} шт.).

О ФРИЛАНСЕРЕ:
{_about(profile)}

ИДЕИ (в поле idea_no укажи номер идеи, в idea — её название):
{ideas_txt}

ТРЕБОВАНИЯ KWORK:
{style}- Название до {CONFIG.title_max} символов, начинается с глагола в 1-м лице («Сделаю…», «Напишу…»),
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


def _new_listing(uid: int, cand: dict, idea: dict, palette: int, lid: str | None = None,
                 bg: int | None = None) -> dict:
    cand = {k: v for k, v in cand.items() if k != "idea_no"}
    cand.update(id=lid or uuid.uuid4().hex[:10], idea_no=idea["no"], idea=idea["name"], palette=palette,
                bg=idea["no"] - 1 if bg is None else bg)  # фоны чередуются по кругу
    images.render_cover(uid, cand)
    return cand


def missing_ideas(uid: int) -> list[dict]:
    done = {l["idea_no"] for l in db.load_listings(uid)}
    return [i for i in db.load_profile(uid)["ideas"] if i["no"] not in done and not i.get("skipped")]


def generate_listings(uid: int, progress: dict, llm=None) -> list[dict]:
    """Пишет кворки для всех идей, у которых ещё нет объявления. Можно перезапускать."""
    llm = llm or _llm()
    profile = db.load_profile(uid)
    palette = profile.get("palette", 0)
    context = examples_block(profile)
    own = [{"title": e["title"], "description": e["description"]} for e in profile.get("examples", [])]
    listings = db.load_listings(uid)
    lock = threading.Lock()
    hints: dict[int, str] = {}
    progress.update(stage="listings", done=len(listings), total=len(listings) + len(missing_ideas(uid)))

    def work(batch: list[dict]) -> None:
        data = llm.ask(_listing_prompt(profile, batch, hints), system=SYSTEM, schema=BOT_LISTING_SCHEMA,
                       effort=BOT_CONFIG.effort, max_tokens=32000, cached_context=context)
        by_no = {i["no"]: i for i in batch}
        for cand in data["listings"]:
            idea = by_no.pop(cand.get("idea_no"), None)
            if idea is None:
                continue
            errors = validate(cand)
            if cand["price_rub"] < profile.get("min_price", 0):
                errors.append(f"цена ниже {profile['min_price']} ₽")
            with lock:
                dup = find_duplicate(cand, own + listings)
                if dup:
                    errors.append(f"слишком похоже на «{dup['title']}»")
                if errors:
                    hints[idea["no"]] = "; ".join(errors)
                    continue
                listings.append(_new_listing(uid, cand, idea, palette))
                hints.pop(idea["no"], None)
                db.save_listings(uid, listings)
                progress["done"] = len(listings)

    def run(batch: list[dict]) -> None:
        try:
            work(batch)
        except Exception as e:  # noqa: BLE001 — одна упавшая пачка не должна ронять остальные
            progress["error"] = f"{type(e).__name__}: {e}"[:300]

    for _ in range(ROUNDS):
        todo = missing_ideas(uid)
        if not todo:
            break
        batches = [todo[i:i + LISTINGS_PER_CALL] for i in range(0, len(todo), LISTINGS_PER_CALL)]
        # Первая пачка — отдельно: она записывает образцы в кэш, остальные читают их дёшево.
        run(batches[0])
        with ThreadPoolExecutor(max_workers=BOT_CONFIG.parallel) as pool:
            list(pool.map(run, batches[1:]))
    return listings


def ensure_visual_brief(uid: int, llm=None) -> str:
    """Английское описание ниши для картинок (если человек пришёл без образцов)."""
    profile = db.load_profile(uid)
    if not profile.get("visual_brief"):
        llm = llm or _llm(BOT_CONFIG.ideas_model)
        data = llm.ask(f"Услуги фрилансера: {profile.get('skills', '')}", system=SYSTEM, schema=VISUAL_SCHEMA,
                       effort="low", max_tokens=2000)
        profile["visual_brief"] = data["visual_brief"]
        db.save_profile(uid, profile)
    return profile["visual_brief"]


def generate_all(uid: int, count: int, progress: dict) -> None:
    """Полный цикл для новой партии: фоны обложек → идеи → тексты."""
    if BOT_CONFIG.images_enabled and not images.backgrounds(uid):
        try:
            ensure_visual_brief(uid)
        except Exception as e:  # noqa: BLE001 — без описания фоны всё равно получатся, просто общее
            progress["error"] = f"описание для картинок: {type(e).__name__}: {e}"[:300]
        images.make_backgrounds(uid, progress)
    generate_ideas(uid, count, progress)
    generate_listings(uid, progress)


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
    others = [l for l in listings if l["id"] != lid] + profile.get("examples", [])
    hint = f"Напиши заново и по-другому, чем «{old['title']}»." + (f" Пожелание: {wish}" if wish else "")
    for _ in range(ROUNDS):
        data = llm.ask(_listing_prompt(profile, [idea], {idea["no"]: hint}), system=SYSTEM,
                       schema=BOT_LISTING_SCHEMA, effort=BOT_CONFIG.effort, max_tokens=16000,
                       cached_context=examples_block(profile))
        cand = data["listings"][0]
        errors = validate(cand)
        dup = find_duplicate(cand, others)
        if dup:
            errors.append(f"слишком похоже на «{dup['title']}»")
        if not errors:
            new = _new_listing(uid, cand, idea, old.get("palette", 0), lid=lid, bg=old.get("bg"))
            listings[listings.index(old)] = new
            db.save_listings(uid, listings)
            return new
        hint += " Прошлая попытка отклонена: " + "; ".join(errors)
    raise ValueError("не получилось переписать без ошибок, попробуйте ещё раз")


def next_cover(uid: int, lid: str) -> dict:
    """Другая обложка: следующий ИИ-фон, а если фонов нет — следующий цвет."""
    listings = db.load_listings(uid)
    l = _find(listings, lid)
    if images.backgrounds(uid):
        l["bg"] = l.get("bg", 0) + 1
    else:
        l["palette"] = (l.get("palette", 0) + 1) % len(PALETTES)
    images.render_cover(uid, l)
    db.save_listings(uid, listings)
    return l


def set_price(uid: int, lid: str, price: int) -> dict:
    if not CONFIG.price_min <= price <= CONFIG.price_max:
        raise ValueError(f"цена должна быть от {CONFIG.price_min} до {CONFIG.price_max} ₽")
    listings = db.load_listings(uid)
    l = _find(listings, lid)
    l["price_rub"] = price
    images.render_cover(uid, l)  # цена есть на обложке
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


def reset(uid: int) -> None:
    """Новая партия: убираем прошлые кворки, образцы и фоны (оплата и настройки остаются)."""
    import shutil

    for sub in ("covers", "examples", "backgrounds"):
        shutil.rmtree(db.user_dir(uid) / sub, ignore_errors=True)
    db.save_listings(uid, [])
    profile = db.load_profile(uid)
    for key in ("examples", "ideas", "skills", "style", "summary", "min_price", "visual_brief"):
        profile.pop(key, None)
    db.save_profile(uid, profile)
