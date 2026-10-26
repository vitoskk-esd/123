"""Ссылки на каналы: «https://t.me/name», «@name», «t.me/+hash», «t.me/joinchat/hash»."""
import re

USERNAME = re.compile(r"^[a-zA-Z][\w]{3,31}$")


def parse_link(s: str) -> tuple[str, str] | None:
    """('username', имя) | ('invite', хэш) | None."""
    s = s.strip().rstrip("/")
    m = re.match(r"^(?:https?://)?(?:t\.me|telegram\.me)/(?:\+|joinchat/)([\w-]{10,})$", s)
    if m:
        return "invite", m.group(1)
    m = re.match(r"^(?:https?://)?(?:t\.me|telegram\.me)/(?:s/)?([\w]+)(?:/\d+)?$", s) or re.match(r"^@?([\w]+)$", s)
    if m and USERNAME.match(m.group(1)):
        return "username", m.group(1).lower()
    return None


def label(kind: str, value: str) -> str:
    return f"@{value}" if kind == "username" else "закрытый канал"
