# python kit/ydisk.py "<папка на Диске>" файл1.mp4 [файл2.mp4 …] — загрузка готовых роликов на Яндекс Диск владельца (владелец 12.11:
# «все видео, которые мы будем делать, клади в отдельные папки на Яндекс Диск самостоятельно»).
# Папка — внутри папки приложения (Диск → Приложения → ПЕРЕХВАТ), вложенные создаются сами: «Рилсы/2026-11-12 · ep50 Жизнь одной Эво».
# Токен (OAuth, доступ cloud_api:disk.app_folder) подставляет прокси окружения в запросы к cloud-api.yandex.net — в коде ключа нет.
# Сам файл уходит PUT-ом на адрес загрузчика, который выдаёт API (ссылка одноразовая, без токена) — curl с ограничением скорости:
# канал до загрузчика ~130 КБ/с, и если отдать файл быстрее, туннель прокси рвётся (12.11: 38 МБ рвались на 37-й секунде; с --limit-rate 200K — 201 за 5 мин).
import json, os, subprocess, sys, time, urllib.parse, urllib.request

API = "https://cloud-api.yandex.net/v1/disk/resources"


def call(method, url, data=None, headers=None):
    req = urllib.request.Request(url, data=data, method=method, headers=headers or {})
    try:
        with urllib.request.urlopen(req, timeout=600) as r:
            body = r.read()
            return r.status, (json.loads(body) if body[:1] in (b"{", b"[") else body)
    except urllib.error.HTTPError as e:
        body = e.read()
        return e.code, (json.loads(body) if body[:1] == b"{" else body)


def mkdirs(path):
    cur = "app:"
    for part in path.strip("/").split("/"):
        cur += "/" + part
        code, j = call("PUT", f"{API}?path={urllib.parse.quote(cur)}")
        if code not in (201, 409):            # 409 — папка уже есть
            raise SystemExit(f"не создал папку {cur}: {code} {j}")


def upload(folder, path, tries=4):
    dst = f"app:/{folder.strip('/')}/{os.path.basename(path)}"
    for k in range(tries):
        code, j = call("GET", f"{API}/upload?path={urllib.parse.quote(dst)}&overwrite=true")
        if code != 200:
            raise SystemExit(f"нет ссылки на загрузку {dst}: {code} {j}")
        r = subprocess.run(["curl", "-sS", "-m", "3600", "-T", path, "--limit-rate", os.environ.get("YD_RATE", "200K"), "-o", "/dev/null",
                            "-w", "%{http_code}", j["href"]], capture_output=True, text=True)
        code = int(r.stdout or 0)
        if code in (201, 202):
            return dst
        time.sleep(2 ** (k + 1))
    raise SystemExit(f"не загрузил {path}: {code}")


def share_link(folder):
    """Публичная ссылка на папку — чтобы открыть с телефона одним нажатием."""
    p = urllib.parse.quote(f"app:/{folder.strip('/')}")
    call("PUT", f"{API}/publish?path={p}")
    code, j = call("GET", f"{API}?path={p}&fields=public_url")
    return j.get("public_url") if code == 200 else None


def remove(path):
    call("DELETE", f"{API}?path={urllib.parse.quote('app:/' + path.strip('/'))}&permanently=true")


if __name__ == "__main__":
    folder, files = sys.argv[1], sys.argv[2:]
    mkdirs(folder)
    for f in files:
        mb = os.path.getsize(f) / 2 ** 20
        t = time.time(); dst = upload(folder, f)
        print(f"✓ {dst}  ({mb:.0f} МБ, {time.time() - t:.0f} с)")
    if os.environ.get("YD_SHARE") == "1":
        print("ссылка:", share_link(folder))
