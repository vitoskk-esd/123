"""Дневной план: сколько объявлений делать сегодня.

Первый день — KWORK_START_PER_DAY. Каждый следующий день план растёт на
KWORK_DAILY_INCREASE (до KWORK_MAX_PER_DAY), но только если вчерашние
публикации в основном прошли. Если Kwork начал отказывать (капча, лимит
кворков, ошибки) — план не растёт, пока ситуация не выправится.
"""

from __future__ import annotations

from . import storage
from .config import CONFIG


def daily_target() -> int:
    state = storage.load_json("ramp.json", {})
    today = storage.today()
    if state.get("date") == today:
        return state["target"]

    prev = state.get("target")
    if prev is None:
        target = CONFIG.start_per_day
        reason = "первый день"
    else:
        attempted = state.get("attempted", 0)
        succeeded = state.get("succeeded", 0)
        if attempted and succeeded / attempted >= CONFIG.ramp_success_ratio:
            target = min(prev + CONFIG.daily_increase, CONFIG.max_per_day)
            reason = f"вчера прошло {succeeded}/{attempted}"
        else:
            target = prev
            reason = f"план не растёт: вчера прошло {succeeded}/{attempted}"
    target = max(1, min(target, CONFIG.max_per_day))

    history = state.get("history", [])
    if prev is not None:
        history.append({k: state.get(k) for k in ("date", "target", "attempted", "succeeded")})
    storage.save_json("ramp.json", {"date": today, "target": target, "attempted": 0,
                                    "succeeded": 0, "history": history[-90:]})
    storage.log(f"План на сегодня: {target} объявлений ({reason})")
    return target


def record_result(attempted: int, succeeded: int) -> None:
    if CONFIG.dry_run:
        return  # в режиме проверки ничего не публикуется — план не растёт
    state = storage.load_json("ramp.json", {})
    if state.get("date") != storage.today():
        return
    state["attempted"] = state.get("attempted", 0) + attempted
    state["succeeded"] = state.get("succeeded", 0) + succeeded
    storage.save_json("ramp.json", state)
