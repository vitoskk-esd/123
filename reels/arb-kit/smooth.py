#!/usr/bin/env python3
"""Плавность клипов Kling: дорисовываем промежуточные кадры там, где модель анимировала «на двойках» (каждый рисунок держится 2–3 кадра —
12 рисунков в секунду, движение рывками; владелец 19.10: «движения не плавные»). Нейросеть RIFE 4.26 (Practical-RIFE, hzwer, MIT)
строит кадр между двумя соседними рисунками по оптическому потоку. Длинные паузы (≥ 4 одинаковых кадров) не трогаем — это игра персонажа.
ffmpeg minterpolate для этого не годится: на пробе v_box дал «призраки» рук (19.10).
Веса (~20 МБ) один раз скачиваются с Hugging Face (hzwer/RIFE) в ~/.cache/arb-kit/rife, в репозиторий не кладутся.
  <python с torch и huggingface_hub> arb-kit/smooth.py <клип.mp4> <выход.mp4> [--fps 60] [--scale 0.5]
--fps 60 — больше кадров в секунду (владелец 19.10: «нужно больше кадров в секунду»): все кадры между рисунками строит RIFE.
--scale 0.5 — поток считается на половинном разрешении (для 1080×1920 на CPU ≈ 1–2 с на кадр), кадр собирается в полном.
"""
import json, os, subprocess, sys, zipfile
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F

torch.set_grad_enabled(False)


# ---- сеть IFNet из Practical-RIFE 4.26 (только то, что нужно для вывода) ----
def warp(x, flow):
    n, _, h, w = flow.shape
    gx = torch.linspace(-1, 1, w).view(1, 1, 1, w).expand(n, -1, h, -1)
    gy = torch.linspace(-1, 1, h).view(1, 1, h, 1).expand(n, -1, -1, w)
    flow = torch.cat([flow[:, 0:1] / ((w - 1) / 2), flow[:, 1:2] / ((h - 1) / 2)], 1)
    return F.grid_sample(x, (torch.cat([gx, gy], 1) + flow).permute(0, 2, 3, 1), mode="bilinear", padding_mode="border", align_corners=True)


def conv(i, o, k=3, s=1, p=1):
    return nn.Sequential(nn.Conv2d(i, o, k, s, p, bias=True), nn.LeakyReLU(.2, True))


class Head(nn.Module):
    def __init__(self):
        super().__init__()
        self.cnn0, self.cnn1, self.cnn2 = nn.Conv2d(3, 16, 3, 2, 1), nn.Conv2d(16, 16, 3, 1, 1), nn.Conv2d(16, 16, 3, 1, 1)
        self.cnn3, self.relu = nn.ConvTranspose2d(16, 4, 4, 2, 1), nn.LeakyReLU(.2, True)

    def forward(self, x):
        return self.cnn3(self.relu(self.cnn2(self.relu(self.cnn1(self.relu(self.cnn0(x)))))))


class ResConv(nn.Module):
    def __init__(self, c):
        super().__init__()
        self.conv, self.beta, self.relu = nn.Conv2d(c, c, 3, 1, 1), nn.Parameter(torch.ones((1, c, 1, 1))), nn.LeakyReLU(.2, True)

    def forward(self, x):
        return self.relu(self.conv(x) * self.beta + x)


class IFBlock(nn.Module):
    def __init__(self, i, c):
        super().__init__()
        self.conv0 = nn.Sequential(conv(i, c // 2, 3, 2, 1), conv(c // 2, c, 3, 2, 1))
        self.convblock = nn.Sequential(*[ResConv(c) for _ in range(8)])
        self.lastconv = nn.Sequential(nn.ConvTranspose2d(c, 4 * 13, 4, 2, 1), nn.PixelShuffle(2))

    def forward(self, x, flow=None, scale=1):
        x = F.interpolate(x, scale_factor=1 / scale, mode="bilinear", align_corners=False)
        if flow is not None:
            x = torch.cat((x, F.interpolate(flow, scale_factor=1 / scale, mode="bilinear", align_corners=False) / scale), 1)
        t = F.interpolate(self.lastconv(self.convblock(self.conv0(x))), scale_factor=scale, mode="bilinear", align_corners=False)
        return t[:, :4] * scale, t[:, 4:5], t[:, 5:]


class IFNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.block0, self.block1 = IFBlock(7 + 8, 192), IFBlock(8 + 4 + 8 + 8, 128)
        self.block2, self.block3, self.block4 = IFBlock(8 + 4 + 8 + 8, 96), IFBlock(8 + 4 + 8 + 8, 64), IFBlock(8 + 4 + 8 + 8, 32)
        self.encode = Head()

    def forward(self, img0, img1, t, scale):
        tt = img0[:, :1] * 0 + t
        f0, f1 = self.encode(img0), self.encode(img1)
        flow = mask = feat = None; w0, w1 = img0, img1
        for i, b in enumerate([self.block0, self.block1, self.block2, self.block3, self.block4]):
            s = [16, 8, 4, 2, 1][i] / scale
            if flow is None: flow, mask, feat = b(torch.cat((img0, img1, f0, f1, tt), 1), None, s)
            else:
                fd, mask, feat = b(torch.cat((w0, w1, warp(f0, flow[:, :2]), warp(f1, flow[:, 2:4]), tt, mask, feat), 1), flow, s)
                flow = flow + fd
            w0, w1 = warp(img0, flow[:, :2]), warp(img1, flow[:, 2:4])
        m = torch.sigmoid(mask)
        return w0 * m + w1 * (1 - m)


def load_net():
    d = os.path.expanduser("~/.cache/arb-kit/rife"); pk = f"{d}/flownet.pkl"
    if not os.path.exists(pk):
        from huggingface_hub import hf_hub_download
        z = hf_hub_download("hzwer/RIFE", "RIFEv4.26_0921.zip", local_dir=d)
        with zipfile.ZipFile(z) as zf: open(pk, "wb").write(zf.read("RIFEv4.26_0921/flownet.pkl"))
        os.remove(z)
    sd = torch.load(pk, map_location="cpu", weights_only=True)
    net = IFNet(); net.load_state_dict({k.replace("module.", ""): v for k, v in sd.items()}, strict=False); return net.eval()


# ---- клип ----
def probe(f):
    s = json.loads(subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v", "-show_entries", "stream=width,height,r_frame_rate",
                                   "-of", "json", f], capture_output=True, text=True).stdout)["streams"][0]
    a, b = s["r_frame_rate"].split("/"); return s["width"], s["height"], float(a) / float(b)


def holds(G):
    """Номера кадров, где появляется новый рисунок. Кадр — повтор, если отличается от прошлого заметно меньше, чем соседние шаги движения."""
    d = np.abs(np.diff(G, axis=0)).mean((1, 2)); new = [0]
    for i in range(1, len(G)):
        loc = d[max(0, i - 3):i + 2].max()
        if d[i - 1] >= max(.15, .3 * loc): new.append(i)
    return new


def main(src, dst, scale=.5, out_fps=None):
    """Каждый кадр выхода (с частотой out_fps, по умолчанию как у исходника) строится между двумя соседними рисунками:
    повторы «на двойках» не считаются рисунками, длинные паузы (≥ 4 одинаковых кадров) и замер в конце держатся как есть."""
    w, h, fps = probe(src); out_fps = out_fps or fps
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
    V = np.frombuffer(raw, np.uint8).reshape(-1, h, w, 3)
    G = V[:, ::4, ::4].mean(3).astype(np.float32)
    new = holds(G); n_out = int(round(len(V) / fps * out_fps))
    net = load_net(); tmp = max(128, int(128 / scale)); ph, pw = ((h - 1) // tmp + 1) * tmp, ((w - 1) // tmp + 1) * tmp
    T = lambda a: F.pad(torch.from_numpy(a.copy()).permute(2, 0, 1)[None].float() / 255, (0, pw - w, 0, ph - h))
    enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{w}x{h}", "-r", f"{out_fps}", "-i", "-",
                            "-c:v", "libx264", "-crf", "14", "-preset", "slow", "-pix_fmt", "yuv420p", dst], stdin=subprocess.PIPE)
    made, cache = 0, {}
    for n in range(n_out):
        t = n / out_fps * fps   # время выходного кадра в кадрах исходника
        k = max(i for i in range(len(new)) if new[i] <= t + 1e-6); a = new[k]
        b = new[k + 1] if k + 1 < len(new) else None
        if b is None or b - a >= 4 or t - a < 1e-3:   # последний рисунок, пауза в игре или точное попадание в рисунок
            enc.stdin.write(V[min(len(V) - 1, int(round(t)))].tobytes()); continue
        for i in (a, b):
            if i not in cache: cache = {j: v for j, v in cache.items() if j >= a}; cache[i] = T(V[i])
        out = net(cache[a], cache[b], (t - a) / (b - a), scale)[0, :, :h, :w].clamp(0, 1).permute(1, 2, 0).numpy()
        enc.stdin.write((out * 255 + .5).astype(np.uint8).tobytes()); made += 1
        if made % 10 == 0: print(f"\r  кадр {n}/{n_out}, дорисовано {made}", end="", flush=True)
    enc.stdin.close(); enc.wait()
    print(f"\n{src}: рисунков {len(new)} из {len(V)} кадров, выход {n_out} кадров при {out_fps:g} к/с, дорисовано {made} → {dst}")


if __name__ == "__main__":
    a = sys.argv[1:]; opt = lambda k, d: float(a[a.index(k) + 1]) if k in a else d
    main(a[0], a[1], opt("--scale", .5), opt("--fps", None))
