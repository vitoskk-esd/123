import time
from pathlib import Path

import pytest

from bot.db import DB
from bot.offers import load_catalog

ROOT = Path(__file__).resolve().parents[1]


@pytest.fixture
async def db(tmp_path):
    d = await DB(tmp_path / "t.db").open()
    yield d
    await d.close()


async def test_user_source_kept_from_first_start(db):
    assert await db.add_user(1, "a", "A", "reels") is True
    assert await db.add_user(1, "a", "A", "tg") is False
    assert (await db.user(1))["source"] == "reels"


async def test_balance_claim_and_payout(db):
    await db.add_user(1, "a", "A", None)
    cid = await db.add_claim(1, "alfa_credit", "Иван И.", "1234", "file")
    assert await db.has_claim(1, "alfa_credit")
    assert await db.balance(1) == 0                       # пока не одобрено — денег нет
    await db.decide_claim(cid, True, 500)
    assert await db.decide_claim(cid, False) is None       # повторное решение не меняет одобренную
    assert await db.balance(1) == 500
    assert await db.request_payout(1, 600, "+79990000000", "Сбер") is None   # больше баланса нельзя
    pid = await db.request_payout(1, 500, "+79990000000", "Сбер")
    assert await db.balance(1) == 0                       # сумма зарезервирована
    await db.decide_payout(pid, False)                     # отклонили — деньги вернулись на баланс
    assert await db.balance(1) == 500


async def test_rejected_claim_can_be_resubmitted(db):
    await db.add_user(1, "a", "A", None)
    cid = await db.add_claim(1, "x", "n", "0000", "f")
    await db.decide_claim(cid, False)
    assert not await db.has_claim(1, "x")


async def test_funnel_counts_unique_people(db):
    for uid in (1, 2):
        await db.add_user(uid, None, None, None)
    await db.event(1, "click", "x"); await db.event(1, "click", "x")
    funnel = dict(await db.funnel())
    assert funnel["Запустили бота"] == 2 and funnel["Взяли ссылку"] == 1


async def test_reminders_replace_and_due(db):
    await db.add_user(1, None, None, None)
    await db.schedule(1, "nudge", "x", [0, 3600])
    await db.schedule(1, "nudge", "x", [0])               # перепланировали — старые неотправленные заменены
    due = await db.due_reminders(time.time() + 1)
    assert len(due) == 1
    await db.cancel(1, "nudge", "x")
    assert not await db.due_reminders(time.time() + 10_000)


def test_catalog_eligible_by_bank():
    cat = load_catalog(ROOT / "offers.yaml")
    assert set(cat.banks) == {"alfa", "tbank"}
    assert [o.bank_key for o in cat.eligible({"alfa"})] == ["tbank"]
