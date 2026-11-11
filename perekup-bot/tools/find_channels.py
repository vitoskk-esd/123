"""Поиск Telegram-каналов с продажей Б/У машин по России (владелец 11.11): ≥3000 подписчиков, ≥5 постов за 7 дней, объявления — б/у,
не импорт «под заказ». Без Telegram-аккаунта: только открытые страницы t.me/s/<канал> (подписчики, последние ~20 постов с датами).

    python tools/find_channels.py [out_dir] [--seeds seeds.txt] [--limit 800]

Где берём кандидатов: (1) ники по шаблонам «avtorynok_<город>», «<город>_avto»… для городов из cars.yaml; (2) «снежный ком» — каналы,
на которые ссылаются уже найденные авто-каналы (@ники и t.me/ссылки в постах); (3) свой список ников (--seeds).
Проверка — тем же разбором, что у бота (parse_post): доля постов «машина + цена», доля импорта («из Кореи», «под заказ», «растаможка»…),
доля новых (пробег 0). Результат: channels.csv / channels.xlsx (подходящие) и rejected.csv (отсеянные — с причиной).
"""
import asyncio, csv, json, re, ssl, sys, time
from datetime import datetime, timezone, timedelta
from html import unescape
from pathlib import Path

import aiohttp
import yaml

ROOT = Path(__file__).resolve().parents[1]; sys.path.insert(0, str(ROOT))
from parse import parse_post                    # noqa: E402
from words import load_dictionary               # noqa: E402

OUT = Path(sys.argv[1]) if len(sys.argv) > 1 and not sys.argv[1].startswith("--") else Path("channels_out")
LIMIT = int(sys.argv[sys.argv.index("--limit") + 1]) if "--limit" in sys.argv else 800
SEEDS = Path(sys.argv[sys.argv.index("--seeds") + 1]) if "--seeds" in sys.argv else None
MIN_SUBS, MIN_WEEK = 3000, 5
D = load_dictionary(ROOT / "cars.yaml")
import finder                                   # noqa: E402 — те же правила, что у /tgfind и /vkfind в боте
TR = dict(zip("абвгдеёжзийклмнопрстуфхцчшщъыьэюя", ["a", "b", "v", "g", "d", "e", "e", "zh", "z", "i", "y", "k", "l", "m", "n", "o", "p", "r", "s", "t",
                                                   "u", "f", "h", "c", "ch", "sh", "sch", "", "y", "", "e", "yu", "ya"]))
TR2 = dict(TR, х="kh", ц="ts", й="i", щ="sh", я="ia", ю="iu")
USER = re.compile(r"^[a-z][a-z0-9_]{3,31}$")


def translit(s: str, tr=TR) -> str:
    return "".join(tr.get(ch, ch) for ch in s.lower() if ch in tr or ch.isalnum()).replace(" ", "")


def city_slugs() -> list[tuple[str, str]]:
    """[(ник-часть, регион)] — ключ региона (msk, spb, krd…) + транслит однословных алиасов городов."""
    regs = yaml.safe_load(open(ROOT / "cars.yaml", encoding="utf-8"))["regions"]
    out = {}
    for key, r in regs.items():
        out.setdefault(key, key)
        for a in r.get("aliases", []):
            if " " in a or "-" in a or len(a) < 4 or re.search(r"[a-z]", a) or "област" in a or "край" in a:
                continue
            for t in {translit(a), translit(a, TR2)}:
                if 3 <= len(t) <= 16:
                    out.setdefault(t, key)
    return list(out.items())


PRE = ["avto", "auto", "avtorynok", "autorynok", "avtorinok", "avtobazar", "autobazar", "avtoprodazha", "prodazha_avto", "prodam_avto", "avtobaraholka",
       "baraholka_avto", "bu_avto", "avto_bu", "cars", "perekup", "avtomobili", "avtovykup", "avtopoisk", "auto_market", "avto_market"]


def pattern_names() -> dict[str, str]:
    names = {}
    for c, reg in city_slugs():
        for p in PRE:
            for sep in ("_", ""):
                names.setdefault(f"{p}{sep}{c}", reg)
        for s in ("_avto", "avto", "_auto", "auto", "_cars", "_avtorynok", "_auto_market", "_bu_avto", "_prodazha_avto"):
            names.setdefault(f"{c}{s}", reg)
    return {n: r for n, r in names.items() if USER.match(n) and not n.endswith("_")}


def num(s: str) -> int:
    s = s.strip().replace(" ", "").upper()
    m = re.match(r"([\d.,]+)([KM]?)", s)
    if not m:
        return 0
    v = float(m.group(1).replace(",", "."))
    return int(v * (1000 if m.group(2) == "K" else 1_000_000 if m.group(2) == "M" else 1))


def strip(h: str) -> str:
    return unescape(re.sub(r"<br\s*/?>", "\n", re.sub(r"<(?!br)[^>]+>", " ", h))).strip()


def parse_page(html: str) -> dict | None:
    if "tgme_channel_info" not in html:
        return None
    title = re.search(r'class="tgme_channel_info_header_title"[^>]*>(?:<span[^>]*>)?(.*?)</', html, re.S)
    subs = re.search(r'counter_value">([^<]+)</span>\s*<span class="counter_type">(?:subscribers|подписчик)', html)
    desc = re.search(r'class="tgme_channel_info_description"[^>]*>(.*?)</div>', html, re.S)
    posts = []
    for m in re.finditer(r'<div class="tgme_widget_message_wrap.*?(?=<div class="tgme_widget_message_wrap|\Z)', html, re.S):
        block = m.group(0)
        t = re.search(r'<time datetime="([^"]+)"', block)
        tx = re.search(r'class="tgme_widget_message_text[^"]*"[^>]*>(.*?)</div>', block, re.S)
        if t:
            posts.append((datetime.fromisoformat(t.group(1)), strip(tx.group(1)) if tx else ""))
    refs = set(re.findall(r'(?:t\.me|telegram\.me)/([A-Za-z][A-Za-z0-9_]{4,31})(?=[/"?<\s]|$)', html)) | set(re.findall(r"@([A-Za-z][A-Za-z0-9_]{4,31})", html))
    return {"title": strip(title.group(1)) if title else "", "subs": num(subs.group(1)) if subs else 0,
            "desc": strip(desc.group(1)) if desc else "", "posts": posts, "refs": {r.lower() for r in refs}}


def judge(name: str, p: dict, region_hint: str | None) -> dict:
    j = finder.judge(p["posts"], D, title=p["title"], about=p["desc"], subs=p["subs"], min_subs=MIN_SUBS, min_week=MIN_WEEK)
    if j["ok"] and not finder.CAR_TITLE.search(f'{p["title"]} {p["desc"]} {name}'):
        j.update(ok=False, reason="не автомобильный канал")        # телефоны, техника: «цена» есть, машин нет
    if not j["region"]:
        reg = D.guess_region(p["title"], name) or region_hint
        j["region"] = D.regions.get(reg, reg) if reg else ""
    return dict(j, username=name, url=f"https://t.me/{name}", title=p["title"], checked=datetime.now(timezone.utc).strftime("%d.%m.%Y"))


async def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    state_f = OUT / "state.json"
    st = json.loads(state_f.read_text()) if state_f.exists() else {"seen": {}, "res": {}}
    queue: dict[str, str | None] = {}
    if SEEDS:
        for ln in SEEDS.read_text().split():
            n = re.sub(r"^(?:https?://)?(?:t\.me/|@)", "", ln.strip()).split("/")[0].lower()
            if USER.match(n): queue.setdefault(n, None)
    for n, r in sorted(pattern_names().items()):
        queue.setdefault(n, r)
    ctx = ssl.create_default_context(cafile="/root/.ccr/ca-bundle.crt")
    sem = asyncio.Semaphore(6)
    t0, good = time.time(), lambda: sum(1 for r in st["res"].values() if r["ok"])

    async with aiohttp.ClientSession(trust_env=True, headers={"User-Agent": "Mozilla/5.0 (channel-checker)", "Accept-Language": "ru"},
                                     timeout=aiohttp.ClientTimeout(total=30)) as s:
        async def check(n: str, hint):
            async with sem:
                for attempt in range(4):
                    try:
                        async with s.get(f"https://t.me/s/{n}", ssl=ctx, allow_redirects=False) as r:
                            if r.status == 429:
                                await asyncio.sleep(20 * (attempt + 1)); continue
                            html = await r.text() if r.status == 200 else ""
                        break
                    except Exception:
                        await asyncio.sleep(3)
                else:
                    html = ""
                await asyncio.sleep(.25)
            st["seen"][n] = 1
            p = parse_page(html) if html else None
            if not p or not p["posts"]:
                return
            j = judge(n, p, hint)
            st["res"][n] = j
            if j["car_share"] >= .3:                              # снежный ком — только от авто-каналов
                for ref in p["refs"]:
                    if ref not in st["seen"] and ref not in queue and USER.match(ref) and not ref.endswith("bot"):
                        queue[ref] = j["region"] or None
                        pending.append(ref)

        pending = [n for n in queue if n not in st["seen"]]
        while pending and good() < LIMIT:
            batch, pending[:] = pending[:60], pending[60:]
            await asyncio.gather(*(check(n, queue.get(n)) for n in batch))
            state_f.write_text(json.dumps(st, ensure_ascii=False))
            print(f"{time.time() - t0:6.0f} с · проверено {len(st['seen'])} · каналов с постами {len(st['res'])} · подходят {good()} · в очереди {len(pending)}", flush=True)
    write(st)


def write(st: dict) -> None:
    rows = sorted((r for r in st["res"].values() if r["ok"]), key=lambda r: -r["subs"])
    rej = sorted((r for r in st["res"].values() if not r["ok"] and r["car_share"] >= .3), key=lambda r: -r["subs"])
    cols = [("username", "Канал"), ("url", "Ссылка"), ("title", "Название"), ("region", "Город / регион"), ("subs", "Подписчиков"),
            ("week", "Постов за 7 дней"), ("days", "Дней с постами из 7"), ("car_share", "Доля объявлений"), ("import_share", "Доля импорта"),
            ("sample", "Пример объявления"), ("checked", "Проверено")]
    for fn, data, extra in (("channels.csv", rows, []), ("rejected.csv", rej, [("reason", "Почему отсеян")])):
        with open(OUT / fn, "w", newline="", encoding="utf-8-sig") as f:
            w = csv.writer(f); w.writerow([c[1] for c in cols + extra])
            for r in data: w.writerow([("@" + r[k]) if k == "username" else r.get(k, "") for k, _ in cols + extra])
    from openpyxl import Workbook
    from openpyxl.styles import Font
    wb = Workbook(); ws = wb.active; ws.title = "Каналы"
    ws.append([c[1] for c in cols]); [setattr(c, "font", Font(bold=True)) for c in ws[1]]
    for r in rows: ws.append([("@" + r[k]) if k == "username" else r.get(k, "") for k, _ in cols])
    for col, wdt in zip("ABCDEFGHIJK", (24, 34, 36, 22, 12, 10, 10, 10, 10, 80, 12)): ws.column_dimensions[col].width = wdt
    ws.freeze_panes = "A2"; ws.auto_filter.ref = ws.dimensions
    ws2 = wb.create_sheet("Отсеяны"); ws2.append([c[1] for c in cols] + ["Почему отсеян"])
    for r in rej: ws2.append([("@" + r[k]) if k == "username" else r.get(k, "") for k, _ in cols] + [r["reason"]])
    wb.save(OUT / "channels.xlsx")
    print("итог:", len(rows), "подходят,", len(rej), "отсеяно (авто, но не по условиям)")


if __name__ == "__main__":
    if "--write" in sys.argv:
        write(json.loads((OUT / "state.json").read_text()))
    else:
        asyncio.run(main())
