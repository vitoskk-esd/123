"""Вставки рилса 24, нарисованные кодом (1080×1920, 60 к/с): лента чужих постов (out/feed.mp4) и экран с пушем о бонусе (out/push.mp4).
Без логотипов соцсетей и банков, без сумм. Посты — картинки p1c/p2/p3 в стиле v2.
  <python с PIL> arb-scroll-24/ui.py
"""
import os, subprocess
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__)); KIT = os.path.join(HERE, "..", "arb-kit")
W, H, FPS = 1080, 1920, 60
BG, CARD, INK, GREY, RED = (14, 15, 20), (26, 28, 36), (242, 242, 246), (150, 154, 168), (232, 38, 46)


def F(size, var=b"Bold"):
    f = ImageFont.truetype(f"{KIT}/fonts/Manrope[wght].ttf", size); f.set_variation_by_name(var); return f


def heart(d, x, y, s, fill):
    d.ellipse((x, y, x + s * .55, y + s * .55), fill=fill); d.ellipse((x + s * .45, y, x + s, y + s * .55), fill=fill)
    d.polygon([(x + s * .03, y + s * .36), (x + s * .97, y + s * .36), (x + s * .5, y + s * .95)], fill=fill)


def post(img_path, name, likes, ava):
    """Один пост ленты: шапка с аватаркой и ником, квадратная картинка, сердечко и число лайков."""
    P = Image.new("RGB", (W, 1380), BG); d = ImageDraw.Draw(P)
    d.ellipse((40, 36, 136, 132), fill=ava); d.text((160, 58), name, font=F(40), fill=INK)
    d.text((W - 90, 50), "···", font=F(48), fill=GREY)
    im = Image.open(img_path).convert("RGB"); s = max(W / im.width, W / im.height)
    im = im.resize((int(im.width * s), int(im.height * s))); im = im.crop(((im.width - W) // 2, (im.height - W) // 2, (im.width - W) // 2 + W, (im.height - W) // 2 + W))
    P.paste(im, (0, 170)); heart(d, 44, 170 + W + 36, 56, RED); d.text((122, 170 + W + 30), f"{likes} отметок «нравится»", font=F(38), fill=INK)
    return P


def encode(frames, out):
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                          "-c:v", "libx264", "-crf", "18", "-preset", "fast", "-pix_fmt", "yuv420p", out], stdin=subprocess.PIPE)
    for f in frames: p.stdin.write(f.tobytes())
    p.stdin.close(); p.wait()


def feed(dur=2.2):
    """Лента пролистывается вверх с разгоном и торможением на каждом посте (большой палец листает)."""
    posts = [post(f"{HERE}/hf/p1c.png", "bali.dreams", "12 480", (240, 150, 90)), post(f"{HERE}/hf/p2.png", "yacht_weekend", "8 902", (90, 160, 240)),
             post(f"{HERE}/hf/p3.png", "rooftop.dinner", "15 307", (200, 90, 160))]
    tall = Image.new("RGB", (W, 170 + sum(p.height for p in posts) + 400), BG); y = 170
    for p in posts: tall.paste(p, (0, y)); y += p.height
    d = ImageDraw.Draw(tall); d.text((44, 60), "Лента", font=F(56, b"ExtraBold"), fill=INK)
    stops = [0, 170 + 1380 - 240, 170 + 2 * 1380 - 240]   # три «остановки» пальца — по посту
    frames = []
    for n in range(int(dur * FPS)):
        t = n / FPS / dur * (len(stops) - 1); i = min(int(t), len(stops) - 2); u = t - i
        u = 0 if u < .35 else (u - .35) / .65; u = u * u * (3 - 2 * u)   # пост держится, потом свайп
        off = int(stops[i] + (stops[i + 1] - stops[i]) * u)
        frames.append(tall.crop((0, off, W, off + H)))
    encode(frames, f"{HERE}/out/feed.mp4")


def push(dur=1.6):
    """Экран телефона: размытые обои, время, пуш «бонус новичку зачислен» выезжает сверху."""
    base = Image.new("RGB", (W, H)); d = ImageDraw.Draw(base)
    for y in range(H): k = y / H; d.line([(0, y), (W, y)], fill=(int(24 + 40 * k), int(30 + 20 * k), int(70 + 50 * k)))   # обои: тёмно-синий градиент
    for txt, f, y in (("17:42", F(190, b"SemiBold"), 230), ("пятница, 23 октября", F(44, b"Medium"), 470)):
        l, t, r, b = d.textbbox((0, 0), txt, font=f); d.text(((W - (r - l)) / 2 - l, y - t), txt, font=f, fill=INK)
    card = Image.new("RGBA", (W - 80, 250)); c = ImageDraw.Draw(card)
    c.rounded_rectangle((0, 0, W - 81, 249), 44, fill=(246, 246, 250, 240)); c.rounded_rectangle((34, 40, 120, 126), 22, fill=RED + (255,))
    c.text((77, 83), "₽", font=F(52, b"ExtraBold"), fill=(255, 255, 255), anchor="mm")
    c.text((150, 40), "БАНК · сейчас", font=F(34), fill=(110, 116, 130)); c.text((150, 92), "Бонус новичку зачислен", font=F(48, b"ExtraBold"), fill=(20, 24, 34))
    c.text((150, 160), "за первую покупку по карте", font=F(38, b"SemiBold"), fill=(40, 44, 56))
    frames = []
    for n in range(int(dur * FPS)):
        u = min(1, n / FPS / .35); u = 1 - (1 - u) ** 3   # въезд сверху с торможением
        fr = base.copy(); fr.paste(card, (40, int(-260 + (700 + 260) * u)), card); frames.append(fr)
    encode(frames, f"{HERE}/out/push.mp4")


if __name__ == "__main__":
    os.makedirs(f"{HERE}/out", exist_ok=True); feed(); push(); print("→ out/feed.mp4, out/push.mp4")
