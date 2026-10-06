"""Обёртка над Claude API: ответ строго по JSON-схеме, можно с картинками."""

from __future__ import annotations

import json
from typing import Any

import anthropic

from .config import CONFIG

# Серверный фолбэк: если модель откажется отвечать, API сам повторит запрос
# на рекомендованной модели.
FALLBACK_BETA = "server-side-fallback-2026-07-01"


class RefusalError(RuntimeError):
    pass


class LLM:
    def __init__(self, client: Any = None, model: str | None = None):
        self.client = client or anthropic.Anthropic()
        self.model = model or CONFIG.model

    def ask(
        self,
        content: str | list[dict],
        *,
        schema: dict,
        system: str = "",
        effort: str = "medium",
        max_tokens: int = 16000,
    ) -> dict:
        """Отправляет запрос и возвращает распарсенный JSON по схеме."""
        kwargs: dict[str, Any] = {"messages": [{"role": "user", "content": content}]}
        if system:
            kwargs["system"] = system
        output_config = {"effort": effort, "format": {"type": "json_schema", "schema": schema}}
        with self.client.beta.messages.stream(
            model=self.model,
            max_tokens=max_tokens,
            betas=[FALLBACK_BETA],
            extra_body={"fallbacks": "default", "output_config": output_config},
            **kwargs,
        ) as stream:
            response = stream.get_final_message()
        if response.stop_reason == "refusal":
            raise RefusalError(str(getattr(response, "stop_details", "")))
        if response.stop_reason == "max_tokens":
            raise RuntimeError("ответ модели обрезан по max_tokens")
        text = "".join(b.text for b in response.content if b.type == "text").strip()
        return json.loads(text)
