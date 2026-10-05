"""Страница с QR-кодом для входа в Telegram прямо в браузере.

Включается переменной TG_LOGIN_PORT (например 80): пока бот не вошёл в аккаунт,
по адресу сервера открывается страница с актуальным QR-кодом. После входа
страница сообщает об успехе и через пару минут выключается.
"""

from __future__ import annotations

import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

PAGE = """<!doctype html><html lang="ru"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
{refresh}<title>Вход в Telegram</title>
<style>body{{font-family:sans-serif;background:#f4f4f4;color:#222;text-align:center;padding:24px}}
.qr{{display:inline-block;background:#fff;padding:24px;border-radius:12px}}
.qr svg{{width:300px;height:300px}}</style></head><body>{body}</body></html>"""

WAITING = """<h2>Вход в Telegram</h2>
<p>На телефоне: Telegram → Настройки → Устройства → <b>Подключить устройство</b>,<br>
наведите камеру на код.</p><div class="qr">{svg}</div>
<p>Код обновляется сам каждые несколько секунд.</p>"""

DONE = "<h2>✅ Вход выполнен</h2><p>Бот работает. Эту страницу можно закрыть.</p>"


def qr_svg(data: str) -> str:
    import qrcode
    import qrcode.image.svg

    svg = qrcode.make(data, image_factory=qrcode.image.svg.SvgPathImage, border=1).to_string().decode()
    return svg[svg.find("<svg") :]


class LoginPage:
    def __init__(self, port: int) -> None:
        self.svg = ""
        self.done = False
        page = self

        class Handler(BaseHTTPRequestHandler):
            def do_GET(self):  # noqa: N802
                body = page.render().encode()
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Cache-Control", "no-store")
                self.end_headers()
                self.wfile.write(body)

            def log_message(self, *args):
                pass

        self.server = ThreadingHTTPServer(("0.0.0.0", port), Handler)
        threading.Thread(target=self.server.serve_forever, daemon=True).start()

    def render(self) -> str:
        if self.done:
            return PAGE.format(refresh="", body=DONE)
        return PAGE.format(refresh='<meta http-equiv="refresh" content="5">', body=WAITING.format(svg=self.svg))

    def show(self, url: str) -> None:
        self.svg = qr_svg(url)

    def finish(self) -> None:
        self.done = True
        threading.Timer(180, self.close).start()

    def close(self) -> None:
        self.server.shutdown()
        self.server.server_close()
