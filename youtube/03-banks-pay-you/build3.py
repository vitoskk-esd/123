#!/usr/bin/env python3
"""Сборка ролика №3 на движке «режимы» (kit/yt) со сценами «Живая иллюстрация» (scenes.js).

  <python с faster-whisper> build3.py words        — слова голоса (voice/out/voice.wav → voice/words.json, Whisper medium)
  python3 build3.py [hook|full]                     — план → data_<имя>.js (window.SEGS, window.TLX) + video_<имя>.html

Метка — место в тексте: (номер фразы из voice/phrases.txt, начало слова[, какое по счёту]). Время метки — начало этого слова
в голосе (слова голоса выравниваются со сценарием; если голоса ещё нет — оценка по темпу 2,55 слова/с, для черновых кадров).
"""
import difflib, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PH = [l.strip() for l in open(os.path.join(HERE, "voice/phrases.txt"), encoding="utf-8") if l.strip()]
norm = lambda w: re.sub(r"[^а-яa-z0-9]", "", w.lower().replace("ё", "е"))


def words_cmd():
    sys.path.insert(0, os.path.join(HERE, "../../reels/zero-card-07"))
    import voice as V
    wav = os.path.join(HERE, "voice/out/voice.wav"); f16 = wav[:-4] + ".16.wav"
    os.system(f"ffmpeg -v error -y -i {wav} -ar 16000 -ac 1 {f16}")
    ws = V.transcribe(f16, "medium")
    json.dump(ws, open(os.path.join(HERE, "voice/words.json"), "w"), ensure_ascii=False)
    print(len(ws), "слов")


def timing():
    """Время начала каждого слова сценария: [(фраза, слово, норм, t0, t1)]."""
    toks = [(i, w, norm(w)) for i, p in enumerate(PH) for w in p.split() if norm(w)]
    wj = os.path.join(HERE, "voice/words.json")
    if not os.path.exists(wj):                                    # оценка без голоса: 2,55 слова/с и пауза 0,45 с между фразами
        t, out, last = .3, [], 0
        for i, w, n in toks:
            if i != last: t += .45; last = i
            d = .18 + .055 * len(n); out.append((i, w, n, t, t + d)); t += d
        return out, False
    ws = json.load(open(wj)); heard = [norm(w["w"]) for w in ws]
    sm = difflib.SequenceMatcher(None, [n for _, _, n in toks], heard, autojunk=False)
    tt = [None] * len(toks)
    for a, b, size in sm.get_matching_blocks():
        for k in range(size): tt[a + k] = (ws[b + k]["a"], ws[b + k]["a"] + ws[b + k]["d"])
    known = [k for k, v in enumerate(tt) if v]                   # не распознанные слова — между соседними известными
    for k in range(len(tt)):
        if tt[k]: continue
        lo = max([j for j in known if j < k], default=None); hi = min([j for j in known if j > k], default=None)
        a = tt[lo][1] if lo is not None else 0; b = tt[hi][0] if hi is not None else a + .4
        n0 = (lo if lo is not None else -1); span = (hi if hi is not None else len(tt)) - n0
        x = a + (b - a) * (k - n0) / span; tt[k] = (x, x + .25)
    return [(i, w, n, *tt[k]) for k, (i, w, n) in enumerate(toks)], True


TOK, REAL = timing()


def T(p, pre=None, nth=1, end=False):
    """Время метки: фраза p, слово, начинающееся с pre (nth-е), или начало/конец фразы."""
    ws = [x for x in TOK if x[0] == p]
    if pre is None: return ws[-1][4] if end else ws[0][3]
    m = [x for x in ws if x[2].startswith(norm(pre))]
    if len(m) < nth: raise SystemExit(f"нет метки: фраза {p} «{pre}» №{nth}: {PH[p]}")
    return m[nth - 1][4] if end else m[nth - 1][3]


# ── план ролика: отрезки по порядку. start — метка начала; at — метки сцены; cam — камера (at: имя метки) ───────
def plan():
    return [
        dict(mode="map", start=(0,), lines=[["Курьер пешком", "a", (0, "Курьер")], ["350–500 ₽ в час", "b", (0, "трёхсот")], ["по данным hh.ru · 2026", "c", (1, "хэдхантера")]]),
        dict(mode="illu", scene="street", start=(1, "То"), tin=dict(type="flash", dur=.6),
             at=dict(тысячу=(1, "тысячу"), два=(1, "два"), дождь=(2, "дождь"), снег=(2, "снег"), рюкзаком=(2, "рюкзаком")),
             cam=[dict(t=0, x=760, y=560, s=1.05), dict(t=.05, x=1650, d="dur"), dict(at="рюкзаком", y=500, s=1.45, d=.9)]),
        dict(mode="illu", scene="home", start=(2, "А"), tin=dict(type="zoom", dur=.7, at=[760, 470]),
             at=dict(Ты=(3, "Ты"), десять=(3, "десять"), покупку=(3, "покупку"), переводит=(3, "переводит"), тысячу=(3, "тысячу"), Иногда=(4, "Иногда"),
                     собеседования=(4, "собеседования"), смен=(4, "смен"), опыта=(4, "опыта")),
             cam=[dict(t=0, x=470, y=520, s=2.3), dict(at="Ты", x=960, y=540, s=1, d=1.6), dict(at="переводит", x=1150, y=520, s=1.12, d=1.2), dict(at="собеседования", x=960, y=560, s=1, d=.8)]),
        dict(mode="illu", scene="reader", start=(5,), tin=dict(type="wipe", dur=.6, color="#ffd60a"),
             at=dict(канал=(5, "канал"), каждый=(5, "каждый"), мелким=(5, "мелким")),
             cam=[dict(t=0, x=960, y=500, s=1), dict(at="мелким", x=930, y=420, s=1.3, d=1.4)]),
        dict(mode="illu", scene="stairs", start=(6,), tin=dict(type="flash", dur=.5),
             at=dict(пять=(6, "пять"), нарастающей=(6, "нарастающей"), простого=(6, "простого"), денежного=(6, "денежного"), посчитаю=(7, "посчитаю"),
                     шестой=(8, "шестой"), телеграме=(8, "телеграме"), больше=(8, "больше"), платишь=(9, "платишь"), конце2=(9, "конце"), Поехали=(9, "Поехали")),
             cam=[dict(t=0, x=960, y=540, s=1), dict(at="шестой", x=1040, y=500, s=1.03, d=1), dict(at="Поехали", x=310, y=790, s=2.4, d=.9)]),
        dict(mode="illu", scene="chapter", start=(10,), tin=dict(type="zoom", dur=.6, at=[960, 540]), num="1", title="Бонус за карту", sub="банк платит за то, что ты пришёл", c2="#3a2a10"),
        dict(mode="illu", scene="bank", start=(10, "Банки"), tin=dict(type="iris", dur=.7, color="#ffd60a", at=[960, 540]),
             at=dict(новым=(10, "новым"), пришли=(10, "пришли"), тысячи=(11, "тысячи"), Деньгами=(12, "Деньгами"), баллами=(12, "баллами"), сертификатом=(12, "сертификатом"),
                     Зачем=(12, "Зачем"), Реклама=(13, "Реклама"), дорого=(13, "дорого"), тому=(13, "тому"), дешевле=(14, "дешевле"), бесплатная=(15, "бесплатная")),
             cam=[dict(t=0, x=1000, y=560, s=1), dict(at="Реклама", x=-480, y=540, s=1.05, d=1), dict(at="тому", x=1060, y=560, s=1, d=1), dict(at="бесплатная", x=1420, y=620, s=1.3, d=.9)]),
        dict(mode="illu", scene="app", start=(15, "Как"), hook_end=True, tin=dict(type="wipe", dur=.6, color="#1f6bff"),
             at=dict(находишь=(16, "находишь"), оформляешь=(16, "оформляешь"), покупку=(16, "покупку"), пятисот=(17, "пятисот"), Хлеб=(18, "Хлеб"), кроссовки=(18, "кроссовки"),
                     подписка=(18, "подписка"), покупка=(18, "покупка"), недель=(19, "недель"), искать=(19, "искать"), сайте=(20, "сайте"), агрегаторы=(20, "агрегаторы"),
                     телеграм=(20, "телеграм"), Важно=(21, "Важно"), правила=(21, "правила"), сумму=(21, "сумму"), срок=(21, "срок"), новым=(21, "новым"), две=(22, "две"), решают=(22, "решают")),
             cam=[dict(t=0, x=960, y=540, s=1), dict(at="находишь", x=760, y=540, s=1.08, d=1), dict(at="покупку", x=1150, y=520, s=1, d=1), dict(at="правила", x=1250, y=540, s=1.03, d=1), dict(at="две", x=1200, y=620, s=1.08, d=.8)]),
        dict(mode="illu", scene="fee", start=(23,), tin=dict(type="flash", dur=.5),
             at=dict(бесплатное=(23, "бесплатное"), двести=(24, "двести"), съест=(24, "съест"), заплатил=(24, "заплатил")),
             cam=[dict(t=0, x=1000, y=560, s=1.1), dict(at="двести", x=960, y=560, s=1, d=1.2)]),
        dict(mode="illu", scene="reasons", start=(25,), tin=dict(type="wipe", dur=.6, color="#ff8a3d"),
             at=dict(половина=(25, "половина"), развод=(25, "развод"), трёх=(26, "трёх"), Первая=(27, "Первая"), новичкам=(28, "новичкам"), Вторая=(29, "Вторая"), телефон=(29, "телефон"),
                     коммуналку=(29, "коммуналку"), Третья=(31, "Третья"), незачем=(32, "незачем"), четвёртая=(33, "четвёртая"), ящик=(35, "ящик"), шесть=(35, "шесть"), сгорел=(35, "сгорел"), тот=(36, "тот")),
             cam=[dict(t=0, x=1920, y=1080, s=.62), dict(at="трёх", s=.5, d=.8), dict(at="Первая", x=960, y=540, s=1, d=1), dict(at="Вторая", x=2880, y=540, s=1, d=1),
                  dict(at="Третья", x=960, y=1620, s=1, d=1), dict(at="четвёртая", x=2880, y=1620, s=1, d=1)]),
        dict(mode="illu", scene="ticks", start=(37,), tin=dict(type="flash", dur=.5),
             at=dict(правило=(37, "правило"), новый=(37, "новый"), настоящая=(37, "настоящая"), оформление=(37, "оформление"), Все=(38, "Все"), один=(38, "один"), следующий=(39, "следующий")),
             cam=[dict(t=0, x=960, y=540, s=1.05), dict(at="Все", x=1000, y=560, s=1, d=1.2)]),
        dict(mode="illu", scene="chapter", start=(40,), tin=dict(type="zoom", dur=.6, at=[960, 540]), num="2", title="Приведи друга", sub="банк платит за друга — много раз", c2="#2a1650", color="#c9b0ff"),
        dict(mode="illu", scene="friends", start=(40, "Она"), tin=dict(type="iris", dur=.7, color="#c9b0ff", at=[960, 540]),
             at=dict(крупных=(40, "крупных"), ссылку=(41, "ссылку"), оформляет=(41, "оформляет"), покупку=(41, "покупку"), обоим=(41, "обоим"), тысячи=(42, "тысячи"), пятисот=(42, "пятисот"),
                     Точная=(43, "Точная"), лучше=(44, "лучше"), один=(45, "один"), много=(46, "много"), Пять=(47, "Пять"), разница=(48, "разница")),
             cam=[dict(t=0, x=960, y=540, s=1), dict(at="тысячи", y=520, s=1.03), dict(at="Пять", y=580, s=1.05)]),
        dict(mode="illu", scene="crowd", start=(49,), tin=dict(type="flash", dur=.5),
             at=dict(вопрос=(49, "вопрос"), Друзья=(50, "Друзья"), однокурсники=(50, "однокурсники"), брат=(50, "брат"), девушка=(50, "девушка"), заплатит=(50, "заплатит"),
                     продаёшь=(51, "продаёшь"), делишься=(51, "делишься"), честно=(52, "честно"), лучше=(53, "лучше")),
             cam=[dict(t=0, x=960, y=600, s=1.06), dict(at="продаёшь", y=540, s=1, d=1)]),
        dict(mode="illu", scene="chat", start=(54,), tin=dict(type="wipe", dur=.6, color="#8a5cf6"),
             at=dict(сообщение=(54, "сообщение"), спама=(55, "спама"), срочно=(55, "срочно"), соглашаются=(56, "соглашаются"), напомни=(57, "напомни"), никому=(58, "никому"),
                     разовые=(59, "разовые"), каждый=(60, "каждый")),
             cam=[dict(t=0, x=960, y=540, s=1.12), dict(at="спама", s=1, d=.8), dict(at="никому", x=760, y=680, s=1.12, d=.8), dict(at="разовые", x=960, y=540, s=1, d=.8)]),
        dict(mode="illu", scene="chapter", start=(61,), tin=dict(type="zoom", dur=.6, at=[960, 540]), num="3", title="Деньги лежат", sub="банк платит каждый день", c2="#0f3a3a", color="#2ee07a"),
        dict(mode="illu", scene="jar", start=(61, "Это"), tin=dict(type="iris", dur=.7, color="#2ee07a", at=[960, 540]),
             at=dict(накопительный=(61, "кошелёк"), Снять=(62, "Снять"), правило=(63, "правило"), пятнадцать=(64, "пятнадцать"), падает=(65, "падает"), Сколько=(66, "Сколько"),
                     Десять=(66, "Десять"), полежали=(67, "полежали"), смотри=(68, "смотри")),
             cam=[dict(t=0, x=1000, y=540, s=1.02), dict(at="Десять", x=900, y=540, s=1, d=1)]),
        dict(mode="illu", scene="habit", start=(69,), tin=dict(type="flash", dur=.5),
             at=dict(скажешь=(69, "скажешь"), Нормально=(70, "Нормально"), смысл=(71, "смысл"), кстати=(72, "кстати")), cam=[dict(t=0, x=960, y=540, s=1.04)]),
        dict(mode="illu", scene="move", start=(73,), tin=dict(type="wipe", dur=.6, color="#2ec4b6"),
             at=dict(переезжать=(73, "переезжать"), календарь=(73, "календарь"), сработало=(74, "сработало"), переводишь=(74, "переводишь"), Пять=(75, "Пять"), застрахованы=(75, "застрахованы")),
             cam=[dict(t=0, x=960, y=500, s=1.05), dict(at="переводишь", x=960, y=600, s=1, d=1)]),
        dict(mode="illu", scene="tg", start=(76,), tin=dict(type="zoom", dur=.6, at=[1260, 560]),
             at=dict(Кстати=(76, "Кстати"), собираю=(77, "собираю"), ссылка=(77, "ссылка"), закреп=(78, "закреп"), Сколько=(79, "Сколько"), пока=(80, "пока")),
             cam=[dict(t=0, x=1260, y=560, s=1.2), dict(at="собираю", x=960, y=540, s=1, d=1)]),
        dict(mode="illu", scene="chapter", start=(81,), tin=dict(type="zoom", dur=.6, at=[960, 540]), num="4", title="Кэшбэк", sub="банк платит за покупки", c2="#0f2a4a", color="#4a8dff"),
        dict(mode="illu", scene="checkout", start=(81, "Банк"), tin=dict(type="iris", dur=.7, color="#4a8dff", at=[960, 540]),
             at=dict(покупки=(81, "покупки"), магазин=(82, "магазин"), комиссию=(82, "комиссию"), часть=(82, "часть")),
             cam=[dict(t=0, x=1100, y=560, s=1.08), dict(at="магазин", x=960, y=480, s=1, d=1)]),
        dict(mode="illu", scene="greedy", start=(83,), tin=dict(type="flash", dur=.5),
             at=dict(жаднее=(83, "жаднее"), ВТБ=(84, "ВТБ"), десять=(84, "десять"), урезали=(85, "урезали"), лимиты=(85, "лимиты"), подписки=(85, "подписки"), умер=(86, "умер"), другое=(87, "другое")),
             cam=[dict(t=0, x=760, y=560, s=1.05), dict(at="урезали", x=1100, y=560, s=1, d=1)]),
        dict(mode="illu", scene="calc", start=(88,), tin=dict(type="wipe", dur=.6, color="#ffd60a"),
             at=dict(примере=(88, "примере"), шесть=(88, "шесть"), транспорт=(89, "транспорт"), Набегает=(90, "Набегает")),
             cam=[dict(t=0, x=960, y=540, s=1.04), dict(at="Набегает", x=1100, y=560, s=1, d=1)]),
        dict(mode="illu", scene="pie", start=(91,), tin=dict(type="zoom", dur=.6, at=[700, 560]),
             at=dict(категории=(91, "категории"), диаграмма=(91, "диаграмма"), доли=(92, "доли"), ресторанов=(93, "ресторанов"), две2=(94, "две")),
             cam=[dict(t=0, x=800, y=560, s=1.05), dict(at="две2", x=1000, y=560, s=1, d=1)]),
        dict(mode="illu", scene="traps", start=(95,), tin=dict(type="flash", dur=.5),
             at=dict(ловушки=(95, "ловушки"), баллы=(95, "баллы"), лимит=(96, "лимит"), подписка=(97, "подписка"), последний=(98, "последний"), минус=(99, "минус")),
             cam=[dict(t=0, x=960, y=560, s=1), dict(at="последний", x=1300, y=700, s=1.1, d=1)]),
        dict(mode="illu", scene="chapter", start=(100,), tin=dict(type="zoom", dur=.6, at=[1700, 930]), num="5", title="Кредитка", sub="самый денежный и самый опасный", c2="#3a0f1a", color="#ff5d8f"),
        dict(mode="illu", scene="credit", start=(100, "Посмотри"), tin=dict(type="iris", dur=.7, color="#ff5d8f", at=[960, 540]),
             at=dict(Посмотри=(100, "Посмотри"), двух=(101, "два"), выгоднее=(102, "выгоднее"), проценты=(103, "проценты"), пятьдесят=(104, "пятьдесят")),
             cam=[dict(t=0, x=760, y=560, s=1.05), dict(at="выгоднее", x=1100, y=560, s=1, d=1)]),
        dict(mode="illu", scene="grace", start=(105,), tin=dict(type="flash", dur=.5),
             at=dict(льготный=(105, "льготный"), больше=(106, "больше"), Вернул=(107, "Вернул"), бонус=(108, "бонус"), кэшбэк=(108, "кэшбэк"), бесплатно=(108, "бесплатно")),
             cam=[dict(t=0, x=960, y=540, s=1.05), dict(at="бонус", y=600, s=1, d=1)]),
        dict(mode="illu", scene="rules5", start=(109,), tin=dict(type="wipe", dur=.6, color="#ff3d4f"),
             at=dict(жёсткие=(109, "жёсткие"), наличных=(109, "наличных"), переводы=(109, "переводы"), капают=(109, "капают"), Минимальный=(110, "Минимальный"), бери=(111, "бери"),
                     Серьёзно=(112, "Серьёзно"), календарь=(113, "календарь")),
             cam=[dict(t=0, x=760, y=560, s=1.05), dict(at="Минимальный", x=1200, y=540, s=1.02, d=1), dict(at="бери", x=960, y=540, s=1, d=.8)]),
        dict(mode="illu", scene="interest", start=(114,), tin=dict(type="flash", dur=.5),
             at=dict(пять=(114, "пять"), двести=(114, "двести"), пропуск=(115, "пропуск"), первый=(116, "первый")),
             cam=[dict(t=0, x=760, y=540, s=1.05), dict(at="пропуск", x=1000, y=560, s=1, d=1)]),
        dict(mode="illu", scene="chapter", start=(117, "Теперь"), tin=dict(type="zoom", dur=.6, at=[960, 540]), num="₽", title="План на первый месяц", sub="сколько это в часах подработки", c2="#2a2a10", color="#ffd60a"),
        dict(mode="illu", scene="plan", start=(118,), tin=dict(type="iris", dur=.7, color="#ffd60a", at=[960, 540]),
             at=dict(восемнадцать=(118, "восемнадцать"), карта=(119, "карта"), друга=(120, "друга"), Кэшбэк=(121, "Кэшбэк"), накопительном=(122, "накопительном"), Выходит=(123, "Выходит"),
                     семи=(124, "семи"), пример=(125, "пример")),
             cam=[dict(t=0, x=960, y=540, s=1.05), dict(at="семи", x=960, y=560, s=1, d=1)]),
        dict(mode="illu", scene="weeks", start=(126,), tin=dict(type="wipe", dur=.6, color="#2ec4b6"),
             at=dict(порядок=(126, "порядок"), Первая=(126, "Первая"), Вторая=(127, "Вторая"), Третья=(128, "Третья"), Четвёртая=(128, "Четвёртая"), Кредитку=(129, "Кредитку"), меньше=(130, "меньше")),
             cam=[dict(t=0, x=700, y=560, s=1.08), dict(at="Третья", x=1200, y=560, s=1.04, d=1.2), dict(at="Кредитку", x=960, y=600, s=1, d=1)]),
        dict(mode="illu", scene="drop", start=(130, "А"), tin=dict(type="flash", dur=.5, color="radial-gradient(1200px 900px at 50% 50%, rgba(255,80,90,1), rgba(120,0,20,.9))"),
             at=dict(шестой=(130, "шестой"), напишут=(131, "напишут"), Оформи=(131, "Оформи"), заплатим=(131, "заплатим"), подработка=(132, "подработка"), июля=(133, "июля"),
                     уголовная=(133, "уголовная"), шести=(134, "шести"), Деньги=(135, "Деньги"), законные=(136, "законные"), Шестой=(136, "Шестой")),
             cam=[dict(t=0, x=700, y=540, s=1.12), dict(at="уголовная", x=1100, y=560, s=1, d=.8)]),
        dict(mode="illu", scene="final", start=(137,), tin=dict(type="iris", dur=.7, color="#ffd60a", at=[960, 540]),
             at=dict(три=(137, "три"), Первое=(138, "Первое"), Второе=(139, "Второе"), Третье=(140, "Третье"), Актуальные=(141, "Актуальные"), комментариях=(142, "комментариях"), Следующий=(143, "Следующий")),
             cam=[dict(t=0, x=960, y=540, s=1.04), dict(at="Актуальные", x=1000, y=560, s=1, d=1)]),
        dict(mode="end", start=(143, None, 1, True), tail=4.0),
    ]


def build(name):
    P = plan()
    if name == "hook":
        k = next(i for i, x in enumerate(P) if x.get("hook_end")); P = P[:k] + [dict(mode="end", start=P[k]["start"])]
    segs = []
    starts = [(T(*s["start"]) if len(s["start"]) > 1 else T(s["start"][0])) + s.get("tail", 0) for s in P]
    starts[0] = 0
    for k, s in enumerate(P[:-1]):
        t0, t1 = starts[k], starts[k + 1]; dur = t1 - t0; lt = lambda m: round(T(*m) - t0, 3)
        if s["mode"] == "map":
            data = dict(view="nav", nx=22, ny=19, park=[[12, 8], [12, 9], [13, 8], [13, 9], [6, 10]], river=13,
                        route=[[6, 9], [8, 9, "pick"], [8, 13, "drop"], [11, 13, "pick"], [13, 10, "drop"]], pause=.7, t0=.3, earn=[120, 110],
                        clock=dict({"from": 0, "to": 40}), clockT=.3, rain=True, zoom=1.2,
                        lines=[[a, b, lt(m)] for a, b, m in s["lines"]])
            blocks = 2 + 4 + 3 + 5          # длина маршрута в кварталах
            data["speed"] = round(blocks * 300 / max(2, dur - .3 - 4 * .7 - .3), 1)
        else:
            data = {k2: v for k2, v in s.items() if k2 not in ("mode", "start", "at", "cam", "tin", "hook_end")}
            data["at"] = {k2: lt(v) for k2, v in s.get("at", {}).items()}
            if "cam" in s:
                cam = []
                for c in s["cam"]:
                    c = dict(c)
                    if c.get("d") == "dur": c["d"] = round(dur, 2)
                    cam.append(c)
                data["cam"] = cam
        seg = dict(mode=s["mode"], t0=round(t0, 3), t1=round(t1, 3), data=data)
        if s.get("tin"): seg["tin"] = s["tin"]
        segs.append(seg)
    chapters = [dict(t=round(starts[k], 2), label=f"Способ {s['num']}") for k, s in enumerate(P[:-1]) if s.get("scene") == "chapter"]
    out = os.path.join(HERE, f"data_{name}.js")
    open(out, "w").write("// собрано build3.py — не править руками\nwindow.SEGS = " + json.dumps(segs, ensure_ascii=False) + ";\nwindow.CHAPTERS = " + json.dumps(chapters, ensure_ascii=False) +
                         ";\nwindow.TLX = " + json.dumps(dict(music=[dict(t=0, part="intro"), dict(t=round(starts[1], 2), part="main")], bpm=96,
                         sfx=dict(whoosh=[round(x["t0"] - .2, 2) for x in segs if x.get("tin") and x["tin"]["type"] != "cut"])), ensure_ascii=False) + ";\n")
    html = os.path.join(HERE, f"video_{name}.html")
    open(html, "w").write(f"""<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><title>Ролик №3 — {name}</title>
<!-- собрано build3.py: движок kit/yt, сцены scenes.js (стиль карусели carousel/art.js), данные data_{name}.js -->
<link rel="stylesheet" href="../kit/yt/yt.css"><script src="../kit/yt/yt.js"></script>
<script src="../kit/yt/modes/map.js"></script><script src="../kit/yt/modes/illu.js"></script>
<script src="carousel/art.js"></script><script src="scenes.js"></script><script src="scenes_c1.js"></script><script src="scenes_c2.js"></script><script src="scenes_c3.js"></script><script src="data_{name}.js"></script></head>
<body><script>YT.play({{ size: [1920, 1080], foot: "", segs: window.SEGS, chapters: [] }});</script></body></html>
""")
    print(f"{name}: {len(segs)} отрезков, {segs[-1]['t1']:.1f} с, голос {'есть' if REAL else 'НЕТ — оценка темпа'}")
    for s in segs: print(f"  {s['t0']:7.2f}–{s['t1']:7.2f}  {s['mode']:5s} {s['data'].get('scene', '')}")


if __name__ == "__main__":
    if sys.argv[1:2] == ["words"]: words_cmd()
    else: build(sys.argv[1] if len(sys.argv) > 1 else "hook")
