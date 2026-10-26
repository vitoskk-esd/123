"""Настройки из переменных окружения (файл .env рядом с ботом)."""
import os
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def load_env(path: Path = ROOT / ".env") -> None:
    """Простой разбор .env: KEY=value, комментарии после #. Уже заданные переменные окружения не перезаписываются."""
    if not path.exists():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.split("#", 1)[0].strip()
        if "=" in line:
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip())


@dataclass(frozen=True)
class Config:
    token: str
    admins: frozenset[int]
    db_path: Path
    offers_path: Path
    min_payout: int


def get_config() -> Config:
    load_env()
    admins = frozenset(int(x) for x in os.environ.get("ADMIN_IDS", "").replace(" ", "").split(",") if x)
    return Config(
        token=os.environ.get("BOT_TOKEN", ""),
        admins=admins,
        db_path=ROOT / os.environ.get("DB_PATH", "data/bot.db"),
        offers_path=ROOT / os.environ.get("OFFERS_PATH", "offers.yaml"),
        min_payout=int(os.environ.get("MIN_PAYOUT", "300")),
    )
