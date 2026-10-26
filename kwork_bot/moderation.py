"""Проверка до выкладки того, за что модерация Kwork отклоняет кворк: цена или скидка на обложке
(цена должна совпадать с ценой кворка, скидки запрещены), контакты и ссылки, водяные знаки.

Картинку ИИ только дословно переписывает (это он делает надёжно), а цены и контакты в тексте ищет
код по правилам. Ответ ИИ «есть водяной знак» ошибается в обе стороны, поэтому это лишь предупреждение.
"""

from __future__ import annotations

import re

from kwork_agent.generator import _FORBIDDEN as CONTACTS_RE

# Сумма с валютой («6000 ₽», «от 500 руб», «$20») или скидка.
PRICE_RE = re.compile(r"\d[\d\s.,]*\s*(₽|руб|р\.|р\b|rub|\$|€|usd)|(₽|\$|€)\s*\d|скидк", re.IGNORECASE)
DISCOUNT_RE = re.compile(r"\d\s*%|скидк|акци[яи]\b|распродаж", re.IGNORECASE)

OCR_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "required": ["text", "watermark"],
    "properties": {
        "text": {"type": "string", "description": "весь текст на изображении дословно, каждая надпись с новой строки"},
        "watermark": {"type": "boolean", "description": "полупрозрачная подпись фотостока или сайта поверх изображения"},
    },
}
OCR_PROMPT = ("Перепиши дословно весь текст, который виден на изображении, включая мелкий и полупрозрачный. "
              "Ответь, есть ли водяной знак (полупрозрачная подпись фотостока или сайта поверх картинки).")


def text_problems(text: str) -> list[str]:
    """Цена и контакты в текстах кворка (название, описание, «что нужно от покупателя»)."""
    found = []
    if PRICE_RE.search(text or ""):
        found.append("в тексте указана цена или скидка — цена должна быть только в поле цены")
    if CONTACTS_RE.search(text or ""):
        found.append("в тексте контакты или ссылка — Kwork это запрещает")
    return found


def image_problems(image: bytes, llm) -> tuple[list[str], list[str]]:
    """(что модерация точно отклонит, предупреждения) для картинки обложки."""
    data = llm.ask(OCR_PROMPT, schema=OCR_SCHEMA, effort="low", max_tokens=2000, images=[image])
    text = str(data.get("text") or "")
    block = []
    if PRICE_RE.search(text) or DISCOUNT_RE.search(text):
        block.append("на картинке цена, скидка или проценты")
    if CONTACTS_RE.search(text):
        block.append("на картинке контакты, ссылка или @логин")
    warn = ["похоже на водяной знак — проверьте фото"] if data.get("watermark") else []
    return block, warn


def has_text(image: bytes, llm) -> bool:
    """Есть ли на картинке надписи (для ИИ-фонов: заголовок мы пишем сами, чужие буквы не нужны)."""
    data = llm.ask(OCR_PROMPT, schema=OCR_SCHEMA, effort="low", max_tokens=2000, images=[image])
    return len(re.findall(r"[a-zа-яё0-9]", str(data.get("text") or ""), re.I)) >= 3
