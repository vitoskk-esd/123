"""Файловое хранилище бота: у каждого пользователя своя папка data/bot/users/<id>/."""

from __future__ import annotations

import json
import threading
from pathlib import Path
from typing import Any

from .config import BOT_CONFIG

_lock = threading.Lock()


def _read(path: Path, default: Any) -> Any:
    if not path.exists():
        return default
    return json.loads(path.read_text(encoding="utf-8"))


def _write(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(".tmp")
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    tmp.replace(path)


def user_dir(uid: int) -> Path:
    d = BOT_CONFIG.data_dir / "users" / str(uid)
    d.mkdir(parents=True, exist_ok=True)
    return d


def covers_dir(uid: int) -> Path:
    d = user_dir(uid) / "covers"
    d.mkdir(exist_ok=True)
    return d


def cover_path(uid: int, lid: str) -> Path:
    # JPEG: обложка на ИИ-фоне весит ~40 КБ против ~220 КБ в PNG, и архив на 300 кворков
    # (~14 МБ) проходит в лимит Telegram на файлы от бота (50 МБ).
    return covers_dir(uid) / f"{lid}.jpg"


# --- Профиль: анкета, оплата, идеи ------------------------------------------

def load_profile(uid: int) -> dict:
    p = _read(user_dir(uid) / "profile.json", {})
    p.setdefault("paid", False)
    p.setdefault("ideas", [])
    return p


def save_profile(uid: int, profile: dict) -> None:
    with _lock:
        _write(user_dir(uid) / "profile.json", profile)


# --- Объявления ----------------------------------------------------------------

def load_listings(uid: int) -> list[dict]:
    return _read(user_dir(uid) / "listings.json", [])


def save_listings(uid: int, items: list[dict]) -> None:
    with _lock:
        _write(user_dir(uid) / "listings.json", items)


# --- Доступ ---------------------------------------------------------------------

def owner_id() -> int | None:
    return _read(BOT_CONFIG.data_dir / "owner.json", {}).get("id")


def claim_owner(uid: int) -> bool:
    """Первый, кто написал боту, становится владельцем (если KWORK_BOT_ADMINS не задан)."""
    if BOT_CONFIG.admins or owner_id() is not None:
        return False
    with _lock:
        _write(BOT_CONFIG.data_dir / "owner.json", {"id": uid})
    return True


def is_admin(uid: int) -> bool:
    return uid in BOT_CONFIG.admins or uid == owner_id()


def has_access(uid: int) -> bool:
    return BOT_CONFIG.free_access or is_admin(uid) or load_profile(uid)["paid"]
