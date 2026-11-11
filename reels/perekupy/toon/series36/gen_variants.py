# python3 gen_variants.py — 3 «пересъёмки» ep45 «Толян: со ста тысяч · 9 — Машина директора» (владелец 12.11): та же история, порядок и озвучка;
# у каждой своя гамма фонов, движение камеры, стиль пузырей, обложка, музыка и одежда героев. → ep45b, ep45c, ep45h (h — розовая)
import json, os, shutil, sys

BASE_JS, BASE_CSS, BASE_JSON = open("ep45.js").read(), open("ep45.css").read(), json.load(open("ep45.json"))
# одежда: Ильдар — костюм #1f4fb8; директор — костюм #2b2f37; Жора — куртка #1d1d1f, кепка #c0392b; Толян — штаны #232c47
V = {
 "ep45b": dict(name="Архив", bg="sepia(.32) saturate(1.1) hue-rotate(-10deg) brightness(.97) contrast(1.08)",
   bub=("#fbfaf3", "#151515", "#2f4fb8", "#c0392b"), tag="#2f4fb8",
   cloth={"DR": {"#2b2f37": "#4a3a2a"}, "ZH": {"#c0392b": "#2f6db5"}, "IL": {"#1f4fb8": "#c0392b"}},
   title=("ПРИКАЗ № 1:", "ПРОДАТЬ ЧЕСТНО", "#2f4fb8", "#fbfaf3"), cam="vpan", music={"style": "story", "bpm": 96}),
 "ep45c": dict(name="Ночь", bg="brightness(.76) contrast(1.12) saturate(1.1) hue-rotate(16deg)",
   bub=("#101826", "#fff", "#ffd23f", "#ffd23f"), tag="#ffd23f",
   cloth={"DR": {"#2b2f37": "#1f3a5a"}, "ZH": {"#1d1d1f": "#4a2a2a"}, "IL": {"#1f4fb8": "#16a085"}},
   title=("30 ЛЕТ", "ПОД ЧЕХЛОМ", "#ffd23f", "#151515"), cam="in", music={"style": "phonk", "bpm": 120}),
 # h — всегда розовая (владелец 06.11)
 "ep45h": dict(name="Пастель", bg="saturate(.7) brightness(1.12) hue-rotate(40deg)",
   bub=("#fff", "#151515", "#ff4fa3", "#ff4fa3"), tag="#ff6fae",
   cloth={"IL": {"#1f4fb8": "#ff6fae"}, "T": {"#232c47": "#2b2b2e"}},
   title=("МАШИНА", "ДИРЕКТОРА", "#ff6fae", "#151515"), cam="alt", music={"style": "bed", "bpm": 110}),
}
WHO = {"IL": '[id^="IL"]', "DR": '[id^="DR"]', "ZH": '[id^="ZH"]', "T": '[id^="T"]'}

for vid, v in V.items():
    if len(sys.argv) > 1 and vid not in sys.argv[1:]: continue
    d = dict(BASE_JSON, id=vid); json.dump(d, open(f"{vid}.json", "w"), ensure_ascii=False, indent=1)
    if os.path.exists(f"vo/{vid}"): shutil.rmtree(f"vo/{vid}")
    shutil.copytree("vo/ep45", f"vo/{vid}")
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
    const S = [["st1", 0, st.d1 - .5, "50% 55%"], ["kab", st.d1 - .5, st.l1 - .35, "55% 50%"], ["gar", st.l1 - .35, st.l3 - .35, "60% 65%"],
               ["st2", st.l3 - .35, st.l5 - .35, "45% 60%"], ["kab2", st.l5 - .35, st.d3 - 1.6, "50% 55%"], ["dd", st.d3 - 1.6, en.end + .3, "55% 55%"]];
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
