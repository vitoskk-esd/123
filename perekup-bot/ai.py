"""ИИ-проверка поста (Gemini): перечитывает объявление целиком и поправляет то, в чём правила могли ошибиться, —
какая машина продаётся, год, цена, пробег, город, метки с учётом отрицаний («никаких вложений не требует»),
число ДТП, и не «куплю ли» это вместо «продам».

Зовём только для постов, которые кому-то могут подойти (экономим бесплатный лимит). Ответ ждём не дольше
TIMEOUT: не успел, нет ключа, кончился лимит — работаем на правилах, как раньше.
"""
import asyncio
import json
import logging
import time
import urllib.error
import urllib.request

from parse import PRICE_MAX, PRICE_MIN, YEAR_MAX, Listing
from words import Dictionary, norm

log = logging.getLogger(__name__)
API = "https://generativelanguage.googleapis.com/v1beta/models"
TIMEOUT = 5      # ответ обычно за 1–3 с; дольше не ждём — скорость важнее

# что значит каждая метка — чтобы ИИ ставил её только когда продавец утверждает это про машину
HINTS = {
    "urgent": "продавец пишет, что продаёт срочно / нужны деньги",
    "haggle": "возможен торг (НЕ ставь, если «без торга», «торга нет»)",
    "moving": "продаёт из-за переезда",
    "owner1": "один владелец по ПТС",
    "cheap": "продавец сам пишет «ниже рынка», «под перепродажу»",
    "damaged": "машина битая, была в ДТП, есть удары или окрасы после аварии (НЕ ставь при «без ДТП», «не бита»)",
    "parts": "продаётся на запчасти / в разбор",
    "notrun": "не на ходу, не заводится, нужен капремонт двигателя",
    "invest": "требует вложений или ремонта (НЕ ставь при «вложений не требует», «никаких вложений»)",
    "dupdoc": "дубликат ПТС, нет ПТС или документов",
    "credit": "в кредите, залоге, под арестом или запретом (НЕ ставь при «без залогов», «ограничений нет»)",
    "taxi": "работала в такси или каршеринге",
}


def _schema(marker_ids: list[str]) -> dict:
    return {
        "type": "object",
        "properties": {
            "is_car_sale": {"type": "boolean"},
            "is_teaser": {"type": "boolean"},
            "make": {"type": "string"}, "model": {"type": "string"},
            "year": {"type": "integer"}, "price_rub": {"type": "integer"}, "mileage_km": {"type": "integer"},
            "city": {"type": "string"},
            "accidents": {"type": "integer"},
            "markers": {"type": "array", "items": {"type": "string", "enum": marker_ids}},
        },
        "required": ["is_car_sale", "is_teaser", "markers", "accidents"],
    }


def _prompt(d: Dictionary, text: str) -> str:
    marks = "\n".join(f"- {m.id}: {HINTS.get(m.id, m.label)}" for m in d.markers.values())
    return (
        "Ты помогаешь перекупщику автомобилей. Ниже пост из Telegram-канала или группы ВКонтакте. Внимательно прочитай его целиком.\n"
        "1. is_car_sale: true, только если это объявление о ПРОДАЖЕ конкретного легкового автомобиля. "
        "«Куплю», реклама, услуги, подбор, обучение и курсы перекупа, наставничество, розыгрыши, новости — false, "
        "даже если в тексте есть цена и название машины. Машина уже продана, в брони, снята с продажи («ПРОДАНО», "
        "«❌ продана») — тоже false. Новости, обзоры новинок и статьи про рынок — false.\n"
        "   is_teaser: true, если это только АНОНС — машина появится в продаже позже («скоро в продаже», "
        "«через 5 минут в продаже», «скоро выставим»), даже если характеристики уже расписаны.\n"
        "2. Какой автомобиль ПРОДАЁТСЯ (make и model латиницей, как пишет производитель). Если в посте упомянуты другие "
        "машины для сравнения («по цене плохой приоры», «дешевле камри», «рассмотрю обмен на…») — их не бери.\n"
        "3. year, price_rub (цена в рублях; цена в другой валюте — не заполняй), mileage_km, city — только если есть в тексте.\n"
        "4. accidents: сколько ДТП, по словам продавца. 0 — если пишет, что ДТП не было («без ДТП», «не бита»). "
        "-1 — если продавец про ДТП ничего не пишет или пишет без количества.\n"
        "5. markers — только то, что продавец УТВЕРЖДАЕТ про эту машину. Учитывай отрицания: «никаких вложений не "
        "требует», «залогов нет», «в ДТП не была» — это НЕ метки. Возможные метки:\n"
        f"{marks}\n\nПост:\n{text[:3500]}"
    )


def _post(key: str, model: str, body: dict) -> dict:
    headers = {"Content-Type": "application/json"}
    if key:   # в облачной среде разработки ключ подставляет прокси сам
        headers["x-goog-api-key"] = key
    req = urllib.request.Request(f"{API}/{model}:generateContent", json.dumps(body).encode(), headers)
    with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
        data = json.load(resp)
    return json.loads(data["candidates"][0]["content"]["parts"][0]["text"])


FALLBACK = "gemini-flash-lite-latest"     # Google перегружен (503) — сразу спрашиваем запасную модель
_fails = {"n": 0, "warned": 0.0}            # сбои Google частые и короткие — в лог-тревогу не чаще раза в 30 мин


def _busy(e: Exception) -> bool:
    return isinstance(e, urllib.error.HTTPError) and (e.code == 429 or e.code >= 500)


async def ask(d: Dictionary, text: str, key: str, model: str) -> dict | None:
    body = {"contents": [{"role": "user", "parts": [{"text": _prompt(d, text)}]}],
            "generationConfig": {"responseMimeType": "application/json", "responseJsonSchema": _schema(list(d.markers)),
                                 "maxOutputTokens": 500, "temperature": 0}}   # без «размышлений» — ответ за ~1 с
    deadline = time.monotonic() + TIMEOUT + 1
    for m in dict.fromkeys((model, FALLBACK)):
        try:
            left = deadline - time.monotonic()
            return await asyncio.wait_for(asyncio.to_thread(_post, key, m, body), left)
        except Exception as e:
            if _busy(e) and deadline - time.monotonic() > 2:
                log.info("ИИ %s занят (%s) — спрашиваю %s", m, e, FALLBACK)
                continue
            _fail(e)
            return None
    return None


def _fail(e: Exception) -> None:
    _fails["n"] += 1
    if time.monotonic() - _fails["warned"] > 1800 or not _fails["warned"]:
        log.warning("ИИ-проверка не прошла (%s сбоев за 30 мин), работаю на правилах: %s", _fails["n"], e)
        _fails.update(n=0, warned=time.monotonic())
    else:
        log.info("ИИ-проверка не прошла, работаю на правилах: %s", e)


def apply(L: Listing, r: dict, d: Dictionary) -> Listing:
    """Поправить разбор правил ответом ИИ. ИИ сказал «это не продажа» — машину убираем, пост никому не уйдёт."""
    L.parsed_by = "ai"
    if r.get("is_teaser"):
        L.teaser = True
        return L
    if not r.get("is_car_sale"):
        L.make = L.model = None
        return L
    cars = d.find_cars(norm(f"{r.get('make', '')} {r.get('model', '')}").split())
    with_model = [c for c in cars if c[1]]
    if with_model:
        L.make, L.model = with_model[0]
    elif cars and cars[0][0] != L.make:
        L.make, L.model = cars[0][0], None
    if 1970 <= (r.get("year") or 0) <= YEAR_MAX:
        L.year = r["year"]
    if PRICE_MIN <= (r.get("price_rub") or 0) <= PRICE_MAX:
        L.price = r["price_rub"]
    if 0 < (r.get("mileage_km") or 0) < 2_000_000:
        L.mileage = r["mileage_km"]
    if r.get("city"):
        regions = d.find_regions(norm(r["city"]).split())
        L.region = regions[0] if regions else L.region
    L.markers = [m for m in dict.fromkeys(r.get("markers") or []) if m in d.markers]
    acc = r.get("accidents")
    if isinstance(acc, int) and 0 <= acc <= 20:
        L.accidents = acc
    return L
