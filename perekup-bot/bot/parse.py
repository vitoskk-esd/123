"""Разбор поста о продаже машины: марка, модель, год, цена, пробег, регион, маркеры. Быстрые правила, без сети —
доли миллисекунды на пост."""
import hashlib
import re
from dataclasses import dataclass, field
from datetime import date

from .words import Dictionary, norm

YEAR_MAX = date.today().year + 1
YEAR = r"(19[7-9]\d|20[0-4]\d)"
PRICE_MIN, PRICE_MAX = 15_000, 100_000_000

URL = re.compile(r"https?://\S+|t\.me/\S+|@\w+")
PHONE = re.compile(r"(?:\+7|(?<!\d)8)[\s\-()]*\d{3}[\s\-()]*\d{3}[\s\-]*\d{2}[\s\-]*\d{2}(?!\d)|(?<!\d)\d{10,11}(?!\d)")
NUM = r"\d{1,3}(?:[ .  ]\d{3})+|\d+(?:[.,]\d+)?"
FOREIGN = re.compile(r"^\s*(тг|тенге|₸|\$|usd|долл|€|eur|евро|сом|byn|бел\.? ?руб|грн|uah|сум)", re.I)
MLN = r"(?:млн|миллион\w*|лям\w*|kk|кк)"
THS = r"(?:тыс\w*\.?|т\.?\s?р\.?|тр\b|k\b|к\b|т\b)"
CUR = r"(?:₽|руб\w*\.?|р\.?(?!\w)|rub)"


@dataclass
class Listing:
    text: str
    make: str | None = None
    model: str | None = None
    year: int | None = None
    price: int | None = None
    mileage: int | None = None
    region: str | None = None
    markers: list[str] = field(default_factory=list)
    tokens: list[str] = field(default_factory=list)
    parsed_by: str = "rules"

    @property
    def is_car(self) -> bool:
        return bool(self.make)

    @property
    def complete(self) -> bool:
        return bool(self.make and self.model and self.price)


def _to_int(num: str, unit: str = "") -> int | None:
    s = num.replace(" ", " ").replace(" ", " ")
    if re.fullmatch(r"\d{1,3}(?:[ .]\d{3})+", s):
        value = float(re.sub(r"[ .]", "", s))
    else:
        try:
            value = float(s.replace(",", ".").replace(" ", ""))
        except ValueError:
            return None
    u = unit.lower()
    if re.match(MLN, u):
        value *= 1_000_000
    elif u and re.match(THS, u):
        value *= 1_000
    return round(value)


def clean(text: str) -> str:
    """Убираем ссылки, @ники и телефоны — в них цифры, которые путают цену и год."""
    return PHONE.sub(" ", URL.sub(" ", text))


def parse_price(text: str) -> int | None:
    t = clean(text).lower().replace("ё", "е")
    found: list[tuple[int, int]] = []    # (приоритет, цена)
    pattern = re.compile(rf"(?P<label>цена|стоимость|продам за|отдам за|прошу|price)?\s*[:\-–—=]?\s*(?P<num>{NUM})\s*(?P<unit>{MLN}|{THS}|{CUR})?\s*(?P<cur>{CUR})?")
    for m in pattern.finditer(t):
        num, unit, label = m.group("num"), m.group("unit") or "", m.group("label")
        tail = t[m.end():m.end() + 6]
        head = t[max(0, m.start() - 12):m.start()]
        if FOREIGN.match(t[m.end("num"):m.end("num") + 8]) or FOREIGN.match(tail):
            continue
        if re.match(r"\s*(км|km|т\.?\s?км|тыс\.?\s?км)", t[m.end("num"):m.end("num") + 10]) or "пробег" in head:
            continue
        value = _to_int(num, unit)
        if value is None:
            continue
        has_cur = bool(m.group("cur") or re.match(CUR, unit))
        grouped = bool(re.fullmatch(r"\d{1,3}(?:[ .  ]\d{3})+", num))
        if not (label or unit or grouped):
            continue
        if re.fullmatch(YEAR, num) and not (label or unit):
            continue
        # «цена 850» без единиц — это тысячи
        if label and not unit and value < 10_000:
            value *= 1000
        if PRICE_MIN <= value <= PRICE_MAX:
            prio = 3 if label else 2 if (has_cur or re.match(MLN, unit) or re.match(THS, unit)) else 1
            found.append((prio, value))
    if not found:
        return None
    best = max(p for p, _ in found)
    return next(v for p, v in found if p == best)


def parse_year(text: str) -> int | None:
    t = clean(text).lower()
    for rx in (rf"(?:год\w*(?: выпуска)?|г\.?\s?в\.?)\s*[:\-–—]?\s*{YEAR}(?!\d)",
               rf"(?<!\d){YEAR}\s*(?:г\.?\s?в|год|гв|г\b|г\.)",
               rf"(?<![\d.,\u00a0]){YEAR}(?!\d|[.,]\d|\s?(?:км|km|₽|руб|р\b))"):
        for m in re.finditer(rx, t):
            y = int(m.group(1))
            if 1970 <= y <= YEAR_MAX:
                return y
    return None


def parse_mileage(text: str) -> int | None:
    t = clean(text).lower()
    m = re.search(r"пробег\w*\s*[:\-–—]?\s*(\d[\d\s.\-]*\d|\d)\s*(тыс\w*|т\.?(?=\s?км)|т\b|к\b)?", t) or \
        re.search(r"(\d[\d\s.]*\d|\d)\s*(тыс\w*\.?|т\.?)?\s*(?:км|km)\b", t)
    if not m:
        return None
    digits = re.sub(r"[\s.\-]", "", m.group(1))
    if not digits.isdigit():
        return None
    value = int(digits)
    if m.group(2) or value < 1000:     # «пробег 150» и «150 тыс км» — тысячи
        value *= 1000
    return value if 0 < value < 2_000_000 else None


def parse_post(text: str, d: Dictionary, channel_region: str | None = None) -> Listing:
    tokens = norm(clean(text)).split()
    L = Listing(text=text, tokens=tokens)
    cars = d.find_cars(tokens)
    makes = [mk for mk, md in cars if md is None]
    models = [(mk, md) for mk, md in cars if md is not None]
    if models:
        # модель той марки, что названа в тексте, важнее случайного совпадения
        L.make, L.model = next(((mk, md) for mk, md in models if mk in makes), models[0])
    elif makes:
        L.make = makes[0]
    L.price = parse_price(text)
    L.year = parse_year(text)
    L.mileage = parse_mileage(text)
    regions = d.find_regions(tokens)
    L.region = regions[0] if regions else channel_region
    L.markers = d.find_markers(tokens)
    return L


def fingerprint(text: str) -> str:
    """Один и тот же текст в разных каналах: без ссылок, ников, телефонов, эмодзи и пробелов."""
    t = norm(clean(text))
    return hashlib.sha1(t[:600].encode()).hexdigest()[:16]


def car_key(L: Listing) -> str | None:
    """Та же машина, переписанная другими словами: марка, модель, год, цена, пробег (до тысяч)."""
    if not (L.make and L.model and L.year and L.price):
        return None
    km = L.mileage // 1000 if L.mileage else "-"
    return f"{L.make}|{L.model}|{L.year}|{L.price}|{km}"
