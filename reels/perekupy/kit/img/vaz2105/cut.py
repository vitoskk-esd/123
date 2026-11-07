# python cut.py → vaz2105_34.png (3/4 спереди, мордой влево), vaz2105_side.png (сбоку, мордой влево), vaz2105_side_r.png (мордой вправо):
# бежевая «пятёрка» владельца без бирюзового фона и тени. Фон и тень — бирюзовые (синий канал заметно выше красного); заливаем от краёв кадра,
# поэтому стёкла (тоже голубоватые, но внутри чёрной рамки) остаются. Кайма по контуру — срезаем на 1 px.
import numpy as np
from PIL import Image
from scipy import ndimage
src = np.asarray(Image.open("source.webp").convert("RGB")).astype(int)


def cut(box, out):
    x0, y0, x1, y1 = box; a = src[y0:y1, x0:x1]
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    teal = (b - r > 35) & (g - r > 15)
    lab, _ = ndimage.label(teal)
    edge = set(lab[0]) | set(lab[-1]) | set(lab[:, 0]) | set(lab[:, -1]); edge.discard(0)
    fg = ~np.isin(lab, list(edge))
    fg = ndimage.binary_opening(fg, iterations=1)
    lab3, n3 = ndimage.label(fg); sizes = ndimage.sum(fg, lab3, range(1, n3 + 1)); fg = lab3 == (1 + int(np.argmax(sizes)))
    fg = ndimage.binary_fill_holes(fg) & ~(teal & ~ndimage.binary_erosion(ndimage.binary_fill_holes(fg), iterations=6))
    fg = ndimage.binary_erosion(fg, iterations=1)
    ys, xs = np.nonzero(fg); yy0, yy1, xx0, xx1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    alpha = (ndimage.gaussian_filter(fg.astype(float), .6) * 255).clip(0, 255)
    Image.fromarray(np.dstack([a, alpha]).astype(np.uint8)[yy0:yy1, xx0:xx1]).save(out); print(out, xx1 - xx0, yy1 - yy0)


cut((0, 630, 800, 990), "vaz2105_34.png")
cut((0, 340, 790, 625), "vaz2105_side.png")
cut((790, 340, 1536, 625), "vaz2105_side_r.png")
