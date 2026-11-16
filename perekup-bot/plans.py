"""Тарифы. Пробный день — всё как в PRO на 24 часа, один раз на человека. «Простой» — работать можно, но PRO
заметно выгоднее: машины приходят с задержкой (кто первый позвонил — тот и забрал), 2 фильтра, только общая база
каналов, без оценки «ниже рынка». PRO — мгновенно и без ограничений.
Цены и лимиты «Простого» — в переменных окружения (PRICE_*, BASIC_FILTERS, BASIC_OWN_CHANNELS, BASIC_DELAY)."""
import time
from dataclasses import dataclass

from config import Config

UNLIMITED = 10_000


@dataclass(frozen=True)
class Plan:
    id: str
    title: str
    price: int
    days: int
    max_filters: int
    max_own: int
    delay: int = 0          # через сколько секунд после публикации приходит машина
    market: bool = True     # оценка «ниже рынка» и фильтр по ней
    dkp: bool = True        # договор купли-продажи по данным клиента
    full: int = 0           # обычная цена, если сейчас действует скидка (PRO во время пробного дня)

    @property
    def unlimited(self) -> bool:
        return self.max_filters >= UNLIMITED


def on_trial(user, now: float | None = None) -> bool:
    """Сейчас идёт оплаченный пробный день."""
    return bool(user) and user["plan"] == "trial" and user["paid_until"] > (now or time.time())


def plans(cfg: Config, user=None, now: float | None = None) -> dict[str, Plan]:
    """Тарифы; с user — цены для этого человека: во время пробного дня PRO стоит price_pro_trial (1990 вместо 2490 —
    пробный день засчитывается, владелец 13.11)."""
    out = _plans(cfg)
    if user is not None and on_trial(user, now) and cfg.price_pro_trial < cfg.price_pro:
        from dataclasses import replace
        out["pro"] = replace(out["pro"], price=cfg.price_pro_trial, full=cfg.price_pro)
    return out


def _plans(cfg: Config) -> dict[str, Plan]:
    return {
        # пробный день (владелец 13.11: бесплатный убрали, снова платный — 490 ₽): как PRO, но один фильтр и без договора; один раз на человека
        "trial": Plan("trial", "Пробный день", cfg.price_trial, 1, 1, UNLIMITED, dkp=False),
        "basic": Plan("basic", "Простой", cfg.price_basic, 30, cfg.basic_filters, cfg.basic_own,
                      delay=cfg.basic_delay, market=False, dkp=False),
        "pro": Plan("pro", "PRO", cfg.price_pro, 30, UNLIMITED, UNLIMITED),
    }


FREE = Plan("free", "Бесплатно", 0, 0, UNLIMITED, UNLIMITED)   # пока оплата не подключена — всё бесплатно и без лимитов


def current(cfg: Config, user, now: float | None = None) -> Plan | None:
    """Действующий тариф человека или None, если доступа нет."""
    if not cfg.payments_on:
        return FREE
    now = now or time.time()
    if user and user["paid_until"] > now:
        if user["plan"] == "admin":             # админ — всегда PRO
            return plans(cfg)["pro"]
        return plans(cfg).get(user["plan"] or "basic", plans(cfg)["basic"])
    if user and user["trial_until"] > now:      # бесплатные дни из прошлых версий бота
        return plans(cfg)["pro"]
    return None


def new_period(cfg: Config, user, plan_id: str, now: float | None = None) -> float:
    """До какого момента будет доступ после покупки тарифа. Тот же тариф — продлеваем от конца текущего.
    Другой тариф — новый срок с сегодняшнего дня, а оставшиеся оплаченные дни старого пересчитываем по цене
    в дни нового (переход с «Простого» на PRO не сжигает деньги)."""
    now = now or time.time()
    p = plans(cfg)
    new = p[plan_id]
    left = max(0.0, user["paid_until"] - now)
    old = p.get(user["plan"]) if user["plan"] else None
    if not left or not old or old.id == new.id or old.id == "trial":
        # остаток пробного дня не пересчитываем по цене (он уже засчитан скидкой на PRO) — новый срок просто идёт после него
        return max(now, user["paid_until"]) + new.days * 86400
    per_day_old, per_day_new = old.price / old.days, new.price / new.days
    return now + new.days * 86400 + left * per_day_old / per_day_new
