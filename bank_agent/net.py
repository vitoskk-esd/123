"""HTTP-запросы с JSON на стандартной библиотеке — без лишних зависимостей."""

from __future__ import annotations

import json
import urllib.error
import urllib.parse
import urllib.request
from typing import Any


class HttpError(RuntimeError):
    def __init__(self, status: int, body: str):
        super().__init__(f"HTTP {status}: {body[:300]}")
        self.status = status


def request(method: str, url: str, *, params: dict | None = None, json_body: Any = None,
            form: dict | None = None, headers: dict | None = None, timeout: float = 40) -> Any:
    if params:
        url += ("&" if "?" in url else "?") + urllib.parse.urlencode(params)
    hdrs = {"Accept": "application/json", "User-Agent": "bank-agent/1.0", **(headers or {})}
    data = None
    if json_body is not None:
        data = json.dumps(json_body, ensure_ascii=False).encode()
        hdrs["Content-Type"] = "application/json"
    elif form is not None:
        data = urllib.parse.urlencode(form).encode()
        hdrs["Content-Type"] = "application/x-www-form-urlencoded"
    req = urllib.request.Request(url, data=data, method=method, headers=hdrs)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            raw = resp.read()
    except urllib.error.HTTPError as e:
        raise HttpError(e.code, e.read().decode(errors="replace")) from e
    return json.loads(raw) if raw else {}
