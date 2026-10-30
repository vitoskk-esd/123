# python recolor.py — линейный рисунок Приоры (source_lineart.jpg, присланный владельцем) → цветные PNG с прозрачным фоном:
# black (пацанская: чёрный глянец, тонировка, наклейка на стекле задней двери), white, yellow (такси), patch (собрана из трёх).
from PIL import Image, ImageFilter
import numpy as np
from scipy import ndimage as nd

S = 2                                   # рисуем в 2× — линии глаже
src = Image.open("source_lineart.jpg").convert("L").resize((700 * S, 692 * S), Image.LANCZOS)
a = np.array(src)
line = a < 150
lab, n = nd.label(~line)
bg = lab == lab[0, 0]
car = ~bg
# толстые тёмные массивы — стёкла, тонкие — линии кузова
core = nd.distance_transform_edt(line) > 3.2 * S / 2
glass = nd.binary_dilation(core, iterations=3 * S) & line
thin = line & ~glass
outer = thin & nd.binary_dilation(bg, iterations=2)
cms = nd.center_of_mass(np.ones_like(lab), lab, range(1, n + 1))
sizes = nd.sum(np.ones_like(lab), lab, range(1, n + 1))
def regions_near(cx, cy, r):
    return [i + 1 for i in range(n) if sizes[i] > 30 and (cms[i][1] / S - cx) ** 2 + (cms[i][0] / S - cy) ** 2 < r * r and i + 1 != lab[0, 0]]
def pick(cx, cy):
    return lab[int(cy * S), int(cx * S)]
wheels = {}
for cx, cy, r in ((478, 425, 46), (130, 412, 40)):
    rs = sorted(regions_near(cx, cy, r), key=lambda i: -sizes[i - 1])
    wheels[(cx, cy)] = rs
headlight, indicator, rear_light = pick(598, 378), pick(648, 386), pick(59, 360)
fog = [pick(663, 419), pick(660, 437)]
front_panel = pick(594, 426)
body_main = pick(320, 371)

def hexrgb(h):
    h = h.lstrip("#"); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))

def render(name, body, panel_line, rim, sticker=False, patch=False, taxi=False):
    img = np.zeros((*a.shape, 4), np.uint8)
    def put(mask, color, alpha=255):
        img[mask] = (*hexrgb(color), alpha)
    put(car, body)
    if patch:
        yy, xx = np.mgrid[0:a.shape[0], 0:a.shape[1]]
        put((lab == body_main) & (xx > 258 * S) & (xx < 398 * S), "#c0392b")
        put(lab == front_panel, "#2f5d9c")
    for (cx, cy), rs in wheels.items():
        if rs:
            put(lab == rs[0], "#121316")
            for r in rs[1:]:
                put(lab == r, rim)
    put(lab == headlight, "#eef5fb"); put(lab == indicator, "#ffb703"); put(lab == rear_light, "#d62828")
    for f in fog:
        put(lab == f, "#0e0f11")
    put(glass, "#06070a")
    put(thin, panel_line); put(outer, "#000000")
    out = Image.fromarray(img)
    # блик на стёклах
    ref = Image.new("RGBA", out.size, (0, 0, 0, 0))
    from PIL import ImageDraw
    d = ImageDraw.Draw(ref)
    for x0 in (180, 300, 400):
        d.polygon([(x0 * S, 270 * S), ((x0 + 22) * S, 270 * S), ((x0 - 26) * S, 330 * S), ((x0 - 48) * S, 330 * S)], fill=(255, 255, 255, 38))
    rm = Image.fromarray((glass * 255).astype(np.uint8))
    out = Image.composite(Image.alpha_composite(out, ref), out, rm)
    if body == "#16181d":                                   # блики на чёрном глянце
        sh = Image.new("RGBA", out.size, (0, 0, 0, 0)); d = ImageDraw.Draw(sh)
        d.line([(150 * S, 352 * S), (560 * S, 350 * S)], fill=(255, 255, 255, 60), width=4 * S)
        d.line([(170 * S, 405 * S), (420 * S, 412 * S)], fill=(255, 255, 255, 30), width=3 * S)
        bodym = Image.fromarray(((car & ~line) * 255).astype(np.uint8))
        out = Image.composite(Image.alpha_composite(out, sh), out, bodym)
    if taxi:                                                # шашки на крыше и полоса по борту
        d = ImageDraw.Draw(out)
        d.rounded_rectangle([272 * S, 240 * S, 336 * S, 264 * S], radius=4 * S, fill=hexrgb("#ffd23f") + (255,), outline=(0, 0, 0, 255), width=3 * S)
        for i in range(8):
            for j in range(2):
                if (i + j) % 2:
                    d.rectangle([(275 + i * 7.5) * S, (243 + j * 10) * S, (282 + i * 7.5) * S, (252 + j * 10) * S], fill=(21, 21, 21, 255))
        for i in range(22):
            x = (150 + i * 17) * S; y0 = (392 + (i % 2) * 6 + i * 0.35) * S
            d.rectangle([x, y0, x + 7 * S, y0 + 6 * S], fill=(21, 21, 21, 255))
    if sticker:
        st = Image.open("../sticker.png").convert("RGBA")
        w = 46 * S; st = st.resize((w, int(w * st.height / st.width)), Image.LANCZOS)
        out.alpha_composite(st, (int(193 * S), int(276 * S)))
    out = out.crop(out.getbbox())
    out.save(f"priora_{name}.png")
    print(name, out.size)

render("black", "#16181d", "#4b5361", "#2c2f36", sticker=True)
render("white", "#eef0f3", "#151515", "#b8bec6")
render("yellow", "#ffd23f", "#151515", "#b8bec6", taxi=True)
render("patch", "#eef0f3", "#151515", "#b8bec6", patch=True)
