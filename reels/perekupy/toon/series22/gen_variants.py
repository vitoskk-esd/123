# Розовый не использовать (владелец 06.11).
# python3 gen_variants.py — 2 «пересъёмки» ep31 «Схемы · Продаю сам» (владелец 07.11: только b и h) (схема ep27, владелец 05–06.11): та же история, порядок и озвучка;
# у каждой своя гамма фонов, движение камеры, стиль пузырей, обложка, музыка и одежда героев. → ep31b, ep31h (.json/.js/.css + vo/<id>)
import json, os, shutil, sys

BASE_JS, BASE_CSS, BASE_JSON = open("ep31.js").read(), open("ep31.css").read(), json.load(open("ep31.json"))
# одежда: Серёга — толстовка #25b39b/#1f9a85; баба Галя — пальто #c4553f/#c2402f; Толян — штаны #232c47
V = {
 "ep31b": dict(name="Детектив", bg="sepia(.3) saturate(1.2) hue-rotate(-15deg) brightness(.95) contrast(1.08)",
   bub=("#151515", "#fff", "#ff7a1a", "#ff7a1a"), tag="#ff7a1a",
   cloth={"S": {"#25b39b": "#2c3e50", "#1f9a85": "#1f2d3a"}, "G": {"#c4553f": "#2e6b8a", "#c2402f": "#245670"}},
   title=("«ПРОДАЮ САМ»", "В НАКЛАДНЫХ УСАХ", "#ff7a1a", "#151515"), cam="vpan", music={"style": "detective", "bpm": 100}),
 # h — всегда розовая (владелец 06.11)
 "ep31h": dict(name="Пастель", bg="saturate(.7) brightness(1.12) hue-rotate(40deg)",
   bub=("#fff", "#151515", "#ff4fa3", "#ff4fa3"), tag="#ff6fae",
   cloth={"S": {"#25b39b": "#ff6fae", "#1f9a85": "#e0559a"}, "T": {"#232c47": "#2b2b2e"}},
   title=("ХОЗЯЙКА — В 07:00,", "ПЕРЕКУП — В 07:20", "#ff6fae", "#151515"), cam="alt", music={"style": "bed", "bpm": 110}),
}
WHO = {"S": '[id^="S"]', "G": '[id^="G"]', "T": '[id^="T"]'}

for vid, v in V.items():
    if len(sys.argv) > 1 and vid not in sys.argv[1:]: continue
    d = dict(BASE_JSON, id=vid); json.dump(d, open(f"{vid}.json", "w"), ensure_ascii=False, indent=1)
    if os.path.exists(f"vo/{vid}"): shutil.rmtree(f"vo/{vid}")
    shutil.copytree("vo/ep31", f"vo/{vid}")
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
    const D2 = W("l5", "утром") - .4;
    const S = [["room", 0, st.t1 - .7, "40% 55%"], ["dacha", st.t1 - .7, st.l2 - .7, "50% 60%"], ["street", st.l2 - .7, st.l3 - .7, "50% 55%"],
               ["cta", st.l3 - .7, st.s2 - .7, "50% 45%"], ["metro", st.s2 - .7, st.l4 - .7, "50% 55%"], ["docs", st.l4 - .7, D2, "50% 45%"],
               ["dacha2", D2, st.rule - .7, "50% 60%"], ["moral", st.rule - .7, st.end - .15, "50% 40%"]];
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
