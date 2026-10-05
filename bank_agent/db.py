"""SQLite: посты, клики, конверсии, пользователи бота, напоминания.

id пользователей и IP хранятся только в виде солёного хеша (кроме id чата,
без которого бот не может ответить) — минимум персональных данных.
"""

from __future__ import annotations

import datetime as dt
import hashlib
import sqlite3
import threading
from pathlib import Path

from .config import CONFIG

SCHEMA = """
CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    channel TEXT NOT NULL,
    product_id TEXT NOT NULL,
    idea TEXT,
    text TEXT NOT NULL,
    status TEXT NOT NULL,          -- queued | published | outbox | failed | rejected
    scheduled_at TEXT,
    published_at TEXT,
    external_id TEXT,
    note TEXT
);
CREATE TABLE IF NOT EXISTS clicks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ts TEXT NOT NULL,
    product_id TEXT NOT NULL,
    source TEXT NOT NULL,
    post_id TEXT,
    user_hash TEXT,
    ip_hash TEXT
);
CREATE TABLE IF NOT EXISTS conversions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ext_id TEXT UNIQUE,
    ts TEXT NOT NULL,
    product_id TEXT,
    source TEXT,
    post_id TEXT,
    count INTEGER NOT NULL DEFAULT 1,
    payout_rub REAL,
    status TEXT NOT NULL DEFAULT 'approved'   -- approved | pending
);
CREATE TABLE IF NOT EXISTS users (
    platform TEXT NOT NULL,
    user_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    last_seen TEXT NOT NULL,
    stopped INTEGER NOT NULL DEFAULT 0,
    day TEXT,
    day_count INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (platform, user_id)
);
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform TEXT NOT NULL,
    user_id TEXT NOT NULL,
    ts TEXT NOT NULL,
    role TEXT NOT NULL,
    text TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS reminders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform TEXT NOT NULL,
    user_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    step INTEGER NOT NULL,
    due_at TEXT NOT NULL,
    sent_at TEXT
);
CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT);
CREATE INDEX IF NOT EXISTS clicks_ts ON clicks(ts);
CREATE INDEX IF NOT EXISTS messages_user ON messages(platform, user_id, id);
"""


def now() -> dt.datetime:
    return dt.datetime.now(dt.timezone.utc)


def iso(t: dt.datetime) -> str:
    return t.astimezone(dt.timezone.utc).isoformat(timespec="seconds")


def anon(value: str) -> str:
    return hashlib.sha256(f"{CONFIG.salt}:{value}".encode()).hexdigest()[:16]


class DB:
    """Тонкая обёртка: одно соединение на процесс, доступ из нескольких потоков под замком."""

    def __init__(self, path: Path | None = None):
        path = path or CONFIG.data_dir / "agent.sqlite"
        path.parent.mkdir(parents=True, exist_ok=True)
        self.conn = sqlite3.connect(path, check_same_thread=False)
        self.conn.row_factory = sqlite3.Row
        self.lock = threading.Lock()
        with self.lock:
            self.conn.executescript(SCHEMA)

    def execute(self, sql: str, args: tuple = ()) -> sqlite3.Cursor:
        with self.lock:
            cur = self.conn.execute(sql, args)
            self.conn.commit()
            return cur

    def all(self, sql: str, args: tuple = ()) -> list[dict]:
        with self.lock:
            return [dict(r) for r in self.conn.execute(sql, args).fetchall()]

    def one(self, sql: str, args: tuple = ()) -> dict | None:
        rows = self.all(sql, args)
        return rows[0] if rows else None

    # --- kv -----------------------------------------------------------------
    def get(self, key: str, default: str | None = None) -> str | None:
        row = self.one("SELECT value FROM kv WHERE key=?", (key,))
        return row["value"] if row else default

    def set(self, key: str, value: str) -> None:
        self.execute("INSERT INTO kv(key, value) VALUES(?, ?) "
                     "ON CONFLICT(key) DO UPDATE SET value=excluded.value", (key, value))

    # --- клики и конверсии --------------------------------------------------
    def add_click(self, product_id: str, source: str, post_id: str | None,
                  user_hash: str | None, ip_hash: str | None) -> None:
        self.execute(
            "INSERT INTO clicks(ts, product_id, source, post_id, user_hash, ip_hash) VALUES(?,?,?,?,?,?)",
            (iso(now()), product_id, source, post_id, user_hash, ip_hash),
        )

    def add_conversion(self, *, product_id: str | None, source: str | None, post_id: str | None,
                       count: int = 1, payout_rub: float | None = None, ext_id: str | None = None,
                       status: str = "approved", ts: str | None = None) -> bool:
        """False, если конверсия с таким ext_id уже была импортирована."""
        try:
            self.execute(
                "INSERT INTO conversions(ext_id, ts, product_id, source, post_id, count, payout_rub, status) "
                "VALUES(?,?,?,?,?,?,?,?)",
                (ext_id, ts or iso(now()), product_id, source, post_id, count, payout_rub, status),
            )
        except sqlite3.IntegrityError:
            if status == "approved" and ext_id:
                # Ранее была «в обработке», теперь подтверждена.
                self.execute("UPDATE conversions SET status='approved', payout_rub=COALESCE(?, payout_rub) "
                             "WHERE ext_id=? AND status!='approved'", (payout_rub, ext_id))
            return False
        return True
