"""Монтажный лист рилса 23 «Почему ты боишься начать зарабатывать» для arb-kit/live_cut.py.
Время — секунды ролика; голос идёт со сдвигом OFF. Текст на экране — только 4 момента (владелец 19.10): «ТРЕТИЙ ГОД», «0 ₽», «×2», «НАЧНИ».
Клипы: v01…v10, v08c (крупно телефон); где клип смазан или замирает — берём другие секунды (src) или чуть меняем скорость.
"""
import os
from PIL import Image, ImageDraw, ImageFont

OFF = .3
HERE = os.path.dirname(os.path.abspath(__file__)); KIT = os.path.join(HERE, "..", "arb-kit")
RED, WHITE, TEAL = (232, 38, 46), (246, 244, 238), (64, 224, 208)


def screens_ui():
    """Экран телефона на прилавке: блокировка (время по центру — владелец 16.10 ловил съехавшее время) и пуш о бонусе."""
    os.makedirs(f"{HERE}/out/ui", exist_ok=True)
    W, H = 600, 1170
    F = lambda f, s, v=None: (lambda ft: (ft.set_variation_by_name(v) if v else None, ft)[1])(ImageFont.truetype(f"{KIT}/fonts/{f}", s))
    lock = Image.new("RGBA", (W, H)); d = ImageDraw.Draw(lock)
    for y in range(H):   # тёмно-синий градиент
        k = y / H; d.line([(0, y), (W, y)], fill=(int(18 + 30 * k), int(28 + 22 * k), int(58 + 40 * k), 255))
    def center(text, ft, y, col):
        l, t, r, b = d.textbbox((0, 0), text, font=ft); d.text(((W - (r - l)) / 2 - l, y - t), text, font=ft, fill=col)
    center("21:47", F("Manrope[wght].ttf", 150, b"SemiBold"), 150, (240, 242, 248))
    center("понедельник, 19 октября", F("Manrope[wght].ttf", 34, b"Medium"), 345, (210, 216, 230))
    lock.save(f"{HERE}/out/ui/lock.png")
    push = Image.new("RGBA", (W, H)); d = ImageDraw.Draw(push)
    d.rounded_rectangle((30, 450, W - 30, 680), 36, fill=(245, 246, 250, 238))
    d.rounded_rectangle((58, 482, 118, 542), 14, fill=RED + (255,))
    d.text((88, 512), "₽", font=F("Unbounded[wght].ttf", 34, b"Black"), fill=(255, 255, 255), anchor="mm")
    d.text((136, 486), "БАНК · сейчас", font=F("Manrope[wght].ttf", 26, b"Bold"), fill=(110, 116, 130))
    d.text((58, 562), "Бонус новичку", font=F("Manrope[wght].ttf", 36, b"ExtraBold"), fill=(20, 24, 34))
    d.text((58, 612), "+1 000 ₽ зачислено на карту", font=F("Manrope[wght].ttf", 30, b"SemiBold"), fill=(40, 44, 56))
    push.save(f"{HERE}/out/ui/push.png")


def edit(W):
    T = lambda key, n=0, end=False: [w for w in W if w["w"].lower().strip(".,—«»").startswith(key)][n]["e" if end else "s"] + OFF
    if not os.path.exists(f"{HERE}/out/ui/push.png"): screens_ui()
    END = T("шага", end=True) + 1.0
    quad = [(429, 822), (630, 806), (783, 1167), (532, 1199)]   # экран телефона в v08c (телефон лежит неподвижно; найдено по белому)
    shots = [
        dict(clip="v01", t=0, src=0, zoom=(1.06, 1.0), center=(.5, .42)),
        dict(clip="v02", t=2.95, src=0, zoom=(1.0, 1.06), center=(.55, .45)),
        dict(clip="v03", t=9.0, src=.6, speed=1.1, zoom=(1.02, 1.08), center=(.5, .5), trans="pixel"),
        dict(clip="v04", t=14.82, src=0, zoom=(1.0, 1.06), center=(.5, .4)),
        dict(clip="v05", t=19.62, src=1.7, zoom=(1.05, 1.0), center=(.5, .55), trans="pixel"),
        dict(clip="v06", t=23.9, src=.4, zoom=(1.0, 1.06), center=(.5, .55), trans="whip"),
        dict(clip="v07", t=27.05, src=1.3, zoom=(1.0, 1.08), center=(.5, .45), trans="whip"),
        dict(clip="v08", t=30.0, src=0, zoom=(1.0, 1.05), center=(.5, .45), trans="pixel"),
        dict(clip="v08c", t=33.2, src=.8, zoom=(1.0, 1.06), center=(.55, .53),
             screens=[dict(ui="lock", t0=33.2, quad=quad), dict(ui="push", t0=T("покупку") - .1, quad=quad)]),
        dict(clip="v08", t=34.9, src=7.0, zoom=(1.04, 1.0), center=(.5, .4)),
        dict(clip="v09", t=36.9, src=0, speed=.85, zoom=(1.0, 1.06), center=(.5, .4)),
        dict(clip="v10", t=41.3, src=2.4, zoom=(1.0, 1.05), center=(.5, .45), trans="pixel"),
    ]
    W_ = lambda **k: {"stroke": 0, **k}
    moments = [
        dict(shot=0, out=T("заработка", end=True) + .05, punch=T("3"), mask_box=(.25, .1, .8, .55), words=[
            W_(text="ТРЕТИЙ", kind="hero", size=165, color=RED, x=.5, y=.125, t=T("3") - .03, anim="slam"),
            W_(text="ГОД", kind="black", size=200, color=WHITE, x=.5, y=.235, t=T("год") - .03, anim="slam", behind=True)]),
        dict(shot=1, out=T("0", end=True) + .35, punch=T("0"), words=[
            W_(text="ЗАРАБОТАНО", kind="bold", size=64, color=WHITE, x=.5, y=.12, t=T("заработано") - .03, anim="rise"),
            W_(text="0 ₽", kind="black", size=260, color=TEAL, x=.5, y=.22, t=T("0") - .03, anim="slam", stroke=0)]),
        dict(shot=2, out=T("выигрыш", end=True) - .25, punch=T("вдвое"), mask_box=(.2, .08, .85, .5), words=[
            W_(text="ПОТЕРЯ", kind="bold", size=70, color=WHITE, x=.5, y=.11, t=T("потерю") - .03, anim="rise"),
            W_(text="×2", kind="hero", size=420, color=RED, x=.5, y=.24, t=T("вдвое") - .03, anim="slam", behind=True)]),
        dict(shot=11, out=END + 1, punch=T("начни"), words=[
            W_(text="НАЧНИ", kind="hero", size=230, color=RED, x=.42, y=.2, t=T("начни") - .03, anim="slam", arc=.08),
            W_(text="с одного шага", kind="bold", size=70, color=WHITE, x=.42, y=.3, t=T("одного") - .03, anim="rise")]),
    ]
    sfx = dict(
        impact=[T("3"), T("вдвое"), T("начни")], pop=[T("год"), T("заработано"), T("потерю"), T("одного")], coin=[T("0")],
        glitch=[s["t"] for s in shots if s.get("trans") == "pixel"], whoosh=[s["t"] - .08 for s in shots if s.get("trans") == "whip"],
        pen=[[.9, 1.6], [25.3, .6]], paper=[3.6, 20.0], thud=[T("вдвое") + .05], notif=[T("покупку") - .1], beep=[31.3],
        room=[[0, 30.0], [36.9, END]], murmur=[[30.0, 36.9]])
    return dict(shots=shots, moments=moments, end=END, voice_off=OFF, bpm=92, sfx=sfx, sfxGain=.9,
                music=[dict(t=0, part="intro"), dict(t=2.95, part="main"), dict(t=T("начни") - .2, part="stop"), dict(t=T("начни") + .4, part="outro")],
                screens_ui=dict(lock="out/ui/lock.png", push="out/ui/push.png"))
