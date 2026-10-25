"""Мастер настройки бота: по очереди просит ключи, проверяет каждый и пишет .env.

    python -m kwork_bot setup   # или просто python -m kwork_bot — мастер включится сам, если ключей нет

Каждый ключ проверяется бесплатным запросом: Telegram getMe, список моделей Claude,
запрос ссылки для загрузки файла в Higgsfield (ничего не генерирует и не списывает).
"""

from __future__ import annotations

import json
import os
import re
import urllib.error
import urllib.request

from kwork_agent.config import ROOT

ENV = ROOT / ".env"


def set_env(key: str, value: str) -> None:
    lines = ENV.read_text(encoding="utf-8-sig").splitlines() if ENV.exists() else []
    lines = [l for l in lines if not l.strip().startswith(f"{key}=")] + [f"{key}={value}"]
    ENV.write_text("\n".join(lines) + "\n", encoding="utf-8")
    os.environ[key] = value


def clean(raw: str, name: str) -> str:
    """Убирает то, что часто вставляют вместе с ключом: пробелы, кавычки, «ИМЯ=» в начале."""
    value = re.sub(rf"^{name}\s*=", "", raw.strip().strip("\"'").strip(), flags=re.IGNORECASE)
    return value.strip().strip("\"'").strip()


def _env_local(name: str) -> str:
    path = ROOT / ".env.local"
    if not path.exists():
        return ""
    for line in path.read_text(encoding="utf-8-sig").splitlines():
        if line.strip().startswith(f"{name}="):
            return clean(line, name)
    return ""


# --- Проверки (бросают ValueError с понятным текстом) ------------------------------------

def check_telegram(token: str) -> str:
    """Возвращает имя бота."""
    if ":" not in token:
        raise ValueError("токен выглядит как 1234567890:AAH… — скопируйте его из @BotFather целиком")
    try:
        with urllib.request.urlopen(f"https://api.telegram.org/bot{token}/getMe", timeout=20) as resp:
            data = json.load(resp)
    except urllib.error.HTTPError as e:
        if e.code in (401, 404):
            raise ValueError("Telegram не принял токен — проверьте, что скопировали его целиком") from e
        raise ValueError(f"Telegram ответил ошибкой {e.code}, попробуйте ещё раз") from e
    except urllib.error.URLError as e:
        raise ValueError("нет связи с Telegram — проверьте интернет") from e
    return data["result"]["username"]


def check_anthropic(key: str) -> None:
    if not key.startswith("sk-ant-"):
        raise ValueError("ключ Claude начинается с sk-ant- — скопируйте его на console.anthropic.com целиком")
    import anthropic

    try:
        anthropic.Anthropic(api_key=key).models.list(limit=1)
    except anthropic.AuthenticationError as e:
        raise ValueError("Claude не принял ключ — создайте новый на console.anthropic.com") from e
    except anthropic.PermissionDeniedError as e:
        raise ValueError("у ключа нет доступа — проверьте его в console.anthropic.com") from e
    except anthropic.APIConnectionError as e:
        raise ValueError("нет связи с Claude API — проверьте интернет") from e


def check_higgsfield(key: str) -> None:
    if key.count(":") != 1:
        raise ValueError("ключ Higgsfield состоит из двух частей через двоеточие: key-id:key-secret")
    req = urllib.request.Request(
        "https://api.higgsfield.ai/files/generate-upload-url",
        json.dumps({"content_type": "image/jpeg"}).encode(),
        {"Authorization": f"Key {key}", "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            if "upload_url" not in resp.read().decode():
                raise ValueError("Higgsfield ответил странно, попробуйте ещё раз")
    except urllib.error.HTTPError as e:
        if e.code in (401, 403):
            raise ValueError("Higgsfield не принял ключ — проверьте обе части key-id:key-secret") from e
        raise ValueError(f"Higgsfield ответил ошибкой {e.code}, попробуйте ещё раз") from e
    except urllib.error.URLError as e:
        raise ValueError("нет связи с Higgsfield — проверьте интернет") from e


# --- Диалог ---------------------------------------------------------------------------------

STEPS = [
    ("KWORK_BOT_TOKEN", "Токен бота",
     "Telegram → @BotFather → /mybots → ваш бот → API Token. Вид: 1234567890:AAH…", check_telegram, True),
    ("ANTHROPIC_API_KEY", "Ключ Claude",
     "console.anthropic.com → API Keys → Create Key. Начинается с sk-ant-", check_anthropic, True),
    ("HF_KEY", "Ключ Higgsfield (для обложек)",
     "Тот же, что для рилсов, вид key-id:key-secret. Пустая строка — без ИИ-обложек", check_higgsfield, False),
]


def run_setup(ask=input) -> int:
    print("=== Настройка бота: 3 ключа, ~2 минуты ===")
    print("Вставляйте ключ (правая кнопка мыши или Ctrl+V / Cmd+V) и нажимайте Enter.\n")
    for n, (name, title, hint, check, required) in enumerate(STEPS, 1):
        current = os.getenv(name, "") or (_env_local(name) if name == "HF_KEY" else "")
        if current:
            try:
                result = check(current)
                set_env(name, current)
                print(f"{n}. {title}: ✓ уже есть и работает")
                if name == "KWORK_BOT_TOKEN":
                    set_env("KWORK_BOT_RETURN_URL", f"https://t.me/{result}")
                continue
            except ValueError as e:
                print(f"{n}. {title}: сохранённый не подходит ({e})")
        print(f"{n}. {title}\n   Где взять: {hint}")
        while True:
            value = clean(ask("   Вставьте сюда: "), name)
            if not value and not required:
                print("   Пропускаю — обложки будут простыми градиентными.\n")
                break
            if not value:
                print("   Этот ключ обязателен.")
                continue
            try:
                result = check(value)
            except ValueError as e:
                print(f"   ✗ {e}. Попробуйте ещё раз.")
                continue
            set_env(name, value)
            if name == "KWORK_BOT_TOKEN":
                set_env("KWORK_BOT_RETURN_URL", f"https://t.me/{result}")
                print(f"   ✓ Бот @{result} найден\n")
            else:
                print("   ✓ Ключ работает\n")
            break
    print(f"Готово! Ключи сохранены в {ENV.name} (в git этот файл не попадает).")
    return 0


def needs_setup() -> bool:
    return not (os.getenv("KWORK_BOT_TOKEN") and os.getenv("ANTHROPIC_API_KEY"))
