// данные для kit/yt/sfx.js: отрезки ролика №5 из timeline5.js + музыка (вступление — только пэд, дальше бит, финал — outro)
require("./timeline5.js");
window.SEGS = window.YT_TL.segs;
const ch = window.YT_TL.chapters, last = ch[ch.length - 1];
window.TLX = { bpm: 92, music: [{ t: 0, part: "intro" }, { t: ch[1] ? ch[1].t : 8, part: "main" }, { t: last.t, part: "outro" }] };
