"""Оплата через ЮKassa (API v3). Вебхук и свой сервер не нужны: бот сам спрашивает статус платежа —
по кнопке «Я оплатил» и в фоне раз в 30 секунд."""
import asyncio
import base64
import json
import urllib.request
import uuid

from config import Config

API = "https://api.yookassa.ru/v3/payments"


class YooKassa:
    def __init__(self, cfg: Config):
        self.cfg = cfg

    def _request(self, url: str, body: dict | None = None) -> dict:
        auth = base64.b64encode(f"{self.cfg.yk_shop_id}:{self.cfg.yk_secret}".encode()).decode()
        headers = {"Authorization": f"Basic {auth}", "Content-Type": "application/json"}
        if body is not None:
            headers["Idempotence-Key"] = uuid.uuid4().hex
        req = urllib.request.Request(url, json.dumps(body).encode() if body is not None else None, headers)
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.load(resp)

    async def create(self, uid: int) -> tuple[str, str]:
        """(id платежа, ссылка на оплату)."""
        body = {"amount": {"value": f"{self.cfg.price}.00", "currency": "RUB"}, "capture": True,
                "confirmation": {"type": "redirect", "return_url": self.cfg.return_url},
                "description": f"Подписка «Перехват» на {self.cfg.period_days} дней",
                "metadata": {"telegram_user_id": str(uid)}}
        data = await asyncio.to_thread(self._request, API, body)
        return data["id"], data["confirmation"]["confirmation_url"]

    async def status(self, payment_id: str) -> str:
        """pending | waiting_for_capture | succeeded | canceled"""
        return (await asyncio.to_thread(self._request, f"{API}/{payment_id}"))["status"]
