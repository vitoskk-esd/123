"""Робокасса: ссылка на оплату с подписью и чеком, разбор ответа о статусе — без сети."""
import hashlib
import json
import urllib.parse

import pytest

from config import Config
from payments import Robokassa, parse_state

CFG = Config(token="x", db_path="a", cars_path="b", rk_login="perekhvat", rk_pass1="p1", rk_pass2="p2")


async def test_link_signature_and_receipt():
    rk = Robokassa(CFG)
    inv, url = await rk.create(111, 990, "«Перехват»: Простой на 30 дн.")
    q = dict(urllib.parse.parse_qsl(urllib.parse.urlsplit(url).query))
    assert url.startswith("https://auth.robokassa.ru/Merchant/Index.aspx?")
    assert (q["MerchantLogin"], q["OutSum"], q["InvId"]) == ("perekhvat", "990", inv)
    # в подписи Receipt стоит так, как его получит Робокасса после одного декодирования — закодированным один раз
    assert q["SignatureValue"] == hashlib.md5(f"perekhvat:990:{inv}:{q['Receipt']}:p1".encode()).hexdigest()
    item = json.loads(urllib.parse.unquote(q["Receipt"]))["items"][0]
    assert (item["name"], item["sum"], item["tax"], item["payment_object"]) == ("«Перехват»: Простой на 30 дн.", 990, "none", "service")
    inv2, _ = await rk.create(111, 990, "x")
    assert int(inv2) > int(inv)                     # два платежа в одну секунду — разные номера


def state(result, st=None):
    s = f"<State><Code>{st}</Code></State>" if st else ""
    return (f'<?xml version="1.0" encoding="utf-8"?><OperationStateResponse xmlns="http://merchant.roboxchange.com/WebService/">'
            f"<Result><Code>{result}</Code><Description>x</Description></Result>{s}</OperationStateResponse>").encode()


@pytest.mark.parametrize("xml,status", [
    (state(0, 100), "succeeded"), (state(0, 10), "canceled"), (state(0, 60), "canceled"),
    (state(0, 5), "pending"), (state(0, 50), "pending"), (state(3), "pending"),
])
def test_state(xml, status):
    assert parse_state(xml) == status


def test_state_error():
    with pytest.raises(RuntimeError):
        parse_state(state(2))
