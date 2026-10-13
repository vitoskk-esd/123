// данные для kit/yt/sfx.js: отрезки ролика №4 из timeline4.js + музыка (вступление — только пэд, дальше бит, финал — outro)
require("./timeline4.js");
window.SEGS = window.YT_TL.segs;
const ch = window.YT_TL.chapters, last = ch[ch.length - 1];
window.TLX = { bpm: 92, music: [{ t: 0, part: "intro" }, { t: ch[1] ? ch[1].t : 8, part: "main" }, { t: last.t, part: "outro" }] };
