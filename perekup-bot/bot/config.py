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
    cars_path: Path
    channels_path: Path
    # служебные аккаунты Telegram, которые читают каналы (my.telegram.org → API development tools)
    api_id: int = 0
    api_hash: str = ""
    sessions: tuple[str, ...] = ("main",)
    buffer_channel: int = 0          # закрытый канал: служебный аккаунт пересылает туда пост, бот копирует его людям
    join_interval: int = 90          # пауза между вступлениями в каналы, сек — чтобы Telegram не заблокировал аккаунт
    paid_broadcast: bool = False     # платная рассылка Telegram: до 1000 сообщений/с вместо ~30 (платится звёздами бота)
    # подписка
    price: int = 990
    period_days: int = 30
    trial_days: int = 3
    yk_shop_id: str = ""
    yk_secret: str = ""
    autopay: bool = False            # автопродление: включается в ЮKassa отдельно (рекуррентные платежи)
    receipts: bool = False
    return_url: str = "https://t.me"
    offer_url: str = ""
    support: str = ""
    # ИИ для постов, которые не разобрали правила
    gemini_key: str = ""
    gemini_model: str = "gemini-flash-lite-latest"
    llm_fallback: bool = True
    max_filters: int = 10
    max_own_channels: int = 30


def get_config() -> Config:
    load_env()
    e = os.environ.get
    return Config(
        token=e("BOT_TOKEN", ""),
        admins=frozenset(int(x) for x in e("ADMIN_IDS", "").replace(" ", "").split(",") if x),
        db_path=ROOT / e("DB_PATH", "data/bot.db"),
        cars_path=ROOT / e("CARS_PATH", "cars.yaml"),
        channels_path=ROOT / e("CHANNELS_PATH", "channels.yaml"),
        api_id=int(e("TG_API_ID", "0") or 0),
        api_hash=e("TG_API_HASH", ""),
        sessions=tuple(s for s in e("TG_SESSIONS", "main").replace(" ", "").split(",") if s),
        buffer_channel=int(e("BUFFER_CHANNEL_ID", "0") or 0),
        join_interval=int(e("JOIN_INTERVAL", "90")),
        paid_broadcast=e("PAID_BROADCAST", "0") == "1",
        price=int(e("PRICE_RUB", "990")),
        period_days=int(e("PERIOD_DAYS", "30")),
        trial_days=int(e("TRIAL_DAYS", "3")),
        yk_shop_id=e("YOOKASSA_SHOP_ID", ""),
        yk_secret=e("YOOKASSA_SECRET_KEY", ""),
        autopay=e("YOOKASSA_AUTOPAY", "0") == "1",
        receipts=e("YOOKASSA_RECEIPTS", "0") == "1",
        return_url=e("RETURN_URL", "https://t.me"),
        offer_url=e("OFFER_URL", ""),
        support=e("SUPPORT_CONTACT", ""),
        gemini_key=e("GEMINI_API_KEY", ""),
        gemini_model=e("GEMINI_MODEL", "gemini-flash-lite-latest"),
        llm_fallback=e("LLM_FALLBACK", "1") == "1",
        max_filters=int(e("MAX_FILTERS", "10")),
        max_own_channels=int(e("MAX_OWN_CHANNELS", "30")),
    )
