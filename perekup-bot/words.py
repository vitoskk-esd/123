"""Справочник (cars.yaml) и поиск слов в тексте: марки и модели, регионы, маркеры.

Текст и названия из справочника нормализуются одинаково: нижний регистр, ё→е, дефисы → пробел,
латиница-«двойник» внутри русских слов → кириллица (продавцы пишут «иcпpaвный» латинскими c, p, a,
чтобы обойти фильтры). Группы цифр склеиваются: «1 250 000» → «1250000», чтобы «452» из цены
не нашлось как модель «Буханка».
"""
import re
from dataclasses import dataclass, field
from pathlib import Path

import yaml

LAT2CYR = str.maketrans("aceopxykmthb", "асеорхукмтнв")
CYR = re.compile(r"[а-я]")
LAT = re.compile(r"[a-z]")
# отрицание ПЕРЕД меткой: «без дтп», «не бита», «никаких вложений», «ноль вложений»
NEGATIONS = {"не", "нет", "без", "ни", "никаких", "никакого", "никакой", "никаких", "ноль", "отсутствие", "исключены"}
# отрицание ПОСЛЕ метки: «дтп нет», «залогов и ограничений нет», «вложений не требует», «в дтп не была»
AFTER_NO = {"нет", "отсутствует", "отсутствуют", "отсутствовали", "исключены", "исключено"}
AFTER_NOT_VERBS = ("треб", "нужн", "нужен", "был", "бывал", "участв", "стоит", "стоял", "имеет", "име", "числ", "наход",
                   "надо", "понадоб")


def _fix_mixed(word: str) -> str:
    if CYR.search(word) and LAT.search(word):
        return word.translate(LAT2CYR)
    return word


def norm(text: str) -> str:
    t = text.lower().replace("ё", "е")
    t = re.sub(r"(?<=\d)[ .  ](?=\d{3}(?!\d))", "", t)   # 1 250 000 / 1.250.000 → 1250000
    t = re.sub(r"(?<=\d)[xх](?=\d)", "x", t)   # 4х4 (кириллицей) = 4x4
    t = re.sub(r"[^\w]+", " ", t)
    return " ".join(_fix_mixed(w) for w in t.split())


ENDING = re.compile(r"[аеёиоуыэюяйь]{0,3}|[аеёиоуыэюяйь]?(м|х|ми|го|му|й)|ам|ям|ах|ях|ами|ями|ом|ем|ой|ей|ою|ею")


def _tok_match(alias_tok: str, tok: str) -> bool:
    """Короткие и цифровые — целиком; длинные — с окончанием: «приора» ~ «приору», «москва» ~ «москве»."""
    if len(alias_tok) < 5 or any(ch.isdigit() for ch in alias_tok):
        return tok == alias_tok
    if not CYR.search(alias_tok):           # латиница не склоняется: «ducati» ≠ «ducato»
        return tok == alias_tok or tok == alias_tok + "s"
    if not (tok.startswith(alias_tok[:-1]) and len(tok) <= len(alias_tok) + 3):
        return False
    if len(tok) < len(alias_tok) and alias_tok.endswith(("ое", "ая", "ые", "ий", "ый", "ой", "ее")):
        return False                                    # «видно» ≠ Видное, «видна» ≠ … (владелец 12.11: пост из Уфы пришёл с «Москва и МО»)
    rest = tok[len(alias_tok) - 1:]                     # после основы — только окончание: «москв|е», «солярис|ом», «челн|ах»;
    if rest.startswith(alias_tok[-1]):                  # «мага|зин» — не «Магас», «камаз|ист» — не «КамАЗ» (владелец 12.11: «Магазин № 12» → Ингушетия)
        rest = rest[1:]
    return bool(ENDING.fullmatch(rest))


@dataclass(frozen=True)
class Hit:
    start: int      # номер слова в тексте
    end: int
    payload: tuple


SHORT_ENDINGS = ("а", "у", "ы", "е", "и", "ой")


def _variants(tok: str) -> list[str]:
    """Короткие русские слова на -а/-я ищутся целиком, но с падежом: «нива» → «ниву», «нивы», «ниве»."""
    if len(tok) == 4 and tok[-1] in "ая" and CYR.fullmatch(tok[0]):
        return [tok] + [tok[:-1] + e for e in SHORT_ENDINGS if tok[:-1] + e != tok]
    return [tok]


def negated(tokens: list[str], h: "Hit") -> bool:
    """Метку отменяет отрицание в той же фразе: до неё (за 4 слова) или сразу после — «нет», «не требует», «не было»."""
    if any(t in NEGATIONS for t in tokens[max(0, h.start - 4):h.start]):
        return True
    after = tokens[h.end:h.end + 3]
    if any(t in AFTER_NO for t in after):
        return True
    return any(t == "не" and i + 1 < len(after) and after[i + 1].startswith(AFTER_NOT_VERBS) for i, t in enumerate(after))


class Finder:
    """Ищет фразы по словам. Индекс по первому слову фразы — в нём и полная форма, и основа без последней буквы."""

    def __init__(self, phrases: list[tuple[str, tuple]]):
        self.index: dict[str, list[tuple[list[str], tuple]]] = {}
        for phrase, payload in phrases:
            toks = norm(phrase).split()
            if not toks:
                continue
            for first in _variants(toks[0]):
                key = first if len(first) < 5 or any(c.isdigit() for c in first) else first[:-1]
                self.index.setdefault(key, []).append(([first] + toks[1:], payload))

    def _candidates(self, tok: str):
        seen = self.index.get(tok, [])
        yield from seen
        for n in range(4, len(tok)):
            if tok[:n] != tok:
                yield from self.index.get(tok[:n], [])

    def find(self, tokens: list[str]) -> list[Hit]:
        """Все совпадения без пересечений: при споре побеждает более длинная фраза («ленд крузер прадо» > «ленд крузер»)."""
        hits = []
        for i, tok in enumerate(tokens):
            for toks, payload in self._candidates(tok):
                if i + len(toks) <= len(tokens) and all(_tok_match(a, tokens[i + k]) for k, a in enumerate(toks)):
                    hits.append(Hit(i, i + len(toks), payload))
        hits.sort(key=lambda h: (-(h.end - h.start), h.start))
        taken: set[int] = set()
        out = []
        for h in hits:
            span = set(range(h.start, h.end))
            if not span & taken:
                taken |= span
                out.append(h)
        return sorted(out, key=lambda h: h.start)


@dataclass(frozen=True)
class Marker:
    id: str
    kind: str      # good | bad
    label: str


@dataclass
class Dictionary:
    makes: dict[str, str]                       # id → название
    models: dict[tuple[str, str], str]          # (марка, модель) → «Toyota Camry»
    regions: dict[str, str]                     # id → название
    markers: dict[str, Marker]
    cars: Finder = field(repr=False, default=None)
    places: Finder = field(repr=False, default=None)
    marks: Finder = field(repr=False, default=None)
    latin: dict[str, list[str]] = field(repr=False, default_factory=dict)   # регион → его города латиницей (для ников каналов)
    codes: dict[int, str] = field(repr=False, default_factory=dict)         # автомобильный код региона → регион (38 → Иркутск)
    weak: set[str] = field(repr=False, default_factory=set)                 # названия мест, которые бывают и словом (weak_places.yaml)

    def car_name(self, make: str | None, model: str | None) -> str:
        if make and model:
            return self.models.get((make, model), f"{self.makes.get(make, make)} {model}")
        return self.makes.get(make, "") if make else ""

    def find_cars(self, tokens: list[str]) -> list[tuple[str, str | None]]:
        """[(марка, модель|None)] в порядке появления; голая марка — (марка, None)."""
        return [(h.payload[1], h.payload[2] if h.payload[0] == "model" else None) for h in self.cars.find(tokens)]

    def find_regions(self, tokens: list[str]) -> list[str]:
        return list(dict.fromkeys(h.payload[0] for h in self.places.find(tokens)))

    def find_location(self, tokens: list[str]) -> str | None:
        return self.find_place(tokens)[0]

    def find_place(self, tokens: list[str], text: str | None = None, prefer: str | None = None) -> tuple[str | None, str | None]:
        """(регион, город) — где машина стоит; город — если назван город (а не «Иркутская область»), иначе None.
        Смотрим все упоминания мест по фразам текста (строки, запятые), а не первое попавшееся:
        — «откуда» и «куда» не место продажи: «пригнана из Москвы», «с Питера», «доставка до Москвы», «пригоню в Москву»;
        — адрес не город: «ул. Кирова», «Московское шоссе»;
        — надёжное упоминание — когда видно, что это место: «г. Уфа», «Город: Уфа», «в Уфе», «Уфа» отдельной строкой/фразой;
        — название, которое бывает обычным словом или именем (weak_places.yaml: «Пересвет приборной панели», «продаёт Владимир»,
          «курган», «шахты»), считаем городом только при надёжном упоминании (владелец 12.11);
        — из надёжных берём первое, совпадающее с регионом канала (prefer), иначе первое; надёжных нет — так же из остальных."""
        found = []                                          # (надёжное, регион, город)
        for seg in (_segments(text) if text is not None else [tokens]):
            for h in self.places.find(seg):
                prev, tok = (seg[h.start - 1] if h.start else ""), seg[h.end - 1]       # падеж видно по последнему слову: «в Нижнем Новгороде»
                if prev in ORIGIN:
                    continue
                locative = prev in ("в", "во", "на") and (len(tok) <= 3 or tok.endswith(LOCATIVE) or tok in LOCATIVE_U)
                if prev in ("в", "во", "на") and not locative:
                    continue                                # «в Москву», «в Донецк» — направление; «в Москве», «в Донецке» — место
                if prev in STREET or (h.end < len(seg) and seg[h.end] in STREET_AFTER):
                    continue                                # «ул. Кирова», «пр. Гагарина», «Московское шоссе» — адрес, не город
                rest = [t for i, t in enumerate(seg) if not (h.start <= i < h.end) and t not in PLACE_MARK]
                strong = locative or prev in PLACE_MARK or not rest
                said = " ".join(seg[h.start:h.end])
                if not strong and any(said == w or (said.startswith(w) and len(said) - len(w) <= 3) for w in self.weak):
                    continue                                # «Пересвет приборной панели» — не город
                found.append((strong, h.payload[0], h.payload[1] if len(h.payload) > 1 else None))
        pool = [f for f in found if f[0]] or found
        best = next((f for f in pool if f[1] == prefer), pool[0] if pool else None)
        return (best[1], best[2]) if best else (None, None)

    def guess_region(self, title: str | None, username: str | None) -> str | None:
        """Город канала по названию («АвтоРынок ДНР», «Авто Воронеж») или нику (avto_moskva, AvtoVoronezh, avto_msk);
        нет названия места — по автомобильному коду региона в названии или нике («38 Авторынок», «Авто 161 RUS», avto138)."""
        if title and (found := self.find_regions(norm(title).split())):
            return found[0]
        if title and (rid := self.region_by_code(title)):
            return rid
        if not username:
            return None
        parts = [p for p in re.split(r"[_\d]+|(?<=[a-z])(?=[A-Z])", username) if p]
        segs, flat = {p.lower() for p in parts}, username.lower()
        for rid, names in self.latin.items():
            for n in names:
                if n in segs or (len(n) >= 5 and n in flat):
                    return rid
        return self.region_by_code(username, nick=True)

    def region_by_code(self, text: str, nick: bool = False) -> str | None:
        """Регион по коду с номерного знака: отдельное число из 2–3 цифр (можно «RUS»/«регион» рядом). Не код — часть
        большего числа, время и проценты («24/7», «24 часа», «100%»), цены и пробег («850 тыс», «150 000», «100 км»), годы."""
        for m in (NICK_CODE if nick else TITLE_CODE).finditer(text):
            tail, head = text[m.end():m.end() + 8].lower(), text[max(0, m.start() - 7):m.start()].lower()
            if not nick and (NOT_CODE_AFTER.match(tail) or NOT_CODE_BEFORE.search(head)):
                continue
            if (rid := self.codes.get(int(m.group(1)))):
                return rid
        return None

    def find_markers(self, tokens: list[str]) -> list[str]:
        """Маркеры одной фразы (текст режем по знакам препинания до вызова). «Без запретов / залогов», «не требует
        вложений», «без дтп» — не маркер: в той же фразе за несколько слов до него стоит отрицание."""
        return list(dict.fromkeys(h.payload[0] for h in self.marks.find(tokens) if not negated(tokens, h)))


# код региона в названии: «38 Авторынок», «Авто 161RUS», «Авторынок | 02», «(138)»; не «2024», не «24/7», не «1.5»
TITLE_CODE = re.compile(r"(?<![\d.,/:\-+])(\d{2,3})(?![\d.,/:%\-])")
NICK_CODE = re.compile(r"(?<!\d)(\d{2,3})(?!\d)")
NOT_CODE_AFTER = re.compile(r"\s*(ч\b|час|мин|сек|тыс|т\.?р|руб|₽|р\b|\$|км|л\.?с|лс|лет|год|г\b|%|шт|000|млн|авто\s*в\s*наличии)")
NOT_CODE_BEFORE = re.compile(r"(?:^|\s)(от|до|за|по|свыше|№|n)\s*$")       # «авто до 50», «за 99» — цена; «№ 12» — номер
STREET = {"ул", "улица", "улице", "улицу", "пр", "пр-т", "просп", "проспект", "проспекте", "пер", "переулок", "переулке", "пл", "площадь", "площади",
          "бульвар", "бульваре", "б-р", "наб", "набережная", "набережной", "мкр", "микрорайон", "проезд", "тупик", "аллея", "тракт", "им", "имени", "станция", "ст", "метро", "м"}
STREET_AFTER = {"шоссе", "тракт"}                         # «Московское шоссе», «Сибирский тракт»; «Москва, ул. …» — город (запятую norm съедает)
# слова, после которых название — точно место: «г. Уфа», «Город: Уфа», «пгт Чишмы», «находится в …», «📍 Уфа» (эмодзи norm съедает)
PLACE_MARK = set("г гор город городе п пос поселок поселке пгт с село селе ст станица станице д дер деревня деревне район районе "
                 "обл область области край крае респ республика республике местонахождение местоположение нахожусь находится локация "
                 "регион адрес осмотр".split())
ORIGIN = ("из", "изо", "с", "со", "до")                          # «из Москвы», «с Питера», «доставка до Казани»
LOCATIVE = ("е", "и", "ах", "ях", "ом", "ем")                     # «в Москве», «в Перми», «в Челнах», «в Видном»
LOCATIVE_U = ("крыму",)                                           # «в Крыму» — место, хотя на -у
TR = dict(zip("абвгдеёжзийклмнопрстуфхцчшщъыьэюя", ["a", "b", "v", "g", "d", "e", "e", "zh", "z", "i", "y", "k", "l", "m", "n", "o", "p", "r", "s", "t",
                                                   "u", "f", "h", "ts", "ch", "sh", "sch", "", "y", "", "e", "yu", "ya"]))


def translit(s: str) -> str:
    return "".join(TR.get(c, c if c.isascii() and c.isalnum() else "") for c in s.lower())


ADJ = {"ий": ("ий", "ем", "его", "ему", "им"), "ый": ("ый", "ом", "ого", "ому", "ым"), "ой": ("ой", "ом", "ого", "ому", "ым"),
       "ая": ("ая", "ой", "ую"), "яя": ("яя", "ей", "юю"), "ое": ("ое", "ом", "ого"), "ее": ("ее", "ем", "его")}
WORD_FORMS = {"край": ("край", "крае", "края", "краю"), "область": ("область", "области", "обл"), "республика": ("республика", "республике", "республики"),
              "округ": ("округ", "округе", "округа")}


def _segments(text: str) -> list[list[str]]:
    """Фразы текста для поиска места: строки и куски между запятыми, точками с запятой, скобками, «|», « — »."""
    out = []
    for part in re.split(r"[\n,;!?()|•]+|\s[—–-]\s", text):
        toks = norm(part).split()
        if toks:
            out.append(toks)
    return out


def place_forms(alias: str) -> list[str]:
    """Все падежи названия места: «нижний новгород» → «нижнем новгороде» (второе слово склоняет поиск по основе),
    «московская область» → «московской обл», «краснодарский край» → «краснодарском крае». Одно слово склоняет сам поиск."""
    toks = alias.split()
    if len(toks) == 1:
        return [alias]
    opts = []
    for t in toks:
        if t in WORD_FORMS:
            opts.append(WORD_FORMS[t])
        elif len(t) >= 5 and t[-2:] in ADJ:
            if t[-2:] == "ий" and t[-3] in "кгхжшчщ":       # «краснодарский» → «краснодарском», а не «-скем»; сама «-ий» остаётся
                opts.append((t,) + tuple(t[:-2] + e for e in ("ом", "ого", "ому", "им")))   # (раньше терялась: «Краснодарский край» не находился)
            else:
                opts.append(tuple(t[:-2] + e for e in ADJ[t[-2:]]))
        else:
            opts.append((t,))
    out = [""]
    for o in opts:
        out = [f"{x} {y}".strip() for x in out for y in o]
    return out


def load_dictionary(path: Path) -> Dictionary:
    data = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    makes, models, car_phrases = {}, {}, []
    for mid, m in (data.get("makes") or {}).items():
        makes[mid] = m["name"]
        for alias in m.get("aliases") or []:
            car_phrases.append((str(alias), ("make", mid)))
        for model, aliases in (m.get("models") or {}).items():
            model = str(model)
            models[(mid, model)] = f"{m['name']} {model}"
            for alias in aliases or []:
                car_phrases.append((str(alias), ("model", mid, model)))
            car_phrases.append((f"{m['name']} {model}", ("model", mid, model)))
    regions, place_phrases = {}, []
    cities_path = path.with_name("cities.yaml")          # ~1000 городов России → регион (tools/gen_cities.py); город — раньше алиасов региона,
    if cities_path.exists():                              # чтобы в карточке был «Ангарск», а не только «Иркутская область»
        for rid, names in (yaml.safe_load(cities_path.read_text(encoding="utf-8")) or {}).items():
            place_phrases += [(v, (rid, str(c))) for c in names or [] for v in place_forms(str(c).lower())]
    for rid, r in (data.get("regions") or {}).items():
        regions[rid] = r["name"]
        place_phrases += [(v, (rid,)) for a in r.get("aliases") or [] for v in place_forms(str(a))]
    markers, mark_phrases = {}, []
    for mk in data.get("markers") or []:
        markers[mk["id"]] = Marker(mk["id"], mk["kind"], mk["label"])
        mark_phrases += [(str(w), (mk["id"],)) for w in mk.get("words") or []]
    latin = {rid: list(dict.fromkeys(translit(str(a)) for a in r.get("aliases") or [] if " " not in str(a) and len(translit(str(a))) >= 3))
             for rid, r in (data.get("regions") or {}).items()}
    latin["msk"] += ["moscow", "mos"]; latin["spb"] += ["piter", "spb"]; latin["ekb"] += ["yekaterinburg", "ekb"]
    codes = {int(c): rid for rid, r in (data.get("regions") or {}).items() for c in r.get("codes") or []}
    weak_path = path.with_name("weak_places.yaml")       # tools/audit_places.py: «Пересвет», «Владимир», «Курган», «Шахты»…
    weak = set()
    if weak_path.exists():
        weak = {str(w) for w in (yaml.safe_load(weak_path.read_text(encoding="utf-8")) or {}).get("weak") or []}
    return Dictionary(makes, models, regions, markers,
                      cars=Finder(car_phrases), places=Finder(place_phrases), marks=Finder(mark_phrases), latin=latin, codes=codes, weak=weak)
