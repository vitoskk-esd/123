#!/usr/bin/env python3
"""Сборщик таймлайна YouTube-движка «режимы» по словам голоса (Y6).

Ролик описывается в своём build-скрипте как последовательность отрезков, привязанных к фразам озвучки:

    from build import Build
    B = Build("out/words.json", foot="Условия на дату записи…")
    B.chapter("Кредитная карта. По данным", "СПОСОБ 1 · КРЕДИТКА")
    B.seg("editorial", "Кредитная карта. По данным", {"title": "…", "stats": [...]})
    B.seg("search", "Главная ловушка", {"query": "…", "tAns": "@внеси полторы"}, tin={"type": "flash"})
    B.write("timeline_yt.js", page="video_yt.html")

Любое строковое значение в data вида "@фраза" превращается во время начала фразы, "@>фраза" — во время её конца,
в секундах ОТ НАЧАЛА ОТРЕЗКА (так режимы получают локальные времена). Фразы ищутся вперёд от начала отрезка.
Отрезок начинается за `lead` секунд до своей фразы и длится до начала следующего; последний — до конца голоса + хвост.

Проверки при записи: правила ритма (≤ 90 с одним режимом подряд, «Ночной офис» ≤ 2 отрезков, отрезок ≥ 2 с) и
«мёртвые зоны» — промежутки > 4 с без событий внутри отрезка (событие = любое время из data или начало отрезка).

Черновые слова до записи голоса: `python3 build.py draft script.md out/words.json` — текст сценария без пометок [..],
темп ~150 слов/мин, паузы на точках; в понедельник words.json заменяется словами настоящего голоса (Whisper).
"""
import json, os, re, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from anchors import Words, norm

NAMES = {"office": "Ночной офис", "editorial": "Журнальная инфографика", "phone": "Телефон крупно", "board": "Маркерная доска",
         "search": "Поиск", "scrap": "Коллаж-скрапбук", "swipe": "Свайп-карточки", "voice": "Голосовое сообщение", "ai": "ИИ-ассистент", "premium": "Премиум"}


class Build:
    def __init__(self, words_json, size=(1920, 1080), foot="", lead=.25, tail=1.5):
        self.W = Words(words_json)
        self.size, self.foot, self.lead, self.tail = list(size), foot, lead, tail
        self.segs, self.chapters = [], []
        self.end = self.W.ws[-1]["a"] + self.W.ws[-1]["d"]

    # --- поиск по словам ---
    def _find(self, phrase, start_t):
        i0 = next((i for i, w in enumerate(self.W.ws) if w["a"] >= start_t - .05), len(self.W.ws) - 1)
        self.W.cur = i0
        return self.W._find(phrase)

    def at(self, phrase, after=0.0):
        i, j = self._find(phrase, after); return self.W.ws[i]["a"]

    def end_of(self, phrase, after=0.0):
        i, j = self._find(phrase, after); return self.W.ws[j]["a"] + self.W.ws[j]["d"]

    # --- описание ролика ---
    def stop(self, phrase):
        """Собрать кусок ролика: конец — на конце этой фразы (+ хвост); начало — с первого отрезка."""
        after = self.segs[-1]["_start"] if self.segs else 0
        self.end = self.end_of(phrase, after)

    def chapter(self, phrase, label):
        after = self.segs[-1]["_start"] if self.segs else 0
        self.chapters.append({"t": round(self.at(phrase, after) - self.lead, 3), "label": label})

    def seg(self, mode, phrase, data=None, tin=None, marks=None):
        after = self.segs[-1]["_start"] if self.segs else 0
        start = self.at(phrase, after)
        s = {"mode": mode, "_start": start, "_phrase": phrase, "data": data or {}}
        if tin: s["tin"] = tin
        if marks: s["marks"] = marks
        self.segs.append(s); return s

    # --- сборка ---
    def _resolve(self, v, t0, after):
        if isinstance(v, str) and v.startswith("@"):
            if v.startswith("@>"): return round(self.end_of(v[2:], after) - t0, 3)
            return round(self.at(v[1:], after) - t0, 3)
        if isinstance(v, list): return [self._resolve(x, t0, after) for x in v]
        if isinstance(v, dict): return {k: self._resolve(x, t0, after) for k, x in v.items()}
        return v

    def timeline(self):
        out = []
        base = max(0.0, self.segs[0]["_start"] - self.lead)   # кусок из середины ролика: время 0 — начало первого отрезка
        self.base = base
        for i, s in enumerate(self.segs):
            a0 = base if i == 0 else s["_start"] - self.lead
            a1 = self.segs[i + 1]["_start"] - self.lead if i + 1 < len(self.segs) else self.end + self.tail
            t0, t1 = round(a0 - base, 3), round(a1 - base, 3)
            seg = {"mode": s["mode"], "t0": t0, "t1": t1, "data": self._resolve(s["data"], a0, s["_start"] - .05)}
            for k in ("tin", "marks"):
                if k in s: seg[k] = s[k]
            out.append(seg)
        chapters = [{"t": round(max(0, c["t"] - base), 3), "label": c["label"]} for c in self.chapters]
        return {"size": self.size, "fps": 30, "foot": self.foot, "chapters": chapters, "segs": out, "base": round(base, 3)}

    def lint(self, tl):
        warn, run = [], None
        fmt = lambda x: f"{int(x // 60)}:{int(x % 60):02d}"
        for s in tl["segs"]:
            d = s["t1"] - s["t0"]
            if d < 2: warn.append(f"{fmt(s['t0'])} отрезок {d:.1f} с — короче 2 с")
            run = [s["mode"], s["t0"], (run[2] + d) if run and run[0] == s["mode"] else d]
            if run[2] > 90: warn.append(f"{fmt(run[1])} «{NAMES.get(s['mode'], s['mode'])}» {run[2]:.0f} с подряд (> 90 с)")
            times = sorted({0.0, d} | {x for x in self._times(s["data"]) if 0 <= x <= d})
            gaps = [(b - a, a) for a, b in zip(times, times[1:])]
            g, ga = max(gaps)
            if g > 4: warn.append(f"{fmt(s['t0'] + ga)} «мёртвая зона» {g:.1f} с в «{NAMES.get(s['mode'], s['mode'])}» — добавь событие")
        n = sum(1 for s in tl["segs"] if s["mode"] == "office")
        if n > 2: warn.append(f"«Ночной офис» — {n} отрезков (правило ≤ 2)")
        return list(dict.fromkeys(warn))

    def _times(self, v):
        if isinstance(v, (int, float)) and not isinstance(v, bool): yield float(v)
        elif isinstance(v, list):
            for x in v: yield from self._times(x)
        elif isinstance(v, dict):
            for k, x in v.items():
                if k in ("t", "tq", "ta", "tAns", "tSug", "tIn", "tTr", "hl", "circle", "draw", "strike", "beats", "t0", "t1", "rowsT", "at", "capAt", "pulses") or isinstance(x, (dict, list)):
                    yield from self._times(x)

    def write(self, path, page=None, kit_rel=None):
        tl = self.timeline()
        for w in self.lint(tl): print("ритм:", w)
        open(path, "w").write("window.YT_TL = " + json.dumps(tl, ensure_ascii=False) + ";\n")
        if page:
            kit = kit_rel or os.path.relpath(os.path.dirname(os.path.abspath(__file__)), os.path.dirname(os.path.abspath(page)))
            mods = "".join(f'<script src="{kit}/modes/{m}.js"></script>' for m in NAMES)
            open(page, "w").write(f'<!doctype html>\n<html lang="ru"><head><meta charset="utf-8"><title>YouTube — режимы</title>\n'
                                  f'<link rel="stylesheet" href="{kit}/yt.css"><script src="{kit}/yt.js"></script>{mods}\n'
                                  f'<script src="{os.path.basename(path)}"></script></head>\n<body><script>YT.play(window.YT_TL);</script></body></html>\n')
        segs = tl["segs"]
        print(f"отрезков {len(segs)}, длительность {segs[-1]['t1']:.1f} с (с {tl['base']:.2f} с голоса); режимы: " +
              ", ".join(f"{NAMES[m]} {sum(s['t1'] - s['t0'] for s in segs if s['mode'] == m):.0f} с" for m in NAMES if any(s['mode'] == m for s in segs)))
        return tl


def draft_words(script_md, out_json, wpm=150):
    """Черновые слова из сценария (до записи голоса): текст без [пометок], заголовков и таблиц, темп wpm, паузы на точках."""
    txt = open(script_md, encoding="utf-8").read()
    a, b = txt.find("## 0."), txt.find("## Открытые петли")
    body = txt[a:b if b > 0 else None]
    lines = [l for l in body.splitlines() if l.strip() and not l.startswith(("#", "|", "<!--")) and not l.strip().startswith("[")]
    text = re.sub(r"\[[^\]]*\]", " ", " ".join(lines)).replace("*", "")
    ws, t, step = [], .3, 60 / wpm
    for w in text.split():
        if not norm(w): continue
        ws.append({"w": w, "a": round(t, 3), "d": round(step * .85, 3)}); t += step
        if w[-1] in ".!?:": t += .35
        elif w[-1] in ",—": t += .12
    json.dump({"duration": round(t + .5, 3), "words": ws, "draft": True}, open(out_json, "w"), ensure_ascii=False)
    print(f"черновые слова: {len(ws)}, {t / 60:.1f} мин при {wpm} сл/мин → {out_json}")


if __name__ == "__main__" and sys.argv[1:2] == ["draft"]:
    draft_words(sys.argv[2], sys.argv[3], int(sys.argv[4]) if len(sys.argv) > 4 else 150)
