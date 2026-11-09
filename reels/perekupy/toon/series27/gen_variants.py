# Розовый не использовать (владелец 06.11).
# python3 gen_variants.py — 3 «пересъёмки» ep36 «Толян: со ста тысяч · 4 — Партнёр или ловушка» (владелец 09.11: всего 4 ролика вместе с основным):
# та же история, порядок и озвучка; у каждой своя гамма фонов, движение камеры, стиль пузырей, обложка, музыка и одежда героев. → ep36b, ep36c, ep36h
import json, os, shutil, sys

BASE_JS, BASE_CSS, BASE_JSON = open("ep36.js").read(), open("ep36.css").read(), json.load(open("ep36.json"))
# одежда: Жора — кепка #c0392b; Арсен — кожанка #5b3a26; Вадик — комбинезон #2e86de; Коля — куртка #6b8e5a; Артур — олимпийка #ff3b30; Толян — штаны #232c47
V = {
 "ep36b": dict(name="Детектив", bg="sepia(.3) saturate(1.2) hue-rotate(-15deg) brightness(.95) contrast(1.08)",
   bub=("#151515", "#fff", "#ff7a1a", "#ff7a1a"), tag="#ff7a1a",
   cloth={"AR": {"#5b3a26": "#2c3e50"}, "AU": {"#ff3b30": "#2e86de"}},
   title=("«НЕ ТАКСИ»,", "СТОПУДОВО", "#ff7a1a", "#151515"), cam="vpan", music={"style": "detective", "bpm": 100}),
 "ep36c": dict(name="Ночь", bg="brightness(.72) contrast(1.12) saturate(1.1) hue-rotate(12deg)",
   bub=("#101826", "#fff", "#ffd23f", "#ffd23f"), tag="#ffd23f",
   cloth={"VA": {"#2e86de": "#c0392b"}, "KO": {"#6b8e5a": "#5b4a3a"}},
   title=("470 000 КМ", "ВМЕСТО 120 000", "#ffd23f", "#151515"), cam="in", music={"style": "phonk", "bpm": 120}),
 # h — всегда розовая (владелец 06.11)
 "ep36h": dict(name="Пастель", bg="saturate(.7) brightness(1.12) hue-rotate(40deg)",
   bub=("#fff", "#151515", "#ff4fa3", "#ff4fa3"), tag="#ff6fae",
   cloth={"AU": {"#ff3b30": "#ff6fae"}, "T": {"#232c47": "#2b2b2e"}},
   title=("ПАРТНЁР", "ИЛИ ЛОВУШКА?", "#ff6fae", "#151515"), cam="alt", music={"style": "bed", "bpm": 110}),
}
WHO = {"ZH": '[id^="ZH"]', "AR": "#AR", "VA": "#VA", "KO": "#KO", "AU": "#AU", "T": '[id^="T"]'}

for vid, v in V.items():
    if len(sys.argv) > 1 and vid not in sys.argv[1:]: continue
    d = dict(BASE_JSON, id=vid); json.dump(d, open(f"{vid}.json", "w"), ensure_ascii=False, indent=1)
    if os.path.exists(f"vo/{vid}"): shutil.rmtree(f"vo/{vid}")
    shutil.copytree("vo/ep36", f"vo/{vid}")
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
    const FIT = W("l4", "через") - .3;
    const S = [["bil", 0, st.a1 - .7, "55% 55%"], ["zhk", st.a1 - .7, st.l2 - .7, "50% 60%"], ["tram", st.l2 - .7, st.v1 - .7, "45% 55%"],
               ["el", st.v1 - .7, st.t3 - .7, "55% 55%"], ["bil2", st.t3 - .7, st.l3 - .7, "50% 55%"], ["park", st.l3 - .7, FIT, "50% 60%"],
               ["fit", FIT, st.z3 - .7, "55% 55%"], ["fit2", st.z3 - .7, en.end + .3, "50% 45%"]];
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
