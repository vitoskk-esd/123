"""Фильтр человека: «камри или солярис от 2010, до 1,2 млн, Москва, пробег до 200 тыс, без битых и такси».

Разбор — правила, без ИИ: результат сразу показывается карточкой «Так ищем?», и человек правит текст, если что-то не так.
"""
import json
import re
from dataclasses import asdict, dataclass, field

from parse import MLN, THS, YEAR_MAX, _to_int
from words import Dictionary, _tok_match, norm

EXCLUDE_START = r"(?:без|кроме|не надо|не нужн\w*|исключ\w*|не показывай)"
ALL_RF = re.compile(r"вся росси|всей росси|вся рф|всей рф|любой (город|регион)|все регионы|по рф\b")
# как люди называют то, что не хотят видеть → маркер из cars.yaml
EXCLUDE_ALIASES = {
    "damaged": ["бит", "битых", "битые", "битая", "битый", "дтп", "аварийн", "тотал"],
    "parts": ["запчаст", "разбор", "донор"],
    "notrun": ["неходов", "не на ходу", "не заводится"],
    "invest": ["вложен", "ремонт"],
    "dupdoc": ["дубликат", "без птс"],
    "credit": ["кредит", "залог", "обременен", "арест"],
    "taxi": ["такси", "каршеринг"],
    "remote": ["мошенн", "дистанцион", "развод", "скам"],
    "prepay": ["предоплат", "бронь"],
}


@dataclass
class Filter:
    cars: list[list] = field(default_factory=list)      # [[марка, модель|None]], пусто — любые
    year_min: int | None = None
    year_max: int | None = None
    price_min: int | None = None
    price_max: int | None = None
    mileage_max: int | None = None
    regions: list[str] = field(default_factory=list)    # пусто — вся РФ
    exclude_markers: list[str] = field(default_factory=list)
    exclude_words: list[str] = field(default_factory=list)
    min_discount: int | None = None                      # «только ниже рынка на N%»

    def dumps(self) -> str:
        return json.dumps(asdict(self), ensure_ascii=False)

    @classmethod
    def loads(cls, s: str) -> "Filter":
        return cls(**json.loads(s))

    @property
    def empty(self) -> bool:
        return not (self.cars or self.price_max or self.price_min or self.min_discount)


def _exclusions(text: str) -> tuple[str, list[str], list[str]]:
    """Вырезает «без …»/«кроме …» и раскладывает на маркеры и свои слова."""
    markers, words = [], []
    t = text.lower().replace("ё", "е")
    for m in re.finditer(rf"{EXCLUDE_START}\s+([^.;\n]+?)(?=$|[.;\n]|,\s*(?:от|до|с|пробег|в|не старше)\b)", t):
        for piece in re.split(r",|\s+и\s+|\s+или\s+|/", m.group(1)):
            p = re.sub(rf"^{EXCLUDE_START}\s+", "", piece.strip())
            p = re.sub(r"^(?:слов\w*|фраз\w*)\s+", "", p).strip(" «»\"'")
            if not p:
                continue
            hit = next((mid for mid, al in EXCLUDE_ALIASES.items() if any(a in p for a in al)), None)
            if hit:
                if hit not in markers:
                    markers.append(hit)
            elif len(p) >= 3:
                words.append(norm(p))
    t = re.sub(rf"{EXCLUDE_START}\s+[^.;\n]+?(?=$|[.;\n]|,\s*(?:от|до|с|пробег|в|не старше)\b)", " ", t)
    return t, markers, words


NUMBER = re.compile(rf"(?P<pre>от|с|до|не старше|не дороже|не больше|бюджет|за|пробег\w*(?: до)?|-|–|—)?\s*"
                    rf"(?P<num>\d+(?:[.,]\d+)?)\s*(?P<unit>{MLN}|{THS}|₽|руб\w*|р\b|км|km|г\.?|год\w*|\+)?")


def parse_filter(text: str, d: Dictionary) -> Filter:
    f = Filter()
    t, f.exclude_markers, f.exclude_words = _exclusions(text)
    t = re.sub(r"(?<=\d)[  ](?=\d{3}(?!\d))", "", t)       # 1 200 000 → 1200000

    m = re.search(r"ниже рынка(?:\s*(?:на|от))?\s*(\d{1,2})\s*%", t)
    if m:
        f.min_discount = int(m.group(1))
    elif "ниже рынка" in t:
        f.min_discount = 10
    t = re.sub(r"ниже рынка(?:\s*(?:на|от))?\s*(\d{1,2}\s*%)?", " ", t)

    tokens = norm(t).split()
    cars = list(dict.fromkeys(d.find_cars(tokens)))
    with_model = {mk for mk, md in cars if md}
    f.cars = [[mk, md] for mk, md in cars if md or mk not in with_model]
    f.regions = [] if ALL_RF.search(t) else d.find_regions(tokens)

    years, prices = [], []
    for m in NUMBER.finditer(t):
        pre, num, unit = (m.group("pre") or ""), m.group("num"), (m.group("unit") or "")
        if re.fullmatch(r"\d{4}", num) and any(num == tok for tok in tokens) and d.find_cars([num]):
            continue                                   # «2114» — это модель, а не число
        value = _to_int(num, unit if re.match(rf"{MLN}|{THS}", unit) else "")
        if value is None:
            continue
        if pre.startswith("пробег") or unit in ("км", "km"):
            f.mileage_max = value * 1000 if value < 1000 or re.match(THS, unit) and value < 1000 else value
            continue
        if 1970 <= value <= YEAR_MAX and not re.match(rf"{MLN}|{THS}|₽|руб|р", unit):
            years.append((pre, value, unit))
            continue
        if not unit and value < 10_000:                # «до 900» — тысячи
            value *= 1000
        if value >= 10_000:
            prices.append((pre, value))

    for pre, y, unit in years:
        if pre in ("от", "с", "не старше") or unit == "+":
            f.year_min = y
        elif pre == "до":
            f.year_max = y
        elif pre in ("-", "–", "—") and f.year_min:
            f.year_max = y
        elif f.year_min is None:
            f.year_min = f.year_max = y                # «камри 2012» — ровно этот год
        else:
            f.year_max = y
    if f.year_min and f.year_max and f.year_min > f.year_max:
        f.year_min, f.year_max = f.year_max, f.year_min

    for pre, p in prices:
        if pre in ("от",) or (pre == "" and len(prices) > 1 and p == min(v for _, v in prices)):
            f.price_min = p
        else:
            f.price_max = p
    if f.price_min and f.price_max and f.price_min > f.price_max:
        f.price_min, f.price_max = f.price_max, f.price_min
    return f


def _has_word(word: str, tokens: list[str]) -> bool:
    w = word.split()
    return any(all(_tok_match(a, tokens[i + k]) for k, a in enumerate(w)) for i in range(len(tokens) - len(w) + 1))


def matches(f: Filter, L, discount: int | None) -> bool:
    """Подходит ли объявление под фильтр. Без цены не шлём ничего — перекупу нужна цифра.
    Неизвестный год, пробег или город не отсекают: в постах их часто нет, а машина может быть та самая."""
    if not L.is_car or not L.price:
        return False
    if f.cars and not any(mk == L.make and (md is None or md == L.model) for mk, md in f.cars):
        return False
    if f.price_max and L.price > f.price_max or f.price_min and L.price < f.price_min:
        return False
    if L.year and (f.year_min and L.year < f.year_min or f.year_max and L.year > f.year_max):
        return False
    if L.mileage and f.mileage_max and L.mileage > f.mileage_max:
        return False
    if f.regions and L.region and L.region not in f.regions:
        return False
    if any(mk in L.markers for mk in f.exclude_markers):
        return False
    if any(_has_word(w, L.tokens) for w in f.exclude_words):
        return False
    if f.min_discount and (discount is None or discount < f.min_discount):
        return False
    return True


def describe(f: Filter, d: Dictionary) -> str:
    """Карточка фильтра для человека."""
    rub = lambda v: f"{v:,}".replace(",", " ") + " ₽"
    lines = ["🚗 " + (", ".join(d.car_name(mk, md) for mk, md in f.cars) if f.cars else "любые марки")]
    if f.year_min or f.year_max:
        y = (f"{f.year_min}" if f.year_min == f.year_max else
             f"{f.year_min or '…'}–{f.year_max or '…'}" if f.year_min and f.year_max else
             f"от {f.year_min}" if f.year_min else f"до {f.year_max}")
        lines.append(f"📅 {y} г.")
    if f.price_min or f.price_max:
        p = (f"{rub(f.price_min)} – {rub(f.price_max)}" if f.price_min and f.price_max else
             f"до {rub(f.price_max)}" if f.price_max else f"от {rub(f.price_min)}")
        lines.append(f"💰 {p}")
    if f.mileage_max:
        lines.append(f"🛣 пробег до {f.mileage_max:,} км".replace(",", " "))
    lines.append("📍 " + (", ".join(d.regions.get(r, r) for r in f.regions) if f.regions else "вся Россия"))
    excl = [d.markers[m].label for m in f.exclude_markers if m in d.markers] + f.exclude_words
    if excl:
        lines.append("🚫 без: " + ", ".join(excl))
    if f.min_discount:
        lines.append(f"🔥 только ниже рынка на {f.min_discount}%+")
    return "\n".join(lines)
