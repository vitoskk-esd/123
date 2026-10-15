#!/usr/bin/env python3
"""Пример Higgsfield API: Seedance 2.5 text-to-video через официальный SDK (higgsfield-client), метод subscribe.
Ключ — HF_KEY в формате key-id:key-secret: из .env.local в корне репозитория (файл в .gitignore) или из переменной окружения.
Значение ключа скрипт не печатает и не логирует.
  <python с higgsfield-client и python-dotenv> tools/higgsfield/main.py --check   # БЕСПЛАТНО: только проверка ключа, без генерации
  <python с higgsfield-client и python-dotenv> tools/higgsfield/main.py           # ПЛАТНО: Seedance 2.5, 5 с, 720p, 16:9
Проверка (владелец 15.10: «не хочу запускать пример, чтобы сразу списали кредиты»): запрос ссылки для загрузки файла
(POST /files/generate-upload-url) требует ключ, но ничего не генерирует и не списывает.
"""
import os, sys
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env.local", override=False)   # переменная окружения, если задана, важнее файла

import higgsfield_client
from higgsfield_client.exceptions import CredentialsMissedError, HiggsfieldClientError

MODEL = "bytedance/seedance-2.5/text-to-video"
ARGS = {"prompt": "A cinematic scene at sunset", "duration": 5, "resolution": "720p", "aspect_ratio": "16:9"}


def find_url(result):
    """URL видео из ответа: поле video ({url} или строка), на всякий случай — videos[0]."""
    v = result.get("video")
    if isinstance(v, dict) and v.get("url"): return v["url"]
    if isinstance(v, str) and v.startswith("http"): return v
    vs = result.get("videos")
    if isinstance(vs, list) and vs and isinstance(vs[0], dict) and vs[0].get("url"): return vs[0]["url"]
    return None


def check():
    """Бесплатная проверка ключа: просим ссылку для загрузки файла (ничего не генерируется и не списывается)."""
    import httpx
    try:
        r = httpx.post("https://api.higgsfield.ai/files/generate-upload-url", json={"content_type": "image/jpeg"},
                       headers={"Authorization": f"Key {os.environ['HF_KEY']}"}, timeout=30)
    except httpx.HTTPError as e:
        print(f"Сеть: не удалось достучаться до api.higgsfield.ai ({type(e).__name__})", file=sys.stderr); return 1
    if r.status_code == 200 and "upload_url" in r.text:
        print("Ключ принят: api.higgsfield.ai отвечает 200, генерации не было, деньги не списаны."); return 0
    print(f"Ключ не принят: HTTP {r.status_code} — {r.text[:200]}", file=sys.stderr); return 1


def main():
    if not os.getenv("HF_KEY"):
        print("Нет ключа: задайте HF_KEY (key-id:key-secret) в .env.local или в переменных окружения.", file=sys.stderr)
        return 2
    if "--check" in sys.argv[1:]:
        return check()
    try:
        result = higgsfield_client.subscribe(
            MODEL, arguments=ARGS,
            on_enqueue=lambda rid: print(f"запрос поставлен в очередь: {rid}", flush=True),
            on_queue_update=lambda st: print(f"статус: {type(st).__name__}", flush=True),
        )
    except CredentialsMissedError:
        print("Нет ключа: SDK не нашёл HF_KEY.", file=sys.stderr); return 2
    except HiggsfieldClientError as e:
        print(f"Ошибка API: {e}", file=sys.stderr); return 1
    status = str(result.get("status", "")).lower()
    if status != "completed":
        reason = {"failed": "генерация не удалась", "nsfw": "запрос отклонён модерацией", "canceled": "запрос отменён"}.get(status, f"неожиданный статус «{status}»")
        print(f"Не готово: {reason}. request_id={result.get('request_id')}", file=sys.stderr); return 1
    url = find_url(result)
    if not url:
        print(f"Статус completed, но URL видео в ответе не найден. Поля ответа: {sorted(result)}", file=sys.stderr); return 1
    print(url)
    return 0


if __name__ == "__main__":
    sys.exit(main())
