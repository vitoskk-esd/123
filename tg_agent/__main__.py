"""CLI Telegram-ассистента.

    python -m tg_agent login    # войти в Telegram по QR-коду, сессия сохранится
    python -m tg_agent run      # следить за каналами и комментировать новые посты
    python -m tg_agent status   # сколько комментариев сегодня и последние из них
"""

from __future__ import annotations

import asyncio
import logging
import sys

from .config import CONFIG


def login() -> int:
    from .bot import ensure_login, make_client

    async def go():
        client = make_client()
        await ensure_login(client)
        me = await client.get_me()
        print(f"Готово: вошли как {me.first_name} (@{me.username}). Сессия: {CONFIG.session}.session")
        await client.disconnect()

    asyncio.run(go())
    return 0


def run() -> int:
    from kwork_agent.llm import LLM

    from .bot import Agent, make_client

    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(message)s")
    agent = Agent(make_client(), LLM(model=CONFIG.model))
    asyncio.run(agent.run())
    return 0


def status() -> int:
    from .memory import State

    state = State()
    left = state.comment_budget_left()
    print(f"Сегодня: {CONFIG.max_comments_per_day - left} из {CONFIG.max_comments_per_day} комментариев")
    for item in state.log[-10:]:
        print(f"\n[{item['day']}] {item['channel']}  {item['link']}\n  {item['text']}")
    return 0


def main(argv: list[str]) -> int:
    commands = {"login": login, "run": run, "status": status}
    if not argv or argv[0] not in commands:
        print(__doc__)
        return 1
    return commands[argv[0]]()


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
