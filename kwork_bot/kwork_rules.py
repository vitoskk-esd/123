"""Правила формы «Создать кворк» (kwork.ru/new, снято с настоящей страницы 25.10.2026):
рубрики с номерами, допустимые цены, длины полей. Используются при генерации, загрузке
таблицы и выгрузке для расширения."""

from __future__ import annotations

import json
from difflib import SequenceMatcher
from functools import lru_cache
from pathlib import Path

TITLE_MAX = 70
DESCRIPTION_MIN, DESCRIPTION_MAX = 100, 1200
INSTRUCTION_MIN, INSTRUCTION_MAX = 100, 500  # «От покупателя нужно»
# Цена выбирается из списка (select «Стоимость вашей услуги»). Значение — цена для покупателя,
# подпись в форме — сумма продавцу после комиссии 20% (500 → «400 ₽»).
PRICES = [500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 6000, 7000, 8000, 9000,
          10000, 11000, 12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000, 21000, 22000, 23000,
          24000, 25000, 27000, 30000, 33000, 35000, 37000, 40000, 43000, 45000, 47000, 50000, 55000, 60000,
          65000, 70000, 75000, 80000, 85000, 90000, 95000, 100000, 105000, 110000, 115000, 120000, 125000, 130000]
COVER_MIN = (660, 440)  # обложка: от 660×440, 30 КБ — 10 МБ, jpg/png

DEFAULT_INSTRUCTION = ("Чтобы выполнить заказ, мне потребуется от вас задание: опишите, что именно вы хотите "
                       "получить и какие у вас предпочтения. Пришлите нужные файлы и доступы, если они нужны.")


@lru_cache(maxsize=1)
def sections() -> list[dict]:
    return json.loads((Path(__file__).with_name("kwork_categories.json")).read_text(encoding="utf-8"))["sections"]


def category_list() -> str:
    """Список для промпта: «Раздел > Подрубрика» построчно."""
    return "\n".join(f"{s['name']} > {c['name']}" for s in sections() for c in s["subs"])


def find_category(text: str) -> dict | None:
    """«Дизайн > Логотипы» (или просто «логотип») → {"section_id", "section", "id", "name", "max_days"}."""
    want = (text or "").lower().replace("—", ">").strip()
    if not want:
        return None
    sub_part = want.split(">")[-1].strip()
    best, score = None, 0.0
    for s in sections():
        for c in s["subs"]:
            name = c["name"].lower()
            full = f"{s['name'].lower()} > {name}"
            if want == full or sub_part == name:
                return _cat(s, c)
            ratio = max(SequenceMatcher(None, sub_part, name).ratio(), SequenceMatcher(None, want, full).ratio())
            if sub_part and (sub_part in name or name in sub_part):
                ratio = max(ratio, 0.8)
            if ratio > score:
                best, score = (s, c), ratio
    return _cat(*best) if best and score >= 0.6 else None


# В этих рубриках Kwork не даст сохранить кворк без работ в портфолио (новому продавцу — 3 работы).
PORTFOLIO_REQUIRED = ("photo", "video", "audio")


def _cat(s: dict, c: dict) -> dict:
    return {"section_id": s["id"], "section": s["name"], "id": c["id"], "name": c["name"], "max_days": c["max_days"],
            "portfolio": c.get("portfolio", "none")}


def snap_price(price: int | None) -> int:
    """Ближайшая допустимая цена Kwork (не ниже указанной, если можно)."""
    if not price:
        return PRICES[0]
    return next((p for p in PRICES if p >= price), PRICES[-1])


def fit_instruction(text: str) -> str:
    """«От покупателя нужно»: минимум 100 символов — короткое дополняем стандартной фразой."""
    text = (text or "").strip()
    if len(text) < INSTRUCTION_MIN:
        text = f"{text} {DEFAULT_INSTRUCTION}".strip() if text else DEFAULT_INSTRUCTION
    return text[:INSTRUCTION_MAX]


VOLUME_MAX = 60
DEFAULT_VOLUME = "1 задача в рамках описания кворка"


def fit_volume(text: str) -> str:
    """«Объём услуг в 1 кворке» Kwork требует всегда. Пустой — общая фраза, длинный — обрезаем по слову."""
    text = " ".join(str(text or "").split())
    if not text:
        return DEFAULT_VOLUME
    if len(text) > VOLUME_MAX:
        text = text[:VOLUME_MAX].rsplit(" ", 1)[0].rstrip(",.;:")
    return text


def normalize(listing: dict) -> list[str]:
    """Приводит кворк к форме Kwork: рубрика из списка (+ её номера для расширения), цена из
    допустимых, срок не больше максимума рубрики, «что нужно от покупателя» ≥ 100 символов,
    «объём услуг» заполнен.
    Возвращает ошибки, которые автоматически не исправить."""
    errors = []
    cat = find_category(listing.get("category_hint", ""))
    days = max(1, int(listing.get("days") or 1))
    if cat:
        listing.update(category_hint=f"{cat['section']} > {cat['name']}", category_id=cat["id"],
                       section_id=cat["section_id"], needs_portfolio=cat["portfolio"] in PORTFOLIO_REQUIRED)
        days = min(days, cat["max_days"])
    else:
        errors.append("рубрика не из списка Kwork")
    listing["days"] = min(days, 30)
    listing["price_rub"] = snap_price(listing.get("price_rub"))
    listing["requirements"] = fit_instruction(listing.get("requirements", ""))
    listing["volume"] = fit_volume(listing.get("volume", ""))
    return errors
