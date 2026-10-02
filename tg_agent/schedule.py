"""Когда публиковать комментарий: через 3–5 минут после поста и не впритык к предыдущему."""

from __future__ import annotations

import random

from .config import CONFIG


class Scheduler:
    def __init__(self, rng: random.Random | None = None) -> None:
        self.rng = rng or random.Random()
        # Раньше этого момента (unix-время) следующий комментарий не уходит.
        self.next_free = 0.0

    def plan(self, post_time: float, now: float) -> float:
        """Возвращает unix-время публикации комментария к посту, вышедшему в post_time."""
        delay = self.rng.uniform(CONFIG.delay_min_minutes, CONFIG.delay_max_minutes) * 60
        at = max(post_time + delay, now, self.next_free)
        self.next_free = at + self.rng.uniform(CONFIG.gap_min_minutes, CONFIG.gap_max_minutes) * 60
        return at
