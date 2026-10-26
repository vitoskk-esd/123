"""Клавиатуры. callback_data короткие (лимит Telegram — 64 байта)."""
from aiogram.types import InlineKeyboardButton as B, InlineKeyboardMarkup, KeyboardButton, ReplyKeyboardMarkup

from . import texts as T
from .offers import Offer


def kb(*rows: list[B]) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(inline_keyboard=[r for r in rows if r])


def menu() -> ReplyKeyboardMarkup:
    return ReplyKeyboardMarkup(keyboard=[[KeyboardButton(text=T.MENU_OFFERS), KeyboardButton(text=T.MENU_BALANCE)],
                                         [KeyboardButton(text=T.MENU_HELP)]], resize_keyboard=True)


def start() -> InlineKeyboardMarkup:
    return kb([B(text=T.BTN_START, callback_data="go")])


def age() -> InlineKeyboardMarkup:
    return kb([B(text=T.BTN_AGE_YES, callback_data="age:y"), B(text=T.BTN_AGE_NO, callback_data="age:n")])


def consent() -> InlineKeyboardMarkup:
    return kb([B(text=T.BTN_CONSENT, callback_data="ok")])


def quiz(banks: dict[str, str], picked: set[str]) -> InlineKeyboardMarkup:
    rows = [[B(text=("✅ " if k in picked else "▫️ ") + name, callback_data=f"qb:{k}")] for k, name in banks.items()]
    rows.append([B(text=T.BTN_QUIZ_DONE if picked else T.BTN_NO_BANKS, callback_data="qdone")])
    return kb(*rows)


def catalog(offers: list[Offer]) -> InlineKeyboardMarkup:
    return kb(*[[B(text=T.OFFER_BTN.format(bank=o.bank, title=o.title, payout=o.payout), callback_data=f"o:{o.id}")] for o in offers])


def offer(o: Offer) -> InlineKeyboardMarkup:
    return kb([B(text=T.BTN_GET_LINK, callback_data=f"lnk:{o.id}")], [B(text=T.BTN_DONE, callback_data=f"done:{o.id}")],
              [B(text=T.BTN_BACK, callback_data="cat")])


def link(o: Offer) -> InlineKeyboardMarkup:
    return kb([B(text=T.BTN_OPEN_LINK.format(bank=o.bank), url=o.link)], [B(text=T.BTN_DONE, callback_data=f"done:{o.id}")])


def withdraw() -> InlineKeyboardMarkup:
    return kb([B(text=T.BTN_WITHDRAW, callback_data="wd")])


def claim_admin(cid: int) -> InlineKeyboardMarkup:
    return kb([B(text="✅ Одобрить", callback_data=f"ca:{cid}"), B(text="❌ Отклонить", callback_data=f"cr:{cid}")])


def payout_admin(pid: int) -> InlineKeyboardMarkup:
    return kb([B(text="💸 Выплачено", callback_data=f"pp:{pid}"), B(text="↩️ Отклонить", callback_data=f"pr:{pid}")])
