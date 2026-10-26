"""Оплата через ЮKassa (API v3). Вебхук и свой сервер не нужны: бот сам спрашивает статус платежа —
по кнопке «Я оплатил» и в фоне раз в минуту.

Автопродление (YOOKASSA_AUTOPAY=1): первый платёж сохраняет способ оплаты, следующие списываются без человека.
Его нужно отдельно включить в ЮKassa (рекуррентные платежи) — без этого держи YOOKASSA_AUTOPAY=0, и бот просто
пришлёт ссылку на оплату перед концом доступа.
"""
import asyncio
import base64
import json
import urllib.request
import uuid

from .config import Config

API = "https://api.yookassa.ru/v3/payments"
DESCRIPTION = "Подписка «Перехват» на {days} дней"


class YooKassa:
    def __init__(self, cfg: Config):
        self.cfg = cfg

    @property
    def enabled(self) -> bool:
        return bool(self.cfg.yk_shop_id and self.cfg.yk_secret)

    def _request(self, url: str, body: dict | None = None) -> dict:
        auth = base64.b64encode(f"{self.cfg.yk_shop_id}:{self.cfg.yk_secret}".encode()).decode()
        headers = {"Authorization": f"Basic {auth}", "Content-Type": "application/json"}
        if body is not None:
            headers["Idempotence-Key"] = uuid.uuid4().hex
        req = urllib.request.Request(url, json.dumps(body).encode() if body is not None else None, headers)
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.load(resp)

    def _body(self, uid: int, email: str) -> dict:
        amount = {"value": f"{self.cfg.price}.00", "currency": "RUB"}
        description = DESCRIPTION.format(days=self.cfg.period_days)
        body = {"amount": amount, "capture": True, "description": description,
                "metadata": {"telegram_user_id": str(uid)}}
        if self.cfg.receipts and email:
            body["receipt"] = {"customer": {"email": email}, "items": [{
                "description": description, "quantity": "1.00", "amount": amount,
                "vat_code": 1, "payment_subject": "service", "payment_mode": "full_payment"}]}
        return body

    async def create(self, uid: int, email: str = "") -> tuple[str, str]:
        """(id платежа, ссылка на оплату)."""
        body = self._body(uid, email)
        body["confirmation"] = {"type": "redirect", "return_url": self.cfg.return_url}
        if self.cfg.autopay:
            body["save_payment_method"] = True
        data = await asyncio.to_thread(self._request, API, body)
        return data["id"], data["confirmation"]["confirmation_url"]

    async def charge(self, uid: int, method_id: str, email: str = "") -> tuple[str, str]:
        """Списание по сохранённому способу (автопродление). (id, статус)."""
        body = self._body(uid, email)
        body["payment_method_id"] = method_id
        data = await asyncio.to_thread(self._request, API, body)
        return data["id"], data["status"]

    async def status(self, payment_id: str) -> tuple[str, str]:
        """(pending | waiting_for_capture | succeeded | canceled, id сохранённого способа оплаты или '')."""
        data = await asyncio.to_thread(self._request, f"{API}/{payment_id}")
        pm = data.get("payment_method") or {}
        return data["status"], pm.get("id", "") if pm.get("saved") else ""
