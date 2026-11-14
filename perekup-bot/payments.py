"""Оплата через Робокассу (карта, СБП). Подходит самозанятым: с услугой «Робочеки СМЗ» Робокасса сама пробивает
чек в «Мой налог» и отправляет его покупателю. Вебхук и свой сервер не нужны: бот сам спрашивает статус платежа —
по кнопке «Я оплатил» и в фоне раз в 30 секунд (XML-интерфейс OpStateExt)."""
import asyncio
import hashlib
import json
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

from config import Config

PAY_URL = "https://auth.robokassa.ru/Merchant/Index.aspx"
STATE_URL = "https://auth.robokassa.ru/Merchant/WebService/Service.asmx/OpStateExt"
RECURRING_URL = "https://auth.robokassa.ru/Merchant/Recurring"   # повторное списание по первому (материнскому) платежу
EPOCH = 1_700_000_000       # номер счёта — секунды с ноября 2023: короткий, растёт, не повторяется после перезапуска


class Robokassa:
    def __init__(self, cfg: Config):
        self.cfg = cfg
        self._last = 0

    def _sign(self, *parts) -> str:
        return hashlib.new(self.cfg.rk_hash, ":".join(str(p) for p in parts).encode()).hexdigest()

    def _inv_id(self) -> int:
        self._last = max(int(time.time()) - EPOCH, self._last + 1)
        return self._last

    @staticmethod
    def _receipt(amount: int, description: str) -> str:
        # чек для «Мой налог»: одна услуга на всю сумму, без НДС
        return urllib.parse.quote(json.dumps({"items": [{
            "name": description[:128], "quantity": 1, "sum": amount, "tax": "none",
            "payment_method": "full_payment", "payment_object": "service"}]}, ensure_ascii=False))

    def link(self, inv_id: int, amount: int, description: str, recurring: bool = False) -> str:
        receipt = self._receipt(amount, description)
        sign = self._sign(self.cfg.rk_login, amount, inv_id, receipt, self.cfg.rk_pass1)
        q = {"MerchantLogin": self.cfg.rk_login, "OutSum": amount, "InvId": inv_id, "Description": description[:100],
             "Receipt": receipt, "SignatureValue": sign, "Culture": "ru"}
        if recurring:                # материнский платёж: Робокасса запомнит карту для автопродления (в подпись не входит)
            q["Recurring"] = "true"
        return PAY_URL + "?" + urllib.parse.urlencode(q)

    async def create(self, uid: int, amount: int, description: str, recurring: bool = False) -> tuple[str, str]:
        """(номер счёта, ссылка на оплату). Ссылка собирается на месте — в Робокассу ходить не нужно."""
        inv_id = self._inv_id()
        return str(inv_id), self.link(inv_id, amount, description, recurring)

    def _charge(self, prev_inv: str, amount: int, description: str) -> str:
        inv_id = self._inv_id()
        receipt = self._receipt(amount, description)
        data = urllib.parse.urlencode({
            "MerchantLogin": self.cfg.rk_login, "InvoiceID": inv_id, "PreviousInvoiceID": prev_inv, "OutSum": amount,
            "Description": description[:100], "Receipt": receipt,
            "SignatureValue": self._sign(self.cfg.rk_login, amount, inv_id, receipt, self.cfg.rk_pass1)}).encode()
        with urllib.request.urlopen(urllib.request.Request(RECURRING_URL, data=data), timeout=30) as resp:
            answer = resp.read().decode(errors="replace").strip()
        if not answer.upper().startswith("OK"):
            raise RuntimeError(f"Робокасса, автосписание: {answer[:200]}")
        return str(inv_id)

    async def charge(self, prev_inv: str, amount: int, description: str) -> str:
        """Автосписание по материнскому платежу → номер нового счёта (его статус проверяем как обычно, OpStateExt)."""
        return await asyncio.to_thread(self._charge, prev_inv, amount, description)

    def _state(self, inv_id: str) -> str:
        url = STATE_URL + "?" + urllib.parse.urlencode({
            "MerchantLogin": self.cfg.rk_login, "InvoiceID": inv_id,
            "Signature": self._sign(self.cfg.rk_login, inv_id, self.cfg.rk_pass2)})
        with urllib.request.urlopen(url, timeout=30) as resp:
            return parse_state(resp.read())

    async def status(self, payment_id: str) -> str:
        """pending | succeeded | canceled"""
        return await asyncio.to_thread(self._state, payment_id)


def parse_state(xml: bytes) -> str:
    """Ответ OpStateExt → статус. Result 3 — счёта ещё нет (человек не открыл оплату). State: 100 — оплачено,
    10 — отменено, 60 — возврат; 5, 20, 50, 80 — оплата ещё идёт."""
    root = ET.fromstring(xml)

    def code(path: str) -> str:     # у ответа своё пространство имён — {*} его пропускает
        return (root.findtext("/".join("{*}" + p for p in path.split("/"))) or "").strip()

    result = code("Result/Code")
    if result == "3":
        return "pending"
    if result != "0":
        raise RuntimeError(f"Робокасса: код {result} {code('Result/Description')}")
    return {"100": "succeeded", "10": "canceled", "60": "canceled"}.get(code("State/Code"), "pending")
