"""Монтажный лист рилса 24 «Почему чужая жизнь в соцсетях кажется лучше твоей» для arb-kit/live_cut.py.
Время — секунды ролика; голос идёт со сдвигом OFF. Текст на экране — 4 момента: «У НЕГО — ГРЕЧКА», «ЗАВИСТЬ», «10 МИНУТ», «СЕБЯ ВЧЕРАШНЕГО».
Стиль v2: каждый план — новое место и своя краска (владелец 23.10). Вставки кодом (ui.py): лента out/feed.mp4, пуш out/push.mp4;
ТГ-канал владельца — out/tg_blur.mp4 из рилса 23.
По проверке кадров: v03 → v03r (ноги проваливались), v04 с 1,95 с (рывок стрелки на 1,6–1,9 с), v05 с 1,8 с (лишняя рука до 1,4 с),
v09 — наезд 1,2 (справа проступает тень-силуэт). «ГРЕЧКА» не за головой: маска принимала бирюзовую стену за голову.
"""
import os

OFF = .3
HERE = os.path.dirname(os.path.abspath(__file__))
RED, WHITE, TEAL = (232, 38, 46), (246, 244, 238), (64, 224, 208)


def edit(W):
    T = lambda key, n=0, end=False: [w for w in W if w["w"].lower().strip(".,—«»").startswith(key)][n]["e" if end else "s"] + OFF
    END = T("вчерашнего", end=True) + 1.0
    t_tg = T("такие")
    shots = [
        dict(clip="v01", t=0, src=0, zoom=(1.06, 1.0), center=(.5, .45)),
        dict(clip="feed", path="out/feed.mp4", t=T("всех") - .25, src=0, zoom=(1.0, 1.03), center=(.5, .5), trans="whip"),
        dict(clip="v01", t=T("него") - .12, src=2.6, zoom=(1.06, 1.1), center=(.45, .55), trans="whip"),
        dict(clip="v03r", t=T("двадцать"), src=0, zoom=(1.0, 1.06), center=(.5, .5), trans="pixel"),
        dict(clip="v04", t=T("психологи"), src=1.95, speed=.8, zoom=(1.0, 1.05), center=(.55, .45), trans="whip"),
        dict(clip="v05", t=T("растет") - .15, src=1.8, zoom=(1.0, 1.06), center=(.5, .5), trans="pixel"),
        dict(clip="v06", t=T("ты") - .1, src=0, zoom=(1.0, 1.06), center=(.5, .5), trans="pixel"),
        dict(clip="v07", t=T("другом") - .2, src=0, speed=.9, zoom=(1.04, 1.0), center=(.5, .55), trans="whip"),
        dict(clip="v08", t=T("поэтому"), src=0, speed=.9, zoom=(1.0, 1.06), center=(.5, .5), trans="pixel"),
        dict(clip="v09", t=T("второе"), src=0, zoom=(1.2, 1.24), center=(.42, .5), trans="whip"),
        dict(clip="v10", t=T("третье"), src=0, zoom=(1.0, 1.06), center=(.5, .5), trans="pixel"),
        dict(clip="push", path="out/push.mp4", t=T("заплатил") - .25, src=0, zoom=(1.0, 1.03), center=(.5, .4), trans="whip"),
        # «…в своём телеграме»: Арбузов показывает белый экран → камера наезжает на телефон → влёт в запись канала владельца (как в рилсе 23)
        dict(clip="v11", t=t_tg, src=0, camk=[[0, 1.0, .45, .45], [.8, 1.04, .38, .42], [1.95, 2.8, .27, .33]],
             screens=[dict(video="out/tg_blur.mp4", t0=t_tg, vsrc=0)]),
        dict(clip="tg", path="out/tg_blur.mp4", t=t_tg + 1.95, src=1.95, zoom=(1.0, 1.04), center=(.5, .3), trans="zoom"),
        dict(clip="v12", t=T("черновик") - .74, src=0, speed=.95, zoom=(1.0, 1.05), center=(.5, .5), trans="pixel"),
    ]
    W_ = lambda **k: {"stroke": 0, **k}
    assert [s["t"] for s in shots] == sorted(s["t"] for s in shots)
    moments = [
        dict(shot=2, out=T("гречка", end=True) + .45, punch=T("гречка"), words=[
            W_(text="У НЕГО —", kind="bold", size=72, color=WHITE, x=.5, y=.1, t=T("него") - .03, anim="rise"),
            W_(text="ГРЕЧКА", kind="hero", size=150, stroke=6, color=RED, x=.5, y=.18, t=T("гречка") - .03, anim="slam")]),
        dict(shot=5, out=T("падает", end=True) + .2, punch=T("зависть"), mask_box=(.05, .08, .98, .9), words=[
            W_(text="ЗАВИСТЬ", kind="hero", size=135, stroke=7, color=WHITE, x=.5, y=.1, t=T("зависть") - .03, anim="slam", behind=True)]),
        dict(shot=8, out=T("приложение", 1, end=True) + .4, punch=T("10", 1), words=[
            W_(text="10 МИНУТ", kind="pixel", size=96, color=TEAL, x=.5, y=.13, t=T("10", 1) - .03, anim="scramble"),
            W_(text="на приложение", kind="bold", size=64, color=WHITE, x=.5, y=.2, t=T("приложение", 1) - .03, anim="rise")]),
        dict(shot=14, out=END + 1, punch=T("себя"), words=[
            W_(text="сравнивай", kind="bold", size=72, color=WHITE, x=.5, y=.09, t=T("сравнивай", 1) - .03, anim="rise"),
            W_(text="СЕБЯ", kind="hero", size=210, stroke=6, color=RED, x=.5, y=.17, t=T("себя") - .03, anim="slam"),
            W_(text="ВЧЕРАШНЕГО", kind="black", size=90, color=WHITE, x=.5, y=.255, t=T("вчерашнего") - .03, anim="slam")]),
    ]
    sfx = dict(
        impact=[T("гречка"), T("зависть"), T("себя")], pop=[T("него"), T("приложение", 1), T("сравнивай", 1), T("вчерашнего")],
        beep=[T("10", 1)], coin=[T("заплатил")],
        glitch=[s["t"] for s in shots if s.get("trans") == "pixel"], whoosh=[s["t"] - .08 for s in shots if s.get("trans") in ("whip", "zoom")],
        notif=[T("заплатил") - .25 + .3], paper=[T("второе") + .4],
        murmur=[[0, T("двадцать")]], room=[[T("психологи"), T("ты") - .1], [T("второе"), T("третье")]])
    return dict(shots=shots, moments=moments, end=END, voice_off=OFF, bpm=96, sfx=sfx, sfxGain=.9,
                music=[dict(t=0, part="intro"), dict(t=T("всех") - .25, part="main"), dict(t=T("сравнивай", 1) - .2, part="stop"),
                       dict(t=T("сравнивай", 1) + .4, part="outro")])
