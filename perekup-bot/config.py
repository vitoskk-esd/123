"""Настройки — из переменных окружения (в облаке) или файла .env рядом с ботом. Обязателен только BOT_TOKEN:
ключи служебного аккаунта бот спросит у админа сам в чате (/connect) и сохранит в базе."""
import os
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parent
# в облаке Amvera постоянное хранилище — /data (переживает перезапуски); на своём компьютере — папка data
DATA = Path("/data") if Path("/data").is_dir() else ROOT / "data"


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
    db_path: Path
    cars_path: Path
    api_id: int = 0                  # служебный аккаунт (my.telegram.org); можно не задавать — бот спросит в /connect
    api_hash: str = ""
    admins: frozenset[int] = frozenset()   # пусто — админом станет первый, кто напишет боту /start
    price: int = 990
    period_days: int = 30
    trial_days: int = 3
    yk_shop_id: str = ""             # ЮKassa; пока не заполнено — бот работает бесплатно для всех (тестовый режим)
    yk_secret: str = ""
    return_url: str = "https://t.me"
    join_interval: int = 90          # пауза между вступлениями в каналы, сек — чтобы Telegram не заблокировал аккаунт
    ai_key: str = ""                 # ключ Gemini (aistudio.google.com) — ИИ перепроверяет каждый подходящий пост
    ai_model: str = "gemini-3.1-flash-lite"
    ai_proxy: bool = False           # ключ подставляет прокси (облачная среда разработки) — для проверок без своего ключа
    max_filters: int = 10
    max_own_channels: int = 30

    @property
    def ai_on(self) -> bool:
        return bool(self.ai_key) or self.ai_proxy

    @property
    def payments_on(self) -> bool:
        return bool(self.yk_shop_id and self.yk_secret)


def get_config() -> Config:
    load_env()
    e = os.environ.get
    return Config(
        token=e("BOT_TOKEN", ""),
        db_path=DATA / "bot.db",
        cars_path=ROOT / "cars.yaml",
        api_id=int(e("TG_API_ID", "0") or 0),
        api_hash=e("TG_API_HASH", ""),
        admins=frozenset(int(x) for x in e("ADMIN_IDS", "").replace(" ", "").split(",") if x),
        price=int(e("PRICE_RUB", "990")),
        trial_days=int(e("TRIAL_DAYS", "3")),
        yk_shop_id=e("YOOKASSA_SHOP_ID", ""),
        yk_secret=e("YOOKASSA_SECRET_KEY", ""),
        ai_key=e("GEMINI_API_KEY", ""),
        ai_model=e("GEMINI_MODEL", "gemini-3.1-flash-lite"),
        ai_proxy=e("AI_PROXY", "0") == "1",
    )
