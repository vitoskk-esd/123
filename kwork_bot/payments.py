"""Оплата через ЮKassa (API v3): создаём платёж, человек платит по ссылке, бот проверяет статус.

Вебхук и свой сервер не нужны: после оплаты человек жмёт «Я оплатил», и бот
спрашивает статус платежа у ЮKassa.
"""

from __future__ import annotations

import base64
import json
import urllib.request
import uuid

from .config import BOT_CONFIG

API = "https://api.yookassa.ru/v3/payments"


def _request(url: str, body: dict | None = None) -> dict:
    auth = base64.b64encode(f"{BOT_CONFIG.yookassa_shop_id}:{BOT_CONFIG.yookassa_secret}".encode()).decode()
    headers = {"Authorization": f"Basic {auth}", "Content-Type": "application/json"}
    if body is not None:
        headers["Idempotence-Key"] = uuid.uuid4().hex
    req = urllib.request.Request(url, json.dumps(body).encode() if body is not None else None, headers)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)


def create_payment(uid: int, email: str = "") -> tuple[str, str]:
    """Возвращает (id платежа, ссылка на оплату). email — для чека, если чеки включены."""
    amount = {"value": f"{BOT_CONFIG.price_rub}.00", "currency": "RUB"}
    description = "Доступ к боту: подготовка кворков для Kwork"
    body = {
        "amount": amount,
        "capture": True,
        "confirmation": {"type": "redirect", "return_url": BOT_CONFIG.return_url},
        "description": description,
        "metadata": {"telegram_user_id": str(uid)},
    }
    if BOT_CONFIG.receipts and email:
        # Чек по 54-ФЗ — нужен, если в ЮKassa включена отправка чеков.
        body["receipt"] = {
            "customer": {"email": email},
            "items": [{"description": description, "quantity": "1.00", "amount": amount,
                       "vat_code": 1, "payment_subject": "service", "payment_mode": "full_payment"}],
        }
    data = _request(API, body)
    return data["id"], data["confirmation"]["confirmation_url"]


def payment_status(payment_id: str) -> str:
    """pending | waiting_for_capture | succeeded | canceled"""
    return _request(f"{API}/{payment_id}")["status"]
