#!/usr/bin/env python3
"""Автопубликация постов в Threads через официальный Threads API (graph.threads.net).

Очередь — threads/queue.json: [{"id", "at": "2026-10-09T11:05:00+03:00", "text", "status": "queued"}].
Ключ — переменная окружения THREADS_ACCESS_TOKEN (секрет окружения; в репозиторий и в чат не попадает, в лог не печатается).

  python3 tools/threads_publish.py --check        проверка ключа (аккаунт, лимит публикаций, продление ключа) — ничего не публикует
  python3 tools/threads_publish.py --due          опубликовать ОДИН самый ранний пост, время которого пришло
  python3 tools/threads_publish.py --due --dry    то же без публикации (проверка очереди и текста)
  python3 tools/threads_publish.py --lint         проверить очередь: ≤ 500 символов, без ссылок

Правила (threads/README.md): без ссылок и без призывов оформить продукт конкретного банка — закон о рекламе на ресурсах Meta в РФ.
"""
import datetime as dt, json, os, re, sys, time, urllib.parse, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
QUEUE = os.path.join(ROOT, "threads", "queue.json")
API = "https://graph.threads.net/v1.0"
LINK = re.compile(r"https?://|www\.|t\.me/|\b[\w-]+\.(ru|com|net|org|me|io|рф)\b", re.I)


def token():
    t = os.environ.get("THREADS_ACCESS_TOKEN", "").strip()
    if not t: sys.exit("Нет THREADS_ACCESS_TOKEN в окружении — публикация пропущена (см. threads/API_SETUP.md).")
    return t


def call(method, path, **params):
    params["access_token"] = token()
    data = urllib.parse.urlencode(params).encode()
    url = f"{API}/{path}" if not path.startswith("http") else path
    req = urllib.request.Request(url + ("?" + data.decode() if method == "GET" else ""), data=None if method == "GET" else data, method=method)
    try:
        with urllib.request.urlopen(req, timeout=60) as r: return json.load(r)
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")
        raise RuntimeError(f"{method} {path}: HTTP {e.code} {body[:300]}") from None


def load():
    return json.load(open(QUEUE)) if os.path.exists(QUEUE) else []


def save(q):
    json.dump(q, open(QUEUE, "w"), ensure_ascii=False, indent=1)


def problems(p):
    out = []
    if len(p["text"]) > 500: out.append(f"{len(p['text'])} символов (> 500)")
    if LINK.search(p["text"]): out.append("есть ссылка")
    if not p["text"].strip(): out.append("пустой текст")
    return out


def lint():
    bad = 0
    for p in load():
        if p.get("status") != "queued": continue
        pr = problems(p)
        if pr: bad += 1; print(f"✗ {p['id']} ({p['at']}): {', '.join(pr)}")
    print("очередь в порядке" if not bad else f"проблемных постов: {bad}")
    return bad


def check():
    me = call("GET", "me", fields="id,username")
    print(f"аккаунт: @{me.get('username')} (id {me.get('id')})")
    lim = call("GET", "me/threads_publishing_limit", fields="quota_usage,config")
    d = (lim.get("data") or [{}])[0]
    print(f"публикаций за 24 ч: {d.get('quota_usage')} из {d.get('config', {}).get('quota_total')}")
    # продление ключа: возможно, когда ключу ≥ 24 ч; новый срок — 60 дней
    try:
        r = call("GET", "https://graph.threads.net/refresh_access_token", grant_type="th_refresh_token")
        days = int(r.get("expires_in", 0)) // 86400
        same = r.get("access_token") == token()
        print(f"ключ продлён: действует ещё {days} дн." + ("" if same else
              " ВНИМАНИЕ: Meta выдала новый ключ — старый перестанет работать в свой срок; обнови секрет THREADS_ACCESS_TOKEN (threads/API_SETUP.md, шаг 6)."))
    except RuntimeError as e:
        print(f"продлить ключ сейчас нельзя (бывает, если ключу < 24 ч): {str(e)[:160]}")


def due(dry=False):
    q, now = load(), dt.datetime.now(dt.timezone.utc)
    ready = sorted([p for p in q if p.get("status") == "queued" and dt.datetime.fromisoformat(p["at"]) <= now], key=lambda p: p["at"])
    if not ready: print("нечего публиковать: время постов ещё не пришло"); return
    p = ready[0]
    pr = problems(p)
    if pr:
        p["status"], p["error"] = "rejected", "; ".join(pr); save(q); print(f"✗ {p['id']} отклонён: {p['error']}"); return
    print(f"→ {p['id']} ({p['at']}): {p['text'][:80]}…")
    if dry: print("dry: не публикую"); return
    c = call("POST", "me/threads", media_type="TEXT", text=p["text"])
    time.sleep(3)
    r = call("POST", "me/threads_publish", creation_id=c["id"])
    link = call("GET", r["id"], fields="permalink").get("permalink")
    p.update(status="published", post_id=r["id"], permalink=link, published_at=now.isoformat(timespec="seconds"))
    save(q); print(f"✓ опубликовано: {link}")
    left = sum(1 for x in q if x.get("status") == "queued")
    print(f"в очереди осталось: {left}")


if __name__ == "__main__":
    a = sys.argv[1:]
    if "--lint" in a: sys.exit(1 if lint() else 0)
    if "--check" in a: check()
    elif "--due" in a: due(dry="--dry" in a)
    else: print(__doc__)
