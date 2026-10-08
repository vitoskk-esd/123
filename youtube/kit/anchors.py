"""Привязка сцен к словам озвучки для длинного ролика.

words.json (build_voice.py): [{"w", "a", "d"}] — слова в таймлайне монтажа.
A("фраза") — время первого слова фразы (поиск по нормализованным словам, вперёд от курсора);
E("фраза") — время конца последнего слова фразы. Курсор сдвигается, поэтому одинаковые фразы
находятся по порядку. Не нашли — исключение с подсказкой, что рядом в расшифровке.
"""
import difflib, json, re


def norm(w):
    return re.sub(r"[^а-яa-z0-9]", "", w.lower().replace("ё", "е"))


class Words:
    def __init__(self, path):
        d = json.load(open(path))
        self.ws_all = d["words"]                       # все слова (индексы как в файле — для правки субтитров)
        self.ws = [w for w in d["words"] if norm(w["w"])]
        self.duration = d["duration"]
        self.toks = [norm(w["w"]) for w in self.ws]
        self.cur = 0

    @staticmethod
    def _eq(tok, want):
        """Совпадение слова: префикс или (для слов от 5 букв) почти то же написание — Whisper пишет
        «кэшбеком»/«кэшбэком», «каталоге»/«каталоги» по-разному в разных проходах."""
        if tok.startswith(want): return True
        return len(want) >= 5 and difflib.SequenceMatcher(None, tok[:len(want) + 1], want).ratio() >= .8

    def _find(self, phrase, after=None):
        want = [norm(x) for x in phrase.split() if norm(x)]
        start = self.cur if after is None else next(i for i, w in enumerate(self.ws) if w["a"] >= after)
        for i in range(start, len(self.toks) - len(want) + 1):
            if all(self._eq(self.toks[i + k], want[k]) for k in range(len(want))):
                return i, i + len(want) - 1
        near = " ".join(w["w"] for w in self.ws[start:start + 25])
        raise KeyError(f"нет «{phrase}» после {self.ws[start]['a']:.1f} с; дальше в расшифровке: {near}")

    def A(self, phrase, after=None):
        i, j = self._find(phrase, after)
        self.cur = i + 1
        return round(self.ws[i]["a"], 3)

    def E(self, phrase, after=None):
        i, j = self._find(phrase, after)
        self.cur = j + 1
        return round(self.ws[j]["a"] + self.ws[j]["d"], 3)
