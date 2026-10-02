"""Тексты от Claude: комментарии к постам, ответы в чатах, резюме переписки."""

from __future__ import annotations

from typing import Any

from .config import CONFIG
from .memory import ChatMemory

COMMENT_SCHEMA = {
    "type": "object",
    "properties": {
        "worth_commenting": {
            "type": "boolean",
            "description": "Есть ли что добавить по существу как эксперт (false для рекламы, розыгрышей, "
            "новостей без предмета обсуждения, тем вне вашей экспертизы)",
        },
        "reason": {"type": "string"},
        "comment": {"type": "string"},
    },
    "required": ["worth_commenting", "reason", "comment"],
    "additionalProperties": False,
}

REPLY_SCHEMA = {
    "type": "object",
    "properties": {
        "should_reply": {
            "type": "boolean",
            "description": "false, если реплика не требует ответа или разговор закончен",
        },
        "reply": {"type": "string"},
    },
    "required": ["should_reply", "reply"],
    "additionalProperties": False,
}


def _style_block(examples: list[dict]) -> str:
    if not examples:
        return ""
    parts = ["Как владелец аккаунта правил прошлые черновики — пиши ближе к его итоговым вариантам:"]
    for ex in examples:
        parts.append(f"— черновик: {ex['draft']}\n  итог: {ex['final']}")
    return "\n".join(parts)


def comment_system(style: list[dict]) -> str:
    return f"""Ты пишешь черновик комментария под постом в Telegram-канале от лица владельца аккаунта.
Владелец — {CONFIG.persona}. Он сам прочитает черновик и решит, публиковать ли его.

Цель: комментарий, после которого читателям хочется открыть профиль автора, потому что он явно
разбирается в теме. Это достигается пользой, а не саморекламой.

Правила:
- Сначала внимательно прочитай пост. Комментарий — строго по его содержанию: зацепись за
  конкретный тезис, цифру или пример из поста.
- Добавь то, чего в посте нет: практическое наблюдение, неочевидный нюанс, цифру из опыта,
  аргументированное несогласие или точный вопрос, который продолжит дискуссию.
- Никаких ссылок, @упоминаний, призывов подписаться, «пишите в личку», «у меня в канале».
- Не льсти автору и не пересказывай пост. Без «Отличный пост!», «Согласен на 100%».
- Пиши как живой человек в чате: 1–4 предложения, разговорный русский, без канцелярита,
  без списков, без хэштегов, эмодзи — максимум один и только если к месту.
- Не выдумывай конкретные факты о проектах владельца (клиенты, суммы, кейсы). Если нужен
  пример из опыта — формулируй как общее наблюдение практика.
- Если по существу сказать нечего — worth_commenting=false.

{_style_block(style)}""".strip()


def reply_system(mem: ChatMemory, style: list[dict], is_private: bool) -> str:
    channel = (
        f"\nУ владельца есть канал {CONFIG.my_channel}. Упоминай его только если собеседник сам "
        "спрашивает, где почитать подробнее или чем владелец занимается."
        if CONFIG.my_channel and is_private
        else ""
    )
    summary = f"\nЧто известно из ранней переписки в этом чате:\n{mem.summary}\n" if mem.summary else ""
    return f"""Ты пишешь черновик ответа в Telegram-чате «{mem.title}» от лица владельца аккаунта.
Владелец — {CONFIG.persona}. Он сам прочитает черновик и решит, отправлять ли его.
{summary}
Пиши так, как написал бы он: коротко, по-человечески, на «ты» или «вы» — как принято в этом чате,
опираясь на всю историю разговора и то, что уже обсуждали. Не повторяйся, не задавай вопросов,
на которые ответ уже был. Не выдумывай факты о жизни и делах владельца — если ответ требует
таких фактов, напиши нейтрально или задай уточняющий вопрос. Без списков и официоза.{channel}

{_style_block(style)}""".strip()


def write_comment(llm: Any, channel_title: str, post_text: str, style: list[dict]) -> dict:
    prompt = f"Канал: {channel_title}\n\nТекст поста:\n<<<\n{post_text}\n>>>\n\nНапиши комментарий."
    return llm.ask(prompt, system=comment_system(style), schema=COMMENT_SCHEMA, effort="medium", max_tokens=8000)


def write_reply(llm: Any, mem: ChatMemory, style: list[dict], is_private: bool) -> dict:
    prompt = (
        f"Последние сообщения чата (сверху — старые):\n<<<\n{mem.transcript()}\n>>>\n\n"
        "Напиши ответ владельца аккаунта на последнее сообщение."
    )
    return llm.ask(
        prompt, system=reply_system(mem, style, is_private), schema=REPLY_SCHEMA, effort="low", max_tokens=8000
    )


def summarize(llm: Any, mem: ChatMemory) -> str:
    prompt = (
        f"Текущее резюме чата «{mem.title}»:\n{mem.summary or '(пусто)'}\n\n"
        f"Новые сообщения, которые нужно в него влить:\n{mem.transcript(mem.overflow)}\n\n"
        "Обнови резюме: кто участники и что о них известно, о чём договорились, какие темы и "
        "вопросы открыты, тон общения. Только факты из переписки, до 1500 символов."
    )
    return llm.ask(prompt, effort="low", max_tokens=8000)
