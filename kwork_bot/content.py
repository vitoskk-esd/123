"""Генерация контента для пользователя бота: разбор его кворков → идеи → тексты → обложки.

Функции синхронные (бот вызывает их в отдельном потоке) и сообщают прогресс через
словарь progress: {"stage": ..., "done": ..., "total": ...}.

Экономия: разбор образцов и идеи (несколько запросов) — с глубоким размышлением на
BOT_CONFIG.ideas_model, тексты (десятки запросов) — быстро на BOT_CONFIG.model. Образцы кворков идут в
кэшируемую часть промпта: каждый следующий запрос читает их в ~10 раз дешевле.
"""

from __future__ import annotations

import copy
import threading
import uuid
from concurrent.futures import ThreadPoolExecutor

from kwork_agent.config import CONFIG
from kwork_agent.generator import LISTING_SCHEMA, validate
from kwork_agent.uniqueness import find_duplicate, title_similarity

from . import db, images
from .kwork_rules import PORTFOLIO_REQUIRED, PRICES, category_list, find_category, normalize, snap_price
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



# Та же схема, что у агента, плюс номер идеи — чтобы связать ответ с идеей.
BOT_LISTING_SCHEMA = copy.deepcopy(LISTING_SCHEMA)
_item = BOT_LISTING_SCHEMA["properties"]["listings"]["items"]
_item["properties"]["idea_no"] = {"type": "integer", "description": "Номер идеи из списка"}
_item["properties"]["type_hint"] = {
    "type": "string",
    "description": "Как на Kwork называется тип услуги внутри рубрики (поле «Тип»), 1–3 слова: "
                   "например «Чат-боты», «Логотипы», «Лендинги», «Парсеры»",
}
_item["properties"]["volume"] = {
    "type": "string",
    "description": "Объём услуг в 1 кворке (обязательное поле Kwork): что входит в базовую цену, "
                   "коротко и с числом, до 60 символов — например «1 логотип в 3 вариантах», "
                   "«до 1000 символов текста», «1 чат-бот до 10 команд»",
}
_item["properties"]["attribute_hints"] = {
    "type": "array", "items": {"type": "string"},
    "description": "3–8 коротких слов для обязательных полей рубрики Kwork: платформа, язык программирования, "
                   "программа, формат, площадка — например «Telegram», «Python», «Excel», «Wildberries», «Figma»",
}
_item["required"] += ["idea_no", "type_hint", "volume", "attribute_hints"]

VISUAL_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "required": ["visual_brief"],
    "properties": {"visual_brief": {"type": "string", "description": VISUAL_BRIEF_HINT}},
}

SYSTEM = ("Ты — сильный копирайтер, который помогает фрилансерам продавать услуги на Kwork. "
          "Пишешь по-русски, живо и конкретно, без воды и канцелярита.")


def _llm(model: str | None = None):
    if BOT_CONFIG.llm == "gemini":
        from .gemini_llm import GeminiLLM

        return GeminiLLM(model=model or BOT_CONFIG.model)
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
                   system=SYSTEM, schema=PROFILE_SCHEMA, effort="high", max_tokens=8000)
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
    own = [e["title"] for e in profile.get("examples", []) + db.load_history(uid)]
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
            system=SYSTEM, schema=IDEAS_SCHEMA, effort="high", max_tokens=32000,
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
- requirements — что покупатель присылает для старта ({CONFIG.requirements_min}–{CONFIG.requirements_max} символов).
- category_hint — СТРОГО одна строка из списка рубрик Kwork ниже, как написано.
- Цена в рублях — одна из допустимых на Kwork: {", ".join(str(p) for p in PRICES if p >= profile.get('min_price', 0))};
  срок 1–30 дней — реалистично для объёма работы.
- volume — объём услуг в 1 кворке: что входит в цену, с числом, до 60 символов.
- attribute_hints — 3–8 слов для полей рубрики Kwork («Платформа», «Язык разработки», «Программа»…):
  только то, что правда относится к услуге (Telegram, Python, Excel, Figma, Wildberries).
- cover_text — 2–5 слов крупно на обложку; у каждого кворка свой. Без цен, сроков, скидок и
  процентов: модерация Kwork отклоняет обложку с ценой.
- Обещай только то, что фрилансер реально сделает; без гарантий дохода и позиций.

РУБРИКИ KWORK:
{category_list()}"""


def _new_listing(uid: int, cand: dict, idea: dict, palette: int, lid: str | None = None) -> dict:
    cand = {k: v for k, v in cand.items() if k != "idea_no"}
    cand.update(id=lid or uuid.uuid4().hex[:10], idea_no=idea["no"], idea=idea["name"], palette=palette)
    images.render_cover(uid, cand)
    return cand


def previous_texts(uid: int) -> list[dict]:
    """С чем новый кворк не должен совпадать: образцы клиента и все его прошлые партии."""
    profile = db.load_profile(uid)
    return [{"title": e["title"], "description": e["description"]}
            for e in profile.get("examples", []) + db.load_history(uid)]


def uniqueness_report(uid: int) -> tuple[int, int]:
    """Финальная проверка партии: (пар похожих текстов, пар похожих фонов) — должно быть (0, 0)."""
    listings = db.load_listings(uid)
    texts = sum(1 for i, l in enumerate(listings) for other in listings[i + 1:] if find_duplicate(l, [other]))
    texts += sum(1 for l in listings if find_duplicate(l, previous_texts(uid)))
    marks = [images.cover_fingerprint(p) for l in listings if (p := db.cover_path(uid, l["id"])).exists()]
    old = [h["fp"] for h in db.load_history(uid) if h.get("fp") is not None]
    pics = sum(1 for i, a in enumerate(marks) for b in marks[i + 1:] + old if images.covers_similar(a, b))
    return texts, pics


COVER_TEXT_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "required": ["covers"],
    "properties": {"covers": {"type": "array", "items": {
        "type": "object", "additionalProperties": False, "required": ["no", "text"],
        "properties": {"no": {"type": "integer"}, "text": {"type": "string"}}}}},
}


def cover_texts(titles: list[str], llm=None) -> list[str]:
    """2–5 слов на обложку по названию кворка (для кворков прошлых партий, где текста нет)."""
    if not titles:
        return []
    llm = llm or _llm()
    data = llm.ask("Для каждого кворка Kwork придумай текст на обложку: 2–5 слов в именительном падеже, "
                   "о чём услуга. Без цен, сроков, скидок и процентов.\n\n"
                   + "\n".join(f"{n}. {t}" for n, t in enumerate(titles, 1)),
                   system=SYSTEM, schema=COVER_TEXT_SCHEMA, effort="low", max_tokens=4000)
    got = {c["no"]: c["text"] for c in data.get("covers", [])}
    return [got.get(n, "") for n in range(1, len(titles) + 1)]


def fix_history_covers(uid: int, llm=None) -> int:
    return images.fix_history_covers(uid, lambda titles: cover_texts(titles, llm))


def needs_attributes(uid: int) -> bool:
    from . import kwork_fields

    return any(l.get("attributes_cat") != l.get("category_id") and kwork_fields.tree_for(l.get("category_id"))
               for l in db.load_listings(uid))


def ensure_attributes(uid: int, llm=None) -> int:
    """Варианты полей рубрики Kwork («Тип», «Язык разработки», «Платформа»…) кворкам без них —
    по ним расширение отмечает поля. Возвращает, у скольких кворков поля нужно проверить вручную."""
    from . import kwork_fields

    listings = db.load_listings(uid)
    if kwork_fields.choose(listings, llm or _llm(), system=SYSTEM):
        db.save_listings(uid, listings)
    return sum(1 for l in listings if l.get("attributes_guessed"))


def portfolio_note(uid: int) -> str:
    """Предупреждение о рубриках, где Kwork требует работы в портфолио — их добавляет сам продавец."""
    n = 0
    for l in db.load_listings(uid):
        if "needs_portfolio" not in l:  # кворки, созданные до появления признака
            cat = find_category(l.get("category_hint", ""))
            l["needs_portfolio"] = bool(cat and cat["portfolio"] in PORTFOLIO_REQUIRED)
        n += bool(l["needs_portfolio"])
    if not n:
        return ""
    return (f"\n📁 {n} кворков — в рубриках, где Kwork требует работы в портфолио (новому продавцу — 3). "
            "Расширение заполнит всё остальное и остановится на шаге «Портфолио»: добавьте свои работы "
            "и нажмите «Готово» — дальше оно продолжит само.")


def missing_ideas(uid: int) -> list[dict]:
    done = {l["idea_no"] for l in db.load_listings(uid)}
    return [i for i in db.load_profile(uid)["ideas"] if i["no"] not in done and not i.get("skipped")]


def generate_listings(uid: int, progress: dict, llm=None) -> list[dict]:
    """Пишет кворки для всех идей, у которых ещё нет объявления. Можно перезапускать."""
    llm = llm or _llm()
    profile = db.load_profile(uid)
    palette = profile.get("palette", 0)
    context = examples_block(profile)
    own = previous_texts(uid)
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
            errors = normalize(cand) + validate(cand)
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


def make_images(uid: int, progress: dict) -> None:
    """Уникальная обложка каждому кворку: своя обработка общего фона + проверка отпечатков."""
    images.unique_covers(uid, db.load_listings(uid), progress)


def generate_all(uid: int, count: int, progress: dict) -> None:
    """Полный цикл для новой партии: общие фоны → идеи → тексты → уникальные обложки."""
    if BOT_CONFIG.images_enabled and not images.backgrounds(uid):
        try:
            ensure_visual_brief(uid)
        except Exception as e:  # noqa: BLE001 — без описания фоны всё равно получатся, просто общее
            progress["error"] = f"описание для картинок: {type(e).__name__}: {e}"[:300]
        images.make_backgrounds(uid, progress)
    generate_ideas(uid, count, progress)
    generate_listings(uid, progress)
    make_images(uid, progress)


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
    others = [l for l in listings if l["id"] != lid] + previous_texts(uid)
    hint = f"Напиши заново и по-другому, чем «{old['title']}»." + (f" Пожелание: {wish}" if wish else "")
    for _ in range(ROUNDS):
        data = llm.ask(_listing_prompt(profile, [idea], {idea["no"]: hint}), system=SYSTEM,
                       schema=BOT_LISTING_SCHEMA, effort=BOT_CONFIG.effort, max_tokens=16000,
                       cached_context=examples_block(profile))
        cand = data["listings"][0]
        if old.get("own_photo"):  # обложка — фото клиента, она остаётся
            cand.update(own_photo=True, fp=old.get("fp"))
        errors = normalize(cand) + validate(cand)
        dup = find_duplicate(cand, others)
        if dup:
            errors.append(f"слишком похоже на «{dup['title']}»")
        if not errors:
            new = _new_listing(uid, cand, idea, old.get("palette", 0), lid=lid)  # фон кворка остаётся прежним
            listings[listings.index(old)] = new
            db.save_listings(uid, listings)
            return new
        hint += " Прошлая попытка отклонена: " + "; ".join(errors)
    raise ValueError("не получилось переписать без ошибок, попробуйте ещё раз")


def next_cover(uid: int, lid: str) -> dict:
    """Другая обложка: другая обработка фона (бесплатно), тоже непохожая на остальные."""
    listings = db.load_listings(uid)
    l = _find(listings, lid)
    images.new_look(uid, l, listings)
    db.save_listings(uid, listings)
    return l


def set_price(uid: int, lid: str, price: int) -> dict:
    if not CONFIG.price_min <= price <= CONFIG.price_max:
        raise ValueError(f"цена должна быть от {CONFIG.price_min} до {CONFIG.price_max} ₽")
    price = snap_price(price)  # на Kwork цена выбирается из списка: 500, 1000, 1500 …
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
    db.cover_path(uid, lid).unlink(missing_ok=True)
    (db.user_dir(uid) / "photos" / f"{lid}.jpg").unlink(missing_ok=True)
    db.save_listings(uid, [l for l in listings if l["id"] != lid])


def existing_kworks(uid: int) -> int:
    """Сколько кворков уже на аккаунте: из профиля Kwork, иначе — хотя бы присланные образцы."""
    profile = db.load_profile(uid)
    found = profile.get("existing_kworks")
    return found if found is not None else len(profile.get("examples", []))


def room(uid: int) -> int:
    """Сколько новых кворков можно создать, не превысив лимит Kwork."""
    return max(0, min(BOT_CONFIG.max_listings, BOT_CONFIG.kwork_limit - existing_kworks(uid)))


def reset(uid: int) -> None:
    """Новая партия: убираем прошлые кворки, образцы и фоны (оплата и настройки остаются)."""
    import shutil

    # Прошлая партия уходит в историю: следующие не будут повторять её тексты и фоны.
    history = db.load_history(uid)
    for l in db.load_listings(uid):
        cover = db.cover_path(uid, l["id"])
        history.append({"id": l["id"], "title": l["title"], "description": l["description"],
                        "fp": l.get("fp") or (images.cover_fingerprint(cover) if cover.exists() else None),
                        "cover_text": l.get("cover_text", ""), "category_hint": l.get("category_hint", ""),
                        "own_photo": bool(l.get("own_photo"))})
    db.save_history(uid, history)
    for sub in ("covers", "examples", "backgrounds", "photos"):
        shutil.rmtree(db.user_dir(uid) / sub, ignore_errors=True)
    db.save_listings(uid, [])
    profile = db.load_profile(uid)
    for key in ("examples", "ideas", "skills", "style", "summary", "min_price", "visual_brief", "existing_kworks"):
        profile.pop(key, None)
    db.save_profile(uid, profile)
