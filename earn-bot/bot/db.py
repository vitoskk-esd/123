"""Хранилище SQLite: пользователи, события воронки, заявки «я оформил», выплаты, напоминания.
Баланс = одобренные заявки − выплаты (запрошенные и проведённые): запрошенная сумма сразу резервируется."""
import json
import time
from pathlib import Path

import aiosqlite

SCHEMA = """
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY, username TEXT, first_name TEXT, source TEXT,
  created_at REAL, age_ok INTEGER DEFAULT 0, consent INTEGER DEFAULT 0,
  has_banks TEXT DEFAULT '[]', blocked INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, kind TEXT, offer_id TEXT, at REAL
);
CREATE INDEX IF NOT EXISTS events_kind ON events(kind, offer_id);
CREATE TABLE IF NOT EXISTS claims (
  id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, offer_id TEXT,
  status TEXT DEFAULT 'pending', name TEXT, phone4 TEXT, proof TEXT, amount INTEGER DEFAULT 0,
  created_at REAL, decided_at REAL
);
CREATE TABLE IF NOT EXISTS payouts (
  id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, amount INTEGER, phone TEXT, bank TEXT,
  status TEXT DEFAULT 'requested', created_at REAL, paid_at REAL
);
CREATE TABLE IF NOT EXISTS reminders (
  id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, kind TEXT, offer_id TEXT, due_at REAL, sent INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS reminders_due ON reminders(sent, due_at);
"""

# шаги воронки по порядку — для статистики в админке
FUNNEL = [("start", "Запустили бота"), ("age_ok", "Подтвердили 18+"),
          ("quiz_done", "Прошли квиз"), ("offer_view", "Открыли акцию"), ("click", "Взяли ссылку"),
          ("claim", "Нажали «Я оформил»"), ("approved", "Одобрено"), ("paid", "Получили выплату")]


class DB:
    def __init__(self, path: Path):
        self.path = path
        self.conn: aiosqlite.Connection | None = None

    async def open(self) -> "DB":
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.conn = await aiosqlite.connect(self.path)
        self.conn.row_factory = aiosqlite.Row
        await self.conn.executescript(SCHEMA)
        await self.conn.commit()
        return self

    async def close(self) -> None:
        if self.conn:
            await self.conn.close()

    async def _one(self, sql: str, *args):
        async with self.conn.execute(sql, args) as cur:
            return await cur.fetchone()

    async def _all(self, sql: str, *args):
        async with self.conn.execute(sql, args) as cur:
            return await cur.fetchall()

    async def _run(self, sql: str, *args) -> int:
        cur = await self.conn.execute(sql, args)
        await self.conn.commit()
        return cur.lastrowid

    # ---------- пользователи ----------
    async def add_user(self, uid: int, username: str | None, first_name: str | None, source: str | None) -> bool:
        """Новый пользователь → True. Источник запоминается только при первом запуске (кто привёл первым)."""
        if await self._one("SELECT 1 FROM users WHERE id=?", uid):
            await self._run("UPDATE users SET username=?, first_name=?, blocked=0 WHERE id=?", username, first_name, uid)
            return False
        await self._run("INSERT INTO users (id, username, first_name, source, created_at) VALUES (?,?,?,?,?)",
                        uid, username, first_name, source or "direct", time.time())
        await self.event(uid, "start")
        return True

    async def user(self, uid: int):
        return await self._one("SELECT * FROM users WHERE id=?", uid)

    async def set_flag(self, uid: int, flag: str, log: bool = True) -> None:
        assert flag in ("age_ok", "consent")
        await self._run(f"UPDATE users SET {flag}=1 WHERE id=?", uid)
        if log:
            await self.event(uid, flag)

    async def set_banks(self, uid: int, banks: set[str]) -> None:
        await self._run("UPDATE users SET has_banks=? WHERE id=?", json.dumps(sorted(banks)), uid)

    async def banks(self, uid: int) -> set[str]:
        row = await self.user(uid)
        return set(json.loads(row["has_banks"])) if row else set()

    async def mark_blocked(self, uid: int) -> None:
        await self._run("UPDATE users SET blocked=1 WHERE id=?", uid)

    async def audience(self) -> list[int]:
        return [r["id"] for r in await self._all("SELECT id FROM users WHERE blocked=0")]

    # ---------- события ----------
    async def event(self, uid: int, kind: str, offer_id: str | None = None) -> None:
        await self._run("INSERT INTO events (user_id, kind, offer_id, at) VALUES (?,?,?,?)", uid, kind, offer_id, time.time())

    async def funnel(self) -> list[tuple[str, int]]:
        """Сколько уникальных людей дошло до каждого шага."""
        out = []
        for kind, label in FUNNEL:
            row = await self._one("SELECT COUNT(DISTINCT user_id) n FROM events WHERE kind=?", kind)
            out.append((label, row["n"]))
        return out

    async def offer_stats(self) -> list:
        return await self._all(
            "SELECT offer_id, SUM(kind='click') clicks, SUM(kind='claim') claims, SUM(kind='approved') approved "
            "FROM events WHERE offer_id IS NOT NULL GROUP BY offer_id ORDER BY clicks DESC")

    async def source_stats(self) -> list:
        return await self._all(
            "SELECT u.source, COUNT(*) users, "
            "SUM(EXISTS(SELECT 1 FROM events e WHERE e.user_id=u.id AND e.kind='approved')) approved "
            "FROM users u GROUP BY u.source ORDER BY users DESC")

    # ---------- заявки «я оформил» ----------
    async def has_claim(self, uid: int, offer_id: str) -> bool:
        """Одна заявка на акцию; отклонённую можно подать заново."""
        return bool(await self._one("SELECT 1 FROM claims WHERE user_id=? AND offer_id=? AND status!='rejected'", uid, offer_id))

    async def add_claim(self, uid: int, offer_id: str, name: str, phone4: str, proof: str) -> int:
        cid = await self._run("INSERT INTO claims (user_id, offer_id, name, phone4, proof, created_at) VALUES (?,?,?,?,?,?)",
                              uid, offer_id, name, phone4, proof, time.time())
        await self.event(uid, "claim", offer_id)
        return cid

    async def claim(self, cid: int):
        return await self._one("SELECT * FROM claims WHERE id=?", cid)

    async def pending_claims(self) -> list:
        return await self._all("SELECT * FROM claims WHERE status='pending' ORDER BY created_at")

    async def decide_claim(self, cid: int, approve: bool, amount: int = 0):
        """Решение по заявке; повторное решение не меняет уже решённую (два админа нажали одновременно)."""
        row = await self.claim(cid)
        if not row or row["status"] != "pending":
            return None
        await self._run("UPDATE claims SET status=?, amount=?, decided_at=? WHERE id=?",
                        "approved" if approve else "rejected", amount if approve else 0, time.time(), cid)
        if approve:
            await self.event(row["user_id"], "approved", row["offer_id"])
        return await self.claim(cid)

    async def user_claims(self, uid: int) -> list:
        return await self._all("SELECT * FROM claims WHERE user_id=? ORDER BY created_at DESC", uid)

    # ---------- баланс и выплаты ----------
    async def balance(self, uid: int) -> int:
        earned = await self._one("SELECT COALESCE(SUM(amount),0) s FROM claims WHERE user_id=? AND status='approved'", uid)
        spent = await self._one("SELECT COALESCE(SUM(amount),0) s FROM payouts WHERE user_id=? AND status IN ('requested','paid')", uid)
        return earned["s"] - spent["s"]

    async def request_payout(self, uid: int, amount: int, phone: str, bank: str) -> int | None:
        if amount <= 0 or amount > await self.balance(uid):
            return None
        return await self._run("INSERT INTO payouts (user_id, amount, phone, bank, created_at) VALUES (?,?,?,?,?)",
                               uid, amount, phone, bank, time.time())

    async def payout(self, pid: int):
        return await self._one("SELECT * FROM payouts WHERE id=?", pid)

    async def open_payouts(self) -> list:
        return await self._all("SELECT * FROM payouts WHERE status='requested' ORDER BY created_at")

    async def decide_payout(self, pid: int, paid: bool):
        row = await self.payout(pid)
        if not row or row["status"] != "requested":
            return None
        await self._run("UPDATE payouts SET status=?, paid_at=? WHERE id=?", "paid" if paid else "rejected", time.time(), pid)
        if paid:
            await self.event(row["user_id"], "paid")
        return await self.payout(pid)

    async def totals(self) -> dict:
        r = await self._one("SELECT (SELECT COALESCE(SUM(amount),0) FROM claims WHERE status='approved') earned, "
                            "(SELECT COALESCE(SUM(amount),0) FROM payouts WHERE status='paid') paid, "
                            "(SELECT COALESCE(SUM(amount),0) FROM payouts WHERE status='requested') waiting")
        return dict(r)

    # ---------- напоминания ----------
    async def schedule(self, uid: int, kind: str, offer_id: str | None, delays_s: list[float]) -> None:
        """Ставит напоминания; одинаковые неотправленные (тот же человек, вид, акция) заменяются новыми."""
        await self._run("DELETE FROM reminders WHERE user_id=? AND kind=? AND COALESCE(offer_id,'')=COALESCE(?,'') AND sent=0",
                        uid, kind, offer_id)
        now = time.time()
        for d in delays_s:
            await self._run("INSERT INTO reminders (user_id, kind, offer_id, due_at) VALUES (?,?,?,?)", uid, kind, offer_id, now + d)

    async def cancel(self, uid: int, kind: str, offer_id: str | None = None) -> None:
        await self._run("DELETE FROM reminders WHERE user_id=? AND kind=? AND COALESCE(offer_id,'')=COALESCE(?,'') AND sent=0",
                        uid, kind, offer_id)

    async def due_reminders(self, now: float | None = None) -> list:
        return await self._all("SELECT * FROM reminders WHERE sent=0 AND due_at<=? ORDER BY due_at LIMIT 200", now or time.time())

    async def sent_count(self, uid: int, kind: str, offer_id: str | None) -> int:
        row = await self._one("SELECT COUNT(*) n FROM reminders WHERE user_id=? AND kind=? AND COALESCE(offer_id,'')=COALESCE(?,'') AND sent=1",
                              uid, kind, offer_id)
        return row["n"]

    async def mark_sent(self, rid: int) -> None:
        await self._run("UPDATE reminders SET sent=1 WHERE id=?", rid)
