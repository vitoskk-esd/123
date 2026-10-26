"""ИИ для постов, где правила не нашли модель или цену (Gemini, ответ строго в JSON).
Вызывается редко и с коротким таймаутом: опоздавший ответ хуже, чем пропуск одного кривого поста."""
import asyncio
import json
import logging
import urllib.request

from .parse import PRICE_MAX, PRICE_MIN, YEAR_MAX, Listing
from .words import Dictionary, norm

log = logging.getLogger(__name__)
API = "https://generativelanguage.googleapis.com/v1beta/models"
TIMEOUT = 4

SCHEMA = {
    "type": "object",
    "properties": {
        "is_car_sale": {"type": "boolean"},
        "make": {"type": "string"}, "model": {"type": "string"},
        "year": {"type": "integer"}, "price_rub": {"type": "integer"}, "mileage_km": {"type": "integer"},
        "city": {"type": "string"},
    },
    "required": ["is_car_sale"],
}
PROMPT = ("Это пост из Telegram-канала. Если это объявление о продаже легкового автомобиля в России — "
          "достань марку и модель (латиницей, как пишет производитель), год, цену в рублях, пробег в км и город. "
          "Цена в другой валюте — price_rub не заполняй. Чего нет в тексте — не заполняй. "
          "Если это не продажа машины (реклама, мем, услуги) — is_car_sale=false.\n\nПост:\n")


def _post(key: str, model: str, text: str) -> dict:
    body = {"contents": [{"role": "user", "parts": [{"text": PROMPT + text[:3000]}]}],
            "generationConfig": {"responseMimeType": "application/json", "responseJsonSchema": SCHEMA,
                                 "maxOutputTokens": 400, "thinkingConfig": {"thinkingLevel": "low"}}}
    headers = {"Content-Type": "application/json"}
    if key:   # в облачной среде ключ подставляет прокси сам
        headers["x-goog-api-key"] = key
    req = urllib.request.Request(f"{API}/{model}:generateContent", json.dumps(body).encode(), headers)
    with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
        data = json.load(resp)
    return json.loads(data["candidates"][0]["content"]["parts"][0]["text"])


async def enrich(L: Listing, d: Dictionary, key: str, model: str) -> Listing:
    """Дополняет то, чего не нашли правила. Ошибка или таймаут — возвращаем как было."""
    try:
        r = await asyncio.wait_for(asyncio.to_thread(_post, key, model, L.text), TIMEOUT + 1)
    except Exception as e:
        log.info("ИИ не разобрал пост: %s", e)
        return L
    if not r.get("is_car_sale"):
        return L
    if not L.model and (r.get("make") or r.get("model")):
        cars = d.find_cars(norm(f"{r.get('make', '')} {r.get('model', '')}").split())
        with_model = [c for c in cars if c[1]]
        if with_model:
            L.make, L.model = with_model[0]
        elif cars and not L.make:
            L.make = cars[0][0]
    if not L.price and PRICE_MIN <= (r.get("price_rub") or 0) <= PRICE_MAX:
        L.price = r["price_rub"]
    if not L.year and 1970 <= (r.get("year") or 0) <= YEAR_MAX:
        L.year = r["year"]
    if not L.mileage and 0 < (r.get("mileage_km") or 0) < 2_000_000:
        L.mileage = r["mileage_km"]
    if not L.region and r.get("city"):
        regions = d.find_regions(norm(r["city"]).split())
        L.region = regions[0] if regions else None
    L.parsed_by = "llm"
    return L
