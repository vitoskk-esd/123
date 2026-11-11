"""Поиск новых источников (владелец 11.11): Telegram-каналы и группы ВК с продажей Б/У машин по России, без импорта.
Общая проверка по последним постам (те же правила разбора, что у бота) и таблица .xlsx для админа (открыть в Google Таблицах)."""
import io
import re
from collections import Counter
from datetime import datetime, timedelta, timezone

from parse import parse_post

MSK = timezone(timedelta(hours=3))
# импорт «под заказ» — не то, что нужно людям в боте (машина уже в РФ, её можно посмотреть)
IMPORT = re.compile(r"из (?:кореи|японии|китая|оаэ|эмират|дубая|грузии|армении|казахстана|киргиз|белорус|европы|сша|америки|германии)|под заказ|"
                    r"растамож|с аукцион|encar|энкар|привез[её]м|доставим|доставка из|параллельн\w* импорт|под ключ из|авто из|машин\w* из|"
                    r"в пути\b|на таможне|утильсбор", re.I)
NEW = re.compile(r"\bнов(?:ый|ая|ое) автомобил|(?<!\d)(?<!\d\s)(?<!\d\xa0)0\s?км\b|без пробега\b|в наличии у дилера|официальн\w* дилер", re.I)   # «180 000 км» — не «0 км»
# в названии/описании канала: продажа авто (а не новости, тюнинг, запчасти)
CAR_TITLE = re.compile(r"авто|машин|перекуп|рынок|рынк|тачк|барахол|продаж|car|auto|avto|ниже\s+рынка|по\s+низу|б/у|\bбу\b|пробег", re.I)


def judge(posts: list[tuple[datetime, str]], d, *, title: str = "", about: str = "", subs: int = 0,
          min_subs: int = 3000, min_week: int = 5, min_days: int = 0) -> dict:
    """posts — [(дата, текст)] последних постов. → цифры и вердикт: подходит или почему нет.
    min_week — постов за 7 дней; min_days — в скольких из 7 прошлых дней были посты («каждый день» — 6–7)."""
    now = datetime.now(MSK)
    week = [(dt, t) for dt, t in posts if dt and dt.astimezone(MSK) > now - timedelta(days=7)]
    days = len({dt.astimezone(MSK).date() for dt, _ in week})
    texts = [t for _, t in posts if t and len(t) > 30]
    cars = [(t, L) for t in texts if (L := parse_post(t, d)).is_car and L.price]
    imp = sum(bool(IMPORT.search(t)) for t, _ in cars) + 3 * bool(IMPORT.search(f"{title} {about}"))
    new = sum(bool(NEW.search(t)) or L.mileage == 0 for t, L in cars)
    car_share, imp_share = len(cars) / max(1, len(texts)), min(1.0, imp / max(1, len(cars)))
    regs = Counter(L.region for _, L in cars if L.region)
    region = regs.most_common(1)[0][0] if regs else None
    reason = ("мало подписчиков" if subs < min_subs else
              f"постов за неделю {len(week)}" if len(week) < min_week else
              f"посты не каждый день ({days} из 7)" if days < min_days else
              "не объявления о продаже авто" if car_share < .35 or len(cars) < 4 else
              "импорт / под заказ" if imp_share >= .3 else
              "новые авто / дилер" if new / max(1, len(cars)) >= .5 else "")
    sample = next((re.sub(r"\s+", " ", t)[:160] for t, _ in cars if not IMPORT.search(t)), "")
    return {"subs": subs, "week": len(week), "days": days, "car_share": round(car_share, 2), "import_share": round(imp_share, 2),
            "region": d.regions.get(region, region) if region else "", "ok": not reason, "reason": reason, "sample": sample}


COLS = [("link", "Ссылка"), ("title", "Название"), ("region", "Город / регион"), ("subs", "Подписчиков"), ("week", "Постов за 7 дней"),
        ("days", "Дней с постами из 7"), ("car_share", "Доля объявлений"), ("import_share", "Доля импорта"), ("sample", "Пример объявления")]


def table(rows: list[dict], rejected: list[dict], title: str) -> bytes:
    """.xlsx: лист «Подходят» и лист «Отсеяны» (с причиной) — открыть в Google Таблицах: Файл → Импорт."""
    from openpyxl import Workbook
    from openpyxl.styles import Font
    wb = Workbook()
    for ws, data, extra in ((wb.active, rows, []), (wb.create_sheet("Отсеяны"), rejected, [("reason", "Почему отсеян")])):
        if ws is wb.active:
            ws.title = title[:31]
        ws.append([c[1] for c in COLS + extra])
        for c in ws[1]:
            c.font = Font(bold=True)
        for r in data:
            ws.append([r.get(k, "") for k, _ in COLS + extra])
        for col, w in zip("ABCDEFGHIJ", (34, 40, 22, 12, 10, 10, 10, 10, 80, 26)):
            ws.column_dimensions[col].width = w
        ws.freeze_panes = "A2"
    buf = io.BytesIO(); wb.save(buf)
    return buf.getvalue()


def queries(words=("авто", "авторынок", "продажа авто", "авто с пробегом", "барахолка авто")) -> list[str]:
    """Поисковые фразы: общие + «слово город» по всем городам словаря бота (cars.yaml)."""
    base = ["авторынок россии", "продажа авто", "авто с пробегом", "авто ниже рынка", "перекуп авто", "авто бу", "автобарахолка",
            "продам авто", "купить авто", "машины с пробегом", "срочный выкуп авто", "авто по низу рынка", "тачки ниже рынка", "авто объявления"]
    import yaml
    from pathlib import Path
    regs = yaml.safe_load((Path(__file__).with_name("cars.yaml")).read_text(encoding="utf-8"))["regions"]
    cities = [a for r in regs.values() for a in r.get("aliases", [])[:6] if len(a) > 3 and "област" not in a and "край" not in a and not a.isascii()]
    return list(dict.fromkeys(base + [f"{w} {c}" for c in dict.fromkeys(cities) for w in words]))
