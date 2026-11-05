# python3 gen_variants.py — 6 «пересъёмок» ep27 (владельцу понравилась ep27b, 05.11): та же история, порядок и озвучка;
# у каждой своя гамма фонов, движение камеры, стиль пузырей, обложка, музыка и одежда героев. → ep27c…ep27h (.json/.js/.css + vo/<id>)
import json, os, shutil

BASE_JS, BASE_CSS, BASE_JSON = open("ep27.js").read(), open("ep27.css").read(), json.load(open("ep27.json"))
# одежда: Серёга — толстовка #25b39b/#1f9a85, джинсы #3d6fb6; Михалыч — комбинезон #2f5d9c/#24497d; Гена — куртка #2b3a55
V = {
 "ep27c": dict(name="Ночь", bg="brightness(.72) contrast(1.12) saturate(1.1) hue-rotate(12deg)",
   bub=("#101826", "#fff", "#ffd23f", "#ffd23f"), tag="#ffd23f",
   cloth={"S": {"#25b39b": "#d6403a", "#1f9a85": "#a8302b"}, "G": {"#2b3a55": "#3a3a3a"}},
   title=("ЗАКАЗАЛ МАШИНУ", "ИЗ ЯПОНИИ", "#ffd23f", "#151515"), cam="in", music={"style": "phonk", "bpm": 120}),
 "ep27d": dict(name="Холодная", bg="sepia(.25) hue-rotate(165deg) saturate(.9) brightness(1.04)",
   bub=("#1d4fb8", "#fff", "#fff", "#ffd23f"), tag="#7cc8ff",
   cloth={"S": {"#25b39b": "#8e44ad", "#1f9a85": "#6c3483"}, "M": {"#2f5d9c": "#2f7a3a", "#24497d": "#235c2c"}},
   title=("ПОЧТИ", "ПЯТЁРКА", "#1d4fb8", "#fff"), cam="out", music={"style": "tech", "bpm": 116}),
 "ep27e": dict(name="Ч/Б + красный", bg="grayscale(1) contrast(1.18) brightness(1.02)",
   bub=("#0d0d0d", "#fff", "#ff3b30", "#ff3b30"), tag="#ff3b30",
   cloth={"S": {"#25b39b": "#f1c40f", "#1f9a85": "#c9a20c"}, "G": {"#2b3a55": "#6b3a1f"}},
   title=("«R»", "В УГЛУ ЛИСТА", "#ff3b30", "#fff"), cam="tilt", music={"style": "story", "bpm": 100}),
 "ep27f": dict(name="Комикс", bg="saturate(1.6) contrast(1.15)",
   bub=("#ffd23f", "#151515", "#151515", "#d6243a"), tag="#ff7a1a",
   cloth={"S": {"#25b39b": "#e67e22", "#1f9a85": "#c0651a", "#3d6fb6": "#2b2b2e"}, "M": {"#2f5d9c": "#7a4a24", "#24497d": "#5e3819"}},
   title=("СЕРЁГА", "И ЯПОНСКИЙ АУКЦИОН", "#ffd23f", "#151515"), cam="punch", music={"style": "toon", "bpm": 112}),
 "ep27g": dict(name="Ретро", bg="sepia(.6) saturate(1.3) hue-rotate(-10deg) contrast(1.05)",
   bub=("#f4e7c3", "#3a2010", "#6b3a1f", "#c0392b"), tag="#e8d6a8",
   cloth={"S": {"#25b39b": "#2c3e50", "#1f9a85": "#1f2d3a"}, "M": {"#2f5d9c": "#c0392b", "#24497d": "#962d22"}},
   title=("ВЕЗУ", "ИЗ ЯПОНИИ САМ", "#c0392b", "#f4e7c3"), cam="pan", music={"style": "show", "bpm": 104, "tension": [0.2, 1.6]}),
 "ep27h": dict(name="Пастель", bg="saturate(.7) brightness(1.12) hue-rotate(40deg)",
   bub=("#fff", "#151515", "#2e86de", "#2e86de"), tag="#ff7ab8",
   cloth={"S": {"#25b39b": "#ff7ab8", "#1f9a85": "#d9629b"}, "G": {"#2b3a55": "#4a5a2a"}},
   title=("НЕ ЛИСТ,", "А МОРСКОЙ БОЙ", "#ff7ab8", "#151515"), cam="alt", music={"style": "bed", "bpm": 110}),
}
WHO = {"S": '[id^="S"]', "G": '[id^="G"]', "M": '#M'}

for vid, v in V.items():
    d = dict(BASE_JSON, id=vid); json.dump(d, open(f"{vid}.json", "w"), ensure_ascii=False, indent=1)
    if os.path.exists(f"vo/{vid}"): shutil.rmtree(f"vo/{vid}")
    shutil.copytree("vo/ep27", f"vo/{vid}")
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
    const S = [["flat", 0, st.g1 - .7, "75% 55%"], ["call", st.g1 - .7, st.l1 - .7, "50% 45%"], ["port", st.l1 - .7, st.l3 - .7, "40% 60%"],
               ["sheet", st.l3 - .7, st.m1 - .7, "50% 50%"], ["sto", st.m1 - .7, st.s4 - .7, "30% 60%"], ["call2", st.s4 - .7, st.rule - .7, "50% 45%"], ["moral", st.rule - .7, st.end - .15, "50% 40%"]];
    S.forEach(([n, a, z, o], i) => {{
      const sel = `#sc_${{n}}`, d = z - a;
      if (C.cam === "in") tl.fromTo(sel, {{ scale: 1 }}, {{ scale: 1.12, transformOrigin: o, duration: d, ease: "none", immediateRender: false }}, a);
      else if (C.cam === "out") tl.fromTo(sel, {{ scale: 1.12 }}, {{ scale: 1, transformOrigin: o, duration: d, ease: "none", immediateRender: false }}, a);
      else if (C.cam === "tilt") tl.fromTo(sel, {{ scale: 1.06, rotation: i % 2 ? -.8 : .8 }}, {{ scale: 1.1, rotation: 0, transformOrigin: o, duration: d, ease: "none", immediateRender: false }}, a);
      else if (C.cam === "punch") tl.fromTo(sel, {{ scale: 1 }}, {{ scale: 1.09, transformOrigin: o, duration: .45, ease: "back.out(2)", immediateRender: false }}, a + .5);
      else if (C.cam === "pan") tl.fromTo(sel, {{ scale: 1.1, xPercent: i % 2 ? 2.5 : -2.5 }}, {{ scale: 1.1, xPercent: i % 2 ? -2.5 : 2.5, transformOrigin: "50% 50%", duration: d, ease: "none", immediateRender: false }}, a);
      else tl.fromTo(sel, {{ scale: i % 2 ? 1 : 1.1 }}, {{ scale: i % 2 ? 1.1 : 1, transformOrigin: o, duration: d, ease: "none", immediateRender: false }}, a);
    }});
    window.MUSIC = Object.assign({{}}, window.MUSIC, C.music);
  }};
}})();
''')
    print(vid, v["name"])
