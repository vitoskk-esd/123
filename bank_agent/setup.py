"""Мастер настройки: спрашивает ключи, проверяет их на площадках и записывает .env.

    python -m bank_agent setup

Каждый вопрос можно пропустить (Enter) — тогда останется прежнее значение.
"""

from __future__ import annotations

import os
import secrets

from . import net
from .config import ROOT

ENV = ROOT / ".env"

QUESTIONS = [
    ("ANTHROPIC_API_KEY", "Ключ Anthropic API (sk-ant-…)"),
    ("BANK_TRACKER_URL", "Адрес счётчика переходов, например https://go.example.ru (пусто — без счётчика)"),
    ("BANK_OWNER_NAME", "Как бот вас называет (имя или ник, можно пусто)"),
    ("TELEGRAM_BOT_TOKEN", "Telegram: токен бота от @BotFather"),
    ("TELEGRAM_CHANNEL", "Telegram: адрес канала, например @my_channel (бот должен быть админом)"),
    ("MAX_BOT_TOKEN", "MAX: токен бота"),
    ("MAX_CHANNEL_ID", "MAX: id канала (бот должен быть админом)"),
    ("VK_GROUP_ID", "VK: id сообщества — число без минуса"),
    ("VK_GROUP_TOKEN", "VK: ключ доступа сообщества (сообщения)"),
    ("VK_USER_TOKEN", "VK: ключ администратора с правами wall,groups,offline (для постов)"),
    ("BANK_ADMIN_TELEGRAM", "Ваш id в Telegram (напишите боту /id)"),
    ("BANK_ADMIN_MAX", "Ваш id в MAX (напишите боту /id)"),
    ("BANK_ADMIN_VK", "Ваш id в VK (напишите сообществу /id)"),
]


def read_env() -> dict[str, str]:
    out = {}
    if ENV.exists():
        for line in ENV.read_text(encoding="utf-8").splitlines():
            if "=" in line and not line.lstrip().startswith("#"):
                k, v = line.split("=", 1)
                out[k.strip()] = v.strip()
    return out


def write_env(values: dict[str, str]) -> None:
    """Обновляет ключи в .env, сохраняя остальные строки и комментарии."""
    lines = ENV.read_text(encoding="utf-8").splitlines() if ENV.exists() else []
    done = set()
    for i, line in enumerate(lines):
        if "=" in line and not line.lstrip().startswith("#"):
            k = line.split("=", 1)[0].strip()
            if k in values:
                lines[i] = f"{k}={values[k]}"
                done.add(k)
    lines += [f"{k}={v}" for k, v in values.items() if k not in done]
    ENV.write_text("\n".join(lines) + "\n", encoding="utf-8")
    os.chmod(ENV, 0o600)


def verify(env: dict[str, str]) -> list[str]:
    """Проверка ключей на площадках. Возвращает строки отчёта."""
    report = []

    def ok(name, fn):
        try:
            report.append(f"✓ {name}: {fn()}")
        except Exception as e:  # noqa: BLE001
            report.append(f"✗ {name}: {type(e).__name__}: {str(e)[:200]}")

    if env.get("TELEGRAM_BOT_TOKEN"):
        base = f"https://api.telegram.org/bot{env['TELEGRAM_BOT_TOKEN']}/"
        me = {}

        def tg_me():
            me.update(net.request("POST", base + "getMe", json_body={})["result"])
            return "бот @" + me["username"]
        ok("Telegram-бот", tg_me)
        if env.get("TELEGRAM_CHANNEL") and me:
            ok("Telegram-канал", lambda: net.request("POST", base + "getChatMember", json_body={
                "chat_id": env["TELEGRAM_CHANNEL"], "user_id": me["id"]})["result"]["status"]
                + " (нужен administrator)")
    if env.get("MAX_BOT_TOKEN"):
        base = os.getenv("MAX_API_BASE", "https://platform-api2.max.ru")
        ok("MAX-бот", lambda: "бот " + str(net.request("GET", base + "/me",
                                                        headers={"Authorization": env["MAX_BOT_TOKEN"]}).get("name")))
    if env.get("VK_GROUP_TOKEN") and env.get("VK_GROUP_ID"):
        def vk(token, method, **params):
            res = net.request("POST", "https://api.vk.com/method/" + method,
                              form={**params, "access_token": token, "v": "5.199"})
            if "error" in res:
                raise RuntimeError(res["error"].get("error_msg"))
            return res["response"]
        ok("VK-сообщество", lambda: vk(env["VK_GROUP_TOKEN"], "groups.getLongPollServer",
                                       group_id=env["VK_GROUP_ID"]) and "бот может получать сообщения")
        if env.get("VK_USER_TOKEN"):
            ok("VK-ключ для постов", lambda: "права администратора: " + str(bool(vk(
                env["VK_USER_TOKEN"], "groups.getById", group_id=env["VK_GROUP_ID"], fields="is_admin")
                .get("groups", [{}])[0].get("is_admin"))))
    return report


def run_setup(ask=input) -> int:
    env = read_env()
    print("Настройка агента. Enter — оставить как есть.\n")
    updates: dict[str, str] = {}
    for key, question in QUESTIONS:
        current = env.get(key, "")
        shown = (current[:6] + "…") if current and ("TOKEN" in key or "KEY" in key) else current
        answer = ask(f"{question}\n  [{shown or 'пусто'}] > ").strip()
        if answer:
            updates[key] = answer.rstrip("/") if key == "BANK_TRACKER_URL" else answer
    if env.get("BANK_SALT", "change-me") in ("", "change-me"):
        updates["BANK_SALT"] = secrets.token_hex(16)
    env.setdefault("BANK_DRY_RUN", "1")
    updates.setdefault("BANK_DRY_RUN", env["BANK_DRY_RUN"])
    write_env(updates)
    print(f"\nСохранено в {ENV}.\n\nПроверяю ключи на площадках:")
    for line in verify({**env, **updates}) or ["(ключи площадок не заданы)"]:
        print("  " + line)
    print("\nРежим проверки BANK_DRY_RUN=1: агент готовит посты, но не публикует. Когда посмотрите первые посты, "
          "поставьте BANK_DRY_RUN=0 в .env и перезапустите: systemctl restart bank-agent")
    return 0
