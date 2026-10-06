"""Публикация в Instagram через официальный API (профессиональный аккаунт: бизнес или автор).

Instagram не принимает файлы напрямую — он сам скачивает фото по публичной ссылке,
поэтому сначала фото выкладываются на хостинг (imgbb или ваш веб-сервер).
"""

from __future__ import annotations

import base64
import datetime as dt
import hashlib
import shutil
import time
from pathlib import Path

import requests

from . import storage
from .config import CONFIG

CAROUSEL_MAX = 10
TOKEN_REFRESH_DAYS = 7


class InstagramError(RuntimeError):
    pass


# --- Хостинг фото -----------------------------------------------------------------

class ImgbbUploader:
    """Бесплатный хостинг imgbb.com. Фото удаляются с хостинга через сутки."""

    def __init__(self, key: str | None = None, expiration: int = 86400):
        self.key = key or CONFIG.imgbb_key
        self.expiration = expiration
        if not self.key:
            raise InstagramError("для Instagram нужен IMGBB_API_KEY (или IMAGE_HOST=local)")

    def upload(self, path: Path) -> str:
        r = requests.post(
            "https://api.imgbb.com/1/upload",
            data={
                "key": self.key,
                "expiration": self.expiration,
                "image": base64.b64encode(path.read_bytes()).decode(),
                "name": path.stem,
            },
            timeout=120,
        )
        r.raise_for_status()
        return r.json()["data"]["url"]


class LocalDirUploader:
    """Копирует фото в папку, которую раздаёт ваш веб-сервер (nginx и т.п.)."""

    def __init__(self, directory: str | None = None, base_url: str | None = None):
        self.dir = Path(directory or CONFIG.public_image_dir)
        self.base_url = (base_url or CONFIG.public_image_base_url).rstrip("/")
        if not (str(self.dir) and self.base_url):
            raise InstagramError("для IMAGE_HOST=local нужны PUBLIC_IMAGE_DIR и PUBLIC_IMAGE_BASE_URL")

    def upload(self, path: Path) -> str:
        self.dir.mkdir(parents=True, exist_ok=True)
        name = hashlib.sha1(path.read_bytes()).hexdigest()[:16] + ".jpg"
        shutil.copyfile(path, self.dir / name)
        return f"{self.base_url}/{name}"


def make_uploader():
    return LocalDirUploader() if CONFIG.image_host == "local" else ImgbbUploader()


# --- Токен ------------------------------------------------------------------------

def _fingerprint(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()[:16]


def current_token() -> str:
    """Токен из настроек или его продлённая версия (долгий токен живёт 60 дней).

    Продление работает для входа через Instagram (graph.instagram.com). Продлённый токен
    хранится в data/fashion_bot/instagram_token.json (этот файл не попадает в git).
    Если вы поменяли INSTAGRAM_ACCESS_TOKEN в настройках — берётся новый.
    """
    env_token = CONFIG.instagram_token
    state = storage.load_json("instagram_token.json", {})
    if state.get("env") != _fingerprint(env_token):
        state = {"env": _fingerprint(env_token), "token": env_token, "refreshed": None}
    token = state["token"]
    if CONFIG.instagram_host != "graph.instagram.com":
        return token
    last = state.get("refreshed")
    if last and storage.now() - dt.datetime.fromisoformat(last) < dt.timedelta(days=TOKEN_REFRESH_DAYS):
        return token
    try:
        r = requests.get(
            "https://graph.instagram.com/refresh_access_token",
            params={"grant_type": "ig_refresh_token", "access_token": token},
            timeout=30,
        )
        r.raise_for_status()
        state.update(token=r.json()["access_token"], refreshed=storage.now().isoformat(timespec="seconds"))
        storage.save_json("instagram_token.json", state)
        storage.log("Токен Instagram продлён ещё на 60 дней")
    except Exception as e:  # noqa: BLE001 — старый токен ещё может работать
        storage.log(f"Не удалось продлить токен Instagram: {e}")
    return state["token"]


# --- API --------------------------------------------------------------------------

class Instagram:
    def __init__(self, user_id: str | None = None, token: str | None = None, uploader=None):
        self.user_id = user_id or CONFIG.instagram_user_id
        self.token = token or current_token()
        self.base = f"https://{CONFIG.instagram_host}/{CONFIG.instagram_api_version}"
        self.uploader = uploader or make_uploader()

    def _request(self, method: str, path: str, **params) -> dict:
        params["access_token"] = self.token
        if method == "GET":
            r = requests.get(f"{self.base}/{path}", params=params, timeout=60)
        else:
            r = requests.post(f"{self.base}/{path}", data=params, timeout=120)
        try:
            payload = r.json()
        except ValueError:
            payload = {"error": {"message": f"HTTP {r.status_code}"}}
        if "error" in payload:
            raise InstagramError(f"{path}: {payload['error'].get('message')}")
        return payload

    def _wait_ready(self, container_id: str, timeout: int = 120) -> None:
        deadline = time.monotonic() + timeout
        while True:
            status = self._request("GET", container_id, fields="status_code").get("status_code")
            if status in ("FINISHED", "PUBLISHED", None):
                return
            if status in ("ERROR", "EXPIRED"):
                raise InstagramError(f"контейнер {container_id}: {status}")
            if time.monotonic() > deadline:
                raise InstagramError(f"контейнер {container_id} не обработан за {timeout} с")
            time.sleep(3)

    def publish(self, images: list[Path], caption: str) -> str:
        """Публикует фото или карусель, возвращает id поста."""
        urls = [self.uploader.upload(p) for p in images[:CAROUSEL_MAX]]
        if len(urls) == 1:
            container = self._request("POST", f"{self.user_id}/media", image_url=urls[0], caption=caption)["id"]
        else:
            children = []
            for url in urls:
                child = self._request("POST", f"{self.user_id}/media", image_url=url, is_carousel_item="true")["id"]
                self._wait_ready(child)
                children.append(child)
            container = self._request(
                "POST", f"{self.user_id}/media",
                media_type="CAROUSEL", children=",".join(children), caption=caption,
            )["id"]
        self._wait_ready(container)
        return self._request("POST", f"{self.user_id}/media_publish", creation_id=container)["id"]

    def whoami(self) -> dict:
        return self._request("GET", self.user_id, fields="username")


class InstagramPublisher:
    name = "instagram"

    def __init__(self, ig: Instagram | None = None):
        self.ig = ig or Instagram()

    def publish(self, post) -> dict:
        return {"media_id": self.ig.publish(post.ig_images, post.instagram_caption)}
