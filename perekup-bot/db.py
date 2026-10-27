"""Хранилище SQLite: люди и подписка, фильтры, каналы, разобранные посты (для дублей и цены рынка), доставки
(для статистики и «уже присылал»), платежи, события, отметки «уже отправлено».

Каналы: base=1 — общая база (видят все, каждый может отключить у себя: user_channels.state='off');
base=0 — свой канал человека (видит только тот, кто добавил: state='own'). status: queued → joined | failed.
"""
import time
from pathlib import Path

import aiosqlite

SCHEMA = """
PRAGMA journal_mode=WAL;
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY, username TEXT, first_name TEXT, source TEXT, ref_by INTEGER, created_at REAL,
  trial_until REAL DEFAULT 0, paid_until REAL DEFAULT 0, blocked INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS filters (
  id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, text TEXT, data TEXT, active INTEGER DEFAULT 1, created_at REAL
);
CREATE INDEX IF NOT EXISTS filters_user ON filters(user_id, active);
CREATE TABLE IF NOT EXISTS channels (
  id INTEGER PRIMARY KEY AUTOINCREMENT, tg_id INTEGER UNIQUE, username TEXT, invite TEXT, title TEXT, region TEXT,
  base INTEGER DEFAULT 1, account TEXT, status TEXT DEFAULT 'queued', error TEXT, added_by INTEGER,
  created_at REAL, posts INTEGER DEFAULT 0, last_post_at REAL
);
CREATE UNIQUE INDEX IF NOT EXISTS channels_username ON channels(username) WHERE username IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS channels_invite ON channels(invite) WHERE invite IS NOT NULL;
CREATE TABLE IF NOT EXISTS user_channels (
  user_id INTEGER, channel_id INTEGER, state TEXT, PRIMARY KEY (user_id, channel_id)
);
CREATE TABLE IF NOT EXISTS join_waiters (channel_id INTEGER, user_id INTEGER, PRIMARY KEY (channel_id, user_id));
CREATE TABLE IF NOT EXISTS join_results (user_id INTEGER, channel_id INTEGER, ok INTEGER, PRIMARY KEY (user_id, channel_id));
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT, channel_id INTEGER, msg_id INTEGER, at REAL, fp TEXT, ckey TEXT,
  make TEXT, model TEXT, year INTEGER, price INTEGER, mileage INTEGER, region TEXT,
  dup INTEGER DEFAULT 0, clean INTEGER DEFAULT 1, parsed_by TEXT, latency_ms INTEGER, matched INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS posts_fp ON posts(fp, at);
CREATE INDEX IF NOT EXISTS posts_ckey ON posts(ckey, at);
CREATE INDEX IF NOT EXISTS posts_market ON posts(make, model, year, at);
CREATE TABLE IF NOT EXISTS deliveries (
  id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, post_id INTEGER, fp TEXT, ckey TEXT, filter_id INTEGER,
  discount INTEGER, latency_ms INTEGER, at REAL
);
CREATE INDEX IF NOT EXISTS deliveries_user ON deliveries(user_id, at);
CREATE INDEX IF NOT EXISTS deliveries_fp ON deliveries(fp, at);
CREATE INDEX IF NOT EXISTS deliveries_ckey ON deliveries(ckey, at);
CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, yk_id TEXT UNIQUE, amount INTEGER,
  status TEXT DEFAULT 'pending', auto INTEGER DEFAULT 0, created_at REAL, paid_at REAL
);
CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, kind TEXT, meta TEXT, at REAL);
CREATE INDEX IF NOT EXISTS events_kind ON events(kind, at);
CREATE TABLE IF NOT EXISTS marks (key TEXT PRIMARY KEY, at REAL);
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
CREATE TABLE IF NOT EXISTS support (admin_id INTEGER, msg_id INTEGER, user_id INTEGER, at REAL, PRIMARY KEY (admin_id, msg_id));
"""

DAY = 86400
DEDUP_DAYS = 14


def has_access(user, now: float | None = None) -> bool:
    return bool(user) and max(user["trial_until"], user["paid_until"]) > (now or time.time())


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

    async def _count(self, sql: str, *args) -> int:
        cur = await self.conn.execute(sql, args)
        await self.conn.commit()
        return cur.rowcount

    # ---------- люди ----------
    async def add_user(self, uid: int, username, first_name, source, ref_by, trial_days: int) -> bool:
        """Новый человек → True и пробный период. Источник и пригласивший — только при первом запуске."""
        if await self._one("SELECT 1 FROM users WHERE id=?", uid):
            await self._run("UPDATE users SET username=?, first_name=?, blocked=0 WHERE id=?", username, first_name, uid)
            return False
        now = time.time()
        await self._run("INSERT INTO users (id, username, first_name, source, ref_by, created_at, trial_until) VALUES (?,?,?,?,?,?,?)",
                        uid, username, first_name, source or "direct", ref_by if ref_by != uid else None, now,
                        now + trial_days * DAY)
        await self.event(uid, "start", source)
        return True

    async def first_user(self) -> int | None:
        row = await self._one("SELECT id FROM users ORDER BY created_at LIMIT 1")
        return row["id"] if row else None

    async def user(self, uid: int):
        return await self._one("SELECT * FROM users WHERE id=?", uid)

    async def set_user(self, uid: int, **fields) -> None:
        assert set(fields) <= {"trial_until", "paid_until"}, fields
        await self._run(f"UPDATE users SET {', '.join(f'{k}=?' for k in fields)} WHERE id=?", *fields.values(), uid)

    async def mark_blocked(self, uid: int) -> None:
        await self._run("UPDATE users SET blocked=1 WHERE id=?", uid)

    async def users(self, where: str = "1", *args) -> list:
        return await self._all(f"SELECT * FROM users WHERE blocked=0 AND {where}", *args)

    async def extend(self, uid: int, days: int) -> float:
        """Продлевает оплаченный доступ от большей из дат: сейчас / конец оплаченного / конец пробного."""
        u = await self.user(uid)
        until = max(time.time(), u["paid_until"], u["trial_until"]) + days * DAY
        await self.set_user(uid, paid_until=until)
        return until

    # ---------- фильтры ----------
    async def add_filter(self, uid: int, text: str, data: str) -> int:
        return await self._run("INSERT INTO filters (user_id, text, data, created_at) VALUES (?,?,?,?)", uid, text, data, time.time())

    async def filters(self, uid: int) -> list:
        return await self._all("SELECT * FROM filters WHERE user_id=? ORDER BY id", uid)

    async def filter(self, uid: int, fid: int):
        return await self._one("SELECT * FROM filters WHERE id=? AND user_id=?", fid, uid)

    async def update_filter(self, uid: int, fid: int, text: str, data: str) -> bool:
        return await self._count("UPDATE filters SET text=?, data=?, active=1 WHERE id=? AND user_id=?", text, data, fid, uid) == 1

    async def toggle_filter(self, uid: int, fid: int) -> None:
        await self._run("UPDATE filters SET active=1-active WHERE id=? AND user_id=?", fid, uid)

    async def delete_filter(self, uid: int, fid: int) -> None:
        await self._run("DELETE FROM filters WHERE id=? AND user_id=?", fid, uid)

    # ---------- каналы ----------
    async def add_channel(self, *, username: str | None = None, invite: str | None = None, region: str | None = None,
                          base: bool = True, added_by: int | None = None) -> tuple[int, bool]:
        """(id, новый ли). Тот же @канал или ссылка-приглашение второй раз не добавляется."""
        row = await self._one("SELECT id FROM channels WHERE username=? OR invite=?", username, invite)
        if row:
            if base:
                await self._run("UPDATE channels SET base=1, region=COALESCE(?, region) WHERE id=?", region, row["id"])
            return row["id"], False
        cid = await self._run("INSERT INTO channels (username, invite, region, base, added_by, created_at) VALUES (?,?,?,?,?,?)",
                              username, invite, region, int(base), added_by, time.time())
        return cid, True

    async def channel(self, cid: int):
        return await self._one("SELECT * FROM channels WHERE id=?", cid)

    async def channel_by_tg(self, tg_id: int):
        return await self._one("SELECT * FROM channels WHERE tg_id=?", tg_id)

    async def queued_channels(self) -> list:
        return await self._all("SELECT * FROM channels WHERE status='queued' ORDER BY id")

    async def joined_channels(self) -> list:
        return await self._all("SELECT * FROM channels WHERE status='joined'")

    async def channel_joined(self, cid: int, tg_id: int, title: str, username: str | None, account: str) -> None:
        """Вступили. Если этот же канал уже есть под другой записью (добавили и по @нику, и по приглашению) — склеиваем."""
        other = await self.channel_by_tg(tg_id)
        if other and other["id"] != cid:
            await self._run("UPDATE user_channels SET channel_id=? WHERE channel_id=?", other["id"], cid)
            await self._run("UPDATE OR IGNORE join_waiters SET channel_id=? WHERE channel_id=?", other["id"], cid)
            row = await self.channel(cid)
            if row["base"]:
                await self._run("UPDATE channels SET base=1 WHERE id=?", other["id"])
            await self._run("DELETE FROM channels WHERE id=?", cid)
            return
        await self._run("UPDATE channels SET tg_id=?, title=?, username=COALESCE(username, ?), account=?, status='joined', error=NULL "
                        "WHERE id=?", tg_id, title, username, account, cid)

    async def remove_channel(self, username: str | None, invite: str | None) -> bool:
        """Убрать канал совсем (попросил владелец): посты из него больше никому не идут."""
        return await self._count("UPDATE channels SET base=0, status='removed' WHERE username=? OR invite=?", username, invite) > 0

    async def channel_failed(self, cid: int, error: str) -> None:
        await self._run("UPDATE channels SET status='failed', error=? WHERE id=?", error[:200], cid)

    async def base_channels(self) -> list:
        return await self._all("SELECT * FROM channels WHERE base=1 ORDER BY title, username")

    async def own_channels(self, uid: int) -> list:
        return await self._all("SELECT c.* FROM channels c JOIN user_channels uc ON uc.channel_id=c.id "
                               "WHERE uc.user_id=? AND uc.state='own' AND c.base=0 ORDER BY c.id", uid)

    async def off_channels(self, uid: int) -> set[int]:
        return {r["channel_id"] for r in await self._all("SELECT channel_id FROM user_channels WHERE user_id=? AND state='off'", uid)}

    async def set_channel_state(self, uid: int, cid: int, state: str | None) -> None:
        if state is None:
            await self._run("DELETE FROM user_channels WHERE user_id=? AND channel_id=?", uid, cid)
        else:
            await self._run("INSERT OR REPLACE INTO user_channels (user_id, channel_id, state) VALUES (?,?,?)", uid, cid, state)

    async def add_waiter(self, cid: int, uid: int) -> None:
        await self._run("INSERT OR IGNORE INTO join_waiters (channel_id, user_id) VALUES (?,?)", cid, uid)

    async def batch_done(self, uid: int, cid: int, ok: bool) -> tuple[int, int] | None:
        """Канал из присланных человеком подключился (или нет). Если это был последний из его очереди —
        (сколько подключилось, сколько нет) за всю партию, и партия закрывается; иначе None."""
        await self._run("INSERT OR REPLACE INTO join_results (user_id, channel_id, ok) VALUES (?,?,?)", uid, cid, int(ok))
        if await self._one("SELECT 1 FROM join_waiters WHERE user_id=? LIMIT 1", uid):
            return None
        r = await self._one("SELECT COALESCE(SUM(ok),0) good, COALESCE(SUM(1-ok),0) bad FROM join_results WHERE user_id=?", uid)
        await self._run("DELETE FROM join_results WHERE user_id=?", uid)
        return r["good"], r["bad"]

    async def pop_waiters(self, cid: int) -> list[int]:
        rows = await self._all("SELECT user_id FROM join_waiters WHERE channel_id=?", cid)
        await self._run("DELETE FROM join_waiters WHERE channel_id=?", cid)
        return [r["user_id"] for r in rows]

    async def subscribers(self, channel) -> list:
        """Активные фильтры людей, которым идут посты этого канала: база — всем, кроме отключивших; свой — только добавившим."""
        if channel["base"]:
            sql = ("SELECT f.id fid, f.data, f.text, u.* FROM filters f JOIN users u ON u.id=f.user_id "
                   "WHERE f.active=1 AND u.blocked=0 AND NOT EXISTS (SELECT 1 FROM user_channels uc "
                   "WHERE uc.user_id=u.id AND uc.channel_id=? AND uc.state='off')")
        else:
            sql = ("SELECT f.id fid, f.data, f.text, u.* FROM filters f JOIN users u ON u.id=f.user_id "
                   "WHERE f.active=1 AND u.blocked=0 AND EXISTS (SELECT 1 FROM user_channels uc "
                   "WHERE uc.user_id=u.id AND uc.channel_id=? AND uc.state='own')")
        return await self._all(sql, channel["id"])

    async def channel_count_for(self, uid: int) -> int:
        base = (await self._one("SELECT COUNT(*) n FROM channels WHERE base=1 AND status='joined'"))["n"]
        off = (await self._one("SELECT COUNT(*) n FROM user_channels uc JOIN channels c ON c.id=uc.channel_id "
                               "WHERE uc.user_id=? AND uc.state='off' AND c.base=1 AND c.status='joined'", uid))["n"]
        own = (await self._one("SELECT COUNT(*) n FROM user_channels uc JOIN channels c ON c.id=uc.channel_id "
                               "WHERE uc.user_id=? AND uc.state='own' AND c.base=0 AND c.status='joined'", uid))["n"]
        return base - off + own

    # ---------- посты, дубли, рынок ----------
    async def seen_before(self, fp: str, ckey: str | None, since: float) -> bool:
        if await self._one("SELECT 1 FROM posts WHERE fp=? AND at>? LIMIT 1", fp, since):
            return True
        return bool(ckey and await self._one("SELECT 1 FROM posts WHERE ckey=? AND at>? LIMIT 1", ckey, since))

    async def add_post(self, channel_id: int, msg_id: int, L, fp: str, ckey: str | None, dup: bool, clean: bool) -> int:
        await self._run("UPDATE channels SET posts=posts+1, last_post_at=? WHERE id=?", time.time(), channel_id)
        return await self._run(
            "INSERT INTO posts (channel_id, msg_id, at, fp, ckey, make, model, year, price, mileage, region, dup, clean, parsed_by) "
            "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)", channel_id, msg_id, time.time(), fp, ckey, L.make, L.model, L.year,
            L.price, L.mileage, L.region, int(dup), int(clean), L.parsed_by)

    async def finish_post(self, post_id: int, latency_ms: int, matched: int) -> None:
        await self._run("UPDATE posts SET latency_ms=?, matched=? WHERE id=?", latency_ms, matched, post_id)

    async def market_prices(self, make: str, model: str, year: int | None, since: float, exclude_id: int) -> list[int]:
        """Цены той же модели (±1 год) без дублей и без битых/«на запчасти»/подозрительных."""
        if year:
            rows = await self._all("SELECT price FROM posts WHERE make=? AND model=? AND year BETWEEN ? AND ? AND at>? "
                                   "AND dup=0 AND clean=1 AND price IS NOT NULL AND id!=?", make, model, year - 1, year + 1, since, exclude_id)
        else:
            return []
        return [r["price"] for r in rows]

    async def delivered_to(self, fp: str, ckey: str | None, since: float) -> set[int]:
        """Кому эта машина (тот же текст или та же марка-год-цена-пробег) уже уходила — одним запросом на всех."""
        rows = await self._all("SELECT DISTINCT user_id FROM deliveries WHERE (fp=? OR (ckey IS NOT NULL AND ckey=?)) AND at>?",
                               fp, ckey, since)
        return {r["user_id"] for r in rows}

    async def add_deliveries(self, rows: list[tuple]) -> None:
        """[(user_id, post_id, fp, ckey, filter_id, discount, latency_ms)] — одной транзакцией после рассылки."""
        now = time.time()
        await self.conn.executemany("INSERT INTO deliveries (user_id, post_id, fp, ckey, filter_id, discount, latency_ms, at) "
                                    "VALUES (?,?,?,?,?,?,?,?)", [r + (now,) for r in rows])
        await self.conn.commit()

    async def user_stats(self, uid: int, since: float) -> dict:
        r = await self._one("SELECT COUNT(*) n, SUM(discount>=10) good, SUM(discount>=20) great, AVG(latency_ms) lat, "
                            "MIN(latency_ms) best FROM deliveries WHERE user_id=? AND at>?", uid, since)
        top = await self._all("SELECT COALESCE(c.title, c.username) name, COUNT(*) n FROM deliveries d JOIN posts p ON p.id=d.post_id "
                              "JOIN channels c ON c.id=p.channel_id WHERE d.user_id=? AND d.at>? GROUP BY c.id ORDER BY n DESC LIMIT 3",
                              uid, since)
        dups = await self._one("SELECT COUNT(*) n FROM posts WHERE dup=1 AND at>?", since)
        return {"n": r["n"] or 0, "good": r["good"] or 0, "great": r["great"] or 0, "lat": r["lat"], "best": r["best"],
                "top": [(t["name"], t["n"]) for t in top], "dups": dups["n"]}

    # ---------- платежи ----------
    async def add_payment(self, uid: int, yk_id: str, amount: int, auto: bool = False) -> int:
        return await self._run("INSERT INTO payments (user_id, yk_id, amount, auto, created_at) VALUES (?,?,?,?,?)",
                               uid, yk_id, amount, int(auto), time.time())

    async def payment(self, yk_id: str):
        return await self._one("SELECT * FROM payments WHERE yk_id=?", yk_id)

    async def pending_payments(self, max_age_s: float = 3 * 3600) -> list:
        return await self._all("SELECT * FROM payments WHERE status='pending' AND created_at>?", time.time() - max_age_s)

    async def last_pending(self, uid: int):
        return await self._one("SELECT * FROM payments WHERE user_id=? AND status='pending' ORDER BY id DESC LIMIT 1", uid)

    async def finish_payment(self, yk_id: str, status: str) -> bool:
        """pending → итог. True только первому: «Я оплатил» и фоновая проверка не продлят доступ дважды."""
        cur = await self.conn.execute("UPDATE payments SET status=?, paid_at=? WHERE yk_id=? AND status='pending'",
                                      (status, time.time(), yk_id))
        await self.conn.commit()
        return cur.rowcount == 1

    async def paid_count(self, uid: int) -> int:
        return (await self._one("SELECT COUNT(*) n FROM payments WHERE user_id=? AND status='succeeded'", uid))["n"]

    # ---------- события и отметки ----------
    async def event(self, uid: int, kind: str, meta: str | None = None) -> None:
        await self._run("INSERT INTO events (user_id, kind, meta, at) VALUES (?,?,?,?)", uid, kind, meta, time.time())

    async def add_support_link(self, admin_id: int, msg_id: int, user_id: int) -> None:
        await self._run("INSERT OR REPLACE INTO support (admin_id, msg_id, user_id, at) VALUES (?,?,?,?)",
                        admin_id, msg_id, user_id, time.time())

    async def support_user(self, admin_id: int, msg_id: int) -> int | None:
        row = await self._one("SELECT user_id FROM support WHERE admin_id=? AND msg_id=?", admin_id, msg_id)
        return row["user_id"] if row else None

    async def get_setting(self, key: str) -> str:
        row = await self._one("SELECT value FROM settings WHERE key=?", key)
        return row["value"] if row else ""

    async def set_setting(self, key: str, value: str) -> None:
        await self._run("INSERT OR REPLACE INTO settings (key, value) VALUES (?,?)", key, value)

    async def mark_once(self, key: str) -> bool:
        """True, если ключа ещё не было (и ставит его): напоминание уходит ровно один раз."""
        cur = await self.conn.execute("INSERT OR IGNORE INTO marks (key, at) VALUES (?,?)", (key, time.time()))
        await self.conn.commit()
        return cur.rowcount == 1

    async def admin_stats(self) -> dict:
        now = time.time()
        one = lambda sql, *a: self._one(sql, *a)
        return {
            "users": (await one("SELECT COUNT(*) n FROM users"))["n"],
            "with_filters": (await one("SELECT COUNT(DISTINCT user_id) n FROM filters WHERE active=1"))["n"],
            "trial": (await one("SELECT COUNT(*) n FROM users WHERE trial_until>? AND paid_until<=?", now, now))["n"],
            "paying": (await one("SELECT COUNT(*) n FROM users WHERE paid_until>?", now))["n"],
            "ever_paid": (await one("SELECT COUNT(DISTINCT user_id) n FROM payments WHERE status='succeeded'"))["n"],
            "revenue30": (await one("SELECT COALESCE(SUM(amount),0) s FROM payments WHERE status='succeeded' AND paid_at>?", now - 30 * DAY))["s"],
            "churned": (await one("SELECT COUNT(*) n FROM users WHERE paid_until>0 AND paid_until<=?", now))["n"],
            "blocked": (await one("SELECT COUNT(*) n FROM users WHERE blocked=1"))["n"],
            "posts24": (await one("SELECT COUNT(*) n, SUM(make IS NOT NULL AND price IS NOT NULL) cars, SUM(dup) dups, SUM(parsed_by='ai') ai, "
                                  "AVG(CASE WHEN matched>0 THEN latency_ms END) lat FROM posts WHERE at>?", now - DAY)),
            "deliveries24": (await one("SELECT COUNT(*) n FROM deliveries WHERE at>?", now - DAY))["n"],
            "channels": await self._all("SELECT status, base, COUNT(*) n FROM channels GROUP BY status, base"),
            "sources": await self._all(
                "SELECT u.source, COUNT(*) users, SUM(EXISTS(SELECT 1 FROM payments p WHERE p.user_id=u.id AND p.status='succeeded')) paid "
                "FROM users u GROUP BY u.source ORDER BY users DESC LIMIT 15"),
        }
