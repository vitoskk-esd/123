#!/usr/bin/env python3
"""Проверка «Студии» в 9:16: по сцене каждого типа + субтитры по словам + прогресс. python3 build.py -> timeline.js"""
import json, os
DIR = os.path.dirname(os.path.abspath(__file__))
sc, t = [], 0.0
def add(d, **s):
    global t
    s.update(t0=round(t, 2), t1=round(t + d, 2), tin="zoom" if sc else "cut"); sc.append(s); t += d
W = lambda txt, a, st=.14, c=None: [{"w": w.strip("*"), "at": round(a + i * st, 2), **({"c": c} if "*" in w else {})} for i, w in enumerate(txt.split())]
add(2.5, type="kinetic", acc="r", size=150, align="c", lines=[W("Бонус", .1), W("*не* *пришёл?*", .4, c="r")], sub={"t": "5 причин — за 40 секунд", "at": 1.0})
add(2.5, type="count", acc="g", c="g", **{"from": 0, "to": 5500, "a": t + .1, "b": t + 1.4, "unit": "₽", "label": "можно забрать с одним телефоном", "labelAt": t + 1.2})
add(3, type="phone", acc="r", total={"label": "Ушло банку", "from": 0, "to": -1939, "a": t + .2, "b": t + 2, "c": "r"},
    rows=[{"i": "₽", "t": "Обслуживание", "am": "−99 ₽", "c": "r", "at": t + .3}, {"i": "%", "t": "Проценты", "am": "−1 840 ₽", "c": "r", "at": t + .7}],
    side=[{"t": "отдаёшь", "at": t + .4, "c": "w"}, {"t": "каждый день", "at": t + .9, "c": "r"}])
add(2.5, type="card", acc="y", c="y", n="3", kicker="причина", title="Не та страница", titleAt=t + .2, brand="BANK")
add(2.5, type="bars", acc="g", title="Ставка", max=18, dec=1, unit=" %", bars=[{"label": "Первые 3 месяца", "v": 15.5, "c": "g", "at": t + .1}, {"label": "Потом", "v": 10, "c": "w", "at": t + .5}])
add(2.5, type="split", acc="g", title="100 000 ₽ · 3 мес.", l={"k": "на карте", "v": "0 ₽", "c": "r", "at": t + .1}, r={"k": "на счёте", "v": "≈3 800 ₽", "c": "g", "at": t + .6})
add(3, type="list", acc="r", title="Почему не пришёл", items=[{"t": "Переводы — не покупка", "at": t + .2, "mk": "no"}, {"t": "Уже был клиентом", "at": t + .6, "mk": "no"}, {"t": "Не через акцию", "at": t + 1, "mk": "no"}])
add(2.5, type="cal", acc="g", title="Льготный период", days=35, **{"from": 1, "to": 30, "a": t + .1, "b": t + 1.5}, marks=[{"d": 1, "text": "покупка", "c": "y", "at": t + .2}, {"d": 30, "text": "вернул → 0 %", "c": "g", "at": t + 1.5}])
add(2.5, type="calc", acc="r", lines=[{"t": "99 ₽ × 12 = 1 188 ₽", "at": t + .1}, {"t": "59 ₽ × 12 = 708 ₽", "at": t + .5}], res={"v": "≈1 900 ₽", "at": t + 1, "c": "r"}, note="пример")
add(2.5, type="chat", acc="b", msgs=[{"t": "А это законно?", "at": t + .1, "who": "ты спросишь"}, {"t": "Да. Открытая акция банка.", "at": t + .7, "me": 1, "c": "g"}])
add(2.5, type="table", acc="g", head=["Банк", "Ты"], rows=[{"l": "Проценты", "r": "Полное погашение", "at": t + .1}, {"l": "Комиссии", "r": "5 минут в месяц", "at": t + .4}])
add(2.5, type="stamp", acc="r", c="r", text="Карту чужому — никогда", sub="это уголовная статья", at=t + .2)
add(3, type="flow", acc="g", title="Откуда кэшбэк", nodes=[{"t": "Магазин", "sub": "комиссия", "at": t + .1, "c": "w"}, {"t": "Банк", "at": t + .4, "c": "y"}, {"t": "Ты", "sub": "кэшбэк", "at": t + 1.0, "c": "g"}],
    arrows=[{"t": "комиссия", "at": t + .5, "c": "y"}, {"t": "кусочек", "at": t + 1.2, "c": "g"}])
add(3, type="tg", acc="g", name="Бонусы банков", text="Банки, которые платят сейчас", items=[{"t": "список обновляю", "at": t + .4}], link={"t": "Ссылка в профиле", "at": t + 1})
for i, s in enumerate(sc[:-1]): s["tout"] = "zoom"
text = ("Бонус не пришёл? Вот пять причин. Первая: переводы и оплата ЖКХ — не покупка. Вторая: ты уже был клиентом банка. "
        "Третья: карту оформил не через страницу акции. Четвёртая: не уложился в срок. Пятая: бонус ещё в пути.").split()
caps, a = [], .1
for w in text:
    d = .12 + .045 * len(w); caps.append({"w": w, "a": round(a, 2), "d": round(d, 2)}); a += d + (.25 if w[-1] in ".:?" else .05)
tl = {"size": [1080, 1920], "duration": round(t, 2), "fps": 30, "scenes": sc, "caps": caps, "progress": 1,
      "hits": [{"t": s["t0"] + .05} for s in sc[1:]], "kick": [{"t": s["t0"] + .05, "a": .04} for s in sc[1:]]}
open(os.path.join(DIR, "timeline.js"), "w").write("window.TL = " + json.dumps(tl, ensure_ascii=False) + ";\n")
print(len(sc), "сцен", round(t, 1), "с; субтитры до", round(a, 1), "с")
