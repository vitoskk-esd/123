"""YandexGPT как замена Claude там, где Claude API недоступен.

Повторяет интерфейс kwork_agent.llm.LLM.ask, которым пользуется brain.py.
"""

from __future__ import annotations

import json
import urllib.request
from typing import Any, Callable

from .config import CONFIG

URL = "https://llm.api.cloud.yandex.net/foundationModels/v1/completion"


def _post(url: str, headers: dict, body: dict) -> dict:
    req = urllib.request.Request(url, data=json.dumps(body).encode(), headers=headers, method="POST")
    with urllib.request.urlopen(req, timeout=120) as resp:
        return json.loads(resp.read().decode())


def _extract_json(text: str) -> Any:
    """YandexGPT иногда оборачивает JSON в ```json ... ``` — берём объект между первой { и последней }."""
    start, end = text.find("{"), text.rfind("}")
    if start == -1 or end <= start:
        raise ValueError(f"YandexGPT вернул не JSON: {text[:300]}")
    return json.loads(text[start : end + 1])


class YandexLLM:
    def __init__(self, post: Callable[[str, dict, dict], dict] = _post) -> None:
        if not CONFIG.yandex_api_key or not CONFIG.yandex_folder_id:
            raise SystemExit("Для TG_LLM_PROVIDER=yandex заполните YANDEX_API_KEY и YANDEX_FOLDER_ID.")
        self.post = post

    def ask(self, prompt: str, *, system: str = "", schema: dict | None = None, **_: Any) -> Any:
        if schema is not None:
            fields = ", ".join(f'"{k}"' for k in schema["properties"])
            system += (
                f"\n\nОтветь ТОЛЬКО JSON-объектом с полями {fields}, без пояснений и без markdown. "
                f"Схема: {json.dumps(schema, ensure_ascii=False)}"
            )
        messages = ([{"role": "system", "text": system}] if system else []) + [{"role": "user", "text": prompt}]
        body = {
            "modelUri": f"gpt://{CONFIG.yandex_folder_id}/{CONFIG.yandex_model}",
            "completionOptions": {"stream": False, "temperature": 0.6, "maxTokens": "2000"},
            "messages": messages,
        }
        headers = {
            "Authorization": f"Api-Key {CONFIG.yandex_api_key}",
            "x-folder-id": CONFIG.yandex_folder_id,
            "Content-Type": "application/json",
        }
        data = self.post(URL, headers, body)
        text = data["result"]["alternatives"][0]["message"]["text"].strip()
        return _extract_json(text) if schema is not None else text
