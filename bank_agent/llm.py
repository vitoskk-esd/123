"""Обёртка над Claude API: текст, веб-поиск, ответы по JSON-схеме и диалог бота."""

from __future__ import annotations

import json
from typing import Any

import anthropic

from .config import CONFIG

# Серверный фолбэк: если модель откажется отвечать, API сам повторит запрос
# на рекомендованной модели.
FALLBACK_BETA = "server-side-fallback-2026-07-01"

WEB_TOOLS = [
    {"type": "web_search_20260209", "name": "web_search"},
    {"type": "web_fetch_20260209", "name": "web_fetch"},
]


class RefusalError(RuntimeError):
    pass


def _text(response) -> str:
    if response.stop_reason == "refusal":
        raise RefusalError(str(getattr(response, "stop_details", "")))
    return "".join(b.text for b in response.content if b.type == "text").strip()


class LLM:
    def __init__(self, client: Any = None, model: str | None = None):
        self.client = client or anthropic.Anthropic()
        self.model = model or CONFIG.model

    def _stream(self, *, max_tokens: int, output_config: dict, **kwargs: Any):
        with self.client.beta.messages.stream(
            model=self.model,
            max_tokens=max_tokens,
            betas=[FALLBACK_BETA],
            extra_body={"fallbacks": "default", "output_config": output_config},
            **kwargs,
        ) as stream:
            return stream.get_final_message()

    def ask(
        self,
        prompt: str,
        *,
        system: str = "",
        web: bool = False,
        max_searches: int = 10,
        schema: dict | None = None,
        effort: str = "high",
        max_tokens: int = 32000,
    ) -> Any:
        """Возвращает текст ответа или (если передана schema) распарсенный JSON."""
        messages: list[dict] = [{"role": "user", "content": prompt}]
        kwargs: dict[str, Any] = {"messages": messages}
        if system:
            kwargs["system"] = system
        if web:
            tools = [dict(t) for t in WEB_TOOLS]
            tools[0]["max_uses"] = max_searches
            kwargs["tools"] = tools
        output_config: dict[str, Any] = {"effort": effort}
        if schema is not None:
            output_config["format"] = {"type": "json_schema", "schema": schema}

        response = None
        for _ in range(8):
            response = self._stream(max_tokens=max_tokens, output_config=output_config, **kwargs)
            if response.stop_reason == "pause_turn":
                # Длинный серверный поиск приостановлен — продолжаем тот же ход.
                messages.append({"role": "assistant", "content": response.content})
                continue
            break

        text = _text(response)
        return text if schema is None else json.loads(text)

    def chat(self, system: str, history: list[dict], schema: dict, *, effort: str = "low") -> dict:
        """Ход диалога бота. history — только текстовые реплики user/assistant.

        Системный промпт (каталог продуктов и правила) неизменен между ходами и
        кешируется; блоки размышлений в историю не возвращаем, поэтому обрезка
        старых реплик ничего не ломает.
        """
        response = self.client.beta.messages.create(
            model=self.model,
            max_tokens=8000,
            system=[{"type": "text", "text": system, "cache_control": {"type": "ephemeral"}}],
            messages=history,
            betas=[FALLBACK_BETA],
            extra_body={
                "fallbacks": "default",
                "output_config": {"effort": effort, "format": {"type": "json_schema", "schema": schema}},
            },
        )
        return json.loads(_text(response))
