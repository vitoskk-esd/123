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
NEGATIONS = {"не", "нет", "без", "ни"}


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


def _tok_match(alias_tok: str, tok: str) -> bool:
    """Короткие и цифровые — целиком; длинные — с окончанием: «приора» ~ «приору», «москва» ~ «москве»."""
    if len(alias_tok) < 5 or any(ch.isdigit() for ch in alias_tok):
        return tok == alias_tok
    return tok.startswith(alias_tok[:-1]) and len(tok) <= len(alias_tok) + 3


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

    def car_name(self, make: str | None, model: str | None) -> str:
        if make and model:
            return self.models.get((make, model), f"{self.makes.get(make, make)} {model}")
        return self.makes.get(make, "") if make else ""

    def find_cars(self, tokens: list[str]) -> list[tuple[str, str | None]]:
        """[(марка, модель|None)] в порядке появления; голая марка — (марка, None)."""
        return [(h.payload[1], h.payload[2] if h.payload[0] == "model" else None) for h in self.cars.find(tokens)]

    def find_regions(self, tokens: list[str]) -> list[str]:
        return list(dict.fromkeys(h.payload[0] for h in self.places.find(tokens)))

    def find_markers(self, tokens: list[str]) -> list[str]:
        """Маркеры одной фразы (текст режем по знакам препинания до вызова). «Без запретов / залогов», «не требует
        вложений», «без дтп» — не маркер: в той же фразе за несколько слов до него стоит отрицание."""
        return list(dict.fromkeys(h.payload[0] for h in self.marks.find(tokens)
                                  if not any(t in NEGATIONS for t in tokens[max(0, h.start - 4):h.start])))


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
    for rid, r in (data.get("regions") or {}).items():
        regions[rid] = r["name"]
        place_phrases += [(str(a), (rid,)) for a in r.get("aliases") or []]
    markers, mark_phrases = {}, []
    for mk in data.get("markers") or []:
        markers[mk["id"]] = Marker(mk["id"], mk["kind"], mk["label"])
        mark_phrases += [(str(w), (mk["id"],)) for w in mk.get("words") or []]
    return Dictionary(makes, models, regions, markers,
                      cars=Finder(car_phrases), places=Finder(place_phrases), marks=Finder(mark_phrases))
