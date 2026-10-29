"""Ссылки на каналы: «https://t.me/name», «@name», «t.me/+hash», «t.me/joinchat/hash»; сообщества ВК: «vk.com/name»,
«vk.com/club123», «vk.com/public123», ссылка на пост «vk.com/wall-123_45»."""
import re

USERNAME = re.compile(r"^[a-zA-Z][\w]{3,31}$")
VK = re.compile(r"^(?:https?://)?(?:m\.|www\.)?vk\.(?:com|ru)/([\w.-]+)/?(?:[?#](.*))?$", re.I)
VK_NOT_GROUP = re.compile(r"^(?:id\d+|feed|im|friends|groups|video|music|photos?|wall|search|apps|market|clips|audios?\d*)$", re.I)


def _vk(s: str) -> str | None:
    """Ссылка ВК → «club123» или короткое имя сообщества; страница человека, лента и т.п. — None."""
    m = VK.match(s)
    if not m:
        return None
    path, query = m.group(1).lower(), m.group(2) or ""
    w = re.search(r"wall-(\d+)_", path + " " + query)
    if w:
        return f"club{w.group(1)}"
    n = re.match(r"^(?:club|public|event)(\d+)$", path)
    if n:
        return f"club{n.group(1)}"
    if VK_NOT_GROUP.match(path) or not re.match(r"^[a-z0-9_.]{2,32}$", path):
        return None
    return path


def parse_link(s: str) -> tuple[str, str] | None:
    """('username', имя) | ('invite', хэш) | ('vk', сообщество) | None."""
    s = s.strip().rstrip("/")
    if re.match(r"^(?:https?://)?(?:m\.|www\.)?vk\.(?:com|ru)/", s, re.I):
        vk = _vk(s)
        return ("vk", vk) if vk else None
    m = re.match(r"^(?:https?://)?(?:t\.me|telegram\.me)/(?:\+|joinchat/)([\w-]{10,})$", s)
    if m:
        return "invite", m.group(1)
    m = re.match(r"^(?:https?://)?(?:t\.me|telegram\.me)/(?:s/)?([\w]+)(?:/\d+)?$", s) or re.match(r"^@?([\w]+)$", s)
    if m and USERNAME.match(m.group(1)):
        return "username", m.group(1).lower()
    return None


def label(kind: str, value: str) -> str:
    return f"@{value}" if kind == "username" else f"ВК · vk.com/{value}" if kind == "vk" else "закрытый канал"


def channel_name(ch) -> str:
    """Как показать источник людям: «Авто Москва», «@avto_msk», «ВК · Авто Москва»."""
    if ch["vk"]:
        return "ВК · " + (ch["title"] or f"vk.com/{ch['vk']}")
    return ch["title"] or (f"@{ch['username']}" if ch["username"] else "закрытый канал")
