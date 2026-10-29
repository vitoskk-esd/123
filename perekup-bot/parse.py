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
    markers: list[str] = field(default_factory=list)
    accidents: int | None = None    # сколько ДТП, если продавец написал; 0 — пишет, что не было
    teaser: bool = False            # анонс «скоро в продаже» — не шлём, ждём, когда выставят
    tokens: list[str] = field(default_factory=list)
    parsed_by: str = "rules"
    price_unsure: bool = False      # в посте несколько сумм, похожих на цену, — ИИ перепроверит

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
    elif u and re.match(THS, u) and value < 10_000:     # «55.000т» — уже полные рубли, не 55 млн
        value *= 1_000
    return round(value)


def clean(text: str) -> str:
    """Убираем ссылки, @ники и телефоны — в них цифры, которые путают цену и год."""
    return PHONE.sub(" ", URL.sub(" ", text))


# сумма сразу после этих слов (в той же фразе) — не цена машины: «замена цепи на 250к» (это пробег), «вложено 150к»,
# «торг 20к», «ниже рынка на 100к», «налог 5к». Такие суммы берём, только если других нет совсем.
NOT_PRICE_BEFORE = re.compile(
    r"(?:\bна|\bпри|\bпосле|кажды\w*|через)\s*$"
    r"|вложен|вложил|влож\w*\s+\w*$|потрачен|чек\w*|торг|налог|страхов|осаго|каско|рын\w*|дешевле|дороже|скидк|доплат"
    r"|кредит|залог|остат|платеж|взнос|ремонт|замен|поменя|обслуж|\bто\b|диагност|покраск|запчаст|комплект\s+резин")


def price_candidates(text: str) -> list[tuple[int, int]]:
    """Все суммы, похожие на цену машины, с приоритетом: 4 — «цена: …», 3 — с рублями / «т.р.» / «млн»,
    2 — с «к» / «тыс» (так пишут и пробег), 1 — просто «850 000», 0 — сумма после «замена на», «вложено», «торг»…"""
    t = clean(text).lower().replace("ё", "е")
    found: list[tuple[int, int]] = []
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
        has_cur = bool(m.group("cur") or re.match(CUR, unit) or re.match(r"т\.?\s?р|тр\b", unit))
        grouped = bool(re.fullmatch(r"\d{1,3}(?:[ .  ]\d{3})+", num))
        if not (label or unit or grouped):
            continue
        if re.fullmatch(YEAR, num) and not (label or unit):
            continue
        # «цена 850» без единиц — это тысячи
        if label and not unit and value < 10_000:
            value *= 1000
        if PRICE_MIN <= value <= PRICE_MAX:
            clause = re.split(r"[.,;!?\n(]", t[max(0, m.start("num") - 40):m.start("num")])[-1]
            if label:
                prio = 4
            elif NOT_PRICE_BEFORE.search(clause):
                prio = 0
            else:
                prio = 3 if (has_cur or re.match(MLN, unit)) else 2 if unit else 1
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
            if h.start <= 1:
                score += 2                                   # строка начинается с машины — это заголовок
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


def parse_post(text: str, d: Dictionary, channel_region: str | None = None) -> Listing:
    tokens = norm(clean(text)).split()
    L = Listing(text=text, tokens=tokens)
    L.make, L.model = pick_car(text, d)
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
    regions = d.find_regions(tokens)
    L.region = regions[0] if regions else channel_region
    # маркеры — по фразам: отрицание действует только внутри своей фразы («не бит, в кредите» — кредит есть)
    for clause in re.split(r"[.,;!?\n]+", clean(text)):
        L.markers += [m for m in d.find_markers(norm(clause).split()) if m not in L.markers]
    return L


SOLD = re.compile(
    r"(?:^|\n)[^\w\n]{0,8}(?:продан[аоы]?|продано|снят[аоы]?\s+с\s+продажи|в\s+брони|забронирован\w*)(?![\w])"   # «⛔️ПРОДАН⛔️», «ПРОДАНО!»
    r"|(?:авто(?:мобиль)?|машин[аы]|тачк[аи])\s+(?:уже\s+)?продан"                                   # «автомобиль продан»
    r"|[❌⛔🔴🚫]\ufe0f?\s*продан|продан[аоы]?\s*[❌⛔🔴🚫]|продано\s+за\b")
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
    return (bool(L.make) + bool(L.model) + bool(L.year) + bool(L.price) + bool(L.mileage)
            + bool(SALE_WORDS.search(t)) + (len(set(m.group(0)[:5] for m in SPECS.finditer(t))) >= 2))


def sale_verdict(text: str, L: Listing) -> str:
    """Продажа машины или нет — как решил бы человек, пролистывая канал.
    sale / not_sale — правила уверены; check_sale / check_not_sale — пусть посмотрит ИИ (если он недоступен —
    решение после «check_»). Анонсы, проданные машины, «куплю», реклама курсов, новости, услуги — не продажа."""
    t = text.lower().replace("ё", "е")
    if L.teaser or SOLD.search(t):
        return "not_sale"
    if not (L.make and L.price):
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
    if not (L.make and L.model and L.year and L.price):
        return None
    km = L.mileage // 1000 if L.mileage else "-"
    return f"{L.make}|{L.model}|{L.year}|{L.price}|{km}"
