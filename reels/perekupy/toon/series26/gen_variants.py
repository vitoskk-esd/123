# Розовый не использовать (владелец 06.11).
# python3 gen_variants.py — 4 «пересъёмки» ep35 «Толян: со ста тысяч · 3 — Конкурент» (владелец 09.11): та же история, порядок и озвучка;
# у каждой своя гамма фонов, движение камеры, стиль пузырей, обложка, музыка и одежда героев. → ep35b, ep35c, ep35d, ep35h (.json/.js/.css + vo/<id>)
import json, os, shutil, sys

BASE_JS, BASE_CSS, BASE_JSON = open("ep35.js").read(), open("ep35.css").read(), json.load(open("ep35.json"))
# одежда: Жора — кепка #c0392b; Тимур — куртка #2ec4b6; Семёныч — тулуп #5b4a3a; Нина — платье #c4553f (в базе перекрашено CSS); Толян — штаны #232c47
V = {
 "ep35b": dict(name="Детектив", bg="sepia(.3) saturate(1.2) hue-rotate(-15deg) brightness(.95) contrast(1.08)",
   bub=("#151515", "#fff", "#ff7a1a", "#ff7a1a"), tag="#ff7a1a",
   cloth={"ZH": {"#c0392b": "#2c3e50"}, "TI": {"#2ec4b6": "#e67e22"}},
   title=("ЖОРА", "ВСЕГДА ПЕРВЫЙ?", "#ff7a1a", "#151515"), cam="vpan", music={"style": "detective", "bpm": 100}),
 "ep35c": dict(name="Ночь", bg="brightness(.72) contrast(1.12) saturate(1.1) hue-rotate(12deg)",
   bub=("#101826", "#fff", "#ffd23f", "#ffd23f"), tag="#ffd23f",
   cloth={"SE": {"#5b4a3a": "#2f4f6f"}, "NI": {"#c4553f": "#6a3d9a"}, "NI2": {"#c4553f": "#6a3d9a"}},
   title=("5:47", "КТО БЫСТРЕЕ?", "#ffd23f", "#151515"), cam="in", music={"style": "phonk", "bpm": 120}),
 "ep35d": dict(name="Холодная", bg="sepia(.25) hue-rotate(165deg) saturate(.9) brightness(1.04)",
   bub=("#1d4fb8", "#fff", "#fff", "#ffd23f"), tag="#7cc8ff",
   cloth={"TI": {"#2ec4b6": "#8e44ad"}, "ZH": {"#c0392b": "#16a085"}},
   title=("ЖОРА 3 : 0", "ТОЛЯН", "#1d4fb8", "#fff"), cam="out", music={"style": "tech", "bpm": 116}),
 # h — всегда розовая (владелец 06.11)
 "ep35h": dict(name="Пастель", bg="saturate(.7) brightness(1.12) hue-rotate(40deg)",
   bub=("#fff", "#151515", "#ff4fa3", "#ff4fa3"), tag="#ff6fae",
   cloth={"TI": {"#2ec4b6": "#ff6fae"}, "T": {"#232c47": "#2b2b2e"}},
   title=("ОПОЗДАЛ,", "СТУДЕНТ", "#ff6fae", "#151515"), cam="alt", music={"style": "bed", "bpm": 110}),
}
WHO = {"ZH": '[id^="ZH"]', "TI": '#TI', "SE": '#SE', "NI": "#NI", "NI2": "#NI2", "T": '[id^="T"]:not(#TI)'}

for vid, v in V.items():
    if len(sys.argv) > 1 and vid not in sys.argv[1:]: continue
    d = dict(BASE_JSON, id=vid); json.dump(d, open(f"{vid}.json", "w"), ensure_ascii=False, indent=1)
    if os.path.exists(f"vo/{vid}"): shutil.rmtree(f"vo/{vid}")
    shutil.copytree("vo/ep35", f"vo/{vid}")
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
    const S = [["pochta", 0, st.l1 - .7, "55% 55%"], ["shaurma", st.l1 - .7, st.l2 - .7, "60% 55%"], ["laundry", st.l2 - .7, st.l3 - .7, "45% 55%"],
               ["sad", st.l3 - .7, st.z3 - .7, "50% 60%"], ["sad2", st.z3 - .7, st.l6 - .7, "55% 55%"], ["most", st.l6 - .7, st.z4 - .7, "50% 60%"],
               ["most2", st.z4 - .7, en.end + .3, "50% 45%"]];
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
