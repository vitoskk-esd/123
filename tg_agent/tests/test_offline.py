"""Офлайн-тесты Telegram-ассистента: память, лимиты, обучение стилю, промпты.

    python -m unittest discover -s tg_agent/tests -t .
"""

from __future__ import annotations

import sys
import tempfile
import types
import unittest
from pathlib import Path

sys.modules.setdefault("anthropic", types.SimpleNamespace(Anthropic=lambda: None))

from tg_agent import brain  # noqa: E402
from tg_agent.config import CONFIG  # noqa: E402
from tg_agent.memory import ChatMemory, State  # noqa: E402


class FakeLLM:
    def __init__(self, answer):
        self.answer = answer
        self.calls = []

    def ask(self, prompt, **kwargs):
        self.calls.append((prompt, kwargs))
        return self.answer


class Base(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self._old = CONFIG.data_dir
        CONFIG.data_dir = Path(self.tmp.name)

    def tearDown(self):
        CONFIG.data_dir = self._old
        self.tmp.cleanup()


class MemoryTest(Base):
    def test_history_persists_per_chat(self):
        ChatMemory(1, "Аня").add("Аня", "привет", msg_id=10)
        ChatMemory(2, "Боря").add("Боря", "здравствуйте", msg_id=10)
        self.assertEqual(ChatMemory(1).transcript(), "Аня: привет")
        self.assertEqual(ChatMemory(2).title, "Боря")

    def test_dedupe_by_message_id(self):
        mem = ChatMemory(1)
        mem.add("Я", "ок", me=True, msg_id=5)
        mem.add("Я", "ок", me=True, msg_id=5)
        self.assertEqual(len(ChatMemory(1).messages), 1)

    def test_overflow_goes_to_summary(self):
        mem = ChatMemory(1, "чат")
        for i in range(CONFIG.memory_messages + 25):
            mem.add("Аня", f"сообщение {i}", msg_id=i)
        self.assertEqual(len(mem.messages), CONFIG.memory_messages)
        self.assertTrue(mem.needs_summary())
        llm = FakeLLM("Аня обсуждает ботов")
        mem.apply_summary(brain.summarize(llm, mem))
        self.assertIn("сообщение 0", llm.calls[0][0])
        reloaded = ChatMemory(1)
        self.assertEqual(reloaded.summary, "Аня обсуждает ботов")
        self.assertEqual(reloaded.overflow, [])
        self.assertIn("Аня обсуждает ботов", brain.reply_system(reloaded, [], True))


class StateTest(Base):
    def test_daily_limit(self):
        state = State()
        for i in range(CONFIG.max_comments_per_day):
            state.mark_commented(f"c:{i}")
        self.assertEqual(State().comment_budget_left(), 0)
        self.assertTrue(State().already_commented("c:0"))
        state.day = "2000-01-01"
        self.assertEqual(state.comment_budget_left(), CONFIG.max_comments_per_day)

    def test_pending_roundtrip(self):
        State().add_pending(42, {"kind": "comment", "text": "x"})
        state = State()
        self.assertEqual(state.pop_pending(42)["text"], "x")
        self.assertIsNone(State().pop_pending(42))

    def test_learns_only_real_edits(self):
        state = State()
        state.learn("comment", "a", "a")
        state.learn("comment", "черновик", "мой вариант")
        state.learn("reply", "x", "y")
        examples = State().style_examples("comment")
        self.assertEqual(examples, [{"kind": "comment", "draft": "черновик", "final": "мой вариант"}])
        self.assertIn("мой вариант", brain.comment_system(examples))


class BrainTest(Base):
    def test_comment_prompt_contains_post_and_schema(self):
        llm = FakeLLM({"worth_commenting": True, "reason": "", "comment": "ok"})
        brain.write_comment(llm, "Канал", "Текст поста про RAG", [])
        prompt, kwargs = llm.calls[0]
        self.assertIn("Текст поста про RAG", prompt)
        self.assertIs(kwargs["schema"], brain.COMMENT_SCHEMA)
        self.assertIn("Никаких ссылок", kwargs["system"])


if __name__ == "__main__":
    unittest.main()
