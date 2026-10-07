"""Видео №1, монтаж v4 «рабочий стол» (язык длинных роликов) -> timeline_desk.js для desk.html.

Почему так: youtube/references/tutorials.md. Кадр «дышит» 3–8 с, внутри него каждые 1,5–2,5 с что-то
происходит (маркер, курсор, пуш, счётчик, новое окно); склейки и переезды камеры — на смене мысли.
Объекты привязаны к словам озвучки (A("фраза")): python build_desk.py [--to 61.6]
"""
import json, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "kit"))
from anchors import Words

DIR = os.path.dirname(os.path.abspath(__file__))
W = Words(os.path.join(DIR, "out", "words_final.json"))
SEC = 0.0   # поиск слов — от начала текущего блока (фразы внутри блока уникальны)
def A(phrase, after=None):
    return W.A(phrase, after=SEC if after is None else after)
def sec(phrase):
    global SEC
    SEC = 0.0 if phrase is None else W.A(phrase, after=SEC) - .05
    return SEC + .05
TO = float(sys.argv[sys.argv.index("--to") + 1]) if "--to" in sys.argv else W.duration
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
sec("С баллами"); t_b = A("С баллами"); t_rate = A("курс"); t_r1 = A("равен"); t_cat = A("каталоге"); t_exp = A("дороже")
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
ob("w_board4", "win", t_always - .5, TO + 1, 960, Y3 - 60, 1100, 760, title="Тир-лист: как банк платит тебе", in_="fade",
   body={"type": "board", "rows": rows_D, "blur": [{"t": 0, "v": 9}], "unblur": {"D": 0, "C": t_soC + .1}, "focus": {"row": "B", "at": t_next + .2}})
ob("tk_C2", "takeaway", t_always, t_next + .2, 960, Y3 + 400, z=3, in_="up", html='<span>Работает всегда, но <span class="r">много не даст</span></span>')
ob("tx_next", "text", t_next - .1, TO + 1, 960, Y3 + 400, cls="m", in_="up", html=ws(("где платят", A("платят", after=t_next), "")) + " " + ws(("больше?", A("больше", after=t_next), "g")))
camto(t_lvl - .2, 470, Y3 - 70, 1.6, 1.4, pan=False)
music.append({"t": t_soC + .4, "part": "intro"})

# ---------- выход ----------
objs = [o for o in objs if o["t0"] < TO]
for o in objs: o["t1"] = min(o["t1"], TO + 1)
dur = round(min(TO, W.duration), 3)
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
