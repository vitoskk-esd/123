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
    price_trial: int = 250           # пробный день: всё как в PRO на 24 часа, один раз
    price_basic: int = 990           # «Простой» на 30 дней
    price_pro: int = 2490            # PRO на 30 дней, без лимитов
    basic_filters: int = 2           # лимиты «Простого»: фильтры, свои каналы (0 — только общая база), задержка, с
    basic_own: int = 0
    basic_delay: int = 60
    trial_days: int = 0              # бесплатных дней при первом запуске (теперь пробный день платный)
    rk_login: str = ""               # Робокасса; пока не заполнено — бот работает бесплатно для всех (тестовый режим)
    rk_pass1: str = ""
    rk_pass2: str = ""
    rk_hash: str = "md5"             # алгоритм подписи — как в технических настройках магазина
    seller_name: str = ""            # реквизиты самозанятого для оферты (/offer) — их проверяет Робокасса
    seller_inn: str = ""
    seller_contact: str = ""         # email или телефон для клиентов
    join_interval: int = 90          # пауза между вступлениями в каналы, сек — чтобы Telegram не заблокировал аккаунт
    poll_rps: float = 3.0            # сколько каналов в секунду опрашиваем сами (Telegram присылает посты больших каналов с опозданием)
    ai_key: str = ""                 # ключ Gemini (aistudio.google.com) — ИИ перепроверяет каждый подходящий пост
    ai_model: str = "gemini-3.1-flash-lite"
    ai_proxy: bool = False           # ключ подставляет прокси (облачная среда разработки) — для проверок без своего ключа

    @property
    def ai_on(self) -> bool:
        return bool(self.ai_key) or self.ai_proxy

    @property
    def payments_on(self) -> bool:
        return bool(self.rk_login and self.rk_pass1 and self.rk_pass2)


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
        price_trial=int(e("PRICE_TRIAL", "250")),
        price_basic=int(e("PRICE_BASIC", "990")),
        price_pro=int(e("PRICE_PRO", "2490")),
        basic_filters=int(e("BASIC_FILTERS", "2")),
        basic_own=int(e("BASIC_OWN_CHANNELS", "0")),
        basic_delay=int(e("BASIC_DELAY", "60")),
        trial_days=int(e("TRIAL_DAYS", "0")),
        rk_login=e("ROBOKASSA_LOGIN", ""),
        rk_pass1=e("ROBOKASSA_PASSWORD1", ""),
        rk_pass2=e("ROBOKASSA_PASSWORD2", ""),
        rk_hash=e("ROBOKASSA_HASH", "md5").lower().replace("-", ""),
        seller_name=e("SELLER_NAME", ""),
        seller_inn=e("SELLER_INN", ""),
        seller_contact=e("SELLER_CONTACT", ""),
        poll_rps=float(e("POLL_RPS", "3")),
        ai_key=e("GEMINI_API_KEY", ""),
        ai_model=e("GEMINI_MODEL", "gemini-3.1-flash-lite"),
        ai_proxy=e("AI_PROXY", "0") == "1",
    )
