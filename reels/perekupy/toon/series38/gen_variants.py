# python3 gen_variants.py — 3 уникализации ep47 «Толян: со ста тысяч · 10 — Жора просит о помощи» (владелец 12.11): та же история, порядок и озвучка;
# у каждой своя гамма фонов, движение камеры, стиль пузырей, обложка и одежда героев. Без фоновой музыки (владелец 12.11). → ep47b, ep47c, ep47h (h — розовая)
import json, os, shutil, sys

BASE_JS, BASE_CSS, BASE_JSON = open("ep47.js").read(), open("ep47.css").read(), json.load(open("ep47.json"))
# одежда: Жора — куртка #1d1d1f, кепка #c0392b; Толян — штаны #232c47; бабушка — пальто #7a4a8a
V = {
 "ep47b": dict(name="Архив", bg="sepia(.35) saturate(1.1) hue-rotate(-10deg) brightness(.98) contrast(1.06)",
   bub=("#fbfaf3", "#151515", "#2f4fb8", "#c0392b"), tag="#2f4fb8",
   cloth={"z": {"#c0392b": "#2f6db5"}, "b": {"#7a4a8a": "#3a7d5a"}},
   title=("ЖОРА", "ПРОСИТ О ПОМОЩИ", "#2f4fb8", "#fbfaf3"), cam="vpan"),
 "ep47c": dict(name="Неон", bg="brightness(.85) contrast(1.12) saturate(1.25) hue-rotate(16deg)",
   bub=("#101826", "#fff", "#ffd23f", "#ffd23f"), tag="#ffd23f",
   cloth={"z": {"#1d1d1f": "#4a2a2a"}, "b": {"#7a4a8a": "#2f6db5"}},
   title=("94 ДНЯ", "БЕЗ ЗВОНКОВ", "#ffd23f", "#151515"), cam="in"),
 # h — всегда розовая (владелец 06.11)
 "ep47h": dict(name="Пастель", bg="saturate(.75) brightness(1.12) hue-rotate(40deg)",
   bub=("#fff", "#151515", "#ff4fa3", "#ff4fa3"), tag="#ff6fae",
   cloth={"z": {"#c0392b": "#ff6fae"}, "t": {"#232c47": "#2b2b2e"}, "b": {"#7a4a8a": "#ff6fae"}},
   title=("СОПЕРНИК", "ПРОСИТ ПОМОЩИ", "#ff6fae", "#151515"), cam="alt", tint="rgba(255,111,174,.16)"),
}

for vid, v in V.items():
    if len(sys.argv) > 1 and vid not in sys.argv[1:]: continue
    json.dump(dict(BASE_JSON, id=vid), open(f"{vid}.json", "w"), ensure_ascii=False, indent=1)
    if os.path.exists(f"vo/{vid}"): shutil.rmtree(f"vo/{vid}")
    shutil.copytree("vo/ep47", f"vo/{vid}")
    bb, bt, bo, em = v["bub"]
    cloth = "\n".join(f'.cf .char[data-p^="{k}"] [fill="{a}"] {{ fill: {b}; }}' for k, m in v["cloth"].items() for a, b in m.items())
    if "#c0392b" in v["cloth"].get("z", {}): cloth += f'\n.cf .fgl .prop [fill="#c0392b"] {{ fill: {v["cloth"]["z"]["#c0392b"]}; }}'   # Жора со спины (кадр через плечо)
    open(f"{vid}.css", "w").write(BASE_CSS + f'''
/* {vid} — уникализация «{v["name"]}»: гамма фонов, пузыри, тег, одежда */
.cf .far > svg {{ filter: {v["bg"]}; }}
.cf .bub2 {{ background: {bb}; color: {bt}; border-color: {bo}; box-shadow: 0 0 0 7px {bb}, 0 18px 40px rgba(0,0,0,.45); }}
.cf .bub2::after {{ background: {bb}; border-color: {bo}; }}
.cf .bub2 em {{ color: {em}; }}
#tag b {{ background: {v["tag"]}; }}
{f".cf .vig {{ background: radial-gradient(ellipse 75% 62% at 50% 52%, {v['tint']} 40%, rgba(80,0,40,.5) 100%); }}" if v.get("tint") else ""}
{cloth}
''')
    t1, t2, c1, c2 = v["title"]
    cfg = json.dumps({"t1": t1, "t2": t2, "c1": c1, "c2": c2, "cam": v["cam"]}, ensure_ascii=False)
    open(f"{vid}.js", "w").write(BASE_JS + f'''

// ── {vid} «{v["name"]}»: та же история и озвучка, другая «съёмка» ──
(() => {{
  const K = {cfg};
  const orig = window.build;
  window.build = R => {{
    let T = 0; R.hooks.push(t => {{ T = t; }});          // время кадра — до основного хука, который вызывает C.apply
    // своя камера поверх плана каждой сцены: vpan — медленный проход по вертикали, in — общий наезд, alt — боковой дрейф туда-обратно
    const ap = C.apply;
    C.apply = (el, hand) => {{
      const c = el.cam, s0 = c.s, x0 = c.x, y0 = c.y, k = Object.keys(SC).indexOf(Object.keys(SC).find(n => SC[n] === el));
      if (K.cam === "vpan") {{ c.y = y0 + Math.sin(T * .35 + k) * 40 / s0; c.s = s0 * 1.04; }}
      else if (K.cam === "in") {{ c.s = s0 * (1.03 + .03 * Math.sin(T * .2 + k)); }}
      else {{ c.x = x0 + (k % 2 ? 1 : -1) * Math.sin(T * .3) * 45 / s0; c.s = s0 * 1.05; }}
      ap(el, hand); c.s = s0; c.x = x0; c.y = y0;
    }};
    orig(R);
    const tl = R.tl;
    $("#title .a").textContent = K.t1; $("#title .a").style.cssText = `font-size:110px;background:${{K.c1}};color:${{K.c2}}`;
    const b = $("#title .b"); b.textContent = K.t2; b.style.cssText = `font-size:60px;background:${{K.c2}};color:${{K.c1}}`;
  }};
}})();
''')
    print(vid, v["name"])
