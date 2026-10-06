"""Файловое хранилище: какие новости уже использованы, история постов, логи."""

from __future__ import annotations

import datetime as dt
import json
from pathlib import Path
from typing import Any

from .config import CONFIG

MAX_HISTORY = 5000
MAX_FIRST_SEEN = 5000
MAX_POSTS = 2000


def now() -> dt.datetime:
    return dt.datetime.now(dt.timezone.utc)


def path(name: str) -> Path:
    CONFIG.data_dir.mkdir(parents=True, exist_ok=True)
    return CONFIG.data_dir / name


def load_json(name: str, default: Any) -> Any:
    p = path(name)
    if not p.exists():
        return default
    return json.loads(p.read_text(encoding="utf-8"))


def save_json(name: str, data: Any) -> None:
    p = path(name)
    tmp = p.with_suffix(".tmp")
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    tmp.replace(p)


# --- Использованные новости -------------------------------------------------
# history.json: {url: {"status": posted|preview|rejected, "at": iso, "topic": ...}}
# Новость с любой записью в history больше не предлагается.

def load_history() -> dict:
    return load_json("history.json", {})


def mark(url: str, status: str, **extra: Any) -> None:
    hist = load_history()
    hist[url] = {"status": status, "at": now().isoformat(timespec="seconds"), **extra}
    if len(hist) > MAX_HISTORY:
        hist = dict(sorted(hist.items(), key=lambda kv: kv[1]["at"])[-MAX_HISTORY:])
    save_json("history.json", hist)


def first_seen(urls: list[str]) -> dict[str, dt.datetime]:
    """Когда бот впервые увидел каждую ссылку — для новостей без даты публикации."""
    seen = load_json("first_seen.json", {})
    stamp = now().isoformat(timespec="seconds")
    for u in urls:
        seen.setdefault(u, stamp)
    if len(seen) > MAX_FIRST_SEEN:
        seen = dict(sorted(seen.items(), key=lambda kv: kv[1])[-MAX_FIRST_SEEN:])
    save_json("first_seen.json", seen)
    return {u: dt.datetime.fromisoformat(seen[u]) for u in urls}


# --- Опубликованные посты ----------------------------------------------------

def load_posts() -> list[dict]:
    return load_json("posts.json", [])


def add_post(post: dict) -> None:
    posts = load_posts()
    posts.append(post)
    save_json("posts.json", posts[-MAX_POSTS:])


def posts_since(since: dt.datetime) -> int:
    """Сколько постов реально вышло (хотя бы на одной площадке) с момента since."""
    return sum(
        1 for p in load_posts()
        if dt.datetime.fromisoformat(p["at"]) >= since and not p.get("dry_run")
        and any("error" not in r for r in p["results"].values())
    )


def log(msg: str) -> None:
    line = f"[{dt.datetime.now().isoformat(timespec='seconds')}] {msg}"
    print(line, flush=True)
    logs = path("logs")
    logs.mkdir(exist_ok=True)
    with (logs / f"{dt.date.today().isoformat()}.log").open("a", encoding="utf-8") as f:
        f.write(line + "\n")
