#!/usr/bin/env python3
"""Отправить файл владельцу в Телеграм через его бота (владелец 19.10: «отправь рилс файлом в телеграм»).
Токен — переменная окружения TELEGRAM_BOT_TOKEN (настройки облачного окружения → Environment variables; видна в новых сессиях).
Скрипт токен не печатает. Чат — из последнего сообщения боту (владелец пишет боту /start), сохраняется в tools/.tg_chat (gitignore).
  python3 tools/tg_send.py <файл> ["подпись"]    # mp4 — как видео (до 50 МБ), остальное — как документ
"""
import json, os, sys, urllib.request, uuid

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); CHAT_F = os.path.join(ROOT, "tools", ".tg_chat")
TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN") or sys.exit("нет TELEGRAM_BOT_TOKEN в окружении — нужна новая сессия после добавления переменной")
API = f"https://api.telegram.org/bot{TOKEN}"


def call(method, data=None, files=None):
    if files:
        b = uuid.uuid4().hex; body = b""
        for k, v in (data or {}).items(): body += f"--{b}\r\nContent-Disposition: form-data; name=\"{k}\"\r\n\r\n{v}\r\n".encode()
        for k, path in files.items():
            body += (f"--{b}\r\nContent-Disposition: form-data; name=\"{k}\"; filename=\"{os.path.basename(path)}\"\r\n"
                     f"Content-Type: application/octet-stream\r\n\r\n").encode() + open(path, "rb").read() + b"\r\n"
        body += f"--{b}--\r\n".encode(); req = urllib.request.Request(f"{API}/{method}", body, {"Content-Type": f"multipart/form-data; boundary={b}"})
    else:
        req = urllib.request.Request(f"{API}/{method}", json.dumps(data or {}).encode(), {"Content-Type": "application/json"})
    try: return json.load(urllib.request.urlopen(req, timeout=300))
    except urllib.error.HTTPError as e: sys.exit(f"Telegram: {method} → {e.code} {e.read().decode()[:200]}")


def chat_id():
    if os.path.exists(CHAT_F): return open(CHAT_F).read().strip()
    ups = call("getUpdates").get("result", [])
    ids = [u["message"]["chat"]["id"] for u in ups if "message" in u]
    if not ids: sys.exit("бот ещё не получал сообщений — напишите ему /start")
    open(CHAT_F, "w").write(str(ids[-1])); return str(ids[-1])


if __name__ == "__main__":
    path = sys.argv[1]; cap = sys.argv[2] if len(sys.argv) > 2 else ""
    if os.path.getsize(path) > 50 * 1024 * 1024: sys.exit("файл больше 50 МБ — бот такой не отправит, нужна сжатая копия")
    kind = "video" if path.endswith(".mp4") else "document"
    r = call("sendVideo" if kind == "video" else "sendDocument", {"chat_id": chat_id(), "caption": cap, "supports_streaming": "true"}, {kind: path})
    print("отправлено" if r.get("ok") else f"не отправлено: {r}")
