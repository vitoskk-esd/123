"""Клиенты площадок: публикация в каналы и обмен сообщениями для бота.

Telegram — Bot API; MAX — Bot API (platform-api2.max.ru); VK — API ВКонтакте
(стена сообщества — ключ пользователя, сообщения сообщества — ключ сообщества).
"""

from __future__ import annotations

import json
import random
import time
from dataclasses import dataclass, field

from . import net
from .config import CONFIG


@dataclass
class Button:
    text: str
    url: str | None = None
    data: str | None = None   # команда для бота (≤ 60 байт)


@dataclass
class Incoming:
    platform: str
    user_id: str
    text: str = ""
    data: str | None = None   # нажатая кнопка
    callback_id: str | None = None


@dataclass
class Outgoing:
    text: str
    buttons: list[list[Button]] = field(default_factory=list)


# --- Telegram ----------------------------------------------------------------

class Telegram:
    platform = "telegram"

    def __init__(self, token: str):
        self.base = f"https://api.telegram.org/bot{token}/"
        self.offset = 0

    def call(self, method: str, http_timeout: float = 40, **params):
        res = net.request("POST", self.base + method, json_body=params, timeout=http_timeout)
        if not res.get("ok"):
            raise RuntimeError(f"Telegram {method}: {res}")
        return res["result"]

    @staticmethod
    def _markup(buttons: list[list[Button]]) -> dict | None:
        if not buttons:
            return None
        rows = [[{"text": b.text, "url": b.url} if b.url else {"text": b.text, "callback_data": b.data}
                 for b in row] for row in buttons]
        return {"inline_keyboard": rows}

    def send(self, chat_id: str, msg: Outgoing) -> str:
        params = {"chat_id": chat_id, "text": msg.text, "link_preview_options": {"is_disabled": True}}
        markup = self._markup(msg.buttons)
        if markup:
            params["reply_markup"] = markup
        return str(self.call("sendMessage", **params)["message_id"])

    def poll(self) -> list[Incoming]:
        updates = self.call("getUpdates", http_timeout=40, offset=self.offset, timeout=25,
                            allowed_updates=["message", "callback_query"])
        out = []
        for u in updates:
            self.offset = max(self.offset, u["update_id"] + 1)
            if "message" in u:
                m = u["message"]
                if m.get("chat", {}).get("type") != "private" or "text" not in m:
                    continue
                out.append(Incoming("telegram", str(m["chat"]["id"]), text=m["text"]))
            elif "callback_query" in u:
                q = u["callback_query"]
                out.append(Incoming("telegram", str(q["from"]["id"]), data=q.get("data"), callback_id=q["id"]))
        return out

    def ack(self, inc: Incoming) -> None:
        if inc.callback_id:
            self.call("answerCallbackQuery", callback_query_id=inc.callback_id)


# --- MAX ---------------------------------------------------------------------

class Max:
    platform = "max"

    def __init__(self, token: str, base: str):
        self.base = base
        self.headers = {"Authorization": token}
        self.marker: int | None = None

    def call(self, method: str, path: str, *, params: dict | None = None, body=None, timeout: float = 40):
        return net.request(method, self.base + path, params=params, json_body=body,
                           headers=self.headers, timeout=timeout)

    @staticmethod
    def _attachments(buttons: list[list[Button]]) -> list[dict]:
        if not buttons:
            return []
        rows = [[{"type": "link", "text": b.text, "url": b.url} if b.url
                 else {"type": "callback", "text": b.text, "payload": b.data} for b in row] for row in buttons]
        return [{"type": "inline_keyboard", "payload": {"buttons": rows}}]

    def _send(self, params: dict, msg: Outgoing) -> str:
        body = {"text": msg.text, "attachments": self._attachments(msg.buttons)}
        res = self.call("POST", "/messages", params={**params, "disable_link_preview": "true"}, body=body)
        return str(res.get("message", {}).get("body", {}).get("mid", ""))

    def send(self, user_id: str, msg: Outgoing) -> str:
        return self._send({"user_id": user_id}, msg)

    def post_channel(self, chat_id: str, msg: Outgoing) -> str:
        return self._send({"chat_id": chat_id}, msg)

    def poll(self) -> list[Incoming]:
        params = {"timeout": 25, "types": "message_created,message_callback,bot_started"}
        if self.marker is not None:
            params["marker"] = self.marker
        res = self.call("GET", "/updates", params=params, timeout=40)
        self.marker = res.get("marker", self.marker)
        out = []
        for u in res.get("updates", []):
            kind = u.get("update_type")
            if kind == "message_created":
                m = u.get("message", {})
                if m.get("recipient", {}).get("chat_type", "dialog") != "dialog":
                    continue
                uid = m.get("sender", {}).get("user_id")
                if uid:
                    out.append(Incoming("max", str(uid), text=m.get("body", {}).get("text") or ""))
            elif kind == "message_callback":
                cb = u.get("callback", {})
                uid = cb.get("user", {}).get("user_id")
                if uid:
                    out.append(Incoming("max", str(uid), data=cb.get("payload"), callback_id=cb.get("callback_id")))
            elif kind == "bot_started":
                uid = u.get("user", {}).get("user_id")
                if uid:
                    out.append(Incoming("max", str(uid), data="start"))
        return out

    def ack(self, inc: Incoming) -> None:
        if inc.callback_id:
            self.call("POST", "/answers", params={"callback_id": inc.callback_id}, body={"notification": "✓"})


# --- VK ----------------------------------------------------------------------

class VK:
    platform = "vk"
    API = "https://api.vk.com/method/"

    def __init__(self, group_token: str, group_id: str, user_token: str = "", version: str = "5.199"):
        self.group_token, self.user_token = group_token, user_token
        self.group_id, self.v = group_id, version
        self.lp: dict | None = None

    def call(self, method: str, token: str, **params):
        res = net.request("POST", self.API + method, form={**params, "access_token": token, "v": self.v})
        if "error" in res:
            raise RuntimeError(f"VK {method}: {res['error'].get('error_msg')}")
        return res["response"]

    @staticmethod
    def _keyboard(buttons: list[list[Button]]) -> str | None:
        if not buttons:
            return None
        rows = []
        for row in buttons:
            rows.append([
                {"action": {"type": "open_link", "link": b.url, "label": b.text[:40]}} if b.url
                else {"action": {"type": "text", "label": b.text[:40], "payload": json.dumps({"d": b.data})}}
                for b in row])
        return json.dumps({"inline": True, "buttons": rows[:6]}, ensure_ascii=False)

    def send(self, peer_id: str, msg: Outgoing) -> str:
        params = {"peer_id": peer_id, "message": msg.text, "random_id": random.randint(1, 2**31 - 1),
                  "dont_parse_links": 1}
        kb = self._keyboard(msg.buttons)
        if kb:
            params["keyboard"] = kb
        return str(self.call("messages.send", self.group_token, **params))

    def post_wall(self, text: str) -> str:
        res = self.call("wall.post", self.user_token, owner_id=f"-{self.group_id}", from_group=1, message=text)
        return str(res.get("post_id", ""))

    def poll(self) -> list[Incoming]:
        if not self.lp:
            self.lp = self.call("groups.getLongPollServer", self.group_token, group_id=self.group_id)
        res = net.request("GET", self.lp["server"], params={"act": "a_check", "key": self.lp["key"],
                                                            "ts": self.lp["ts"], "wait": 25}, timeout=40)
        if "failed" in res:
            if res["failed"] == 1:
                self.lp["ts"] = res["ts"]
            else:
                self.lp = None
            return []
        self.lp["ts"] = res["ts"]
        out = []
        for u in res.get("updates", []):
            if u.get("type") != "message_new":
                continue
            m = u["object"]["message"]
            if m.get("peer_id") != m.get("from_id"):   # только личные сообщения
                continue
            data = None
            if m.get("payload"):
                try:
                    payload = json.loads(m["payload"])
                    data = payload.get("d") or ("start" if payload.get("command") == "start" else None)
                except (ValueError, AttributeError):
                    pass
            out.append(Incoming("vk", str(m["from_id"]), text="" if data else m.get("text", ""), data=data))
        return out

    def ack(self, inc: Incoming) -> None:
        pass


def bot_transports() -> list:
    """Боты, для которых заданы ключи и которые включены в BANK_BOTS."""
    out = []
    if "telegram" in CONFIG.bots and CONFIG.telegram_bot_token:
        out.append(Telegram(CONFIG.telegram_bot_token))
    if "max" in CONFIG.bots and CONFIG.max_bot_token:
        out.append(Max(CONFIG.max_bot_token, CONFIG.max_api_base))
    if "vk" in CONFIG.bots and CONFIG.vk_group_token and CONFIG.vk_group_id:
        out.append(VK(CONFIG.vk_group_token, CONFIG.vk_group_id, CONFIG.vk_user_token, CONFIG.vk_api_version))
    return out


def with_retries(fn, attempts: int = 3, delay: float = 2.0):
    for i in range(attempts):
        try:
            return fn()
        except (net.HttpError, OSError) as e:
            if i == attempts - 1:
                raise
            if isinstance(e, net.HttpError) and e.status < 500 and e.status != 429:
                raise
            time.sleep(delay * (2 ** i))
