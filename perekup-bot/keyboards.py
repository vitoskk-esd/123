"""Клавиатуры. callback_data короткие (лимит Telegram — 64 байта)."""
from aiogram.types import InlineKeyboardButton as B, InlineKeyboardMarkup, KeyboardButton, ReplyKeyboardMarkup

import texts as T

PAGE = 8


def kb(*rows: list[B]) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(inline_keyboard=[r for r in rows if r])


def menu() -> ReplyKeyboardMarkup:
    return ReplyKeyboardMarkup(keyboard=[
        [KeyboardButton(text=T.MENU_FILTERS), KeyboardButton(text=T.MENU_CHANNELS)],
        [KeyboardButton(text=T.MENU_STATS), KeyboardButton(text=T.MENU_SUB)],   # по две в ряд — иначе подписи переносятся
        [KeyboardButton(text=T.MENU_HELP)],
    ], resize_keyboard=True)


def new_filter() -> InlineKeyboardMarkup:
    return kb([B(text=T.BTN_NEW_FILTER, callback_data="f:new")])


def confirm_filter() -> InlineKeyboardMarkup:
    return kb([B(text=T.BTN_SAVE, callback_data="f:save"), B(text=T.BTN_REDO, callback_data="f:new")])


def filters(rows) -> InlineKeyboardMarkup:
    out = [[B(text=f"✏️ #{i}", callback_data=f"f:e:{r['id']}"),
            B(text=("⏸ " if r["active"] else "▶️ ") + f"#{i}", callback_data=f"f:t:{r['id']}"),
            B(text=f"🗑 #{i}", callback_data=f"f:d:{r['id']}")] for i, r in enumerate(rows, 1)]
    out.append([B(text=T.BTN_NEW_FILTER, callback_data="f:new")])
    return kb(*out)


def filter_saved(fid: int) -> InlineKeyboardMarkup:
    return kb([B(text=T.BTN_EDIT_FILTER, callback_data=f"f:e:{fid}")])


def help_menu() -> InlineKeyboardMarkup:
    return kb([B(text=T.BTN_SUPPORT, callback_data="sup")])


def support_cancel() -> InlineKeyboardMarkup:
    return kb([B(text=T.BTN_CANCEL, callback_data="sup:x")])


def support_more() -> InlineKeyboardMarkup:
    return kb([B(text=T.BTN_SUPPORT_MORE, callback_data="sup")])


def channels() -> InlineKeyboardMarkup:
    return kb([B(text=T.BTN_ADD_CHANNEL, callback_data="c:add")],
              [B(text=T.BTN_BASE_LIST, callback_data="c:base:0")],
              [B(text=T.BTN_OWN_LIST, callback_data="c:own")])


def base_list(rows, off: set[int], page: int) -> InlineKeyboardMarkup:
    chunk = rows[page * PAGE:(page + 1) * PAGE]
    out = [[B(text=("🚫 " if r["id"] in off else "✅ ") + (r["title"] or r["username"] or f"канал {r['id']}")[:40],
              callback_data=f"c:tg:{r['id']}:{page}")] for r in chunk]
    nav = []
    if page:
        nav.append(B(text="←", callback_data=f"c:base:{page - 1}"))
    if (page + 1) * PAGE < len(rows):
        nav.append(B(text="→", callback_data=f"c:base:{page + 1}"))
    out.append(nav)
    return kb(*out)


def own_list(rows) -> InlineKeyboardMarkup:
    return kb(*[[B(text="🗑 " + (r["title"] or r["username"] or "закрытый канал")[:40], callback_data=f"c:rm:{r['id']}")] for r in rows])


def card(url: str | None, fid: int) -> InlineKeyboardMarkup:
    return kb([B(text=T.BTN_OPEN, url=url)] if url else [], [B(text=T.BTN_PAUSE, callback_data=f"f:p:{fid}")])


def pay(price: int) -> InlineKeyboardMarkup:
    return kb([B(text=T.BTN_PAY.format(price=price), callback_data="s:pay")])


def pay_link(url: str, price: int) -> InlineKeyboardMarkup:
    return kb([B(text=T.BTN_PAY.format(price=price), url=url)], [B(text=T.BTN_PAID, callback_data="s:check")])
