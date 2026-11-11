# python3 gen_variants.py — 3 «пересъёмки» ep43 «Толян: со ста тысяч · 8 — Школьная парковка» (владелец 11.11): та же история, порядок и озвучка;
# у каждой своя гамма фонов, движение камеры, стиль пузырей, обложка, музыка и одежда героев. → ep43b, ep43c, ep43h (h — розовая)
import json, os, shutil, sys

BASE_JS, BASE_CSS, BASE_JSON = open("ep43.js").read(), open("ep43.css").read(), json.load(open("ep43.json"))
# одежда: Ильдар — костюм #1f4fb8; Лев Маркович — пиджак #7a5a3a; Егорыч — халат #2f5d9c; директор — костюм #2b2f37; Толян — штаны #232c47
V = {
 "ep43b": dict(name="Мел", bg="sepia(.28) saturate(1.15) hue-rotate(-12deg) brightness(.97) contrast(1.06)",
   bub=("#25463a", "#f1f4ee", "#f1f4ee", "#ffd23f"), tag="#ffd23f",
   cloth={"IL": {"#1f4fb8": "#c0392b"}, "LV": {"#7a5a3a": "#4a5a6a"}, "EG": {"#2f5d9c": "#5b6b3a"}},
   title=("ВЗЯТЬ ЗА 120", "ИЛИ ЗА 160?", "#25463a", "#f1f4ee"), cam="vpan", music={"style": "story", "bpm": 96}),
 "ep43c": dict(name="Вечер", bg="brightness(.78) contrast(1.12) saturate(1.1) hue-rotate(14deg)",
   bub=("#101826", "#fff", "#5ac8fa", "#5ac8fa"), tag="#5ac8fa",
   cloth={"IL": {"#1f4fb8": "#16a085"}, "LV": {"#7a5a3a": "#6b2f3a"}, "DR": {"#2b2f37": "#3a2b4f"}},
   title=("УЧИТЕЛЯ", "МЕНЯЮТ МАШИНЫ", "#5ac8fa", "#151515"), cam="in", music={"style": "phonk", "bpm": 120}),
 # h — всегда розовая (владелец 06.11)
 "ep43h": dict(name="Пастель", bg="saturate(.7) brightness(1.12) hue-rotate(40deg)",
   bub=("#fff", "#151515", "#ff4fa3", "#ff4fa3"), tag="#ff6fae",
   cloth={"IL": {"#1f4fb8": "#ff6fae"}, "T": {"#232c47": "#2b2b2e"}},
   title=("ШКОЛЬНАЯ", "ПАРКОВКА", "#ff6fae", "#151515"), cam="alt", music={"style": "bed", "bpm": 110}),
}
WHO = {"IL": '[id^="IL"]', "LV": '[id^="LV"]', "EG": '[id^="EG"]', "DR": '[id^="DR"]', "T": '[id^="T"]'}

for vid, v in V.items():
    if len(sys.argv) > 1 and vid not in sys.argv[1:]: continue
    d = dict(BASE_JSON, id=vid); json.dump(d, open(f"{vid}.json", "w"), ensure_ascii=False, indent=1)
    if os.path.exists(f"vo/{vid}"): shutil.rmtree(f"vo/{vid}")
    shutil.copytree("vo/ep43", f"vo/{vid}")
    bb, bt, bo, em = v["bub"]
    cloth = "\n".join(f'.c{WHO[k]} [fill="{a}"] {{ fill: {b}; }}' for k, m in v["cloth"].items() for a, b in m.items())
    open(f"{vid}.css", "w").write(BASE_CSS + f'''
/* {vid} — пересъёмка «{v["name"]}»: гамма фонов, пузыри, тег, одежда */
.scn > svg[id^="bg_"], .pin2 > svg {{ filter: {v["bg"]}; }}
.bub {{ background: {bb}; color: {bt}; border-color: {bo}; box-shadow: 0 0 0 7px {bb}, 0 18px 40px rgba(0,0,0,.45); }}
.bub::after {{ background: {bb}; border-color: {bo}; }}
.bub em {{ color: {em}; }}
#tag b {{ background: {v["tag"]}; }}
{cloth}
''')
    t1, t2, c1, c2 = v["title"]
    cfg = json.dumps({"t1": t1, "t2": t2, "c1": c1, "c2": c2, "cam": v["cam"], "music": v["music"]}, ensure_ascii=False)
    open(f"{vid}.js", "w").write(BASE_JS + f'''

// ── {vid} «{v["name"]}»: та же история и озвучка, другая «съёмка» ──
(() => {{
  const C = {cfg};
  const orig = window.build;
  window.build = R => {{
    orig(R);
    const tl = R.tl;
    $("#title .a").textContent = C.t1; $("#title .a").style.cssText = `font-size:110px;background:${{C.c1}};color:${{C.c2}}`;
    const b = $("#title .b"); b.style.display = ""; b.textContent = C.t2; b.style.cssText = `font-size:60px;background:${{C.c2}};color:${{C.c1}}`;
    tl.set("#title", {{ opacity: 1, y: 0 }}, 0).to("#title", {{ opacity: 0, y: -50, duration: .3 }}, 1.2);
    const S = [["park", 0, st.l1 - .35, "50% 55%"], ["line", st.l1 - .35, st.m1 - .55, "60% 70%"], ["kab", st.m1 - .55, W("l2", "мастер") - .3, "50% 40%"],
               ["mast", W("l2", "мастер") - .3, W("l4", "учител") - .3, "55% 60%"], ["uch", W("l4", "учител") - .3, st.l5 - .3, "45% 55%"],
               ["rasp", st.l5 - .3, st.end - .35, "35% 35%"], ["fin", st.end - .35, en.end + .3, "50% 50%"]];
    S.forEach(([n, a, z, o], i) => {{
      const sel = `#sc_${{n}}`, d = z - a;
      if (C.cam === "in") tl.fromTo(sel, {{ scale: 1 }}, {{ scale: 1.12, transformOrigin: o, duration: d, ease: "none", immediateRender: false }}, a);
      else if (C.cam === "out") tl.fromTo(sel, {{ scale: 1.12 }}, {{ scale: 1, transformOrigin: o, duration: d, ease: "none", immediateRender: false }}, a);
      else if (C.cam === "tilt") tl.fromTo(sel, {{ scale: 1.06, rotation: i % 2 ? -.8 : .8 }}, {{ scale: 1.1, rotation: 0, transformOrigin: o, duration: d, ease: "none", immediateRender: false }}, a);
      else if (C.cam === "punch") tl.fromTo(sel, {{ scale: 1 }}, {{ scale: 1.09, transformOrigin: o, duration: .45, ease: "back.out(2)", immediateRender: false }}, a + .5);
      else if (C.cam === "pan") tl.fromTo(sel, {{ scale: 1.1, xPercent: i % 2 ? 2.5 : -2.5 }}, {{ scale: 1.1, xPercent: i % 2 ? -2.5 : 2.5, transformOrigin: "50% 50%", duration: d, ease: "none", immediateRender: false }}, a);
      else if (C.cam === "vpan") tl.fromTo(sel, {{ scale: 1.1, yPercent: 2 }}, {{ scale: 1.1, yPercent: -2, transformOrigin: "50% 50%", duration: d, ease: "none", immediateRender: false }}, a);
      else tl.fromTo(sel, {{ scale: i % 2 ? 1 : 1.1 }}, {{ scale: i % 2 ? 1.1 : 1, transformOrigin: o, duration: d, ease: "none", immediateRender: false }}, a);
    }});
    window.MUSIC = Object.assign({{}}, window.MUSIC, C.music);
  }};
}})();
''')
    print(vid, v["name"])
