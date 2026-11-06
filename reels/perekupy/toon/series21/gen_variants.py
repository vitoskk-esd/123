# Розовый не использовать (владелец 06.11).
# python3 gen_variants.py — 7 «пересъёмок» ep30 «Схемы · Марафет за ночь» (схема ep27, владелец 05–06.11): та же история, порядок и озвучка;
# у каждой своя гамма фонов, движение камеры, стиль пузырей, обложка, музыка и одежда героев. → ep30b…ep30h (.json/.js/.css + vo/<id>)
import json, os, shutil, sys

BASE_JS, BASE_CSS, BASE_JSON = open("ep30.js").read(), open("ep30.css").read(), json.load(open("ep30.json"))
# одежда: Вика — куртка #8e1f3a/#5c1426; Серёга — толстовка #25b39b/#1f9a85, джинсы #3d6fb6; Толян — штаны #232c47
# озвучка — vo/ep30fix: перезаписана реплика Вики «Капот тёплый» (владелец 06.11: ударение); основной ep30 тоже пересобран с ней (старая — vo/ep30_old)
V = {
 "ep30b": dict(name="Детектив", bg="sepia(.3) saturate(1.2) hue-rotate(-15deg) brightness(.95) contrast(1.08)",
   bub=("#151515", "#fff", "#ff7a1a", "#ff7a1a"), tag="#ff7a1a",
   cloth={"V": {"#8e1f3a": "#2c3e50", "#5c1426": "#1f2d3a"}, "S": {"#25b39b": "#7a4a24", "#1f9a85": "#5e3819"}},
   title=("МАРАФЕТ", "ЗА ОДНУ НОЧЬ", "#ff7a1a", "#151515"), cam="vpan", music={"style": "detective", "bpm": 100}),
 "ep30c": dict(name="Ночь", bg="brightness(.72) contrast(1.12) saturate(1.1) hue-rotate(12deg)",
   bub=("#101826", "#fff", "#ffd23f", "#ffd23f"), tag="#ffd23f",
   cloth={"S": {"#25b39b": "#d6403a", "#1f9a85": "#a8302b"}, "V": {"#8e1f3a": "#16a085", "#5c1426": "#117a65"}},
   title=("ЛАМПОЧКУ «ЧЕК»", "— В КАРМАН", "#ffd23f", "#151515"), cam="in", music={"style": "phonk", "bpm": 120}),
 "ep30d": dict(name="Холодная", bg="sepia(.25) hue-rotate(165deg) saturate(.9) brightness(1.04)",
   bub=("#1d4fb8", "#fff", "#fff", "#ffd23f"), tag="#7cc8ff",
   cloth={"S": {"#25b39b": "#8e44ad", "#1f9a85": "#6c3483"}, "T": {"#232c47": "#3a3a3a"}},
   title=("КАПОТ ТЁПЛЫЙ?", "ЗНАЧИТ, ГРЕЛИ", "#1d4fb8", "#fff"), cam="out", music={"style": "tech", "bpm": 116}),
 "ep30e": dict(name="Ч/Б + красный", bg="grayscale(1) contrast(1.18) brightness(1.02)",
   bub=("#0d0d0d", "#fff", "#ff3b30", "#ff3b30"), tag="#ff3b30",
   cloth={"V": {"#8e1f3a": "#ff3b30", "#5c1426": "#c0392b"}, "S": {"#25b39b": "#f1c40f", "#1f9a85": "#c9a20c"}},
   title=("ЧИСТЫЙ МОТОР", "— ЭТО УЛИКА", "#ff3b30", "#fff"), cam="tilt", music={"style": "story", "bpm": 100}),
 "ep30f": dict(name="Комикс", bg="saturate(1.6) contrast(1.15)",
   bub=("#ffd23f", "#151515", "#151515", "#d6243a"), tag="#ff7a1a",
   cloth={"S": {"#25b39b": "#e67e22", "#1f9a85": "#c0651a"}, "V": {"#8e1f3a": "#2e86de", "#5c1426": "#1d4fb8"}},
   title=("НЕВЕСТА", "ЗА ОДНУ НОЧЬ", "#ffd23f", "#151515"), cam="punch", music={"style": "toon", "bpm": 112}),
 "ep30g": dict(name="Ретро", bg="sepia(.6) saturate(1.3) hue-rotate(-10deg) contrast(1.05)",
   bub=("#f4e7c3", "#3a2010", "#6b3a1f", "#c0392b"), tag="#e8d6a8",
   cloth={"S": {"#25b39b": "#2c3e50", "#1f9a85": "#1f2d3a"}, "V": {"#8e1f3a": "#6b3a1f", "#5c1426": "#4a2810"}},
   title=("«НА СОЛНЫШКЕ", "СТОЯЛА»", "#c0392b", "#f4e7c3"), cam="pan", music={"style": "show", "bpm": 104, "tension": [0.2, 1.6]}),
 # h — всегда розовая (владелец 06.11)
 "ep30h": dict(name="Пастель", bg="saturate(.7) brightness(1.12) hue-rotate(40deg)",
   bub=("#fff", "#151515", "#ff4fa3", "#ff4fa3"), tag="#ff6fae",
   cloth={"S": {"#25b39b": "#ff6fae", "#1f9a85": "#e0559a"}, "T": {"#232c47": "#2b2b2e"}},
   title=("КУПИ У ХОЗЯИНА,", "А НЕ ПОСЛЕ МАРАФЕТА", "#ff6fae", "#151515"), cam="alt", music={"style": "bed", "bpm": 110}),
}
WHO = {"S": '#S', "V": '[id^="V"]', "T": '[id^="T"]'}

for vid, v in V.items():
    if len(sys.argv) > 1 and vid not in sys.argv[1:]: continue
    d = dict(BASE_JSON, id=vid); json.dump(d, open(f"{vid}.json", "w"), ensure_ascii=False, indent=1)
    if os.path.exists(f"vo/{vid}"): shutil.rmtree(f"vo/{vid}")
    shutil.copytree("vo/ep30fix", f"vo/{vid}")
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
    const S = [["hook", 0, st.t1 - .9, "40% 55%"], ["box", st.t1 - .9, st.l2 - .7, "50% 60%"], ["eng", st.l2 - .7, st.l3 - .7, "50% 55%"],
               ["dash", st.l3 - .7, st.l4 - .7, "50% 55%"], ["cta", st.l4 - .7, st.v2 - .7, "50% 45%"], ["show", st.v2 - .7, st.rule - .7, "50% 55%"],
               ["moral", st.rule - .7, st.end - .15, "50% 40%"]];
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
