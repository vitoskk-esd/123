"""Тексты через Gemini (Google). Тот же метод ask(), что у kwork_agent.llm.LLM, — бот
переключается между Claude и Gemini одной настройкой KWORK_BOT_LLM.

Gemini часто отвечает «перегружен» (503/502/429): тогда пробуем следующую модель из
цепочки, а когда кончатся — ждём и повторяем всю цепочку.
"""

from __future__ import annotations

import base64
import json
import time
import urllib.error
import urllib.request
from typing import Any

from .config import BOT_CONFIG

API = "https://generativelanguage.googleapis.com/v1beta/models"
RETRY_CODES = {429, 500, 502, 503, 504}
# Модель недоступна этому ключу или снята — сразу переходим к следующей.
SKIP_CODES = {400, 404}
ROUNDS = 5  # сколько раз проходим цепочку моделей, с паузой 4, 8, 16, 32 с между проходами


class GeminiError(RuntimeError):
    pass


class GeminiLLM:
    def __init__(self, model: str | None = None, fallbacks: list[str] | None = None):
        first = model or BOT_CONFIG.model
        chain = [first] + (BOT_CONFIG.fallback_models if fallbacks is None else fallbacks)
        self.models = list(dict.fromkeys(m for m in chain if m))  # без повторов, порядок сохраняем

    def _post(self, model: str, body: dict) -> dict:
        headers = {"Content-Type": "application/json"}
        if BOT_CONFIG.gemini_key:  # в облачной среде ключ подставляет прокси сам
            headers["x-goog-api-key"] = BOT_CONFIG.gemini_key
        req = urllib.request.Request(f"{API}/{model}:generateContent", json.dumps(body).encode(), headers)
        with urllib.request.urlopen(req, timeout=180) as resp:
            return json.load(resp)

    def ask(
        self,
        prompt: str,
        *,
        system: str = "",
        schema: dict | None = None,
        effort: str = "medium",
        max_tokens: int = 32000,
        cached_context: str = "",
        images: list[bytes] | None = None,
        **_: Any,
    ) -> Any:
        """Текст ответа или (если передана schema) распарсенный JSON. images — JPEG/PNG к запросу."""
        config: dict[str, Any] = {
            "maxOutputTokens": max_tokens,
            # Для массовых текстов хватает «низкого» размышления — быстрее и дешевле.
            "thinkingConfig": {"thinkingLevel": "high" if effort in ("high", "xhigh", "max") else "low"},
        }
        if schema is not None:
            config.update(responseMimeType="application/json", responseJsonSchema=schema)
        # Общую часть (образцы кворков) ставим в начало: Gemini сам кэширует одинаковое начало запросов.
        instruction = "\n\n".join(t for t in (cached_context, system) if t)
        parts: list[dict] = [{"text": prompt}]
        for img in images or []:
            mime = "image/png" if img[:4] == b"\x89PNG" else "image/jpeg"
            parts.append({"inline_data": {"mime_type": mime, "data": base64.b64encode(img).decode()}})
        body: dict[str, Any] = {"contents": [{"role": "user", "parts": parts}], "generationConfig": config}
        if instruction:
            body["systemInstruction"] = {"parts": [{"text": instruction}]}

        last = ""
        for round_no in range(ROUNDS):
            if round_no:
                time.sleep(2 ** (round_no + 1))
            for model in self.models:
                try:
                    data = self._post(model, body)
                except urllib.error.HTTPError as e:
                    last = f"{model}: HTTP {e.code} {e.read().decode(errors='replace')[:200]}"
                    if e.code in RETRY_CODES or e.code in SKIP_CODES:
                        continue
                    raise GeminiError(last) from e
                except (urllib.error.URLError, TimeoutError) as e:
                    last = f"{model}: {type(e).__name__}: {e}"
                    continue
                text = _text(data)
                if text is None:
                    last = f"{model}: пустой ответ ({_finish_reason(data)})"
                    continue
                if schema is None:
                    return text
                try:
                    return json.loads(text)
                except ValueError:
                    last = f"{model}: ответ не JSON"
                    continue
        raise GeminiError(f"Gemini не ответил: {last}")


def _text(data: dict) -> str | None:
    for cand in data.get("candidates", []):
        parts = cand.get("content", {}).get("parts", [])
        text = "".join(p.get("text", "") for p in parts if not p.get("thought"))
        if text.strip():
            return text.strip()
    return None


def _finish_reason(data: dict) -> str:
    cands = data.get("candidates") or [{}]
    return cands[0].get("finishReason") or data.get("promptFeedback", {}).get("blockReason") or "нет кандидатов"
