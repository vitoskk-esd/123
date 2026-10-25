"""Диалог бота: 3–5 кворков-образцов → сколько сделать → идеи, тексты, обложки → правки → архив."""

from __future__ import annotations

import asyncio
import html
import io
import tempfile
from pathlib import Path

from aiogram import Bot, F, Router
from aiogram.filters import Command, CommandStart
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.types import (BufferedInputFile, CallbackQuery, FSInputFile, InlineKeyboardButton,
                           InlineKeyboardMarkup, InputMediaPhoto, Message)

from kwork_agent.config import CONFIG
from kwork_agent.cover import PALETTES, make_cover

from . import content, db, examples, payments
from .config import BOT_CONFIG
from .export import HOW_TO, build_zip

router = Router()
JOBS: dict[int, dict] = {}  # кто сейчас ждёт генерацию: uid → прогресс
_TASKS: set[asyncio.Task] = set()  # ссылки на фоновые задачи, чтобы их не собрал сборщик мусора


def background(coro) -> None:
    task = asyncio.create_task(coro)
    _TASKS.add(task)
    task.add_done_callback(_TASKS.discard)


PALETTE_NAMES = ["Зелёный", "Фиолетовый", "Синий", "Оранжевый", "Бирюзовый", "Жёлтый"]


class Form(StatesGroup):
    examples = State()
    skills = State()
    count = State()
    price = State()
    wish = State()
    email = State()


def kb(*rows: list[tuple[str, str]]) -> InlineKeyboardMarkup:
    """Кнопки: каждая строка — список (текст, callback_data или https-ссылка)."""
    return InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text=t, url=d) if d.startswith("https://") else
         InlineKeyboardButton(text=t, callback_data=d) for t, d in row]
        for row in rows
    ])


def esc(s: object) -> str:
    return html.escape(str(s))


# --- Меню и доступ -------------------------------------------------------------

def menu_markup(uid: int) -> InlineKeyboardMarkup:
    listings = db.load_listings(uid)
    rows = [[("✨ Новая партия кворков", "new")]]
    if listings:
        rows.append([(f"📋 Мои кворки ({len(listings)})", "v:0")])
        rows.append([("📦 Скачать всё архивом", "zip")])
    if db.load_profile(uid)["ideas"] and content.missing_ideas(uid):
        rows.append([("▶️ Дописать недостающие", "continue")])
    rows.append([("❓ Как выложить на Kwork", "howto")])
    return kb(*rows)


async def show_menu(message: Message, uid: int) -> None:
    n = len(db.load_listings(uid))
    text = (f"Готово кворков: <b>{n}</b>. Что делаем дальше?" if n else
            "Пришлите 3–5 своих кворков с Kwork — я изучу их и сделаю столько новых, сколько "
            "нужно: другие услуги, в вашем стиле, с текстами и обложками.")
    await message.answer(text, reply_markup=menu_markup(uid))


async def show_paywall(message: Message) -> None:
    text = (f"Доступ к боту — <b>{BOT_CONFIG.price_rub} ₽ разово</b>.\n\n"
            f"Что входит:\n• до {BOT_CONFIG.max_listings} уникальных кворков под ваши навыки (лимит Kwork)\n"
            "• названия, описания, цены и сроки по правилам Kwork\n"
            "• обложки в едином стиле\n• правки: переписать, другая обложка, цена\n"
            "• архив с таблицей и картинками для быстрой выкладки")
    if not BOT_CONFIG.payments_enabled:
        await message.answer(text + "\n\nОплата скоро заработает — загляните чуть позже.")
        return
    await message.answer(text, reply_markup=kb([("💳 Оплатить", "pay")]))


@router.message(CommandStart())
async def start(message: Message, state: FSMContext) -> None:
    uid = message.from_user.id
    await state.clear()
    if db.claim_owner(uid):
        await message.answer("Вы — владелец этого бота: пользуетесь бесплатно. "
                             "Остальные увидят экран оплаты.")
    if db.has_access(uid):
        await show_menu(message, uid)
    else:
        await show_paywall(message)


@router.message(Command("menu"))
async def cmd_menu(message: Message, state: FSMContext) -> None:
    await state.clear()
    await start(message, state)


@router.message(Command("stats"))
async def cmd_stats(message: Message) -> None:
    if not db.is_admin(message.from_user.id):
        return
    users = [p for p in (BOT_CONFIG.data_dir / "users").glob("*") if p.is_dir()]
    paid = sum(1 for p in users if db.load_profile(int(p.name))["paid"])
    total = sum(len(db.load_listings(int(p.name))) for p in users)
    await message.answer(f"Пользователей: {len(users)}\nОплатили: {paid}\nКворков создано: {total}")


@router.callback_query(F.data == "menu")
async def cb_menu(call: CallbackQuery, state: FSMContext) -> None:
    await state.clear()
    await call.answer()
    await show_menu(call.message, call.from_user.id)


@router.callback_query(F.data == "howto")
async def cb_howto(call: CallbackQuery) -> None:
    await call.answer()
    await call.message.answer(f"<pre>{esc(HOW_TO)}</pre>", reply_markup=kb([("🏠 Меню", "menu")]))


# --- Оплата ---------------------------------------------------------------------

@router.callback_query(F.data == "pay")
async def cb_pay(call: CallbackQuery, state: FSMContext) -> None:
    await call.answer()
    if BOT_CONFIG.receipts:
        await state.set_state(Form.email)
        await call.message.answer("Напишите e-mail — пришлю на него чек об оплате.")
        return
    await send_invoice(call.message, call.from_user.id)


@router.message(Form.email)
async def got_email(message: Message, state: FSMContext) -> None:
    email = (message.text or "").strip()
    if "@" not in email or "." not in email.split("@")[-1]:
        await message.answer("Похоже, в адресе ошибка. Напишите e-mail ещё раз.")
        return
    await state.clear()
    await send_invoice(message, message.from_user.id, email)


async def send_invoice(message: Message, uid: int, email: str = "") -> None:
    try:
        pid, url = await asyncio.to_thread(payments.create_payment, uid, email)
    except Exception:  # noqa: BLE001
        await message.answer("Не получилось создать платёж. Попробуйте через пару минут.")
        return
    profile = db.load_profile(uid)
    profile["payment_id"] = pid
    db.save_profile(uid, profile)
    await message.answer("Оплатите по кнопке ниже, затем вернитесь сюда и нажмите «Я оплатил».",
                         reply_markup=kb([("💳 Перейти к оплате", url)], [("✅ Я оплатил", "paid")]))


@router.callback_query(F.data == "paid")
async def cb_paid(call: CallbackQuery) -> None:
    uid = call.from_user.id
    profile = db.load_profile(uid)
    if not profile.get("payment_id"):
        await call.answer("Сначала нажмите «Оплатить»", show_alert=True)
        return
    try:
        status = await asyncio.to_thread(payments.payment_status, profile["payment_id"])
    except Exception:  # noqa: BLE001
        await call.answer("ЮKassa не ответила, попробуйте ещё раз через минуту", show_alert=True)
        return
    if status != "succeeded":
        await call.answer("Оплата ещё не прошла. Если вы уже заплатили — подождите минуту.", show_alert=True)
        return
    profile["paid"] = True
    db.save_profile(uid, profile)
    await call.answer("Оплата прошла, спасибо!")
    await show_menu(call.message, uid)


# --- Анкета ------------------------------------------------------------------------

async def guard(call: CallbackQuery) -> bool:
    """Нет доступа или идёт генерация — действие не выполняем."""
    uid = call.from_user.id
    if not db.has_access(uid):
        await call.answer()
        await show_paywall(call.message)
        return False
    if uid in JOBS:
        await call.answer("Подождите, я ещё пишу кворки — пришлю, когда закончу", show_alert=True)
        return False
    return True


@router.callback_query(F.data == "new")
async def cb_new(call: CallbackQuery, state: FSMContext) -> None:
    if not await guard(call):
        return
    await call.answer()
    n = len(db.load_listings(call.from_user.id))
    if n:
        await call.message.answer(f"У вас уже есть {n} кворков. Начать новую партию? Старые удалятся "
                                  "(скачайте архив, если ещё не скачали).",
                                  reply_markup=kb([("Да, новая партия", "new_ok"), ("Нет", "menu")]))
        return
    content.reset(call.from_user.id)
    await ask_examples(call.message, state)


@router.callback_query(F.data == "new_ok")
async def cb_new_ok(call: CallbackQuery, state: FSMContext) -> None:
    if not await guard(call):
        return
    await call.answer()
    content.reset(call.from_user.id)
    await ask_examples(call.message, state)


# --- Шаг 1: кворки-образцы ---------------------------------------------------------------

async def ask_examples(message: Message, state: FSMContext) -> None:
    await state.set_state(Form.examples)
    await message.answer(
        "<b>Шаг 1.</b> Пришлите ссылку на ваш профиль Kwork — я сам возьму из него до "
        f"{examples.MAX_EXAMPLES} кворков.\n\n<i>Например: https://kwork.ru/user/ваш_логин</i>\n"
        "<i>Откройте свой профиль на Kwork и скопируйте адрес из адресной строки.</i>\n\n"
        "Подойдёт и ссылка на любой ваш кворк. А если хотите показать конкретные — пришлите "
        "ссылки на них или вставьте текст кворка (название в первой строке, ниже описание).",
        reply_markup=kb([("У меня пока нет кворков", "no_examples")]),
    )


@router.message(Form.examples)
async def got_examples(message: Message, state: FSMContext) -> None:
    uid = message.from_user.id
    text = message.text or message.caption or ""
    urls = examples.find_urls(text)
    seller = examples.find_profile(text)
    have = len(db.load_profile(uid).get("examples", []))
    report, found = [], []

    async def take(source: str | None) -> None:
        try:
            found.append(await asyncio.to_thread(examples.fetch_kwork, source) if source
                         else examples.from_text(text))
        except Exception as e:  # noqa: BLE001 — сеть, чужая ссылка, не страница кворка
            why = esc(e) if isinstance(e, ValueError) else "страница не открылась, попробуйте ещё раз"
            report.append(f"⚠️ {esc(source) if source else 'Текст'}: {why}")

    if not urls and not seller:
        await take(None)
    for url in urls[:examples.MAX_EXAMPLES]:
        await take(url)
    # Ссылка на профиль или на один свой кворк — остальные кворки берём из профиля сами.
    if seller is None and len(urls) == 1 and found:
        seller = found[0].get("username") or None
    room = examples.MAX_EXAMPLES - have - len(found)
    if seller and room > 0:
        try:
            _, links = await asyncio.to_thread(examples.seller_kworks, seller)
        except Exception as e:  # noqa: BLE001
            links = []
            why = esc(e) if isinstance(e, ValueError) else "профиль не открылся, попробуйте ещё раз"
            report.append(f"⚠️ Профиль: {why}")
        before = len(found)
        for url in [u for u in links if u not in urls][:room]:
            await take(url)
        if len(found) > before:
            report.append(f"🔎 Взял из вашего профиля кворков: {len(found) - before}")
    n = have
    for ex in found:
        n = await asyncio.to_thread(examples.add_example, uid, ex)
        report.append(f"✅ «{esc(ex['title'])}»")
    if n >= examples.MAX_EXAMPLES:
        await message.answer("\n".join(report) + f"\n\nПринял {n} кворков — этого достаточно.")
        await analyze(message, uid, state)
        return
    hint = ("Пришлите ещё или нажмите «Готово»." if n >= 3 else
            f"Пришлите ещё {3 - n} — по 3–5 кворкам я лучше пойму ваш стиль." if n else
            "Не получилось — пришлите ссылку на профиль вида https://kwork.ru/user/ваш_логин")
    buttons = [[(f"Готово ({n}) — дальше", "ex_done")]] if n else []
    await message.answer("\n".join(report + [f"\nОбразцов: <b>{n}</b>. {hint}"]), reply_markup=kb(*buttons))


@router.callback_query(F.data == "ex_done")
async def cb_examples_done(call: CallbackQuery, state: FSMContext) -> None:
    if not await guard(call):
        return
    await call.answer()
    await analyze(call.message, call.from_user.id, state)


async def analyze(message: Message, uid: int, state: FSMContext) -> None:
    if not db.load_profile(uid).get("examples"):
        await ask_examples(message, state)
        return
    await state.set_state(None)
    wait = await message.answer("🔎 Изучаю ваши кворки…")
    JOBS[uid] = {}
    try:
        profile = await asyncio.to_thread(content.analyze_examples, uid)
    except Exception as e:  # noqa: BLE001
        details = f"\n<code>{esc(type(e).__name__)}: {esc(str(e)[:300])}</code>" if db.is_admin(uid) else ""
        await wait.edit_text("😔 Не получилось разобрать кворки, попробуйте ещё раз." + details,
                             reply_markup=kb([("🔁 Ещё раз", "ex_done")]))
        return
    finally:
        JOBS.pop(uid, None)
    usernames = [e.get("username") for e in profile["examples"] if e.get("username")]
    try:
        found = await asyncio.to_thread(examples.seller_kwork_count, usernames[0]) if usernames else None
    except Exception:  # noqa: BLE001 — профиль не открылся: считаем по образцам
        found = None
    profile = db.load_profile(uid)
    profile["existing_kworks"] = found
    db.save_profile(uid, profile)
    have = content.existing_kworks(uid)
    await wait.edit_text(
        f"Понял: {esc(profile['summary'])}\nЦены новых кворков — от {profile['min_price']} ₽.\n\n"
        f"На Kwork можно держать до {BOT_CONFIG.kwork_limit} кворков. "
        + (f"В вашем профиле сейчас {have} — можно создать ещё <b>{content.room(uid)}</b>."
           if found is not None else
           f"Сколько у вас уже есть, узнать не получилось — учту только присланные ({have})."))
    await ask_count(message, state)


# --- Если своих кворков нет: коротко о себе ------------------------------------------

@router.callback_query(F.data == "no_examples")
async def cb_no_examples(call: CallbackQuery, state: FSMContext) -> None:
    await call.answer()
    await state.set_state(Form.skills)
    await call.message.answer("Тогда расскажите, что вы умеете и какие услуги хотите продавать, "
                              "и какой у вас опыт.\n\n<i>Например: «Делаю логотипы и баннеры в Figma, "
                              "3 года, 150 проектов».</i>")


@router.message(Form.skills)
async def got_skills(message: Message, state: FSMContext) -> None:
    text = (message.text or "").strip()
    if len(text) < 10:
        await message.answer("Напишите чуть подробнее — хотя бы одно предложение.")
        return
    uid = message.from_user.id
    profile = db.load_profile(uid)
    profile.update(skills=text[:1500], examples=[])
    db.save_profile(uid, profile)
    await state.set_state(None)
    prices = [p for p in (500, 1000, 2000, 5000) if p >= CONFIG.price_min]
    await message.answer("Минимальная цена одного кворка?",
                         reply_markup=kb([(f"{p} ₽", f"mp:{p}") for p in prices]))


@router.callback_query(F.data.startswith("mp:"))
async def got_price(call: CallbackQuery, state: FSMContext) -> None:
    await call.answer()
    profile = db.load_profile(call.from_user.id)
    profile["min_price"] = int(call.data[3:])
    db.save_profile(call.from_user.id, profile)
    await ask_count(call.message, state)


# --- Шаг 2: сколько кворков ------------------------------------------------------------

async def ask_count(message: Message, state: FSMContext) -> None:
    await state.set_state(None)
    free = content.room(message.chat.id)
    if free == 0:
        await message.answer(f"У вас уже {BOT_CONFIG.kwork_limit} кворков — это лимит Kwork. Чтобы добавить "
                             "новые, сначала удалите или архивируйте часть старых.", reply_markup=kb([("🏠 Меню", "menu")]))
        return
    counts = [c for c in (10, 30, 50, 100) if c < free]
    buttons = [(str(c), f"cnt:{c}") for c in counts] + [(f"Все {free}", f"cnt:{free}")]
    await message.answer(
        f"<b>Шаг 2.</b> Сколько новых кворков создать? Свободно мест: <b>{free}</b>.\n"
        "<i>Для начала можно 10 — посмотрите качество, потом доделаем остальные.</i>\n"
        "<i>Кворки на модерации и на паузе в профиле не видны — если такие есть, берите с запасом.</i>",
        reply_markup=kb(buttons[:3], buttons[3:], [("✍️ Своё число", "cnt_custom")]),
    )


@router.callback_query(F.data == "cnt_custom")
async def cb_count_custom(call: CallbackQuery, state: FSMContext) -> None:
    await call.answer()
    await state.set_state(Form.count)
    await call.message.answer(f"Напишите число от 1 до {content.room(call.from_user.id)}:")


@router.message(Form.count)
async def got_count_text(message: Message, state: FSMContext) -> None:
    digits = "".join(ch for ch in (message.text or "") if ch.isdigit())
    count, free = int(digits or 0), content.room(message.from_user.id)
    if not 1 <= count <= free:
        await message.answer(f"Нужно число от 1 до {free} — столько мест свободно до лимита Kwork. "
                             "Напишите ещё раз.")
        return
    await state.set_state(None)
    await chose_count(message, message.from_user.id, state, count)


@router.callback_query(F.data.startswith("cnt:"))
async def got_count(call: CallbackQuery, state: FSMContext) -> None:
    await call.answer()
    count = min(int(call.data[4:]), content.room(call.from_user.id))
    if count < 1:
        await call.message.answer("Свободных мест до лимита Kwork не осталось.")
        return
    await chose_count(call.message, call.from_user.id, state, count)


async def chose_count(message: Message, uid: int, state: FSMContext, count: int) -> None:
    await state.update_data(count=count)
    if BOT_CONFIG.images_enabled:
        # Обложки будут на ИИ-фонах в стиле образцов, цвет нужен только для акцента.
        await start_generation(message, uid, state, palette=5)
        return
    await message.answer_photo(
        BufferedInputFile(palette_preview(), "styles.png"),
        caption="<b>Шаг 3.</b> Выберите цвет обложек:",
        reply_markup=kb(*[[(f"{i + 1}. {n}", f"pal:{i}") for i, n in list(enumerate(PALETTE_NAMES))[r:r + 3]]
                          for r in (0, 3)]),
    )


def palette_preview() -> bytes:
    from PIL import Image, ImageDraw

    sample = {"id": "preview", "title": "Ваша услуга", "cover_text": "Ваша услуга здесь",
              "days": 3, "price_rub": 1000}
    w, h = 330, 220
    sheet = Image.new("RGB", (w * 3, h * 2), "white")
    with tempfile.TemporaryDirectory() as tmp:
        for i in range(len(PALETTES)):
            img = Image.open(make_cover(sample, out_dir=Path(tmp), palette=i)).resize((w, h))
            ImageDraw.Draw(img).text((w - 30, 10), str(i + 1), fill="white")
            sheet.paste(img, ((i % 3) * w, (i // 3) * h))
    buf = io.BytesIO()
    sheet.save(buf, "PNG")
    return buf.getvalue()


@router.callback_query(F.data.startswith("pal:"))
async def got_palette(call: CallbackQuery, state: FSMContext) -> None:
    if not await guard(call):
        return
    await call.answer()
    await start_generation(call.message, call.from_user.id, state, palette=int(call.data[4:]))


async def start_generation(message: Message, uid: int, state: FSMContext, palette: int) -> None:
    count = (await state.get_data()).get("count")
    await state.clear()
    profile = db.load_profile(uid)
    if not count or not profile.get("skills"):
        await message.answer("Давайте начнём заново.", reply_markup=kb([("✨ Новая партия", "new")]))
        return
    profile.update(palette=palette, ideas=[])
    db.save_profile(uid, profile)
    background(run_job(message.bot, uid, message.chat.id, count))


@router.callback_query(F.data == "continue")
async def cb_continue(call: CallbackQuery) -> None:
    if not await guard(call):
        return
    await call.answer()
    background(run_job(call.bot, call.from_user.id, call.message.chat.id, None))


# --- Генерация с прогрессом ------------------------------------------------------------

def progress_text(p: dict) -> str:
    if p.get("stage") == "images":
        return f"🎨 Рисую фоны для обложек в вашем стиле: <b>{p['done']} из {p['total']}</b>"
    if p.get("stage") == "listings":
        return f"✍️ Пишу тексты и делаю обложки: <b>{p['done']} из {p['total']}</b>"
    if p.get("stage") == "ideas":
        return f"💡 Придумываю услуги: <b>{p['done']} из {p['total']}</b>"
    return "⏳ Начинаю…"


async def run_job(bot: Bot, uid: int, chat_id: int, ideas_count: int | None) -> None:
    """ideas_count=None — только дописать недостающие кворки по уже готовым идеям."""
    if uid in JOBS:
        return
    progress: dict = {}
    JOBS[uid] = progress

    def work() -> None:
        if ideas_count:
            content.generate_all(uid, ideas_count, progress)
        else:
            content.generate_listings(uid, progress)

    msg = await bot.send_message(chat_id, progress_text(progress) + "\n\nЭто займёт несколько минут — "
                                 "можно закрыть чат, я пришлю сообщение, когда закончу.")
    shown = ""
    task = asyncio.create_task(asyncio.to_thread(work))
    try:
        while not task.done():
            await asyncio.wait({task}, timeout=5)
            text = progress_text(progress)
            if text != shown:
                shown = text
                try:
                    await msg.edit_text(text)
                except Exception:  # noqa: BLE001 — «сообщение не изменилось» и т.п. не важны
                    pass
        task.result()
    except Exception as e:  # noqa: BLE001
        details = f"\n<code>{esc(type(e).__name__)}: {esc(str(e)[:300])}</code>" if db.is_admin(uid) else ""
        await bot.send_message(chat_id, "😔 Генерация прервалась. Нажмите «Дописать недостающие» — "
                               "продолжу с того же места." + details, reply_markup=menu_markup(uid))
        return
    finally:
        JOBS.pop(uid, None)

    n = len(db.load_listings(uid))
    left = len(content.missing_ideas(uid))
    text = f"✅ Готово: <b>{n}</b> кворков."
    if left:
        text += f"\nЕщё {left} не прошли проверку — нажмите «Дописать недостающие»."
    if progress.get("error") and db.is_admin(uid):
        text += f"\n<code>{esc(progress['error'])}</code>"
    await bot.send_message(chat_id, text, reply_markup=kb([("📋 Смотреть кворки", "v:0")],
                                                          [("📦 Скачать архивом", "zip"), ("🏠 Меню", "menu")]))


# --- Просмотр и правки ---------------------------------------------------------------------

def card(l: dict, i: int, total: int) -> tuple[str, InlineKeyboardMarkup]:
    desc = l["description"]
    if len(desc) > 550:
        desc = desc[:550].rsplit(" ", 1)[0] + "…"
    text = (f"<b>{i + 1}/{total}. {esc(l['title'])}</b>\n"
            f"💰 {l['price_rub']} ₽ · ⏱ {l['days']} дн. · 📂 {esc(l['category_hint'])}\n\n{esc(desc)}")
    lid = l["id"]
    markup = kb(
        [("◀️", f"v:{(i - 1) % total}"), (f"{i + 1}/{total}", f"v:{i}"), ("▶️", f"v:{(i + 1) % total}")],
        [("✏️ Переписать", f"rw:{lid}"), ("🎨 Обложка", f"cv:{lid}")],
        [("💰 Цена", f"pr:{lid}"), ("📄 Весь текст", f"full:{lid}"), ("🗑", f"del:{lid}")],
        [("📦 Архив", "zip"), ("🏠 Меню", "menu")],
    )
    return text, markup


async def show_card(message: Message, uid: int, i: int, edit: bool) -> None:
    listings = db.load_listings(uid)
    if not listings:
        await message.answer("Кворков пока нет.", reply_markup=menu_markup(uid))
        return
    i %= len(listings)
    l = listings[i]
    text, markup = card(l, i, len(listings))
    photo = FSInputFile(db.cover_path(uid, l["id"]))
    if edit and message.photo:
        try:
            await message.edit_media(InputMediaPhoto(media=photo, caption=text), reply_markup=markup)
            return
        except Exception:  # noqa: BLE001 — старое сообщение нельзя изменить — пришлём новое
            pass
    await message.answer_photo(photo, caption=text, reply_markup=markup)


def index_of(uid: int, lid: str) -> int:
    return next((i for i, l in enumerate(db.load_listings(uid)) if l["id"] == lid), 0)


@router.callback_query(F.data.startswith("v:"))
async def cb_view(call: CallbackQuery) -> None:
    await call.answer()
    if not db.has_access(call.from_user.id):
        await show_paywall(call.message)
        return
    await show_card(call.message, call.from_user.id, int(call.data[2:]), edit=True)


@router.callback_query(F.data.startswith("full:"))
async def cb_full(call: CallbackQuery) -> None:
    await call.answer()
    uid, lid = call.from_user.id, call.data[5:]
    l = next((l for l in db.load_listings(uid) if l["id"] == lid), None)
    if l:
        await call.message.answer(
            f"<b>{esc(l['title'])}</b>\n\n{esc(l['description'])}\n\n"
            f"<b>Что нужно от покупателя:</b>\n{esc(l['requirements'])}\n\n"
            f"<b>Теги:</b> {esc(', '.join(l['tags']))}")


@router.callback_query(F.data.startswith("cv:"))
async def cb_cover(call: CallbackQuery) -> None:
    if not await guard(call):
        return
    await call.answer("Другой цвет")
    uid, lid = call.from_user.id, call.data[3:]
    content.next_cover(uid, lid)
    await show_card(call.message, uid, index_of(uid, lid), edit=True)


@router.callback_query(F.data.startswith("del:"))
async def cb_delete(call: CallbackQuery) -> None:
    if not await guard(call):
        return
    await call.answer()
    await call.message.answer("Удалить этот кворк?", reply_markup=kb(
        [("🗑 Да, удалить", f"delok:{call.data[4:]}"), ("Нет", f"v:{index_of(call.from_user.id, call.data[4:])}")]))


@router.callback_query(F.data.startswith("delok:"))
async def cb_delete_ok(call: CallbackQuery) -> None:
    if not await guard(call):
        return
    uid, lid = call.from_user.id, call.data[6:]
    i = index_of(uid, lid)
    try:
        content.delete_listing(uid, lid)
    except StopIteration:
        pass
    await call.answer("Удалено")
    await show_card(call.message, uid, i, edit=False)


@router.callback_query(F.data.startswith("pr:"))
async def cb_price(call: CallbackQuery, state: FSMContext) -> None:
    if not await guard(call):
        return
    await call.answer()
    await state.set_state(Form.price)
    await state.update_data(lid=call.data[3:])
    await call.message.answer(f"Напишите новую цену в рублях (от {CONFIG.price_min} до {CONFIG.price_max}):")


@router.message(Form.price)
async def got_new_price(message: Message, state: FSMContext) -> None:
    uid = message.from_user.id
    lid = (await state.get_data()).get("lid", "")
    digits = "".join(ch for ch in (message.text or "") if ch.isdigit())
    try:
        content.set_price(uid, lid, int(digits or 0))
    except ValueError as e:
        await message.answer(f"Не получилось: {esc(e)}. Напишите число ещё раз.")
        return
    except StopIteration:
        await state.clear()
        await message.answer("Этот кворк уже удалён.", reply_markup=menu_markup(uid))
        return
    await state.clear()
    await show_card(message, uid, index_of(uid, lid), edit=False)


@router.callback_query(F.data.startswith("rw:"))
async def cb_rewrite(call: CallbackQuery, state: FSMContext) -> None:
    if not await guard(call):
        return
    await call.answer()
    await state.set_state(Form.wish)
    await state.update_data(lid=call.data[3:])
    await call.message.answer("Что поменять? Напишите пожелание — например, «короче» или "
                              "«сделай упор на скорость» — или нажмите кнопку.",
                              reply_markup=kb([("Просто напиши по-другому", "rw_any")]))


@router.callback_query(F.data == "rw_any", Form.wish)
async def cb_rewrite_any(call: CallbackQuery, state: FSMContext) -> None:
    await call.answer()
    await do_rewrite(call.message, call.from_user.id, state, "")


@router.message(Form.wish)
async def got_wish(message: Message, state: FSMContext) -> None:
    await do_rewrite(message, message.from_user.id, state, (message.text or "").strip()[:500])


async def do_rewrite(message: Message, uid: int, state: FSMContext, wish: str) -> None:
    lid = (await state.get_data()).get("lid", "")
    await state.clear()
    if uid in JOBS:
        await message.answer("Подождите, я ещё пишу кворки.")
        return
    wait = await message.answer("✍️ Переписываю…")
    JOBS[uid] = {}
    try:
        await asyncio.to_thread(content.rewrite_listing, uid, lid, wish)
    except Exception as e:  # noqa: BLE001
        await wait.edit_text(f"Не получилось переписать: {esc(str(e)[:200])}")
        return
    finally:
        JOBS.pop(uid, None)
    await wait.delete()
    await show_card(message, uid, index_of(uid, lid), edit=False)


# --- Выгрузка ----------------------------------------------------------------------------------

@router.callback_query(F.data == "zip")
async def cb_zip(call: CallbackQuery) -> None:
    if not await guard(call):
        return
    await call.answer("Собираю архив…")
    uid = call.from_user.id
    data = await asyncio.to_thread(build_zip, uid)
    await call.message.answer_document(
        BufferedInputFile(data, "kwork.zip"),
        caption=f"Все {len(db.load_listings(uid))} кворков: таблица kworks.csv, обложки и инструкция "
                "«КАК_ВЫЛОЖИТЬ.txt».",
    )
