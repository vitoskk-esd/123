"""Видео №1, монтаж v4 «рабочий стол» (язык длинных роликов) -> timeline_desk.js для desk.html.

Почему так: youtube/references/tutorials.md. Кадр «дышит» 3–8 с, внутри него каждые 1,5–2,5 с что-то
происходит (маркер, курсор, пуш, счётчик, новое окно); склейки и переезды камеры — на смене мысли.
Объекты привязаны к словам озвучки (A("фраза")): python build_desk.py [--to 61.6]
"""
import json, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "kit"))
from anchors import Words

DIR = os.path.dirname(os.path.abspath(__file__))
W = Words(os.environ.get("WORDS") or os.path.join(DIR, "out", "words_final.json"))
SEC = 0.0   # поиск слов — от начала текущего блока (фразы внутри блока уникальны)
def A(phrase, after=None):
    return W.A(phrase, after=SEC if after is None else after)
def sec(phrase):
    global SEC
    SEC = 0.0 if phrase is None else W.A(phrase, after=SEC) - .05
    return SEC + .05
TO = float(sys.argv[sys.argv.index("--to") + 1]) if "--to" in sys.argv else W.duration + 20
objs, cam, glow = [], [], []
music = [{"t": 0, "part": "intro"}]
sfx = {k: [] for k in ["ui", "pan", "notif", "mark", "click", "thud", "ticks", "coin", "sting", "riser", "chip"]}
BR = []      # кадры видео для extract_desk.py: (id, src, ss, n)
THUMBS = []  # стоп-кадры для карточек: (src, ss)


def ob(id, k, t0, t1, x, y, w=None, h=None, kf=(), sound=True, **kw):
    base = {"t": t0, "x": x, "y": y}
    if w: base.update(w=w, h=h)
    for key in ("s", "r", "ry", "o"):
        if key in kw: base[key] = kw.pop(key)
    if "in_" in kw: kw["in"] = kw.pop("in_")
    o = {"id": id, "k": k, "t0": round(t0, 3), "t1": round(t1, 3), "kf": [base, *kf], **kw}
    objs.append(o)
    if sound and k in ("win", "phone", "bank"): sfx["ui"].append(round(t0 + .05, 3))
    return o


def kf(t, d=.7, **kw):
    return {"t": round(t, 3), "d": d, **kw}


def camto(t, x, y, s=1, d=1.0, pan=True):
    cam.append({"t": round(t, 3), "x": x, "y": y, "s": s, "d": d})
    if pan: sfx["pan"].append(round(t + d * .45, 3))


CNT = json.load(open(os.path.join(DIR, "out", "bfr_counts.json"))) if os.path.exists(os.path.join(DIR, "out", "bfr_counts.json")) else {}


def frames(id, src, ss, t0, t1, credit, gray=False):
    n = int((t1 - t0) * 30) + 2
    BR.append((id, src, ss, n))
    n = min(n, CNT.get(id, n))
    return {"type": "frames", "id": id, "n": n, "credit": credit, **({"gray": 1} if gray else {})}


def mark(text, at, d=.6, c=""):
    sfx["mark"].append(round(at, 3))
    return f'<mark class="{c}" data-a="{at:.3f}" data-d="{d}">{text}</mark>'


def ws(*items):
    """слова для K.text: (текст, время, класс)"""
    return " ".join(f'<span class="w {c}" data-a="{a:.3f}">{w}</span>' for w, a, c in items)


CREDIT = {r[0]: r[2] for r in (l.rstrip("\n").split("\t") for l in open(os.path.join(DIR, "..", "assets", "broll", "list.tsv")))}
cr = lambda src: f"Видео: {CREDIT[src]} / Pexels"

# ================= ХУК — станция 1 (центр 960×540) =================
glow.append({"t": 0, "c": "#3ddc84"})
t_end1 = A("Только") - .2
ph1 = ob("ph1", "phone", 0, t_end1 + .6, 520, 560, 420, 860, in_="up", balLabel="Баланс", appTop=420,
         bal={"from": 0, "to": 3500, "a": A("раздают"), "b": A("клиентам") + .3, "c": "g"},
         pushes=[{"at": A("раздают"), "ico": "<b style='font:900 26px Unb;color:#0b0f14'>₽</b>", "title": "Банк · сейчас", "html": "Бонус новому клиенту <b>+1 000 ₽</b>"},
                 {"at": A("деньги"), "ico": "<b style='font:900 26px Unb;color:#0b0f14'>₽</b>", "title": "Банк · сейчас", "html": "Бонус за покупку <b>+2 000 ₽</b>"},
                 {"at": A("клиентам"), "ico": "<b style='font:900 26px Unb;color:#0b0f14'>₽</b>", "title": "Банк · сейчас", "html": "Кэшбэк начислен <b>+500 ₽</b>"}],
         kf=[kf(t_end1, .6, x=300, s=.85, o=0)])
for p in ph1["pushes"]: sfx["notif"].append(p["at"])
ob("t1", "text", .1, t_end1 + .4, 850, 470, anchor="left", in_="fade", html=ws(("Банки", A("Банки"), ""), ("платят", A("раздают"), "g")))
ob("t1s", "text", 2.2, t_end1 + .4, 854, 580, anchor="left", cls="s", html=ws(("новым клиентам — каждый месяц", A("новым"), "")))

# --- «одни способы — пару тысяч, другие — ноль»
t2 = sec("Только"); t_two = A("другие"); t3 = A("Большинство")
ob("w_pay", "win", t2 - .1, t3 + .2, 560, 520, 780, 560, title="Способ 1", acc="var(--green)", body=frames("d_pay", "pay_terminal", 2.0, t2, t3 + .3, cr("pay_terminal")), in_="left")
ob("n_pay", "num", A("пару") - .1, t3 + .2, 560, 890, z=3, c="g", sign=True, **{"from": 0, "to": 2000}, a=A("пару"), b=A("покупку"), label="за одну покупку")
sfx["ticks"].append([A("пару"), A("покупку")]); sfx["coin"].append(A("покупку"))
ob("w_zero", "win", t_two - .2, t3 + .2, 1380, 520, 640, 560, title="Способ 2", acc="var(--red)", in_="right",
   body={"type": "html", "html": '<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:26px">'
         '<svg viewBox="0 0 24 24" width="150" height="150" fill="none" stroke="#ffd84a" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>'
         '<div style="font:700 34px Mont;color:var(--muted)">потраченное время</div></div>'})
ob("n_zero", "num", A("ноль") - .1, t3 + .2, 1380, 890, z=3, c="r", **{"from": 0, "to": 0}, a=A("ноль"), b=A("ноль") + .01, label="на выходе")

# --- «большинство видео — реклама одной карты либо пересказ мелким шрифтом»
sec("Большинство"); t_ad = A("реклама"); t_re = A("пересказ"); t_fine = A("мелким"); t4 = A("Я веду")
ob("w_yt", "win", t3 - .1, t4 + .1, 900, 530, 1480, 860, title="youtube.com — «бонусы банков»", acc="var(--red)", in_="scale",
   kf=[kf(t_re - .1, .6, x=700, s=.9, o=.55)],
   body={"type": "yt", "cards": [
       {"title": "Лучшая карта 2026", "bg": "linear-gradient(135deg,#ff4d5e,#a3123b)", "tag": {"text": "Реклама", "at": t_ad}},
       {"title": "Оформи и забери бонус", "bg": "linear-gradient(135deg,#ffb23c,#d4561b)"},
       {"title": "Топ-1 кредитка", "bg": "linear-gradient(135deg,#6a4cff,#2c1d8f)", "tag": {"text": "Реклама", "at": A("одной") + .05}},
       {"title": "Как получить бонус", "bg": "linear-gradient(135deg,#2fbf71,#0f6b3d)"},
       {"title": "Обзор карты", "bg": "linear-gradient(135deg,#3a8dff,#174a9c)", "tag": {"text": "Реклама", "at": A("карты") + .05}},
       {"title": "Условия бонуса", "bg": "linear-gradient(135deg,#888,#444)"}]})
sfx["thud"] += [t_ad, A("одной") + .05, A("карты") + .05]
ob("cur1", "cursor", t3 + .4, t_re, 1500, 900, in_="fade", z=5, kf=[kf(t3 + .5, .9, x=470, y=330), kf(t_ad - .5, .4, x=500, y=340)], clicks=[t_ad - .1])
sfx["click"].append(t_ad - .1)
FINE = " ".join(["Бонус начисляется при соблюдении условий акции в период её проведения; банк вправе изменить условия, перечень операций, не учитываемых при расчёте, и сроки начисления в одностороннем порядке."] * 9)
ob("w_fine", "win", t_re - .15, t4 + .1, 1260, 600, 820, 600, title="Условия акции.pdf", paper=True, in_="up", z=2,
   body={"type": "doc", "html": f'<h3>Условия акции</h3><p class="fine">{FINE}</p>', "zoom": {"a": t_fine - .1, "b": t_fine + .9, "s": 2.4, "origin": "40% 45%"}})
camto(t_fine - .2, 1080, 580, 1.12, 1.4, pan=False)

# ================= станция 2 (центр 3060×540): канал и условия =================
X2 = 3060
camto(t4 - .35, X2, 540, 1, .9)
sec("Я веду"); t_cond = A("разбираю"); t5 = A("Поэтому")
ob("w_tg", "win", t4 - .5, t5 + .2, X2 - 420, 540, 720, 860, title="Telegram", acc="var(--tg)", in_="fade",
   body={"type": "tg", "name": "Бонусы банков", "sub": "канал · подписаться", "msgs": [
       {"html": "<b>С чего начать</b><br>Кредитка Альфа-Банка — <b>+1 000 ₽</b><br>любая покупка по терминалу", "at": A("канал") - .1},
       {"html": "Дебетовая ОТП Банка — <b>+1 000 ₽</b><br>2 покупки от 500 ₽, только курьером", "at": A("бонусы") + .05},
       {"html": "Кредитка Т-Банка — <b>+2 000 ₽</b><br>одна покупка от 3 000 ₽", "at": A("банков") + .05}]})
ob("w_cond", "win", t_cond - .35, t5 + .2, X2 + 430, 560, 780, 620, title="Условия — разбор", paper=True, in_="right", z=2,
   body={"type": "doc", "html": "<h3>Т-Банк, кредитная карта</h3>"
         f"<p>Бонус за {mark('одну покупку от 3 000 ₽', t_cond + .05, .55)} по терминалу.</p>"
         f"<p>Покупка — {mark('одной транзакцией', A('условия') , .5)}, не частями.</p>"
         "<p style='color:#8a8d94;font-size:22px'>Условия на дату записи — проверяй на сайте банка.</p>"})

# ================= станция 3 (центр 960×1900): тир-лист способов =================
Y3 = 1900
camto(t5 - .3, 960, Y3, 1, 1.0)
sec("Поэтому"); t_crit = A("Оцениваем"); t_end = A("А в конце")
chips_at = [A("способы") + k * .22 for k in range(6)]
board_rows = {"S": [{"t": "Свой канал", "at": chips_at[5]}], "A": [{"t": "Приведи друга", "at": chips_at[4]}], "B": [{"t": "Бонус за карту", "at": chips_at[3]}],
              "C": [{"t": "Кэшбэк", "at": chips_at[2]}], "D": [{"t": "Розыгрыши", "at": chips_at[0]}, {"t": "Баллы", "at": chips_at[1]}]}
sfx["chip"] += chips_at
ob("w_board", "win", t5 - .2, t_end + .3, 960, Y3, 1100, 820, title="Тир-лист: как банк платит тебе", in_="scale",
   kf=[kf(t_crit - .1, .8, x=560, s=.82)],
   body={"type": "board", "rows": board_rows, "blur": [{"t": 0, "v": 9}]})
t_mus = A("мусора"); t_top = A("топа")
ob("cur3", "cursor", t5 + 1.2, t_crit, 1400, Y3 + 300, in_="fade", z=5, kf=[kf(t_mus - .45, .4, x=520, y=Y3 + 330), kf(t_top - .4, .4, x=520, y=Y3 - 270)], clicks=[t_mus, t_top])
sfx["click"] += [t_mus, t_top]
ob("w_crit", "win", t_crit - .1, t_end + .3, 1420, Y3, 760, 520, title="Критерии", in_="right",
   body={"type": "crit", "title": "Оцениваем по 3 вещам", "items": [{"ic": "rub", "t": "Сколько платят", "at": A("сколько платят")},
                                                                     {"ic": "clock", "t": "Сколько сил", "at": A("сколько сил")},
                                                                     {"ic": "risk", "t": "Какой риск", "at": A("какой риск")}]})
sfx["chip"] += [A("сколько платят"), A("сколько сил"), A("какой риск")]

# --- «а в конце — тир-лист конкретных банков» (логотипы размыты — петля до финала)
sec("А в конце"); t_banks = A("конкретных"); t6 = A("сколько из")
ob("tx_end", "text", t_end + .3, t6 + .1, 960, Y3 - 250, cls="m", in_="fade", html=ws(("В конце —", t_end, ""), ("банки", t_banks, "g")))
for i, b in enumerate(["tbank", "alfa", "uralsib", "otp"]):
    ob(f"bk{i}", "bank", t_banks + .12 * i, t6 + .1, 450 + 340 * i, Y3 + 60, 300, 170, bank=b, blur=10, in_="up", z=2, sound=i == 0)
ob("st_now", "stamp", A("прямо") - .1, t6 + .1, 960, Y3 + 300, at=A("прямо"), text="платят сейчас", c="var(--green)", rot=-4, z=3)
sfx["thud"].append(A("прямо"))

# ================= снова станция 1: «парень 18 лет и только телефон» =================
camto(t6 - .35, 960, 540, 1, 1.0)
sec("сколько из"); t7 = A("Я покажу")
ob("ph2", "phone", t6 - .3, t7 + .2, 960, 560, 420, 860, in_="up", balLabel="Можешь получить", balText="?? ??? ₽", balC="g",
   rows=[{"ico": "18+", "t": "Возраст", "am": "18 лет", "at": A("18")}, {"ico": "📱", "t": "Что нужно", "am": "телефон", "at": A("телефон")}])
objs[-1]["rows"][1]["ico"] = "<svg viewBox='0 0 24 24' width='26' height='26' fill='none' stroke='#eef2f6' stroke-width='2'><rect x='6' y='2' width='12' height='20' rx='3'/></svg>"
ob("tx18", "text", A("обычный") - .2, t7 + .2, 690, 540, cls="m ra", in_="fade", anchor="right", html=ws(("обычный", A("обычный"), "")) + "<br>" + ws(("парень 18+", A("парень"), "")))
ob("txph", "text", A("только") - .1, t7 + .2, 1240, 540, cls="m", in_="fade", anchor="left", html=ws(("только", A("только"), "")) + "<br>" + ws(("телефон", A("телефон"), "g")))

# --- «способ вне рейтинга — может стоить свободы»
sec("Я покажу"); t_out = A("рейтинг"); t_free = A("свободы"); t8 = A("смотри")
glow.append({"t": t7, "c": "#ff4d5e"})
music += [{"t": t7 - .1, "part": "break"}, {"t": t_free + .25, "part": "stop"}]
RED = "".join(f'<p><span style="display:inline-block;height:26px;width:{w}%;background:#1b1d22;border-radius:4px"></span></p>' for w in (92, 80, 88, 60, 85, 70))
ob("w_secret", "win", t7 - .1, t8 + .1, 760, 540, 860, 620, title="Способ вне рейтинга", paper=True, acc="var(--red)", in_="scale",
   body={"type": "doc", "html": f"<h3>Способ №7</h3>{RED}"})
ob("st_out", "stamp", t_out - .1, t8 + .1, 760, 560, at=t_out, text="вне рейтинга", z=3)
sfx["thud"].append(t_out)
ob("w_cuff", "win", t_free - .45, t8 + .1, 1430, 600, 700, 440, title="", acc="var(--red)", in_="right", z=4,
   body=frames("d_cuff", "handcuffs", 1.0, t_free - .45, t8 + .2, cr("handcuffs"), gray=True))
ob("st_free", "stamp", t_free + .05, t8 + .1, 1430, 860, at=t_free + .05, text="Свобода", z=5, rot=4)
sfx["thud"].append(t_free + .05)

# --- «досмотри до конца … Поехали» → доска, наезд в строку D, заставка уровня
sec("смотри"); t_go = A("Поехали"); t_d = A("Начнем")
camto(t8 - .3, 960, Y3, 1, 1.0)
music.append({"t": t8 - .2, "part": "intro"})
glow.append({"t": t8, "c": "#3ddc84"})
ob("w_board2", "win", t8 - .3, t_d + .2, 960, Y3, 1100, 820, title="Тир-лист: как банк платит тебе", in_="fade",
   body={"type": "board", "rows": {k: [{**c, "at": 0} for c in v] for k, v in board_rows.items()}, "blur": [{"t": 0, "v": 9}], "focus": {"row": "D", "at": t_go - .2}})
ob("tx_go", "text", A("конца") - .1, t_go + .1, 960, Y3 - 480, cls="m", in_="fade", html=ws(("досмотри до", A("смотри"), ""), ("конца", A("конца"), "g")))
camto(t_go - .1, 470, Y3 + 330, 2.4, .9)
sfx["riser"].append([t_go - 1.2, t_d - .05])

# ================= уровень D — станция 4 (центр 3060×1900) =================
X4, Y4 = 3060, 1900
t_know = A("Знаешь")
ob("sting_d", "sting", t_d - .05, t_know - .05, 0, 0, fixed=True, tier="D", title="Розыгрыши и баллы", sub="уровень", z=50, sound=False)
sfx["sting"].append(t_d)
music.append({"t": t_d, "part": "main"})
glow.append({"t": t_d, "c": "#ff4d5e"})
camto(t_d + .4, X4, Y4, 1, .05, pan=False)
sec("Знаешь"); t_pay = A("Оплати"); t_crowd = A("Участников"); t_ch = A("Шанс"); t_sp = A("зато"); t_end_d = A("С баллами")
ob("low_d", "lower", t_know + .2, A("Уровень C", after=t_know), 80, 975, fixed=True, text="Уровень D", sub="розыгрыши и баллы", c="var(--D)", z=40, sound=False)
ob("ph3", "phone", t_know - .3, t_end_d + .5, X4 - 260, Y4 + 20, 420, 860, in_="up",
   kf=[kf(t_crowd - .3, .7, x=X4 - 560, s=.9)],
   banner={"at": t_know + .3, "until": t_sp - .2, "top": 150, "html": "Розыгрыш смартфона<small>Оплати картой — участвуй</small>"},
   btn={"at": t_pay + .1, "until": t_sp - .2, "text": "Участвовать"},
   rows=[{"ico": "☕", "t": "Кафе", "am": "−640 ₽", "c": "r", "at": t_sp + .1},
         {"ico": "🛍", "t": "Маркетплейс", "am": "−2 190 ₽", "c": "r", "at": A("начинаешь") + .05},
         {"ico": "🍔", "t": "Доставка", "am": "−870 ₽", "c": "r", "at": A("больше") + .05},
         {"ico": "🎮", "t": "Подписка", "am": "−399 ₽", "c": "r", "at": A("собирался") + .05}])
for r, ic in zip(objs[-1]["rows"], ["К", "М", "Д", "П"]): r["ico"] = ic
sfx["chip"] += [r["at"] for r in objs[-1]["rows"]]
ob("tx_pay", "text", t_pay - .1, t_crowd - .1, X4 + 60, Y4 - 40, cls="m", in_="fade", anchor="left",
   html=ws(("оплати картой", t_pay, "")) + "<br>" + ws(("и участвуй", A("участвуй"), "y")))
ob("tx_pay2", "text", A("розыгрыше") - .1, t_crowd - .1, X4 + 64, Y4 + 110, cls="s", in_="fade", anchor="left", html=ws(("в розыгрыше смартфона", A("розыгрыше"), "")))
ob("cur4", "cursor", t_pay - .4, t_crowd, X4 + 200, Y4 + 500, in_="fade", z=6, kf=[kf(t_pay - .3, .5, x=X4 - 260, y=Y4 + 360)], clicks=[A("участвуй") + .05])
sfx["click"].append(A("участвуй") + .05)
ob("w_dots", "win", t_crowd - .2, t_ch - .1, X4 + 330, Y4, 820, 640, title="Участники розыгрыша", in_="right",
   body={"type": "dots", "n": 400, "cols": 25, "a": t_crowd, "b": t_crowd + 1.4, "gold": {"i": 212, "at": A("призов")}, "dim": A("призов")})
sfx["ticks"].append([t_crowd, t_crowd + 1.4])
ob("w_meme", "win", A("единицы") - .05, t_ch + .6, X4 + 650, Y4 + 230, 420, 470, title="мем", r=4, in_="scale", z=3,
   body={"type": "img", "src": "../assets/memes/skeleton.jpg",
         "labels": f'<div data-a="{A("единицы") + .15:.3f}" style="position:absolute;left:0;right:0;top:12px;text-align:center;font:900 30px Mont;color:#fff;text-transform:uppercase;text-shadow:0 0 8px #000,0 3px 0 #000">жду свой приз</div>'})
ob("w_gauge", "win", t_ch - .2, t_end_d + .1, X4 + 330, Y4 - 40, 820, 520, title="Шанс выиграть", acc="var(--red)", in_="up",
   kf=[kf(t_sp - .1, .6, y=Y4 - 230, s=.75)],
   body={"type": "gauge", "val": 3, "at": t_ch + .1, "label": "почти ноль"})
ob("n_sp", "num", t_sp - .05, t_end_d + .1, X4 + 330, Y4 + 270, c="r", **{"from": 0, "to": -4099}, sign=True, a=A("начинаешь"), b=A("собирался") + .3, label="а тратишь больше, чем собирался")
sfx["ticks"].append([A("начинаешь"), A("собирался") + .3])

# ================= минута 2: конец уровня D — станция 5 (5160×1900) =================
# Уроки 2026 (youtube/references/tutorials.md): картинка под каждую фразу, ярлыки для ключевых идей,
# вывод в конце блока + тир-лист пополняется (отсылка к доске из хука), саб-хук в конце уровня.
X5, Y5 = 5160, 1900
sec("С баллами"); t_b = A("С баллами"); t_rate = A("курс"); t_r1 = A("равен"); t_cat = A("катал"); t_exp = A("дороже")
t_life = A("срок"); t_burn = A("сгорели"); t_what = A("Что с этим"); t_rub = A("рублями"); t_there = A("там"); t_mk = A("маркетинг")
camto(t_b - .3, X5, Y5, 1, 1.0)
ob("ph5", "phone", t_b - .4, t_what + .2, X5 - 520, Y5 + 10, 420, 860, in_="up", balLabel="Бонусный счёт", balText="1 250 баллов", balC="g", appTop=400,
   kf=[kf(t_life - .2, .5, x=X5 - 260), kf(t_what - .25, .5, x=X5 - 700, o=0)],
   pushes=[{"at": A("начисляет") + .1, "ico": "<b style='font:900 22px Unb;color:#0b0f14'>Б</b>", "title": "Банк · сейчас", "html": "Начислено <b>+250 баллов</b>"},
           {"at": t_life + .1, "ico": "<b style='font:900 22px Unb;color:#0b0f14'>!</b>", "title": "Банк · напоминание", "html": "Баллы <b class='r'>сгорят</b> через 3 дня"}])
sfx["notif"] += [A("начисляет") + .1, t_life + .1]
ob("tx_pts", "text", A("не рубли") - .1, t_rate, X5 - 180, Y5 - 60, cls="m", in_="fade", anchor="left",
   html=ws(("не рубли,", A("не рубли"), "")) + "<br>" + ws(("а баллы", A("баллы", after=t_b + 1), "y")))
ob("w_rate", "win", t_rate - .2, t_life - .2, X5 + 330, Y5, 820, 520, title="Курс баллов", in_="right",
   body={"type": "rows", "title": "1 балл = ? ₽", "items": [
       {"l": "Где-то", "r": "1 балл = 1 ₽", "c": "g", "at": A("Где", after=t_rate), "mark": {"at": A("рублю"), "ok": True}},
       {"l": "А где-то", "r": "только каталог", "c": "r", "at": A("а где") , "mark": {"at": t_cat + .1, "ok": False}}]})
sfx["chip"] += [A("рублю"), t_cat + .1]
ob("w_shop", "win", t_cat + .2, t_life - .2, X5 + 330, Y5 + 330, 820, 300, title="Пример: те же наушники", in_="up", z=2, paper=True,
   body={"type": "rows", "items": [{"l": "Каталог партнёров", "r": "4 990 баллов", "c": "r", "at": t_cat + .4},
                                   {"l": "Обычный магазин", "r": "3 490 ₽", "c": "g", "at": t_exp}]})
objs[-2]["kf"].append(kf(t_cat + .1, .6, y=Y5 - 160, s=.85))
ob("w_burn", "win", t_life + .3, t_what + .2, X5 + 330, Y5 - 20, 760, 460, title="", acc="var(--red)", in_="scale", z=3,
   body=frames("d_burn", "burning", .5, t_life + .3, t_what + .3, cr("burning")))
ob("n_burn", "num", t_burn - .5, t_what + .1, X5 + 330, Y5 + 330, z=4, c="r", **{"from": 1250, "to": 0}, a=t_burn - .3, b=t_burn + .4, unit=" баллов", label="не потратил вовремя")
sfx["ticks"].append([t_burn - .3, t_burn + .4])
# ярлык: три ловушки одним именем
ob("lb_pts", "label", t_burn + .45, t_mk + .4, X5 - 40, Y5 - 330, z=6, at=t_burn + .45, kicker="ловушка", text="ловушка баллов", c="var(--yel)",
   items=[{"t": "свой курс", "at": t_burn + .7}, {"t": "каталог дороже", "at": t_burn + .85}, {"t": "сгорают", "at": t_burn + 1.0}])
sfx["thud"].append(t_burn + .45)
objs[-1]["kf"].append(kf(t_what + .2, .7, x=X5 - 420, y=Y5 - 380, s=.7))
ob("w_check", "win", t_what - .1, A("Поэтому уровень") + .2, X5 + 250, Y5 + 60, 980, 520, title="Проверь, прежде чем радоваться", paper=True, in_="up", z=2,
   body={"type": "rows", "title": "Во что превращаются баллы?", "items": [
       {"l": "Можно получить рублями?", "at": A("проверь"), "mark": {"at": A("не деньги"), "ok": False}},
       {"l": "Можно тратить там, где покупаешь?", "at": A("превращаются"), "mark": {"at": A("не деньги") + .2, "ok": False}}],
       "note": "Если нет — это не деньги."})
camto(A("проверь") - .2, X5 + 120, Y5 + 40, 1.08, 1.6, pan=False)
ob("cur5", "cursor", A("Если бонус") - .2, t_mk, X5 + 700, Y5 + 380, in_="fade", z=6,
   kf=[kf(t_rub - .5, .4, x=X5 + 520, y=Y5 + 10), kf(t_there - .4, .4, x=X5 + 620, y=Y5 + 120)], clicks=[t_rub, t_there])
sfx["click"] += [t_rub, t_there]
ob("st_mk", "stamp", t_mk - .05, A("Поэтому уровень") + .2, X5 + 250, Y5 + 250, at=t_mk, text="маркетинг", z=4, rot=-6)
sfx["thud"].append(t_mk); sfx["chip"] += [A("не деньги"), A("не деньги") + .2]

# --- вывод уровня D: назад к доске (отсылка к хуку), строка D открывается
t_poD = A("Поэтому уровень"); t_C = A("Уровень C")
camto(t_poD - .4, 960, Y3, 1, 1.0)
rows_D = {k: [{**c, "at": 0} for c in v] for k, v in board_rows.items()}
ob("w_board3", "win", t_poD - .5, t_C + .3, 960, Y3 - 60, 1100, 760, title="Тир-лист: как банк платит тебе", in_="fade",
   body={"type": "board", "rows": rows_D, "blur": [{"t": 0, "v": 9}], "unblur": {"D": t_poD + .2}})
ob("tk_D", "takeaway", t_poD + .1, t_C + .3, 960, Y3 + 400, z=3, in_="up",
   html=f'<span>Баллы — <span class="r">не деньги</span>, пока их нельзя вывести рублями</span>')
camto(t_C - .5, 470, Y3 + 230, 2.4, .7)
sfx["riser"].append([t_poD + .2, t_C - .02])

# ================= уровень C — станция 6 (5160×540) =================
X6, Y6 = 5160, 540
t_k = A("Тут деньги"); t_month = A("Каждый месяц"); t_fun = A("веселье"); t_cow = A("Вид"); t_yacht = A("аренда"); t_tr = A("запчасти")
t_exag = A("Это я"); t_hi = A("повышенный"); t_food = A("продукты"); t_lim = A("И почти"); t_sum = A("несколько")
t_what2 = A("Что делать"); t_2m = A("две минуты"); t_p1 = A("Продукты", after=t_what2); t_p2 = A("транспорт"); t_p3 = A("кафе"); t_forget = A("Включил")
t_not = A("Это не заработок"); t_disc = A("скидка"); t_always = A("Работает всегда"); t_soC = A("поэтому С"); t_next = A("а вот где"); t_lvl = A("следующем")
ob("sting_c", "sting", t_C - .05, t_k - .05, 0, 0, fixed=True, tier="C", title="Кэшбэк по категориям", sub="уровень", z=50, sound=False)
sfx["sting"].append(t_C); glow.append({"t": t_C, "c": "#ff9a3c"})
camto(t_C + .4, X6, Y6, 1, .05, pan=False)
ob("low_c", "lower", t_k + .2, t_next, 80, 975, fixed=True, text="Уровень C", sub="кэшбэк по категориям", c="var(--C)", z=40, sound=False)
ob("ph6", "phone", t_k - .3, t_month + .2, X6 - 300, Y6 + 10, 420, 860, in_="up", balLabel="Кэшбэк за месяц", bal={"from": 0, "to": 312, "a": A("процент") , "b": A("покупок") + .6, "c": "g"},
   rows=[{"ico": "П", "t": "Продукты", "am": "−1 200 ₽", "c": "r", "at": A("возвращает") - .2}, {"ico": "₽", "t": "Кэшбэк", "am": "+12 ₽", "c": "g", "at": A("процент")}])
ob("tx_real", "text", A("настоящие") - .1, t_month + .1, X6 + 40, Y6 - 40, cls="m", in_="fade", anchor="left",
   html=ws(("деньги", A("деньги", after=t_k - 1), "")) + "<br>" + ws(("настоящие", A("настоящие"), "g")))
ob("tx_real2", "text", A("процент") - .1, t_month + .1, X6 + 44, Y6 + 90, cls="s", in_="fade", anchor="left", html=ws(("процент с покупок возвращается рублями", A("процент"), "")))
# категории: картинка под каждую строку
for src, ss in (("cows", 2.0), ("yacht", 2.0), ("tractor", 3.0), ("groceries", 2.0)): THUMBS.append((src, ss))
cats = [{"name": "Ветклиники для коров", "p": "7%", "at": t_cow, "img": "out/thumbs/cows.jpg"}, {"name": "Аренда яхт", "p": "10%", "at": t_yacht, "img": "out/thumbs/yacht.jpg"},
        {"name": "Запчасти для тракторов", "p": "15%", "at": t_tr, "img": "out/thumbs/tractor.jpg"}, {"name": "Продукты", "p": "1%", "bad": 1, "at": t_food - .1, "img": "out/thumbs/groceries.jpg"}]
ob("w_cats", "win", t_month - .2, t_lim + .1, X6, Y6, 1100, 800, title="Выбери категории кэшбэка на месяц", in_="scale",
   kf=[kf(t_fun - .1, 1.2, s=1.06), kf(t_exag - .1, .7, x=X6 - 330, s=.8)],
   body={"type": "cats", "items": cats, "hl": [{"i": 3, "at": t_food}]})
sfx["chip"] += [t_cow, t_yacht, t_tr, t_food]
ob("w_meme2", "win", t_hi - .2, t_lim + .1, X6 + 470, Y6 - 10, 640, 474, title="мем", r=2, in_="right", z=3,
   body={"type": "img", "src": "../assets/memes/distracted.jpg", "labels":
         f'<div data-a="{t_hi:.3f}" class="mtag" style="left:6%;top:56%">повышенный %<br>на коров</div>'
         f'<div data-a="{t_hi + .5:.3f}" class="mtag" style="left:44%;top:20%">банк</div>'
         f'<div data-a="{t_food:.3f}" class="mtag" style="left:66%;top:46%">продукты —<br>копейки</div>'})
ob("tx_hi", "text", t_hi - .1, t_lim + .1, X6 + 470, Y6 + 330, cls="s", in_="fade", html=ws(("повышенный — там, где ты почти не тратишь", t_hi, "")))
# потолок кэшбэка
ob("w_cap", "win", t_lim - .1, t_what2 + .1, X6 + 180, Y6 + 40, 1000, 460, title="Кэшбэк за месяц", in_="up",
   body={"type": "cap", "label": "сколько вернут", "a": t_lim + .2, "b": A("вернут") + .2, "cap": .7, "at2": t_sum, "sub": "лимит обычно — несколько тысяч ₽ в месяц"})
ob("lb_cap", "label", A("лимит") + .2, t_what2 + .1, X6 - 100, Y6 - 330, z=5, at=A("лимит") + .2, kicker="ловушка", text="потолок кэшбэка", c="var(--C)", rot=2)
sfx["thud"].append(A("лимит") + .2)
# что делать: та же сетка категорий, выбираем свои (отсылка назад)
my = [{"name": "Продукты", "p": "5%", "at": t_what2 + .1, "img": "out/thumbs/groceries.jpg"}, {"name": "Транспорт", "p": "5%", "at": t_what2 + .2},
      {"name": "Кафе", "p": "5%", "at": t_what2 + .3}, {"name": "Аренда яхт", "p": "10%", "at": t_what2 + .4, "img": "out/thumbs/yacht.jpg"}]
ob("w_my", "win", t_what2 - .1, t_not + .1, X6 - 300, Y6, 900, 700, title="Мои категории · раз в месяц", in_="scale",
   body={"type": "cats", "items": my, "sel": [{"i": 0, "at": t_p1}, {"i": 1, "at": t_p2}, {"i": 2, "at": t_p3}]})
ob("cur6", "cursor", t_what2 + .4, t_not, X6 + 400, Y6 + 400, in_="fade", z=6,
   kf=[kf(t_p1 - .35, .3, x=X6 - 520, y=Y6 - 60), kf(t_p2 - .35, .3, x=X6 - 80, y=Y6 - 60), kf(t_p3 - .35, .3, x=X6 - 520, y=Y6 + 280)], clicks=[t_p1, t_p2, t_p3])
sfx["click"] += [t_p1, t_p2, t_p3]
ob("tx_2m", "text", t_2m - .1, t_not + .1, X6 + 240, Y6 - 80, cls="m", in_="fade", anchor="left", html=ws(("2 минуты", t_2m, "y")) + "<br>" + ws(("раз в месяц", t_2m + .2, "")))
ob("tx_fg", "text", t_forget - .1, t_not + .1, X6 + 244, Y6 + 70, cls="s", in_="fade", anchor="left", html=ws(("включил и забыл", t_forget, "")))
# вывод уровня C → доска, строка C открывается; саб-хук на уровень B
ob("tk_C", "takeaway", t_not - .1, t_always, X6, Y6, z=3, in_="up", s=1.15,
   html=f'<span data-a="{t_not:.3f}">Кэшбэк — <span class="r">не заработок</span>,</span><br><span data-a="{t_disc:.3f}">а <span class="g">скидка</span> на то, что ты и так покупаешь</span>')
camto(t_always - .4, 960, Y3, 1, 1.0)
t_B = A("Уровень B")
ob("w_board4", "win", t_always - .5, t_B + .3, 960, Y3 - 60, 1100, 760, title="Тир-лист: как банк платит тебе", in_="fade",
   body={"type": "board", "rows": rows_D, "blur": [{"t": 0, "v": 9}], "unblur": {"D": 0, "C": t_soC + .1}, "focus": {"row": "B", "at": t_next + .2}})
ob("tk_C2", "takeaway", t_always, t_next + .2, 960, Y3 + 400, z=3, in_="up", html='<span>Работает всегда, но <span class="r">много не даст</span></span>')
ob("tx_next", "text", t_next - .1, t_B + .3, 960, Y3 + 400, cls="m", in_="up", html=ws(("где платят", A("платят", after=t_next), "")) + " " + ws(("больше?", A("больше", after=t_next), "g")))
camto(t_lvl - .2, 470, Y3 - 70, 1.6, 1.4, pan=False)
music.append({"t": t_soC + .4, "part": "intro"})


def sting(tier, t, t_end, title, color):
    ob(f"sting_{tier}", "sting", t - .05, t_end, 0, 0, fixed=True, tier=tier, title=title, sub="уровень", z=50, sound=False)
    sfx["sting"].append(t); glow.append({"t": t, "c": color}); music.append({"t": t, "part": "main"})


def to_board(t, unblur, focus_row, t_end, take=None, take_t=None):
    """Отсылка к доске из хука: камера к доске, строка разобранного уровня открывается, наезд в следующую строку."""
    camto(t - .4, 960, Y3, 1, 1.0)
    ob(f"w_board_{focus_row}", "win", t - .5, t_end + .3, 960, Y3 - 60, 1100, 760, title="Тир-лист: как банк платит тебе", in_="fade",
       body={"type": "board", "rows": rows_D, "blur": [{"t": 0, "v": 9}], "unblur": unblur, "focus": {"row": focus_row, "at": t_end - 1.2}})
    if take: ob(f"tk_b_{focus_row}", "takeaway", take_t or t, t_end - .5, 960, Y3 + 400, z=3, in_="up", html=take)
    y_row = {"S": -290, "A": -150, "B": 0, "C": 150, "D": 290}[focus_row] * 760 / 820 - 60
    camto(t_end - .55, 470, Y3 + y_row, 2.4, .6)
    sfx["riser"].append([t_end - 1.3, t_end - .02])


# ================= уровень B — станция 7 (7260×540) =================
X7, Y7 = 7260, 540
sec("Уровень B"); t_B = A("Уровень B"); t_nc = A("Новый клиент"); t_pay2 = A("готов"); t_how = A("Работает это так"); t_form = A("Оформляешь"); t_buy = A("делаешь одну")
t_get = A("получаешь бонус"); t_now = A("Сейчас это"); t_cash = A("деньгами"); t_cb = A("кэшбеком"); t_cert = A("сертификатом"); t_range = A("за одну покупку от")
t_gift = A("Звучит"); t_3 = A("три подвоха"); t_n1 = A("Новый клиент", after=t_gift); t_had = A("уже была"); t_n2 = A("Сроки"); t_miss = A("Пропустил")
t_n3 = A("Обслуживание"); t_free = A("бесплатны"); t_fee = A("Не выполнил"); t_more = A("больше, чем"); t_whB = A("Что делать", after=t_n3); t_rules = A("правила")
t_ban = A("баннер"); t_now2 = A("Сделать покупку"); t_close = A("закрыть"); t_throw = A("выкинуть"); t_tg2 = A("А какие банки"); t_list = A("Список"); t_link = A("Ссылка в описании")
sting("B", t_B, t_nc - .1, "Приветственные бонусы", "#ffd84a")
camto(t_B + .4, X7, Y7, 1, .05, pan=False)
ob("low_b", "lower", t_nc + .2, A("Уровень А"), 80, 975, fixed=True, text="Уровень B", sub="приветственные бонусы", c="var(--B)", z=40, sound=False)
ob("w_flowB", "win", t_nc - .2, t_how + .1, X7, Y7 - 20, 1300, 620, title="Почему банк платит", in_="scale",
   body={"type": "flow", "nodes": [{"id": "b", "x": 260, "y": 280, "t": "Банк", "sub": "нужны клиенты", "c": "var(--B)", "at": t_nc},
                                    {"id": "y", "x": 1020, "y": 280, "t": "Ты", "sub": "новый клиент", "c": "var(--green)", "at": t_nc + .4}],
            "edges": [{"a": "b", "b": "y", "t": "платит за тебя", "c": "#3ddc84", "at": t_pay2}]})
ob("w_stepsB", "win", t_how - .1, t_now + .1, X7 - 330, Y7, 760, 560, title="Как это работает", in_="left",
   body={"type": "crit", "title": "3 шага", "items": [{"ic": "rub", "t": "Оформляешь карту", "at": t_form}, {"ic": "clock", "t": "Одна покупка", "at": t_buy}, {"ic": "rub", "t": "Получаешь бонус", "at": t_get}]})
ob("w_payB", "win", t_buy - .1, t_now + .1, X7 + 470, Y7 - 120, 640, 400, title="", in_="right", z=2, body=frames("d_payB", "pay_terminal", 3.0, t_buy, t_now + .2, cr("pay_terminal")))
ob("ph7", "phone", t_get - .4, t_now + .1, X7 + 470, Y7 + 260, 300, 600, in_="up", z=3, appTop=420, s=.8,
   pushes=[{"at": t_get + .1, "ico": "<b style='font:900 22px Unb;color:#0b0f14'>₽</b>", "title": "Банк · сейчас", "html": "Бонус новому клиенту <b>+1 000 ₽</b>"}])
sfx["notif"].append(t_get + .1); sfx["chip"] += [t_form, t_buy]
ob("n_rangeB", "num", t_now - .1, t_gift, X7, Y7 - 150, c="g", **{"from": 1000, "to": 2000}, a=A("1000"), b=A("2000") + .3, label="обычно — от 1 000 до 2 000 ₽", text="1 000–2 000 ₽")
sfx["ticks"].append([A("1000"), A("2000") + .3])
ob("w_formB", "win", t_cash - .2, t_gift, X7, Y7 + 170, 1100, 300, title="Чем платят", in_="up",
   body={"type": "rows", "items": [{"l": "Деньгами", "r": "₽", "c": "g", "at": t_cash}, {"l": "Кэшбэком или сертификатом", "r": "маркетплейс", "at": t_cb}]})
ob("tx_rangeB", "text", t_range - .1, t_gift, X7, Y7 + 400, cls="s", in_="fade", html=ws(("за одну покупку от 500 до 3 000 ₽", t_range, "")))
# три подвоха — документ правил с маркером
ob("lb_3", "label", t_3 - .1, t_whB, X7 - 330, Y7 - 390, z=6, at=t_3, kicker="внимание", text="3 подвоха", c="var(--red)",
   items=[{"t": "новый клиент", "at": t_n1}, {"t": "сроки", "at": t_n2}, {"t": "обслуживание", "at": t_n3}])
sfx["thud"].append(t_3)
ob("w_rulesB", "win", t_n1 - .3, t_whB, X7 + 200, Y7 + 60, 1000, 680, title="Правила акции.pdf", paper=True, in_="up",
   body={"type": "doc", "html": "<h3>Бонус за первую покупку</h3>"
         f"<p>1. Участник — {mark('новый клиент банка', t_n1 + .1, .6)}: ранее не имел карт банка.</p>"
         f"<p>2. Покупку нужно совершить {mark('в течение установленного срока', t_n2 + .1, .7)} с даты выдачи карты.</p>"
         f"<p>3. {mark('Обслуживание бесплатно при выполнении условий', t_free - .2, .8, 'r')}, иначе — по тарифу.</p>"
         "<p style='color:#8a8d94;font-size:20px'>Пример формулировок. Условия — на сайте банка.</p>"})
ob("st_had", "stamp", t_had + .2, t_n2 - .1, X7 + 520, Y7 - 120, at=t_had + .2, text="бонуса нет", z=4, rot=-5)
sfx["thud"].append(t_had + .2)
ob("n_days", "num", t_miss - .5, t_n3, X7 + 520, Y7 + 330, z=4, c="r", **{"from": 7, "to": 0}, a=t_miss - .4, b=t_miss + .2, unit=" дней", label="срок вышел — бонус всё")
ob("ph7b", "phone", t_fee - .3, t_whB, X7 - 660, Y7 + 60, 420, 860, in_="left", z=5, s=.85, appTop=420, kf=[kf(t_fee - .3, .01, s=.85)],
   pushes=[{"at": t_fee - .1, "ico": "<b style='font:900 22px Unb;color:#0b0f14'>₽</b>", "title": "Банк", "html": "Бонус <b>+1 000 ₽</b>"},
           {"at": t_more, "ico": "<b style='font:900 22px Unb;color:#0b0f14'>!</b>", "title": "Банк · пример", "html": "Обслуживание <b class='r'>−1 490 ₽</b>"}])
sfx["notif"] += [t_fee - .1, t_more]
# что делать: правила целиком, а не баннер; закрыть, а не выкинуть
ob("w_banB", "win", t_whB - .1, t_now2, X7 - 380, Y7 - 40, 640, 520, title="Реклама", in_="left",
   body={"type": "html", "html": '<div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:14px;background:linear-gradient(135deg,#6a4cff,#b44cff);font:900 54px/1.05 Unb;text-transform:uppercase;text-align:center">+2 000 ₽<br>за покупку!<small style="font:600 24px Mont;text-transform:none;opacity:.8">* подробности мелким шрифтом</small></div>'})
ob("st_ban", "stamp", t_ban - .05, t_now2, X7 - 380, Y7 + 60, at=t_ban, text="не верь баннеру", z=3, rot=-7)
sfx["thud"].append(t_ban)
ob("w_rules2", "win", t_rules - .2, t_now2, X7 + 380, Y7 - 20, 760, 600, title="Правила акции.pdf", paper=True, in_="right",
   body={"type": "doc", "html": f"<h3>Правила акции</h3><p>{mark('Читать целиком', t_rules + .1, .6)}: кто считается новым клиентом, срок покупки, минимальная сумма, тариф обслуживания.</p>",
         "scroll": {"from": 0, "to": 0, "a": 0, "b": 1}})
ob("w_doB", "win", t_now2 - .1, t_tg2, X7, Y7, 1000, 520, title="Чек-лист", in_="scale",
   body={"type": "rows", "items": [{"l": "Покупку — сразу", "at": t_now2, "mark": {"at": t_now2 + .5, "ok": True}},
                                   {"l": "Карта не нужна — закрыть в приложении/отделении", "at": t_close - .2, "mark": {"at": t_close + .4, "ok": True}},
                                   {"l": "Просто выкинуть карту", "at": t_throw - .3, "mark": {"at": t_throw, "ok": False}}]})
sfx["chip"] += [t_now2 + .5, t_close + .4, t_throw]
# встроенный CTA: список банков в TG (та же карточка канала, что в хуке)
ob("w_tgB", "win", t_tg2 - .2, A("Уровень А") - .2, X7 - 260, Y7, 720, 820, title="Telegram", acc="var(--tg)", in_="up",
   body={"type": "tg", "name": "Бонусы банков", "sub": "канал · список обновляется", "msgs": [
       {"html": "<b>Приветственные бонусы — сейчас</b><br>актуальный список банков", "at": A("собрал")},
       {"html": "Обновлено сегодня ✓", "at": t_list}]})
ob("tx_link", "text", t_link - .1, A("Уровень А") - .2, X7 + 460, Y7, cls="m", in_="fade", html=ws(("ссылка", t_link, "")) + "<br>" + ws(("в описании ↓", t_link + .3, "g")))

# ================= уровень A — станция 8 (9360×1900) =================
X8, Y8 = 9360, 1900
sec("Уровень А"); t_A = A("Уровень А"); t_ref = A("программа"); t_share = A("делишься ссылкой"); t_fr = A("друг оформляет"); t_you = A("получаешь ты"); t_too = A("и он тоже")
t_sum = A("обычно это"); t_why = A("Почему это выше"); t_once = A("один раз"); t_many = A("друзей может"); t_f1 = A("однокурсники"); t_f2 = A("коллеги"); t_f3 = A("семья")
t_self = A("им самим"); t_vp = A("впариваешь"); t_shb = A("делишься бонусом"); t_whA = A("Что делать"); t_honest = A("честно объяснять"); t_what3 = A("что сделать")
t_term = A("в какой срок"); t_paid = A("платное"); t_if = A("Если друг"); t_listen = A("не послушает"); t_rem = A("помни"); t_lim2 = A("лимит"); t_year = A("в год"); t_also = A("Это тоже написано")
to_board(t_tg2 + 0, {"D": 0, "C": 0, "B": t_tg2 + .2}, "A", t_A, take='<span>Бонус за карту — <span class="g">разовый</span>, читай правила целиком</span>')
objs[-2]["t0"] = round(A("Ссылка в описании", after=t_tg2) + .9, 3); objs[-2]["kf"][0]["t"] = objs[-2]["t0"]
cam[-2]["t"] = round(objs[-2]["t0"] + .3, 3); objs[-1]["t0"] = objs[-2]["t0"]
for o in objs:
    if o["id"] == "w_board_A": o["t0"] = objs[-1]["t0"] - .1; o["kf"][0]["t"] = o["t0"]; o["body"]["unblur"]["B"] = o["t0"] + .4
for o in objs:
    if o["id"] in ("w_tgB", "tx_link", "low_b"): o["t1"] = round(objs[-1]["t0"] + .3, 3)
sting("A", t_A, A("большинства", after=t_A) + .2, "Приведи друга", "#4aa8ff")
camto(t_A + .4, X8, Y8, 1, .05, pan=False)
ob("low_a", "lower", A("большинства", after=t_A) + .3, A("уровень S"), 80, 975, fixed=True, text="Уровень A", sub="приведи друга", c="var(--A)", z=40, sound=False)
ob("w_flowA", "win", A("большинства", after=t_A) + .1, t_why, X8, Y8 - 110, 1500, 700, title="Реферальная программа", in_="scale",
   body={"type": "flow", "nodes": [{"id": "y", "x": 220, "y": 200, "t": "Ты", "sub": "делишься ссылкой", "c": "var(--green)", "at": t_ref},
                                    {"id": "f", "x": 750, "y": 200, "t": "Друг", "sub": "оформляет карту", "c": "var(--A)", "at": t_fr},
                                    {"id": "b", "x": 1280, "y": 200, "t": "Банк", "sub": "условия выполнены", "c": "var(--B)", "at": t_fr + .6},
                                    {"id": "y2", "x": 500, "y": 520, "t": "+ бонус тебе", "c": "var(--green)", "at": t_you},
                                    {"id": "f2", "x": 1000, "y": 520, "t": "+ бонус другу", "sub": "часто", "c": "var(--A)", "at": t_too}],
            "edges": [{"a": "y", "b": "f", "t": "ссылка", "at": t_share}, {"a": "f", "b": "b", "t": "карта", "at": t_fr + .3},
                      {"a": "b", "b": "y2", "c": "#3ddc84", "at": t_you - .2}, {"a": "b", "b": "f2", "c": "#4aa8ff", "at": t_too - .1}]})
ob("tx_sumA", "text", t_sum - .1, t_why, X8, Y8 + 330, cls="m", in_="up", html=ws(("от сотен ₽", t_sum, "")) + " " + ws(("до 2 000 ₽", A("пары тысяч"), "g")) + " " + ws(("за друга", A("одного друга"), "")))
ob("w_once", "win", t_why - .2, t_self, X8 - 450, Y8, 640, 560, title="Приветственный бонус", in_="left",
   body={"type": "html", "html": f'<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px"><div style="font:800 140px Mono;color:var(--muted)">×1</div><div style="font:700 30px Mont;color:var(--muted)">один раз</div></div>'})
ob("w_frA", "win", t_many - .2, t_self, X8 + 330, Y8, 900, 560, title="Друзей может быть много", in_="right",
   body=frames("d_friends", "friends", 1.0, t_many - .2, t_self + .2, cr("friends")))
for k, (tt, w_) in enumerate(((t_f1, "однокурсники"), (t_f2, "коллеги"), (t_f3, "семья"))):
    ob(f"chA{k}", "lower", tt - .05, t_self, X8 + 30 + 280 * k - 260, Y8 + 330, text=w_, c="var(--A)", z=4)
    objs[-1].pop("fixed", None)
ob("tk_vp", "takeaway", t_self - .1, t_whA, X8, Y8, z=3, in_="up", s=1.2,
   html=f'<span>Им самим выгодно:</span><br><span data-a="{t_vp:.3f}">ты <span class="r">не впариваешь</span>,</span> <span data-a="{t_shb:.3f}">а <span class="g">делишься бонусом</span></span>')
ob("w_chat", "win", t_whA - .1, t_rem, X8 - 260, Y8, 820, 860, title="Чат с другом", acc="var(--tg)", in_="up",
   body={"type": "tg", "name": "Друг", "sub": "в сети", "msgs": [
       {"html": "Смотри, оформи карту по моей ссылке 👇".replace(" 👇", ""), "at": t_honest},
       {"html": "Что сделать: <b>покупка по условиям</b>", "at": t_what3},
       {"html": "Срок: <b>успей за отведённые дни</b>", "at": t_term},
       {"html": "И проверь, чтобы <b>обслуживание было бесплатным</b>", "at": t_paid},
       {"html": "<span style='color:#ff4d5e'>бонус так и не пришёл…</span>", "at": t_if + .3}]})
ob("lb_trust", "label", t_listen - .3, t_rem, X8 + 470, Y8 + 150, z=5, at=t_listen - .2, kicker="правило", text="честность", c="var(--A)", rot=2)
sfx["thud"].append(t_listen - .2)
ob("w_capA", "win", t_rem - .1, t_also + 1.2, X8 + 200, Y8 + 40, 1000, 460, title="Реферальная программа", in_="up",
   body={"type": "cap", "label": "друзей и выплат в год", "a": t_lim2, "b": t_year + .4, "cap": .7, "at2": t_year, "sub": "лимиты — в правилах программы", "grow": "друзья приходят…", "stop": "дальше — бонус не начислят"})
ob("lb_capA", "label", t_lim2 - .1, t_also + 1.2, X8 - 160, Y8 - 300, z=5, at=t_lim2, kicker="помни", text="лимит друзей", c="var(--A)", rot=-2)
sfx["thud"].append(t_lim2)

# ================= уровень S — станция 9 (11460×540) =================
X9, Y9 = 11460, 540
sec("наконец"); t_S = A("уровень S"); t_time = A("твое время"); t_three = A("не трем"); t_aud = A("целевой"); t_ch = A("Свой телеграм"); t_vid = A("ролики"); t_post = t_vid + .4
t_people = A("Люди приходят"); t_links = A("по твоим ссылкам"); t_partner = A("как партнеру"); t_good = A("Один хороший"); t_weeks = A("неделями"); t_mych = A("мой канал")
t_ipay = A("я сам плачу"); t_adult = A("взрослые правила"); t_r1 = A("Первое"); t_mk2 = A("маркировать"); t_adv = A("рекламодатель"); t_note = t_adv - .6; t_code = A("специальный код")
t_r2 = A("Второй"); t_tax = A("налог"); t_self2 = A("проще всего"); t_6 = A("6"); t_app = A("в приложении"); t_r3 = A("Третья"); t_rec = A("рекомендуй"); t_cond = A("всегда")
t_bad = A("плохую карту"); t_back = A("не вернется"); t_soS = A("Поэтому S"); t_grow = A("растет")
to_board(t_also, {"D": 0, "C": 0, "B": 0, "A": t_also + .6}, "S", t_S, take='<span>Друзей много — бонусов много, <span class="r">но есть лимит</span></span>')
sting("S", t_S, t_time - .2, "Свой канал", "#b77cff")
camto(t_S + .4, X9, Y9, 1, .05, pan=False)
ob("low_s", "lower", t_time, A("Я обещал"), 80, 975, fixed=True, text="Уровень S", sub="свой канал", c="var(--S)", z=40, sound=False)
ob("w_aud3", "win", t_time - .2, t_ch - .1, X9 - 420, Y9, 640, 560, title="Друзья", in_="left",
   body={"type": "dots", "n": 3, "cols": 3, "a": t_three - .3, "b": t_three})
ob("w_aud", "win", t_aud - .3, t_ch - .1, X9 + 330, Y9, 900, 620, title="Аудитория", in_="right",
   body={"type": "dots", "n": 600, "cols": 30, "a": t_aud, "b": t_aud + 1.6})
sfx["ticks"].append([t_aud, t_aud + 1.6])
ob("w_flowS", "win", t_ch - .2, t_good, X9, Y9 - 40, 1500, 720, title="Как платят партнёру", in_="scale",
   body={"type": "flow", "nodes": [{"id": "c", "x": 230, "y": 210, "t": "Твой контент", "sub": "канал · ролики · посты", "c": "var(--S)", "at": t_ch},
                                    {"id": "p", "x": 750, "y": 210, "t": "Люди", "sub": "за полезным", "c": "var(--A)", "at": t_people},
                                    {"id": "b", "x": 1270, "y": 210, "t": "Банк", "sub": "карты по ссылкам", "c": "var(--B)", "at": t_links},
                                    {"id": "y", "x": 750, "y": 530, "t": "Тебе", "sub": "как партнёру", "c": "var(--green)", "at": t_partner}],
            "edges": [{"a": "c", "b": "p", "at": t_people - .2}, {"a": "p", "b": "b", "t": "карты", "at": t_links - .1}, {"a": "b", "b": "y", "t": "₽", "c": "#3ddc84", "at": t_partner}]})
ob("w_tgS", "win", t_good - .2, t_adult, X9 - 300, Y9, 720, 820, title="Telegram", acc="var(--tg)", in_="up",
   body={"type": "tg", "name": "Бонусы банков", "sub": "канал", "msgs": [
       {"html": "<b>С чего начать</b><br>Кредитка Альфа-Банка — <b>+1 000 ₽</b>", "at": t_good},
       {"html": "За карты по моим ссылкам <b>плачу подписчикам</b>", "at": t_ipay}]})
ob("w_chartS0", "win", t_weeks - .3, t_adult, X9 + 420, Y9, 700, 460, title="Просмотры поста", in_="right",
   body={"type": "chart", "pts": [[0, 0], [.15, .45], [.35, .62], [.6, .78], [.85, .88], [1, .93]], "a": t_weeks - .1, "b": t_weeks + 1.5, "ticks": [[0, "день 1"], [.5, "неделя"], [1, "3 недели"]], "label": "пост работает неделями"})
ob("lb_adult", "label", t_adult - .1, t_r1 + .3, X9, Y9, z=6, at=t_adult, kicker="взрослые правила", text="реклама · налог · честность", c="var(--S)", rot=-1)
sfx["thud"].append(t_adult)
ob("w_mark", "win", t_r1 - .1, t_r2, X9, Y9, 1200, 620, title="Пост с реферальной ссылкой", paper=True, in_="up",
   body={"type": "doc", "html": "<h3>Карта с бонусом +1 000 ₽</h3><p>Оформи по ссылке и сделай покупку…</p>"
         f"<p style='font-size:24px'>{mark('Реклама.', t_note, .4)} {mark('ООО «Рекламодатель», ИНН 0000000000.', t_adv, .7)} {mark('erid: 2Vtzq…', t_code, .5)}</p>"
         "<p style='color:#8a8d94;font-size:20px'>Пример маркировки: пометка «Реклама», рекламодатель и код erid.</p>"})
ob("tx_law", "text", t_mk2 - .1, t_r2, X9, Y9 - 400, cls="m", in_="fade", html=ws(("по закону — ", t_mk2, "")) + ws(("маркировка", t_mk2 + .2, "y")))
ob("ph9", "phone", t_r2 - .2, t_r3, X9 - 380, Y9 + 10, 420, 860, in_="left", balLabel="Самозанятый · пример", bal={"from": 0, "to": 10000, "a": t_tax, "b": t_tax + .8, "c": "g"},
   rows=[{"ico": "₽", "t": "От компании", "am": "+10 000 ₽", "c": "g", "at": t_tax + .2}, {"ico": "%", "t": "Налог 6%", "am": "−600 ₽", "c": "r", "at": t_6}])
ob("tx_tax", "text", t_self2 - .1, t_r3, X9 + 100, Y9 - 40, cls="m", in_="fade", anchor="left", html=ws(("доход =", t_tax, "")) + "<br>" + ws(("налог 6%", t_6, "y")))
ob("tx_tax2", "text", t_app - .1, t_r3, X9 + 104, Y9 + 110, cls="s", in_="fade", anchor="left", html=ws(("самозанятость, всё в приложении", t_app, "")))
ob("w_honest", "win", t_r3 - .1, t_soS, X9, Y9, 1100, 560, title="Третье правило: честность", in_="scale",
   body={"type": "rows", "items": [{"l": "Рекомендуй то, что понимаешь сам", "at": t_rec, "mark": {"at": t_rec + .6, "ok": True}},
                                   {"l": "Всегда пиши условия", "at": t_cond - .2, "mark": {"at": t_cond + .3, "ok": True}},
                                   {"l": "Впарить плохую карту", "at": t_bad - .4, "mark": {"at": t_back, "ok": False}}]})
sfx["chip"] += [t_rec + .6, t_cond + .3, t_back]
ob("w_growS", "win", t_soS - .2, A("Я обещал"), X9, Y9 - 20, 1100, 620, title="Доход: способ S против разового бонуса", in_="up",
   body={"type": "chart", "pts": [[0, .02], [.25, .05], [.45, .12], [.65, .3], [.85, .62], [1, .95]], "a": t_soS, "b": t_grow + .8, "c": "#b77cff",
         "ticks": [[0, "старт"], [.5, "полгода"], [1, "дальше"]], "label": "на старте дольше всего — потом растёт вместе с тобой"})

# ================= способ вне рейтинга — станция 10 (13560×1900) =================
X10, Y10 = 13560, 1900
sec("Я обещал"); t_prom = A("Я обещал"); t_dm = A("в личку"); t_give = A("отдай нам"); t_wepay = A("мы заплатим"); t_notb = A("Это не бонусы"); t_scam = A("мошенники")
t_you2 = A("Отвечать будешь"); t_crim = A("уголовная"); t_3y = A("трех лет"); t_fine = A("от ста"); t_block = A("блокировка"); t_never = A("никогда")
to_board(t_soS + .2, {"D": 0, "C": 0, "B": 0, "A": 0, "S": t_soS + .8}, "S", t_prom - .05)
for o in objs:
    if o["id"] == "w_board_S" and o["t0"] > t_soS: o["id"] = "w_board_S2"
cam[-1]["t"] = cam[-2]["t"]; cam.pop()   # без наезда: дальше — не уровень, а «способ вне рейтинга»
sfx["riser"].pop()
for o in objs:
    if o["id"] == "w_growS": o["t1"] = round(t_soS + .3, 3)
camto(t_prom - .3, X10, Y10, 1, 1.0)
glow.append({"t": t_prom, "c": "#ff4d5e"}); music += [{"t": t_prom - .1, "part": "break"}]
ob("w_secret2", "win", t_prom - .3, t_notb, X10 - 420, Y10, 760, 560, title="Способ вне рейтинга", paper=True, acc="var(--red)", in_="scale",
   body={"type": "doc", "html": f"<h3>Способ №7</h3>{RED}"})
ob("w_dm", "win", t_dm - .2, t_notb + .2, X10 + 380, Y10, 760, 640, title="Личные сообщения", acc="var(--red)", in_="right",
   body={"type": "tg", "name": "Незнакомец", "sub": "был в сети недавно", "msgs": [
       {"html": "Привет! Оформи карту и <b style='color:#ff4d5e'>отдай нам на время</b>", "at": t_give - .3},
       {"html": "Мы заплатим, всё легально 😉".replace(" 😉", ""), "at": t_wepay}]})
ob("st_not", "stamp", t_notb - .05, t_scam, X10 - 420, Y10 + 60, at=t_notb, text="не заработок", z=4)
sfx["thud"].append(t_notb)
ob("w_hack", "win", t_scam - .3, t_you2 + .2, X10 + 330, Y10, 900, 520, title="", acc="var(--red)", in_="right", body=frames("d_hack", "hacker", 1.0, t_scam - .3, t_you2 + .3, cr("hacker")))
ob("w_flowX", "win", t_scam - .2, t_you2 + .2, X10 - 520, Y10 + 40, 620, 600, title="Куда идут деньги", acc="var(--red)", in_="left",
   body={"type": "flow", "nodes": [{"id": "m", "x": 310, "y": 110, "t": "Мошенники", "c": "var(--red)", "at": t_scam},
                                    {"id": "c", "x": 310, "y": 300, "t": "Твоя карта", "c": "var(--yel)", "at": t_scam + .3},
                                    {"id": "v", "x": 310, "y": 490, "t": "Чужие деньги", "c": "var(--red)", "at": t_scam + .6}],
            "edges": [{"a": "m", "b": "c", "c": "#ff4d5e", "at": t_scam + .2}, {"a": "c", "b": "v", "c": "#ff4d5e", "at": t_scam + .5}]})
ob("lb_you", "label", t_you2 - .1, t_never + .8, X10, Y10 - 360, z=6, at=t_you2, kicker="отвечаешь ты", text="уголовная статья", c="var(--red)")
sfx["thud"].append(t_you2)
ob("w_law", "win", t_crim - .2, t_never + .8, X10 - 300, Y10 + 60, 900, 560, title="Передача карты третьим лицам", paper=True, acc="var(--red)", in_="up",
   body={"type": "rows", "items": [{"l": "Лишение свободы", "r": "до 3 лет", "c": "r", "at": t_3y}, {"l": "Или штраф", "r": "100–300 тыс. ₽", "c": "r", "at": t_fine},
                                   {"l": "Плюс", "r": "блокировка счетов", "c": "r", "at": t_block}], "note": "Ответственность — на владельце карты."})
ob("w_cuff2", "win", t_3y - .3, t_never + .8, X10 + 520, Y10 + 40, 640, 420, title="", acc="var(--red)", in_="right", z=2,
   body=frames("d_cuff2", "handcuffs_money", 1.0, t_3y - .3, t_never + 1.0, cr("handcuffs_money"), gray=True))
ob("st_never", "stamp", t_never - .1, t_never + .8, X10 + 520, Y10 + 330, at=t_never, text="карту чужому — никогда", z=5, rot=-4)
sfx["thud"].append(t_never); music.append({"t": t_never + .3, "part": "stop"})

# ================= обещанный подсчёт — станция 11 (15660×540) =================
X11, Y11 = 15660, 540
sec("А теперь обещанный"); t_calc = A("А теперь обещанный"); t_18 = A("Допустим"); t_phone = A("кроме телефона"); t_here = A("Вот сколько можно")
t_alfa = A("Альфа"); t_any = A("Любая покупка"); t_otp = A("УТП"); t_two = A("Две покупки"); t_cour = A("курьера"); t_tb = A("Т", after=t_cour); t_3k = A("от 3000")
t_ur = A("Ураус"); t_31 = A("31"); t_tot = A("Итого"); t_place = A("Если расставить"); t_inS = A("попадает"); t_big = A("самый большой"); t_alfa2 = A("и Альфа")
t_inA = A("В А"); t_month2 = A("держать месяц"); t_otp2 = A("бонус хороший"); t_cr = A("три из"); t_bankm = A("деньги банка"); t_ret = A("верни"); t_serv = A("обслуживания")
t_once2 = A("разовый"); t_cta = A("выплату"); t_end = W.ws[-1]["a"] + W.ws[-1]["d"]
glow.append({"t": t_calc, "c": "#3ddc84"}); music.append({"t": t_calc, "part": "main"})
camto(t_calc - .3, X11, Y11, 1, 1.0)
ob("ph11", "phone", t_calc - .3, t_place, X11 - 640, Y11 + 10, 420, 860, in_="up", balLabel="Можешь получить", appTop=120, balText="?? ??? ₽",
   bal={"from": 0, "to": 5500, "a": t_alfa, "b": t_tot + .6, "c": "g"})
objs[-1]["bal"]["steps"] = [[t_any, 1000], [t_two + .5, 2000], [t_3k + .5, 4000], [t_31 + .3, 5500]]
ob("tx18b", "text", t_18 - .1, t_here, X11 + 60, Y11 - 40, cls="m", in_="fade", anchor="left",
   html=ws(("18 лет", A("18", after=t_18 - .5), "")) + "<br>" + ws(("и только телефон", t_phone, "g")))
ob("tx_here", "text", t_here - .1, t_alfa - .3, X11 + 64, Y11 + 150, cls="s", in_="fade", anchor="left",
   html=ws(("прямо сейчас — по ссылкам из моего ТГ", t_here + .4, "")))
objs[-2]["t1"] = round(t_alfa - .3, 3)
for k, bk in enumerate(["tbank", "alfa", "uralsib", "otp"]):   # отсылка к хуку: те же размытые логотипы — сейчас откроем
    ob(f"bkx{k}", "bank", t_here + .1 * k, t_alfa - .1, X11 - 260 + 330 * k, Y11 + 330, 290, 160, bank=bk, blur=10, in_="up", z=2, sound=k == 0)
offers = [("alfa", "Альфа-Банк · кредитная карта", "+1 000 ₽", "любая покупка по терминалу", t_alfa),
          ("otp", "ОТП Банк · дебетовая карта", "+1 000 ₽", "2 покупки от 500 ₽, карту забрать у курьера", t_otp),
          ("tbank", "Т-Банк · кредитная карта", "+2 000 ₽", "одна покупка по терминалу от 3 000 ₽", t_tb),
          ("uralsib", "Уралсиб · кредитная карта", "+1 500 ₽", "покупка от 500 ₽, не закрывать 31 день", t_ur)]
for k, (bk, card, bon, cond, tt) in enumerate(offers):
    ob(f"of{k}", "win", tt - .2, t_place, X11 + 230, Y11 - 345 + 225 * k, 1100, 210, title="Реклама · условия на дату записи", in_="right",
       body={"type": "offer", "bank": bk, "card": card, "bonus": bon, "cond": cond})
    sfx["coin"].append(tt + .3)
ob("n_tot", "num", t_tot - .1, t_place, X11 + 230, Y11 + 370, z=5, c="g", sign=True, **{"from": 0, "to": 5500}, a=t_tot, b=t_tot + .8, label="за простые действия")
for o in objs:
    if o["id"].startswith("of"): o["kf"].append(kf(t_tot - .3, .6, y=Y11 - 420 + 180 * int(o["id"][2:]), s=.8))
sfx["ticks"].append([t_tot, t_tot + .8]); sfx["coin"].append(t_tot + .8)
# банки — в тир-лист (вторая доска: с логотипами)
camto(t_place - .3, X11, Y11 + 1360, 1, 1.0)
bank_rows = {"S": [{"bank": "tbank", "at": t_big - .3}, {"bank": "alfa", "at": t_alfa2}], "A": [{"bank": "uralsib", "at": t_inA}, {"bank": "otp", "at": t_otp2 - .4}], "B": [], "C": [], "D": []}
ob("w_banks", "win", t_place - .3, t_cr, X11 - 380, Y11 + 1360, 1000, 600, title="Тир-лист банков — прямо сейчас", in_="fade",
   body={"type": "board", "rows": bank_rows, "big": 1, "only": "SA"})
ob("tx_whyS", "text", t_big - .1, t_inA, X11 + 180, Y11 + 1230, cls="s", in_="fade", anchor="left",
   html=ws(("S: Т-Банк — самый большой бонус", t_big, "")) + "<br>" + ws(("S: Альфа — любая покупка", t_alfa2 + .3, "")))
ob("tx_whyA", "text", t_inA - .1, t_cr, X11 + 180, Y11 + 1500, cls="s", in_="fade", anchor="left",
   html=ws(("A: Уралсиб — держать месяц", t_month2, "")) + "<br>" + ws(("A: ОТП — 2 покупки и курьер", t_otp2, "")))
sfx["chip"] += [t_big - .3, t_alfa2, t_inA, t_otp2 - .4]
# честно про кредитки
glow.append({"t": t_cr, "c": "#ffd84a"})
camto(t_cr - .3, X11, Y11 + 2720, 1, 1.0)
ob("lb_cr", "label", t_cr - .1, t_once2, X11 - 300, Y11 + 2380, z=6, at=t_cr, kicker="честно", text="3 из 4 — кредитки", c="var(--yel)")
sfx["thud"].append(t_cr)
ob("w_crd", "win", t_bankm - .3, t_once2, X11, Y11 + 2760, 1200, 560, title="Кредитная карта — правила", paper=True, in_="up",
   body={"type": "doc", "html": f"<h3>Кредитка — это {mark('деньги банка, не твои', t_bankm, .6, 'r')}</h3>"
         f"<p>Всё потраченное {mark('верни до конца льготного периода', t_ret, .9)} — тогда процентов не будет.</p>"
         f"<p>Проверь, {mark('сколько стоит обслуживание', t_serv - .2, .7)}.</p>"})
ob("tk_end", "takeaway", t_once2 - .1, t_cta, X11, Y11 + 2720, z=3, in_="up", s=1.2,
   html='<span>Это <span class="g">разовый бонус</span> новым клиентам, <span class="r">а не зарплата</span></span>')
# CTA + конечная заставка (20 с спокойного кадра под элементы YouTube)
camto(t_cta - .3, X11, Y11 + 4080, 1, 1.0)
ob("w_tgEnd", "win", t_cta - .3, t_end + 20, X11 - 420, Y11 + 4080, 720, 760, title="Telegram", acc="var(--tg)", in_="up",
   body={"type": "tg", "name": "Бонусы банков", "sub": "канал · выплаты за карты", "msgs": [
       {"html": "<b>Как получить выплату за карты</b><br>пиши в личку @vitoskk", "at": t_cta}]})
ob("tx_endL", "text", t_cta + .2, t_end + 20, X11 + 380, Y11 + 3900, cls="m", in_="fade", html=ws(("ссылка", t_cta + .3, "")) + "<br>" + ws(("в описании ↓", t_cta + .6, "g")))
ob("tx_endN", "text", t_end + .5, t_end + 20, X11 + 380, Y11 + 4260, cls="s", in_="fade", html=ws(("смотри следующий ролик →", t_end + .6, "")))
music.append({"t": t_end + .2, "part": "intro"})
END_TAIL = 20

# ---------- выход ----------
objs = [o for o in objs if o["t0"] < TO]
for o in objs: o["t1"] = min(o["t1"], TO + 1)
dur = round(min(TO, W.duration + (END_TAIL if "END_TAIL" in globals() else 0)), 3)
for k in sfx: sfx[k] = sorted(x for x in sfx[k] if (x[0] if isinstance(x, list) else x) < dur)
tl = {"duration": dur, "fps": 30, "objs": objs, "cam": cam, "glow": glow, "music": [m for m in music if m["t"] < dur], "sfx": sfx, "bpm": 92, "hats": .6}
open(os.path.join(DIR, "timeline_desk.js"), "w").write("window.TL = " + json.dumps(tl, ensure_ascii=False) + ";\n")
json.dump([b for b in BR], open(os.path.join(DIR, "out", "desk_broll.json"), "w"))
json.dump(THUMBS, open(os.path.join(DIR, "out", "desk_thumbs.json"), "w"))
# статистика: события внутри кадра (появления, маркеры, клики, пуши) — чтобы не было «мёртвых» пауз
import re as _re
inner = [float(x) for o in objs for x in _re.findall(r'"(?:at|a|reveal)": ([0-9.]+)|data-a=\\"([0-9.]+)', json.dumps(o)) for x in x if x]
ev = sorted(set(inner + [o["t0"] for o in objs] + [k["t"] for o in objs for k in o["kf"][1:]] + [c["t"] for c in cam]
            + [x for k, v in sfx.items() if k != "ticks" and k != "riser" for x in v]))
ev = [e for e in ev if e < dur]
gaps = [b - a for a, b in zip(ev, ev[1:])]
print(f"объектов {len(objs)}, событий {len(ev)}, в среднем каждые {dur / max(1, len(ev)):.2f} с, самая длинная пауза {max(gaps):.2f} с (на {ev[gaps.index(max(gaps))]:.1f} с)")
