"""CLI Telegram-ассистента.

    python -m tg_agent login    # войти в Telegram (номер + код), сессия сохранится
    python -m tg_agent run      # слушать каналы и чаты, присылать черновики в «Избранное»
    python -m tg_agent status   # лимиты, черновики на одобрении, память чатов
"""

from __future__ import annotations

import asyncio
import logging
import sys

from .config import CONFIG


def login() -> int:
    from .bot import make_client

    async def go():
        client = make_client()
        await client.start()
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
    print(f"Комментариев сегодня осталось: {state.comment_budget_left()} из {CONFIG.max_comments_per_day}")
    print(f"Черновиков ждут решения: {len(state.pending)}")
    print(f"Выучено правок стиля: {len(state.style)}")
    chats = sorted(CONFIG.chats_dir.glob("*.json")) if CONFIG.chats_dir.exists() else []
    print(f"Чатов в памяти: {len(chats)}")
    return 0


def main(argv: list[str]) -> int:
    commands = {"login": login, "run": run, "status": status}
    if not argv or argv[0] not in commands:
        print(__doc__)
        return 1
    return commands[argv[0]]()


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
