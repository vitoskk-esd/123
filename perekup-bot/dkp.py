"""Договор купли-продажи ТС (тариф PRO): клиент присылает данные одним сообщением — по шаблону «поле: значение»
или как попало (тогда поля разбирает ИИ), бот собирает договор в Word (поправить) и PDF (распечатать).
Чего нет — в договоре остаются линии, их дописывают от руки. Паспортные данные в базу не пишем: живут только
в памяти диалога до выдачи файлов."""
import asyncio
import io
import logging
import re
from datetime import datetime, timedelta, timezone
from pathlib import Path

import ai

log = logging.getLogger(__name__)
MSK = timezone(timedelta(hours=3))
FONT_DIR = Path(__file__).parent
BLANK = "_______________"

# поле → (подпись в шаблоне, синонимы для разбора «как написали»)
FIELDS = {
    "city": ("Город", ["город", "место"]),
    "date": ("Дата", ["дата", "число"]),
    "seller_name": ("Продавец ФИО", ["продавец фио", "фио продавца", "продавец"]),
    "seller_birth": ("Продавец дата рождения", ["продавец дата рождения", "дата рождения продавца", "продавец др"]),
    "seller_passport": ("Продавец паспорт", ["продавец паспорт", "паспорт продавца"]),
    "seller_issued": ("Продавец паспорт выдан", ["продавец паспорт выдан", "продавец выдан", "паспорт продавца выдан"]),
    "seller_address": ("Продавец адрес", ["продавец адрес", "адрес продавца", "продавец прописка"]),
    "buyer_name": ("Покупатель ФИО", ["покупатель фио", "фио покупателя", "покупатель"]),
    "buyer_birth": ("Покупатель дата рождения", ["покупатель дата рождения", "дата рождения покупателя", "покупатель др"]),
    "buyer_passport": ("Покупатель паспорт", ["покупатель паспорт", "паспорт покупателя"]),
    "buyer_issued": ("Покупатель паспорт выдан", ["покупатель паспорт выдан", "покупатель выдан", "паспорт покупателя выдан"]),
    "buyer_address": ("Покупатель адрес", ["покупатель адрес", "адрес покупателя", "покупатель прописка"]),
    "car": ("Марка, модель", ["марка модель", "марка", "модель", "автомобиль", "машина", "тс"]),
    "vin": ("VIN", ["vin", "вин", "идентификационный номер"]),
    "year": ("Год выпуска", ["год выпуска", "год"]),
    "engine": ("Номер двигателя", ["номер двигателя", "двигатель", "двигатель №"]),
    "body": ("Номер кузова", ["номер кузова", "кузов", "кузов №"]),
    "color": ("Цвет", ["цвет"]),
    "power": ("Мощность двигателя, л.с.", ["мощность двигателя", "мощность", "лс", "л с"]),
    "plate": ("Госномер", ["госномер", "гос номер", "гос рег знак", "государственный номер", "номер авто"]),
    "pts": ("ПТС", ["птс", "паспорт тс", "эптс"]),
    "sts": ("СТС", ["стс", "свидетельство о регистрации"]),
    "mileage": ("Пробег", ["пробег"]),
    "price": ("Цена", ["цена", "стоимость", "сумма"]),
}
MAIN = ["seller_name", "buyer_name", "car", "price"]     # без этих договор не собрать; паспорта — по желанию
OPTIONAL = {"seller_birth", "seller_passport", "seller_issued", "seller_address", "buyer_birth", "buyer_passport", "buyer_issued", "buyer_address"}


def template() -> str:
    """Шаблон для копирования; паспортные строки помечены «по желанию» — их можно стереть или оставить пустыми."""
    return "\n".join(f"{label}{' (по желанию)' if k in OPTIONAL else ''}: " for k, (label, _) in FIELDS.items())


_norm = lambda s: re.sub(r"\s+", " ", re.sub(r"[^a-zа-я0-9 ]", " ", s.lower().replace("ё", "е"))).strip()
_LOOKUP = sorted(((_norm(syn), key) for key, (label, syns) in FIELDS.items() for syn in [label] + syns), key=lambda x: -len(x[0]))


def parse(text: str) -> dict:
    """«Поле: значение» построчно; длинные подписи проверяем раньше коротких («продавец паспорт выдан» ≠ «продавец паспорт»)."""
    out = {}
    for line in text.splitlines():
        if ":" not in line and "—" not in line and " - " not in line:
            continue
        head, _, value = re.split(r"(:|—| - )", line, maxsplit=1)
        value = value.strip(" \t:—-")
        if not value:
            continue
        h = _norm(head)
        key = next((k for syn, k in _LOOKUP if h == syn), None) or next((k for syn, k in _LOOKUP if h.startswith(syn)), None)
        if key and key not in out:
            out[key] = value[:200]
    if "price" in out:
        out["price"] = clean_price(out["price"])
    return {k: v for k, v in out.items() if v}


def clean_price(v: str) -> str:
    from parse import parse_price
    p = parse_price(f"цена {v}") or (int(re.sub(r"\D", "", v)) if re.sub(r"\D", "", v) else None)
    return str(p) if p else ""


SCHEMA = {"type": "object", "properties": {k: {"type": "string"} for k in FIELDS}}


def ai_extract(cfg, text: str) -> dict:
    """Данные написали как попало — пусть ИИ разложит по полям (только то, что есть в тексте)."""
    prompt = ("Из текста клиента достань данные для договора купли-продажи автомобиля. Заполняй только то, что прямо есть "
              "в тексте, ничего не выдумывай. Поля: " + "; ".join(f"{k} — {label}" for k, (label, _) in FIELDS.items())
              + ". Паспорт — серия и номер; «выдан» — кем и когда. Цена — число в рублях.\n\nТекст:\n" + text)
    body = {"contents": [{"role": "user", "parts": [{"text": prompt}]}],
            "generationConfig": {"responseMimeType": "application/json", "responseJsonSchema": SCHEMA, "maxOutputTokens": 900, "temperature": 0}}
    for m in dict.fromkeys((cfg.ai_model, ai.FALLBACK)):
        try:
            r = ai._post(cfg.ai_key, m, body, timeout=20)
            out = {k: str(v).strip()[:200] for k, v in r.items() if k in FIELDS and str(v).strip()}
            if "price" in out:
                out["price"] = clean_price(out["price"])
            return {k: v for k, v in out.items() if v}
        except Exception as e:
            log.info("договор: ИИ не разобрал данные (%s): %s", m, e)
    return {}


async def extract(cfg, text: str) -> dict:
    found = parse(text)
    if len(found) < 4 and cfg.ai_on:
        more = await asyncio.to_thread(ai_extract, cfg, text)
        found = {**more, **found}
    return found


def summary(d: dict) -> tuple[str, list[str]]:
    """Что поняли (строки «подпись: значение») и каких главных полей нет."""
    lines = [f"• {FIELDS[k][0]}: <b>{_esc(rub(d[k]) + ' ₽' if k == 'price' else d[k])}</b>" for k in FIELDS if d.get(k)]
    missing = [FIELDS[k][0] for k in MAIN if not d.get(k)]
    if not (d.get("vin") or d.get("body")):           # у праворульных «японцев» VIN нет — тогда хватит номера кузова
        missing.append("VIN или номер кузова")
    return "\n".join(lines), missing


def _esc(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def rub(v) -> str:
    return f"{int(v):,}".replace(",", " ")


# ---------- сумма прописью
_U = ["", "один", "два", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять"]
_UF = ["", "одна", "две", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять"]
_T = ["десять", "одиннадцать", "двенадцать", "тринадцать", "четырнадцать", "пятнадцать", "шестнадцать", "семнадцать", "восемнадцать", "девятнадцать"]
_D = ["", "", "двадцать", "тридцать", "сорок", "пятьдесят", "шестьдесят", "семьдесят", "восемьдесят", "девяносто"]
_H = ["", "сто", "двести", "триста", "четыреста", "пятьсот", "шестьсот", "семьсот", "восемьсот", "девятьсот"]


def _form(n: int, f: tuple) -> str:
    n %= 100
    if 11 <= n <= 19:
        return f[2]
    return f[0] if n % 10 == 1 else f[1] if 2 <= n % 10 <= 4 else f[2]


def _three(n: int, fem: bool) -> list[str]:
    out = [_H[n // 100]]
    t = n % 100
    if 10 <= t <= 19:
        out.append(_T[t - 10])
    else:
        out += [_D[t // 10], (_UF if fem else _U)[t % 10]]
    return [w for w in out if w]


def words(n: int) -> str:
    """1 250 000 → «один миллион двести пятьдесят тысяч»."""
    if n == 0:
        return "ноль"
    parts = []
    for div, fem, f in ((10 ** 9, False, ("миллиард", "миллиарда", "миллиардов")), (10 ** 6, False, ("миллион", "миллиона", "миллионов")),
                        (1000, True, ("тысяча", "тысячи", "тысяч"))):
        q = n // div % 1000
        if q:
            parts += _three(q, fem) + [_form(q, f)]
    parts += _three(n % 1000, False)
    return " ".join(parts)


MONTHS = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"]


def _date(d: dict) -> str:
    raw = d.get("date")
    m = re.search(r"(\d{1,2})[.\-/ ](\d{1,2})[.\-/ ](\d{2,4})", raw or "")
    if m:
        dd, mm, yy = int(m.group(1)), int(m.group(2)), int(m.group(3))
        yy = yy + 2000 if yy < 100 else yy
        if 1 <= mm <= 12:
            return f"«{dd:02d}» {MONTHS[mm - 1]} {yy} г."
    if raw:
        return raw
    now = datetime.now(MSK)
    return f"«{now.day:02d}» {MONTHS[now.month - 1]} {now.year} г."


def _short(name: str | None) -> str:
    """Иванов Пётр Иванович → Иванов П. И."""
    if not name:
        return BLANK
    p = name.split()
    return " ".join([p[0]] + [w[0] + "." for w in p[1:3]]) if len(p) > 1 else name


def paragraphs(d: dict) -> list[tuple[str, str]]:
    """Текст договора: (вид, строка) — title, center, p, sign."""
    g = lambda k: d.get(k) or BLANK
    def party(who: str) -> str:
        born = f", {d[who + '_birth']} г.р." if d.get(who + "_birth") else f", дата рождения {BLANK}"
        return (f"{g(who + '_name')}{born}, паспорт {g(who + '_passport')}, выдан {g(who + '_issued')}, "
                f"зарегистрирован(а) по адресу: {g(who + '_address')}")
    price = int(d["price"]) if d.get("price", "").isdigit() else None
    price_txt = f"{rub(price)} ({words(price)}) рублей" if price else f"{BLANK} ({BLANK}) рублей"
    car = [("марка, модель", g("car")), ("идентификационный номер (VIN)", g("vin")), ("год выпуска", g("year")),
           ("номер двигателя", g("engine")), ("номер кузова", g("body")), ("цвет", g("color")), ("мощность двигателя, л.с.", g("power")),
           ("государственный регистрационный знак", g("plate")), ("паспорт ТС (ПТС / ЭПТС)", g("pts")),
           ("свидетельство о регистрации ТС (СТС)", g("sts"))] + ([("пробег", d["mileage"])] if d.get("mileage") else [])
    return [
        ("title", "ДОГОВОР КУПЛИ-ПРОДАЖИ ТРАНСПОРТНОГО СРЕДСТВА"),
        ("center", f"г. {g('city')}                                        {_date(d)}"),
        ("p", f"{party('seller')}, именуемый(ая) в дальнейшем «Продавец», с одной стороны, и {party('buyer')}, "
              f"именуемый(ая) в дальнейшем «Покупатель», с другой стороны, заключили настоящий договор о нижеследующем:"),
        ("p", "1. Продавец передаёт в собственность Покупателя, а Покупатель принимает и оплачивает транспортное средство (далее — ТС):"),
        *[("li", f"{a}: {b}") for a, b in car],
        ("p", "2. ТС принадлежит Продавцу на праве собственности, что подтверждается паспортом ТС и свидетельством о регистрации ТС, указанными выше."),
        ("p", f"3. Стоимость ТС составляет {price_txt}."),
        ("p", f"4. Покупатель передал, а Продавец получил денежные средства за ТС в размере {price_txt} полностью до подписания настоящего договора."),
        ("p", "5. Продавец гарантирует, что ТС никому не продано, не заложено, в споре и под арестом (запретом) не состоит, "
              "не обременено правами третьих лиц."),
        ("p", "6. Покупатель осмотрел ТС до подписания договора, техническое состояние и комплектность ему известны, "
              "претензий к Продавцу не имеет."),
        ("p", "7. Право собственности на ТС переходит к Покупателю с момента подписания настоящего договора. Одновременно с подписанием "
              "Продавец передаёт Покупателю ТС, ключи и документы: паспорт ТС и свидетельство о регистрации ТС."),
        ("p", "8. Покупатель в течение 10 дней со дня подписания договора обязан обратиться в Госавтоинспекцию для изменения "
              "регистрационных данных о собственнике ТС."),
        ("p", "9. Договор составлен в трёх экземплярах, имеющих одинаковую юридическую силу: по одному для Продавца, Покупателя "
              "и Госавтоинспекции."),
        ("sign", f"Продавец: ____________________ / {_short(d.get('seller_name'))} /"),
        ("sign", f"Деньги в сумме {rub(price) if price else BLANK} руб. получил: ____________________"),
        ("sign", f"Покупатель: ____________________ / {_short(d.get('buyer_name'))} /"),
        ("sign", "Транспортное средство, ключи и документы получил: ____________________"),
    ]


def docx_bytes(d: dict) -> bytes:
    from docx import Document
    from docx.enum.text import WD_ALIGN_PARAGRAPH
    from docx.shared import Cm, Pt
    doc = Document()
    for s in doc.sections:
        s.left_margin = s.right_margin = Cm(2); s.top_margin = s.bottom_margin = Cm(1.6)
    st = doc.styles["Normal"]; st.font.name = "Times New Roman"; st.font.size = Pt(12)
    for kind, text in paragraphs(d):
        p = doc.add_paragraph()
        run = p.add_run(text)
        if kind == "title":
            run.bold = True; run.font.size = Pt(14); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        elif kind == "center":
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        elif kind == "li":
            p.paragraph_format.left_indent = Cm(1)
        elif kind == "sign":
            p.paragraph_format.space_before = Pt(14)
        else:
            p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.space_after = Pt(4)
    buf = io.BytesIO(); doc.save(buf)
    return buf.getvalue()


def pdf_bytes(d: dict) -> bytes:
    """PDF для печати: страницы A4 рисуем шрифтом Inter (кириллица есть) и складываем в один файл."""
    from PIL import Image, ImageDraw, ImageFont
    W, H, M = 1654, 2339, 150                    # A4 при 200 dpi, поля 1,9 см
    reg = ImageFont.truetype(str(FONT_DIR / "Inter-Regular.otf"), 28)
    bold = ImageFont.truetype(str(FONT_DIR / "Inter-Bold.otf"), 38)
    pages, page, y = [], None, 0

    def new_page():
        nonlocal page, y
        page = Image.new("RGB", (W, H), "white"); pages.append(page); y = M

    def wrap(text, font, width):
        out, line = [], ""
        for w in text.split(" "):
            t = (line + " " + w).strip()
            if font.getlength(t) <= width:
                line = t
            else:
                out.append(line); line = w
        return out + [line]

    new_page()
    for kind, text in paragraphs(d):
        font = bold if kind == "title" else reg
        indent = 60 if kind == "li" else 0
        gap = 30 if kind == "sign" else 10
        lines = wrap(text, font, W - 2 * M - indent)
        if y + gap + len(lines) * 40 > H - M:
            new_page()
        y += gap
        dr = ImageDraw.Draw(page)
        for ln in lines:
            x = (W - font.getlength(ln)) / 2 if kind in ("title", "center") else M + indent
            dr.text((x, y), ln, font=font, fill="black"); y += 48 if kind == "title" else 40
    buf = io.BytesIO()
    pages[0].save(buf, "PDF", resolution=200, save_all=True, append_images=pages[1:])
    return buf.getvalue()


def filename(d: dict, ext: str) -> str:
    car = re.sub(r"[^A-Za-zА-Яа-яЁё0-9]+", "_", d.get("car") or "avto").strip("_")[:30]
    return f"DKP_{car}_{datetime.now(MSK).strftime('%Y-%m-%d')}.{ext}"
