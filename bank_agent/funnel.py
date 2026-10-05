"""Математика цели: сколько нужно кликов, какой темп, куда направить посты.

Пока своих данных мало, используем допущения из конфигурации (по обзорам
партнёрок), а по мере накопления кликов и конверсий — фактические цифры.
"""

from __future__ import annotations

import datetime as dt
import random
from dataclasses import dataclass

from .config import CONFIG
from .db import DB, iso

# Вес априорных допущений: сколько «виртуальных кликов» они стоят.
PRIOR_CLICKS = 300


@dataclass
class GoalStatus:
    goal: int
    done: int
    pending: int
    deadline: dt.date
    days_left: int
    clicks_month: int
    cr: float                # клик → засчитанное оформление
    cr_is_measured: bool
    clicks_needed_per_day: int
    conv_needed_per_day: float
    projection: int          # прогноз к дедлайну при текущем темпе
    avg_payout: float
    break_even_cpc: float    # дороже этого клик не окупается
    budget_for_rest: int     # если добирать платными посевами по средней цене клика

    @property
    def on_track(self) -> bool:
        return self.projection >= self.goal


def month_start(today: dt.date) -> dt.datetime:
    return dt.datetime(today.year, today.month, 1, tzinfo=dt.timezone.utc)


def goal_status(db: DB, today: dt.date, avg_payout: float) -> GoalStatus:
    start = iso(month_start(today))
    done = db.one("SELECT COALESCE(SUM(count),0) n FROM conversions WHERE status='approved' AND ts>=?", (start,))["n"]
    pending = db.one("SELECT COALESCE(SUM(count),0) n FROM conversions WHERE status='pending' AND ts>=?", (start,))["n"]
    clicks = db.one("SELECT COUNT(*) n FROM clicks WHERE ts>=?", (start,))["n"]

    prior_cr = CONFIG.cr_click_to_app * CONFIG.cr_app_to_conv
    # Сглаживание: факт постепенно вытесняет допущение по мере роста кликов.
    cr = (done + prior_cr * PRIOR_CLICKS) / (clicks + PRIOR_CLICKS)
    measured = clicks >= PRIOR_CLICKS and done >= 5

    deadline = CONFIG.deadline(today)
    days_left = max(1, (deadline - today).days + 1)
    remaining = max(0, CONFIG.goal - done)
    conv_per_day = remaining / days_left
    clicks_per_day = int(round(conv_per_day / cr)) if cr > 0 else 0

    days_passed = max(1, (today - month_start(today).date()).days)
    projection = int(done + pending * CONFIG.cr_app_to_conv + done / days_passed * days_left)

    break_even = avg_payout * cr
    budget = int(round(remaining / cr * CONFIG.avg_cpc_rub)) if cr > 0 else 0
    return GoalStatus(
        goal=CONFIG.goal, done=done, pending=pending, deadline=deadline, days_left=days_left,
        clicks_month=clicks, cr=cr, cr_is_measured=measured,
        clicks_needed_per_day=clicks_per_day, conv_needed_per_day=conv_per_day,
        projection=projection, avg_payout=avg_payout, break_even_cpc=break_even, budget_for_rest=budget,
    )


def performance(db: DB, field: str, since_days: int = 30) -> dict[str, dict]:
    """Клики и конверсии в разрезе канала (field='source') или продукта ('product_id')."""
    if field not in ("source", "product_id", "post_id"):
        raise ValueError(field)
    since =iso(dt.datetime.now(dt.timezone.utc) - dt.timedelta(days=since_days))
    stats: dict[str, dict] = {}
    for r in db.all(f"SELECT {field} k, COUNT(*) n FROM clicks WHERE ts>=? GROUP BY {field}", (since,)):
        stats.setdefault(r["k"], {"clicks": 0, "conv": 0, "revenue": 0.0})["clicks"] = r["n"]
    for r in db.all(
        f"SELECT {field} k, SUM(count) n, SUM(COALESCE(payout_rub,0)) rev FROM conversions "
        f"WHERE status='approved' AND ts>=? AND {field} IS NOT NULL GROUP BY {field}", (since,)
    ):
        s = stats.setdefault(r["k"], {"clicks": 0, "conv": 0, "revenue": 0.0})
        s["conv"], s["revenue"] = r["n"], r["rev"]
    return stats


def score(stat: dict | None, prior_epc: float) -> float:
    """Доход с клика со сглаживанием: у новичка — априорный, у проверенного — свой."""
    stat = stat or {"clicks": 0, "revenue": 0.0}
    return (stat["revenue"] + prior_epc * 50) / (stat["clicks"] + 50)


def allocate(total: int, options: list[str], stats: dict[str, dict], prior_epc: float,
             explore_share: float, rng: random.Random | None = None) -> list[str]:
    """Распределяет `total` слотов: большая часть — лучшим по доходу с клика, часть — разведка."""
    if total <= 0 or not options:
        return []
    rng = rng or random.Random()
    ranked = sorted(options, key=lambda o: -score(stats.get(o), prior_epc))
    explore = int(round(total * explore_share)) if len(options) > 1 else 0
    exploit = total - explore
    weights = [score(stats.get(o), prior_epc) + 1e-9 for o in ranked]
    picks = rng.choices(ranked, weights=weights, k=exploit) if exploit else []
    picks += [rng.choice(options) for _ in range(explore)]
    rng.shuffle(picks)
    return picks
