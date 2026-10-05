"""Счётчик переходов: /go/<продукт>?s=<канал>&p=<пост>&u=<пользователь> → запись клика → редирект.

Без него агент не знает, какие каналы и посты приводят людей, и не может
перераспределять силы. Превью-боты мессенджеров (они открывают каждую ссылку)
не считаются кликами.
"""

from __future__ import annotations

import re
import threading
import urllib.parse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

from .db import DB, anon
from .products import Product, destination

_BOT_UA = re.compile(r"bot|crawler|spider|preview|vkshare|facebookexternalhit|whatsapp|"
                     r"telegram|slack|discord|curl|python-requests|headless", re.IGNORECASE)
_SAFE = re.compile(r"^[a-z0-9]{1,16}$")
_SAFE_ID = re.compile(r"^[A-Za-z0-9_-]{1,32}$")


def make_handler(db: DB, catalog_ref: dict):
    """catalog_ref["products"] — актуальный словарь продуктов (можно подменять на лету)."""

    class Handler(BaseHTTPRequestHandler):
        server_version = "go"

        def log_message(self, *args):  # тихий режим: клики пишем в базу, не в консоль
            pass

        def _send(self, code: int, body: str = "", location: str | None = None):
            self.send_response(code)
            if location:
                self.send_header("Location", location)
                self.send_header("Cache-Control", "no-store")
                self.send_header("Referrer-Policy", "no-referrer-when-downgrade")
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.end_headers()
            self.wfile.write(body.encode())

        def do_GET(self):  # noqa: N802
            self._route(count=True)

        def do_HEAD(self):  # noqa: N802 — HEAD шлют превью и проверялки ссылок: не клик
            self._route(count=False)

        def _route(self, count: bool):
            url = urllib.parse.urlsplit(self.path)
            if url.path == "/health":
                return self._send(200, "ok")
            m = re.fullmatch(r"/go/([A-Za-z0-9_.-]{1,64})", url.path)
            products: dict[str, Product] = catalog_ref["products"]
            product = products.get(m.group(1)) if m else None
            if not product or not product.active:
                return self._send(404, "not found")
            q = dict(urllib.parse.parse_qsl(url.query))
            source = q.get("s", "direct")
            source = source if _SAFE.match(source) else "other"
            post_id = q.get("p") if _SAFE_ID.match(q.get("p", "")) else None
            user = q.get("u") if _SAFE_ID.match(q.get("u", "")) else None
            ua = self.headers.get("User-Agent", "")
            if count and not _BOT_UA.search(ua):
                ip = self.headers.get("X-Forwarded-For", self.client_address[0]).split(",")[0].strip()
                db.add_click(product.id, source, post_id, user, anon(ip))
            return self._send(302, location=destination(product, source, post_id))

    return Handler


def start(db: DB, catalog_ref: dict, host: str, port: int) -> ThreadingHTTPServer:
    server = ThreadingHTTPServer((host, port), make_handler(db, catalog_ref))
    threading.Thread(target=server.serve_forever, daemon=True, name="tracker").start()
    return server
