"""Разбор поста о продаже машины: марка, модель, год, цена, пробег, регион, маркеры. Быстрые правила, без сети —
доли миллисекунды на пост."""
import hashlib
import re
from dataclasses import dataclass, field
from datetime import date

from words import Dictionary, norm

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
    city: str | None = None         # город, если назван («Ангарск»); регион — его область (фильтр «Иркутская область» ловит Ангарск)
    markers: list[str] = field(default_factory=list)
    accidents: int | None = None    # сколько ДТП, если продавец написал; 0 — пишет, что не было
    teaser: bool = False            # анонс «скоро в продаже» — не шлём, ждём, когда выставят
    tokens: list[str] = field(default_factory=list)
    parsed_by: str = "rules"
    price_unsure: bool = False      # в посте несколько сумм, похожих на цену, — ИИ перепроверит
    kind: str | None = None         # не легковая: «мотоцикл», «скутер», «мотоблок»… (None — автомобиль)
    title: str | None = None        # как назвал продавец: «Ducati Panigale 899»

    @property
    def is_car(self) -> bool:
        """Продаётся транспорт, который можно прислать: машина из словаря или другая техника с названным видом."""
        return bool(self.make or self.kind)

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
    elif u and re.match(THS, u) and value < 10_000:     # «55.000т» — уже полные рубли, не 55 млн
        value *= 1_000
    return round(value)


def clean(text: str) -> str:
    """Убираем ссылки, @ники и телефоны — в них цифры, которые путают цену и год."""
    return PHONE.sub(" ", URL.sub(" ", text))


# Как человек читает цену в посте. Смотрим на фразу перед суммой (от прошлой точки/запятой/строки):
#  5 — «моя/наша/финальная цена», «цена всего», «отдам/продаю за», «ценник» — это точно цена продавца;
#  4 — «цена», «стоимость», «прошу» (если во фразе нет слов про рынок и оценки);
#  3 — сумма с ₽ / «руб» / «т.р.» / «млн»; 2 — с «к» / «тыс»; 1 — просто «850 000»;
#  0 — сумма про другое: рынок, оценка Авито, «старт рынка», зазор, выгода, вложения, торг, ремонт, налог, кредит…;
#  пробег («пробег щиток 220.000», «по базе 147.000», «одометр») — вообще не сумма.
NOT_PRICE_BEFORE = re.compile(
    r"(?:\bна|\bпри|\bпосле|кажды\w*|через)\s*$"
    r"|вложен|вложил|влож\w*\s+\w*$|потрачен|чек\w*|торг|налог|страхов|осаго|каско|рын\w*|дешевле|дороже|скидк|доплат"
    r"|кредит|залог|остат|платеж|взнос|ремонт|замен|поменя|обслуж|\bто\b|диагност|покраск|запчаст|комплект\s+резин"
    r"|зазор|выгод|эконом|разниц|марж|навар|прибыл|заработ|оценк|авито|дром|авто\.?ру|старт|средн|аналог|конкурент"
    r"|предложени|ниже|выше|минус")
MILEAGE_BEFORE = re.compile(r"пробег|одометр|одо\b|щит[оке]|приборк|по\s+базе|в\s+базе|по\s+автотек|пробежал|наезд")
STRONG_PRICE = re.compile(r"(?:мо[яю]|наш[аиу]|финальн\w*|итогов\w*|окончательн\w*|реальн\w*)\s+цен|цен[аы]\s+(?:всего|лишь|только|сегодня|сейчас)"
                          r"|(?:отда[юм]|продаю|продам|забрать|заберет\w*|забирай\w*)\s+(?:\w+\s+)?за\b|ценник")
LABEL_PRICE = re.compile(r"цен[аыу]|стоимост|прошу|\bprice")


def price_candidates(text: str) -> list[tuple[int, int]]:
    """Все суммы, похожие на цену машины, с приоритетом (см. правила выше)."""
    t = clean(text).lower().replace("ё", "е")
    found: list[tuple[int, int]] = []
    # число — отдельное слово: не хвост модели или кузова («F30 335», «RX 350 2010», «E 320») и не кусок соседнего числа
    pattern = re.compile(rf"(?P<label>цена|стоимость|продам за|отдам за|прошу|price)?\s*[:\-–—=]?\s*(?<![\w.,/])(?P<num>{NUM})(?!\d)"
                         rf"\s*(?P<unit>{MLN}|{THS}|{CUR})?\s*(?P<cur>{CUR})?")
    for m in pattern.finditer(t):
        num, unit = m.group("num"), m.group("unit") or ""
        tail = t[m.end():m.end() + 6]
        # фраза перед суммой: от прошлого знака препинания или начала строки («1.150к» — точка внутри числа не граница)
        clause = re.split(r"(?<!\d)[.,;!?(]|[.,;!?(](?!\d)|\n", t[max(0, m.start("num") - 60):m.start("num")])[-1]
        clause = re.split(r"\d", clause)[-1]        # «пробег 167000 цена 1150000» — фраза цены начинается после пробега
        if FOREIGN.match(t[m.end("num"):m.end("num") + 8]) or FOREIGN.match(tail):
            continue
        if re.match(r"\s*(км|km|т\.?\s?км|тыс\.?\s?км)", t[m.end("num"):m.end("num") + 10]) or MILEAGE_BEFORE.search(clause):
            continue
        value = _to_int(num, unit)
        if value is None:
            continue
        strong = bool(STRONG_PRICE.search(clause))
        other = bool(NOT_PRICE_BEFORE.search(clause))
        label = strong or bool(m.group("label")) or (bool(LABEL_PRICE.search(clause)) and not other)
        has_cur = bool(m.group("cur") or re.match(CUR, unit) or re.match(r"т\.?\s?р|тр\b", unit))
        grouped = bool(re.fullmatch(r"\d{1,3}(?:[ .  ]\d{3})+", num))
        if not (label or unit or grouped):
            continue
        if re.fullmatch(YEAR, num) and not (label or unit):
            continue
        # «цена 850» без единиц — это тысячи
        if label and not unit and value < 10_000:
            value *= 1000
        if PRICE_MIN <= value <= PRICE_MAX:
            if strong and not re.search(r"рын|оценк|авито|старт|средн|зазор|аналог", clause):
                prio = 5
            elif other:
                prio = 0
            elif label:
                prio = 4
            else:
                prio = 3 if (has_cur or re.match(MLN, unit)) else 2 if unit else 1
            # голое число без ₽, «к», «млн» и без слова «цена» — цена, только если круглое, как пишут цены:
            # «650 000», «1 249 990», «899 999». «30 335», «147 382» — это код, пробег или номер, а не цена
            if prio == 1 and not (value % 100 == 0 or value % 1000 in (990, 999)):
                continue
            found.append((prio, value))
    return found


def parse_price(text: str) -> int | None:
    found = price_candidates(text)
    if not found:
        return None
    best = max(p for p, _ in found)
    return next(v for p, v in found if p == best)


def price_unsure(text: str) -> bool:
    """Правила не уверены в цене: нет «цена: …», а сумм, похожих на цену, несколько разных — пусть проверит ИИ."""
    found = price_candidates(text)
    return bool(found) and max(p for p, _ in found) < 4 and len({v for p, v in found if p >= 1}) > 1


def price_options(text: str) -> list[int]:
    """Другие суммы поста, которые могут быть ценой (для проверки по рынку): лучшие приоритеты первыми."""
    return [v for p, v in sorted(price_candidates(text), key=lambda x: -x[0]) if p >= 1]


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


NOT_MILEAGE_BEFORE = re.compile(r"(?:\bдо|запас\w*\s+хода|через|кажды\w*|\bв|\bна|\bза|\bот)\s*$")
NOT_MILEAGE_AFTER = re.compile(r"^\s*(?:назад|от\b|в\s+час|/ч|на\s+(?:чистом|одной|электр|заряд)|без\s+подзаряд|до\s+)")


def parse_mileage(text: str) -> int | None:
    t = clean(text).lower()
    m = re.search(r"пробег\w*\s*[:\-–—]?\s*(\d[\d\s.\-]*\d|\d)\s*(тыс\w*|т\.?(?=\s?км)|т\b|к\b)?", t)
    if not m:   # «🟢170.000 ПРОБЕГ🟢» — число перед словом
        m = re.search(r"(?<![\d.])(\d{2,3}[\s.]?\d{3}|\d{1,3})\s*(тыс\w*\.?|т\.?)?\s*(?:км\.?\s*)?пробег", t)
    if not m:
        # «150 тыс км» — да; «до 300 км на чистом электричестве», «2000 км назад было ТО», «в 20 км от города» — нет
        m = next((x for x in re.finditer(r"(\d[\d\s.]*\d|\d)\s*(тыс\w*\.?|т\.?)?\s*(?:км|km)\b", t)
                  if not NOT_MILEAGE_BEFORE.search(t[max(0, x.start() - 25):x.start()])
                  and not NOT_MILEAGE_AFTER.match(t[x.end():x.end() + 25])), None)
    if not m:
        return None
    digits = re.sub(r"[\s.\-]", "", m.group(1))
    if not digits.isdigit():
        return None
    value = int(digits)
    if m.group(2) or value < 1000:     # «пробег 150» и «150 тыс км» — тысячи
        value *= 1000
    return value if 0 < value < 2_000_000 else None


# слова перед названием машины, после которых это сравнение, а не продажа: «по цене плохой приоры», «дешевле камри»
COMPARE = {"цене", "цена", "дешевле", "дороже", "чем", "как", "вместо", "типа", "уровня", "аналог", "лучше", "хуже",
           "обмен", "обменяю", "меняю", "поменяю", "рассмотрю", "против", "конкурент"}


def named_makes(lines: list[list[str]], d: Dictionary) -> set[str]:
    """Марки, названные словом: «бмв», «BMW X3» — а не угаданные по одной модели («х3»)."""
    return {h.payload[1] for toks in lines for h in d.cars.find(toks) if h.payload[0] == "make" or h.end - h.start > 1}


# «приора салон», «руль от приоры», «приора зеркала» — деталь от другой модели, а не продаваемая машина (владелец 12.11: «в продаже 2112 …
# установлен приора салон» бот назвал Приорой)
PARTS = set("салон салона салоном зеркала зеркало зеркалами руль руля рулем сиденья сидения кресла панель панели торпеда торпедо "
            "фары фар оптика бампер бампера диски дисков стекла ручки обшивка обшивки мульти коробка кпп двигатель мотор".split())
FROM_CAR = {"от", "с", "со", "под"}
SALE_LEAD = set("в на продаже продажа продам продаю продается продаеться срочно отдам".split())   # «в продаже 2112» — это заголовок


def pick_car(text: str, d: Dictionary) -> tuple[str | None, str | None]:
    """Какая машина продаётся, если в посте их несколько. Каждое упоминание получает очки:
    + модель (а не только марка), + названа вместе с маркой («Citroen C4»), + стоит в начале строки (заголовок),
    + рядом год; − перед ним «по цене», «дешевле», «как», «вместо», «обмен» — значит, это сравнение."""
    lines = [norm(line).split() for line in clean(text).splitlines()]
    years = [bool(re.search(YEAR, " ".join(t))) for t in lines]
    named = named_makes(lines, d)
    best, best_score = (None, None), -99.0
    for li, toks in enumerate(lines):
        hits = d.cars.find(toks)
        make_before = {h.end: h.payload[1] for h in hits if h.payload[0] == "make"}   # где кончается название марки
        for h in hits:
            make, model = h.payload[1], (h.payload[2] if h.payload[0] == "model" else None)
            short = model and h.end - h.start == 1 and len(toks[h.start]) <= 3
            if short and make not in named and not any(years[max(0, li - 1):li + 3]):
                continue                                     # «доход х3», «rx» без марки и года — не машина
            score = 2.0 if model else 1.0
            if model and (h.end - h.start > 1 or make_before.get(h.start) == make):
                score += 3                                   # «Citroen C4», «Тойота Королла» — марка прямо перед моделью
            if h.start <= 1 or (h.start <= 3 and set(toks[:h.start]) <= SALE_LEAD):
                score += 2                                   # строка начинается с машины («в продаже 2112») — это заголовок
            if (h.end < len(toks) and toks[h.end] in PARTS) or (h.start and toks[h.start - 1] in PARTS | FROM_CAR):
                score -= 4                                   # «приора салон», «руль приора», «от приоры» — деталь
            if any(years[max(0, li - 1):li + 3]):
                score += 1                                   # рядом год выпуска
            if set(toks[max(0, h.start - 4):h.start]) & COMPARE:
                score -= 6                                   # «по цене плохой приоры»
            score -= li * 0.05                               # при прочих равных — что раньше
            if score > best_score:
                best, best_score = (make, model), score
    return best


NUM_WORDS = {"одно": 1, "один": 1, "одна": 1, "одну": 1, "два": 2, "две": 2, "три": 3, "четыре": 4, "пять": 5}
ACC = r"(?:дтп|авари\w*)"


def parse_accidents(text: str) -> int | None:
    """Сколько ДТП, по словам продавца: «ДТП: 2», «2 мелких дтп», «одно дтп» → число; «без дтп», «дтп нет»,
    «в дтп не была», «по дтп чистая» → 0; ничего не сказано или просто «после дтп» → None."""
    t = clean(text).lower().replace("ё", "е")
    if re.search(rf"(?:без|нет|ноль|0)\s+{ACC}|{ACC}\s*[:\-–—]?\s*(?:нет|0\b|не было|отсутств)|"
                 rf"{ACC}\s+не\s+(?:был|бывал|участв)|не\s+(?:был\w*|бывал\w*|участвовал\w*)\s+в\s+{ACC}|"
                 rf"по\s+{ACC}\s+чист", t):
        return 0
    m = (re.search(rf"(?<![\d.,])(\d{{1,2}})\s*(?:мелк\w*|незначит\w*|косметич\w*|легк\w*|небольш\w*)?\s*{ACC}", t)
         or re.search(rf"{ACC}\s*[:\-–—]\s*(\d{{1,2}})(?![\d.,])", t)
         or re.search(rf"{ACC}\s+(\d{{1,2}})\s*раз", t))
    if m:
        return int(m.group(1))
    m = re.search(rf"\b({'|'.join(NUM_WORDS)})\s+(?:мелк\w*\s+|незначит\w*\s+|небольш\w*\s+)?{ACC}", t)
    return NUM_WORDS[m.group(1)] if m else None


WHEN = r"(?:\d+|пару|пар\w*|несколько|полчаса|час\w*|минут\w*|день|дня)"
TEASER = re.compile(
    r"скоро\s+(?:будет\s+)?(?:в\s+)?продаж"                                 # «скоро в продаже», «скоро продажа»
    rf"|(?:через|в\s+течени\w+)\s+{WHEN}\s*(?:минут\w*|мин\.?|час\w*|ч\.?)?\s+(?:будет\s+)?(?:в\s+)?продаж"   # «через 5 минут в продаже»
    rf"|в\s+продаж\w*\s+(?:будет\s+)?через\s+{WHEN}"                       # «в продаже через 10 минут»
    r"|скоро\s+(?:выставим|выставлю|выложим|выложу|опубликуем|появится)"
    r"|готовим\s+к\s+продаже|анонс\b|продажа\s+начн\w*|старт\s+продаж"
    r"|(?:продажа|в\s+продаже|публикаци\w*|выставим|выложим|опубликуем)\s+(?:будет\s+)?(?:на|в|с|после)\s+\d{1,2}[:.]\d{2}"  # «Продажа на 18:30»
    r"|(?:скоро|завтра|позже|через\s+\S+\s+\S+)\s+(?:поступ\w+|появ\w+|выйд\w+)\s+(?:в\s+)?продаж"          # «скоро поступит в продажу»
    r"|(?:в\s+течени\w+|через)\s+(?:часа|часик\w*|\S+\s+(?:минут\w*|час\w*))\s+(?:закину|будет|выложу|скину|выставлю)"
    r"|\bожидайте\b|завтра\s+(?:будет|выставлю|выставим|выложу|выложим|покажу|покажем)"
    r"|сейчас\s+(?:помоем|отмоем|сфоткаем|отснимем)\w*\s+и\s+(?:опубликуем|выложим|выставим)")


PROMO = re.compile(
    r"обучени|наставни|менторств|вебинар|интенсив|мастер-?класс|\bученик|\bуроки?\b|\bкурс(?:а|ы|ов|ом)?\b(?!\s+(?:валют|доллар|евро|юан|цб))"
    r"|розыгрыш|разыгрыва|конкурс|франшиз|инфопродукт|закрыт\w*\s+(?:клуб|чат|канал)\w*\s+(?:для|перекуп)")


def is_promo(text: str) -> bool:
    """Реклама курса, наставничества, розыгрыша — не объявление о продаже машины."""
    return bool(PROMO.search(text.lower().replace("ё", "е")))


def is_teaser(text: str) -> bool:
    """Анонс, а не продажа: «скоро в продаже», «через 5 минут в продаже» — машину ещё нельзя купить."""
    return bool(TEASER.search(text.lower().replace("ё", "е")))


def looks_like_ad(text: str) -> bool:
    """Похоже на объявление о продаже — стоит ли звать ИИ, если правила не нашли машину или цену."""
    t = text.lower()
    return len(t) > 25 and bool(re.search(r"пробег|км\b|₽|руб|цена|продам|продаю|продается|продаётся|торг|год", t))


# «Кредит/залог» — это обременение машины («в кредите», «кредитная», «остаток по кредиту», «залог», «арест», «запрет»).
# А «можно купить в кредит», «оформим в кредит», «кредит/рассрочка от банка/салона», «подробности у менеджера» — способ оплаты,
# который предлагает продавец: машина при этом чистая (владелец 08.11: Citroen C3 «можно купить в кредит» получил метку «кредит/залог»).
CREDIT_OFFER = re.compile(
    r"(?:купить|покупк\w*|оформ\w*|возьм\w*|взять|приобре\w*|прода\w*|выда\w*|одобр\w*|доступн\w*|возможн\w*|можно|помож\w*|поможем)"
    r"(?:\s+\S+){0,3}?\s+в\s+кредит(?![а-я])"
    r"|в\s+кредит(?![а-я])\s+(?:и|или)\s+(?:в\s+)?рассрочк|(?:авто)?кредит\s+(?:от|через|в)\s+(?:банк|салон|нас|партн)"
    r"|рассрочк|автокредит|подробност\w*\s+у\s+менеджер|первоначальн\w*\s+взнос|без\s+справок|одобрени")
CREDIT_REAL = re.compile(r"в\s+кредите|кредитн\w+|остат\w*|залог|обремен|арест|запрет|под\s+кредит|кредит\s+не\s+(?:закрыт|погаш)|банк\w*\s+(?:держ|забер)|плат\w+\s+кредит")

CREDIT_NEG = re.compile(r"(?:без|нет|никаких|не\s+(?:в|под))\s+(?:\w+\s+){0,2}?(?:залог\w*|запрет\w*|обремен\w*|арест\w*|кредит\w*|ограничен\w*)(?:\s+(?:и|или|,)\s+(?:\w+\s+)?(?:залог\w*|запрет\w*|обремен\w*|арест\w*|ограничен\w*))*"
                        r"|(?:залог\w*|запрет\w*|обремен\w*|арест\w*|ограничен\w*)\s+(?:нет|отсутству\w*)")


def credit_is_offer(text: str) -> bool:
    """Про кредит в тексте говорится только как о способе оплаты — обременения не видно."""
    t = clean(text).lower().replace("ё", "е")
    t = CREDIT_NEG.sub(" ", t)                                   # «без залогов и запретов» — не обременение
    return bool(CREDIT_OFFER.search(t)) and not CREDIT_REAL.search(t)


def _bare_number(text: str, d: Dictionary, make: str, model: str) -> bool:
    """Модель узнана только по числу («520», «2112»), а марка словом не названа — при упоминании квадроцикла или мотоцикла это не машина."""
    lines = [norm(x).split() for x in clean(text).splitlines()]
    if make in named_makes(lines, d):
        return False
    hits = [(toks, h) for toks in lines for h in d.cars.find(toks) if h.payload[0] == "model" and h.payload[1:3] == (make, model)]
    return bool(hits) and all(h.end - h.start == 1 and toks[h.start].isdigit() for toks, h in hits)


def parse_post(text: str, d: Dictionary, channel_region: str | None = None) -> Listing:
    tokens = norm(clean(text)).split()
    L = Listing(text=text, tokens=tokens)
    L.make, L.model = pick_car(text, d)
    kind = vehicle_kind(text)
    if kind and (not L.model or _bare_number(text, d, L.make, L.model)):
        # «Honda CBR 600, спортбайк» — мотоцикл, а не машина Honda; «квадроцикл CFMoto 520.L» — не BMW 520 (марка не названа,
        # модель — голое число); а «Камри 2014, обмен на мотоцикл» — машина
        L.kind, L.title, L.make, L.model = kind, vehicle_title(text), None, None
    L.price = parse_price(text)
    L.price_unsure = price_unsure(text)
    L.year = parse_year(text)
    L.mileage = parse_mileage(text)
    L.accidents = parse_accidents(text)
    L.teaser = is_teaser(text)
    if L.make and is_promo(text):
        # «обучение всего 35 000 ₽» — не машина. Но объявление с подписью «наше обучение — @…» оставляем:
        # там названа марка и есть год с ценой или пробегом
        if not (L.make in named_makes([norm(line).split() for line in clean(text).splitlines()], d)
                and L.year and (L.price or L.mileage)):
            L.make = L.model = None
    # где машина: город из текста (кроме «пригнана из Москвы», «доставка в Москву»), иначе — город канала
    L.region, L.city = d.find_place(tokens)
    if not L.region:
        L.region = channel_region
    # маркеры — по фразам: отрицание действует только внутри своей фразы («не бит, в кредите» — кредит есть)
    for clause in re.split(r"[.,;!?\n]+", clean(text)):
        L.markers += [m for m in d.find_markers(norm(clause).split()) if m not in L.markers]
    if "credit" in L.markers and credit_is_offer(text):
        L.markers.remove("credit")
    return L


SOLD = re.compile(
    r"(?:^|\n)[^\w\n]{0,8}(?:продан[аоы]?|продано|снят[аоы]?\s+с\s+продажи|в\s+брони|забронирован\w*)(?![\w])"   # «⛔️ПРОДАН⛔️», «ПРОДАНО!»
    r"|(?:авто(?:мобиль)?|машин[аы]|тачк[аи])\s+(?:уже\s+)?продан"                                   # «автомобиль продан»
    r"|[❌⛔🔴🚫]\ufe0f?\s*продан|продан[аоы]?\s*[❌⛔🔴🚫]|продано\s+за\b"
    r"|[—–-]\s*(?:уже\s+)?продан[аоы]?(?![\w])")                                                    # «… 1 500 000 ₽ — ПРОДАНО»
BUY = re.compile(
    r"(?:^|\n)[^\w\n]{0,8}куплю\b|(?:выкупим|выкуплю|купим|куплю)\s+(?:ваш|твой|твою|вашу|любой|любую|ваше)"
    r"|ищу\s+(?:авто|машин|вариант|тачк)|нужн[аыо]\s+(?:машин|авто|тачк)|присыла\w*\s+(?:ваш|свои|свой)")
NEWS = re.compile(
    r"представил|презентаци|дебют|премьер[аы]\b|выпустил[аи]?\b|начал[аи]?\s+(?:производств|выпуск)|запуска\w*\s+производств"
    r"|росстат|автостат|статистик|по\s+данным|утильсбор|госдум|минпромторг|законопроект|мошенни"
    r"|\bюан\w*|в\s+китае\s+стоит|за\s+рубежом|подорожа|подешеве|продажи\s+(?:новых|автомобил)|показал[аи]?\b|выкатил"
    r"|анонсировал|конвейер|концерн|автоваз|классифайд|€|\$\s?\d|\d\s?\$|джентльмен|давайте|итак,|вы\s+получаете|сядьте"
    r"|аукцион\w*\s+века|ушл\w*\s+с\s+молотка|cars\s*&\s*bids|фильм|знаменит|кто\s+следит|смог\s+удивить|что\s+такое\b"
    r"|россиян|по\s+итогам|квартал|в\s+сравнении|лидерств|сертификац|прототип|средн\w+\s+(?:размер|цен|стоимост)"
    r"|интерес\s+к\b|рынок\s+(?:легков|подержан|автомобил|новых)|на\s+(?:вторичн|авторынк)\w*\s+(?:рынк|росси)"
    r"|(?:на|до|в|к)\s+\d+(?:[.,]\d+)?\s?%|\d+[.,]\d+\s?%|тысяч\w*\s+(?:новых|подержан)|в\s+сша|в\s+германии|в\s+европе|в\s+япони"
    r"|обзор\s+на\b|отсняли|сняли\s+(?:обзор|видео|ролик)|в\s+комментари|делаем\?|как\s+вам\b|ваше\s+мнение|голосуем|опрос")
OWNERS = re.compile(r"владел|хозя|собственник|птс|vin\b|вин\b|регистрац")
PHONE_OR_NICK = re.compile(r"звони|звонит|позвон|пиш\w*\s+(?!в\s+коммент)|в\s+лс|в\s+личк|whatsapp|ватсап|вотс|телеф|тел[.:]|контакт|\bтг\b|@\w{4,}|\+7|(?<!\d)8\s?9\d{2}")
SERVICE = re.compile(
    r"автоподбор|подбор\w*\s+(?:авто|машин)|выездн\w+\s+(?:проверк|диагност)|толщиномер|эвакуатор|шиномонтаж|детейлинг"
    r"|химчистк|тонировк|оформим\s+страхов|осаго|каско|растаможк|пригон\w*\s+(?:авто|под)")
SALE_WORDS = re.compile(r"продам|продаю|прода[её]тся|в\s+продаже|в\s+наличии|продажа\b|реализу\w+|на\s+торгах|торг\b|"
                        r"(?:^|\n)\W*(?:моя\s+|наша\s+)?цена|цена\s*[:\-—]|цена\s+для|отдам\s+за|стоимость\s*[:\-—]|#продаж|#купитьавто|#продам")
SPECS = re.compile(r"владел|хозя|собственник|птс|vin|акпп|мкпп|механик|автомат|л\.?\s?с\b|двигател|мотор|коробк|кузов|окрас"
                   r"|комплектац|пробег|на\s+ходу|полном\s+ходу|дтп|вложени|салон|ходов|ключ")


def sale_score(text: str, L: Listing) -> int:
    """Насколько пост похож на объявление о продаже: машина, модель, год, цена, пробег, слова продажи, характеристики."""
    t = text.lower().replace("ё", "е")
    return (bool(L.make or L.kind) + bool(L.model or L.title) + bool(L.year) + bool(L.price) + bool(L.mileage)
            + bool(SALE_WORDS.search(t)) + (len(set(m.group(0)[:5] for m in SPECS.finditer(t))) >= 2))


# другая техника: шлём тем, у кого фильтр без марки, и подписываем, что это. Порядок важен: «квадроцикл» раньше «мото»
KINDS = [
    ("квадроцикл", "🛞", re.compile(r"квадроцикл|квадрик|\batv\b|\butv\b|багги")),
    ("снегоход", "🛷", re.compile(r"снегоход|ski[\s-]?doo|буран\b")),
    ("гидроцикл", "🌊", re.compile(r"гидроцикл|sea[\s-]?doo|водный\s+мотоцикл")),
    ("мотоблок", "🚜", re.compile(r"мотоблок|мотокультиватор|культиватор")),
    ("скутер", "🛵", re.compile(r"скутер|мопед|максискутер")),
    ("мотоцикл", "🏍", re.compile(r"мотоцикл|спортбайк|\bбайк|питбайк|\bэндуро|\bмот\b|\bмото\b|чоппер|круизер|ducati|kawasaki|harley|\bktm\b|aprilia|husqvarna|triumph\s+\w|\bcbr\s?\d|\byzf|\bgsx|\bmt[\s-]?\d{2}")),
    ("трактор", "🚜", re.compile(r"трактор|минитрактор")),
    ("спецтехника", "🏗", re.compile(r"экскаватор|погрузчик|спецтехник|манипулятор|автокран")),
]
KIND_ICON = {k: icon for k, icon, _ in KINDS}
VEHICLE_BRAND = re.compile(r"\b(ducati|kawasaki|yamaha|honda|suzuki|bmw|ktm|harley[\s-]?davidson|aprilia|triumph|husqvarna|stels|irbis|cf[\s-]?moto|"
                           r"brp|polaris|lifan|racer|vespa|piaggio|минск|урал|иж|ява|нева|каскад|кировец|мтз|беларус)\b([ \t]+[\w-]+){0,2}", re.I)


def vehicle_kind(text: str) -> str | None:
    t = text.lower().replace("ё", "е")
    return next((k for k, _, rx in KINDS if rx.search(t)), None)


def vehicle_title(text: str) -> str | None:
    """Название техники как у продавца: марка и 1–2 слова после неё («Ducati Panigale 899»), без года и цены."""
    m = VEHICLE_BRAND.search(clean(text))
    if not m:
        return None
    words = [w for w in m.group(0).split() if not re.fullmatch(YEAR, w) and not re.match(r"\d{4,}", w)]   # «2026год» — тоже год
    return " ".join(words)[:40] or None


def sale_verdict(text: str, L: Listing) -> str:
    """Продажа машины или нет — как решил бы человек, пролистывая канал.
    sale / not_sale — правила уверены; check_sale / check_not_sale — пусть посмотрит ИИ (если он недоступен —
    решение после «check_»). Анонсы, проданные машины, «куплю», реклама курсов, новости, услуги — не продажа."""
    t = text.lower().replace("ё", "е")
    if L.teaser or SOLD.search(t):
        return "not_sale"
    if not (L.is_car and L.price):
        return "not_sale"
    score = sale_score(text, L)
    owners, contact = bool(OWNERS.search(t)), bool(PHONE_OR_NICK.search(t))
    # признаки живого объявления: пробег, владельцы, контакт продавца, «продам / в продаже / цена для подписчиков»
    evidence = bool(L.mileage) + owners + contact + bool(SALE_WORDS.search(t))
    against = {name for name, rx in (("promo", PROMO), ("buy", BUY), ("news", NEWS), ("service", SERVICE)) if rx.search(t)}
    news = len({m.group(0) for m in NEWS.finditer(t)})          # разных «новостных» слов в посте
    if news and not (owners or contact) and (news >= 2 or not (L.mileage and SALE_WORDS.search(t))):
        return "not_sale"            # новость или обзор: машина и цена есть, а продавца нет
    if not against:                  # «Toyota Camry 2014, 980 000 ₽, Москва» — короткое, но объявление
        if score >= 4:
            return "sale"
        return "check_sale" if score >= 3 or evidence >= 2 else "check_not_sale"
    if "promo" in against:           # «обучение всего 35 000 ₽»; объявление с подписью «наше обучение» — пусть решит ИИ
        return "check_sale" if score >= 5 and evidence >= 2 else "not_sale"
    # «выкупим ваш авто», «автоподбор» часто стоят подписью под объявлением
    return "check_sale" if score >= 4 and evidence else "check_not_sale"


def fingerprint(text: str) -> str:
    """Один и тот же текст в разных каналах: без ссылок, ников, телефонов, эмодзи и пробелов."""
    t = norm(clean(text))
    return hashlib.sha1(t[:600].encode()).hexdigest()[:16]


def car_key(L: Listing) -> str | None:
    """Та же машина, переписанная другими словами: марка, модель, год, цена, пробег (до тысяч)."""
    km = L.mileage // 1000 if L.mileage else "-"
    if L.kind and L.title and L.year and L.price:
        return f"{L.kind}|{L.title.lower()}|{L.year}|{L.price}|{km}"
    if not (L.make and L.model and L.year and L.price):
        return None
    return f"{L.make}|{L.model}|{L.year}|{L.price}|{km}"
