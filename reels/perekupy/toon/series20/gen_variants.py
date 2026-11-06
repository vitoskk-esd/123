# Розовый не использовать (владелец 06.11).
# python3 gen_variants.py — 7 «пересъёмок» ep29 «Перегон из Якутска» (схема ep27, владелец 05–06.11): та же история, порядок и озвучка;
# у каждой своя гамма фонов, движение камеры, стиль пузырей, обложка, музыка и одежда героев. → ep29b…ep29h (.json/.js/.css + vo/<id>)
import json, os, shutil, sys

BASE_JS, BASE_CSS, BASE_JSON = open("ep29.js").read(), open("ep29.css").read(), json.load(open("ep29.json"))
# одежда: Михалыч — комбинезон #2f5d9c/#24497d; Саня — тулуп #5b4636, шарф #c0392b, ушанка #8a6a4a; Толян — штаны #232c47
V = {
 "ep29b": dict(name="Детектив", bg="sepia(.3) saturate(1.2) hue-rotate(-15deg) brightness(.95) contrast(1.08)",
   bub=("#151515", "#fff", "#ff7a1a", "#ff7a1a"), tag="#ff7a1a",
   cloth={"SA": {"#c0392b": "#2e86de", "#8a6a4a": "#4a4a4a"}, "M": {"#2f5d9c": "#2f7a3a", "#24497d": "#235c2c"}},
   title=("8000 КМ", "ЗА ВЫГОДОЙ", "#ff7a1a", "#151515"), cam="vpan", music={"style": "detective", "bpm": 100}),
 "ep29c": dict(name="Ночь", bg="brightness(.72) contrast(1.12) saturate(1.1) hue-rotate(12deg)",
   bub=("#101826", "#fff", "#ffd23f", "#ffd23f"), tag="#ffd23f",
   cloth={"SA": {"#5b4636": "#2c3e50", "#c0392b": "#f1c40f"}, "T": {"#232c47": "#3a3a3a"}},
   title=("ПРАДО −30%", "В ЯКУТСКЕ", "#ffd23f", "#151515"), cam="in", music={"style": "phonk", "bpm": 120}),
 "ep29d": dict(name="Холодная", bg="sepia(.25) hue-rotate(165deg) saturate(.9) brightness(1.04)",
   bub=("#1d4fb8", "#fff", "#fff", "#ffd23f"), tag="#7cc8ff",
   cloth={"M": {"#2f5d9c": "#7a4a24", "#24497d": "#5e3819"}, "SA": {"#c0392b": "#16a085"}},
   title=("МИНУС 48", "И ЛЕТНЯЯ СОЛЯРКА", "#1d4fb8", "#fff"), cam="out", music={"style": "tech", "bpm": 116}),
 "ep29e": dict(name="Ч/Б + красный", bg="grayscale(1) contrast(1.18) brightness(1.02)",
   bub=("#0d0d0d", "#fff", "#ff3b30", "#ff3b30"), tag="#ff3b30",
   cloth={"SA": {"#5b4636": "#6b3a1f"}, "M": {"#2f5d9c": "#c0392b", "#24497d": "#962d22"}},
   title=("ЛЁД ТРЕЩИТ,", "ТОЛЯН МОЛИТСЯ", "#ff3b30", "#fff"), cam="tilt", music={"style": "story", "bpm": 100}),
 "ep29f": dict(name="Комикс", bg="saturate(1.6) contrast(1.15)",
   bub=("#ffd23f", "#151515", "#151515", "#d6243a"), tag="#ff7a1a",
   cloth={"SA": {"#c0392b": "#e67e22", "#8a6a4a": "#2b2b2e"}, "T": {"#232c47": "#2b2b2e"}},
   title=("ПРАДО", "НА ЛЬДУ", "#ffd23f", "#151515"), cam="punch", music={"style": "toon", "bpm": 112}),
 "ep29g": dict(name="Ретро", bg="sepia(.6) saturate(1.3) hue-rotate(-10deg) contrast(1.05)",
   bub=("#f4e7c3", "#3a2010", "#6b3a1f", "#c0392b"), tag="#e8d6a8",
   cloth={"M": {"#2f5d9c": "#2c3e50", "#24497d": "#1f2d3a"}, "SA": {"#c0392b": "#2f7a3a"}},
   title=("«ЗАВОДИТСЯ", "С ПОЛПИНКА»", "#c0392b", "#f4e7c3"), cam="pan", music={"style": "show", "bpm": 104, "tension": [0.2, 1.6]}),
 "ep29h": dict(name="Пастель", bg="saturate(.7) brightness(1.12) hue-rotate(40deg)",
   bub=("#fff", "#151515", "#ff4fa3", "#ff4fa3"), tag="#ff6fae",
   cloth={"SA": {"#5b4636": "#4a5a2a", "#c0392b": "#ff6fae"}, "M": {"#2f5d9c": "#16a085", "#24497d": "#117a65"}},
   title=("ВЫГОДА", "ДОРОЖЕ РЫНКА", "#ff6fae", "#151515"), cam="alt", music={"style": "bed", "bpm": 110}),
}
WHO = {"SA": '#SA', "M": '#M', "T": '[id^="T"]'}

for vid, v in V.items():
    if len(sys.argv) > 1 and vid not in sys.argv[1:]: continue
    d = dict(BASE_JSON, id=vid); json.dump(d, open(f"{vid}.json", "w"), ensure_ascii=False, indent=1)
    if os.path.exists(f"vo/{vid}"): shutil.rmtree(f"vo/{vid}")
    shutil.copytree("vo/ep29", f"vo/{vid}")
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
    const S = [["room", 0, st.l1 - .7, "40% 55%"], ["yak", st.l1 - .7, st.l3 - .7, "50% 60%"], ["ice", st.l3 - .7, st.l4 - .7, "50% 65%"],
               ["zim", st.l4 - .7, st.d1 - .7, "45% 65%"], ["dps", st.d1 - .7, st.m1 - .7, "50% 55%"], ["sto", st.m1 - .7, st.l7 - .7, "50% 55%"],
               ["check", st.l7 - .7, st.rule - .7, "50% 40%"], ["moral", st.rule - .7, st.end - .15, "50% 40%"]];
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
