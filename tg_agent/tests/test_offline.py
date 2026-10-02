"""Офлайн-тесты Telegram-ассистента: расписание, лимиты, промпт.

    python -m unittest discover -s tg_agent/tests -t .
"""

from __future__ import annotations

import random
import sys
import tempfile
import types
import unittest
from pathlib import Path

sys.modules.setdefault("anthropic", types.SimpleNamespace(Anthropic=lambda: None))

from tg_agent import brain  # noqa: E402
from tg_agent.config import CONFIG  # noqa: E402
from tg_agent.memory import State  # noqa: E402
from tg_agent.schedule import Scheduler  # noqa: E402


class FakeLLM:
    def __init__(self, answer):
        self.answer = answer
        self.calls = []

    def ask(self, prompt, **kwargs):
        self.calls.append((prompt, kwargs))
        return self.answer


class SchedulerTest(unittest.TestCase):
    def test_delay_is_3_to_5_minutes_after_post(self):
        for seed in range(50):
            s = Scheduler(random.Random(seed))
            at = s.plan(post_time=1000.0, now=1001.0)
            self.assertGreaterEqual(at - 1000.0, 3 * 60)
            self.assertLessEqual(at - 1000.0, 5 * 60)

    def test_posts_at_once_are_spread_out(self):
        s = Scheduler(random.Random(1))
        times = [s.plan(post_time=1000.0, now=1000.0) for _ in range(4)]
        gaps = [b - a for a, b in zip(times, times[1:])]
        self.assertTrue(all(g >= CONFIG.gap_min_minutes * 60 for g in gaps), gaps)

    def test_old_post_is_not_scheduled_in_the_past(self):
        s = Scheduler(random.Random(1))
        self.assertGreaterEqual(s.plan(post_time=0.0, now=5000.0), 5000.0)


class StateTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self._old = CONFIG.data_dir
        CONFIG.data_dir = Path(self.tmp.name)

    def tearDown(self):
        CONFIG.data_dir = self._old
        self.tmp.cleanup()

    def test_daily_limit_and_dedupe(self):
        state = State()
        for i in range(CONFIG.max_comments_per_day):
            state.mark_commented(f"c:{i}", "Канал", "текст", "link")
        reloaded = State()
        self.assertEqual(reloaded.comment_budget_left(), 0)
        self.assertTrue(reloaded.already_commented("c:0"))
        self.assertEqual(reloaded.log[0]["channel"], "Канал")
        reloaded.day = "2000-01-01"
        self.assertEqual(reloaded.comment_budget_left(), CONFIG.max_comments_per_day)


class BrainTest(unittest.TestCase):
    def test_comment_prompt_contains_post_and_schema(self):
        llm = FakeLLM({"worth_commenting": True, "reason": "", "comment": "ok"})
        brain.write_comment(llm, "Канал", "Текст поста про RAG")
        prompt, kwargs = llm.calls[0]
        self.assertIn("Текст поста про RAG", prompt)
        self.assertIs(kwargs["schema"], brain.COMMENT_SCHEMA)
        self.assertIn("Никаких ссылок", kwargs["system"])


if __name__ == "__main__":
    unittest.main()
