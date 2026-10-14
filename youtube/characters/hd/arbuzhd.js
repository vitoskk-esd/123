/* Арбузов в выбранном стиле роликов (владелец 14.10: «рисовка которую ты кидал, она мне очень понравилась. Такую будем использовать в роликах» — amo_test: кухня и превью «ТЕБЕ ДОЛЖНЫ»).
   ArbuzHD.svg({ mood: smirk|shock|happy, look, rim, w, h }) — голова с объёмом, полосами корки, контровым светом. */
(function () {
const OL = "#1e1717";
const st = (w = 6) => `stroke="${OL}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
let U = 0;
function arbuzHD(o = {}) {
  const u = ++U;
  const mood = o.mood || "smirk", rim = o.rim || "#7fd6ff";
  const eye = (x) => mood === "happy"
    ? `<path d="M${x - 34} 392 Q ${x} 350 ${x + 34} 392" fill="none" ${st(9)}/>`
    : `<ellipse cx="${x}" cy="380" rx="40" ry="${mood === "shock" ? 52 : 46}" fill="url(#eyeW${u})" ${st(6)}/>
       <circle cx="${x + (o.look ?? 8)}" cy="${mood === "shock" ? 384 : 388}" r="${mood === "shock" ? 13 : 20}" fill="#1a1414"/>
       <circle cx="${x + (o.look ?? 8) + 7}" cy="${mood === "shock" ? 376 : 379}" r="7" fill="#fff"/><circle cx="${x + (o.look ?? 8) - 6}" cy="${mood === "shock" ? 392 : 396}" r="3" fill="#fff" opacity=".7"/>
       ${mood === "smirk" ? `<path d="M${x - 44} ${352} Q ${x} ${340} ${x + 44} ${356} L ${x + 44} 334 L ${x - 44} 330 Z" fill="url(#face${u})" /><path d="M${x - 42} 354 Q ${x} 344 ${x + 42} 358" fill="none" ${st(7)}/>` : ""}`;
  const brows = mood === "shock" ? `<path d="M206 300 Q 248 272 286 296" fill="none" ${st(9)}/><path d="M314 296 Q 352 272 394 300" fill="none" ${st(9)}/>`
    : mood === "smirk" ? `<path d="M206 318 L 288 312" ${st(9)}/><path d="M312 304 Q 352 288 396 300" fill="none" ${st(9)}/>` : `<path d="M210 312 L 286 304" ${st(9)}/><path d="M314 304 L 390 312" ${st(9)}/>`;
  const mouth = mood === "shock" ? `<ellipse cx="300" cy="478" rx="22" ry="30" fill="#5c1420" ${st(6)}/><ellipse cx="300" cy="490" rx="12" ry="9" fill="#d9536a"/>`
    : mood === "happy" ? `<path d="M250 456 Q 300 520 350 456 Z" fill="#5c1420" ${st(6)}/><path d="M270 482 Q 300 470 330 482 Q 300 506 270 482" fill="#e46b80"/>`
    : `<path d="M262 470 Q 306 494 346 458" fill="none" ${st(8)}/>`;
  return `<svg viewBox="0 0 600 640" width="${o.w || 600}" height="${o.h || 640}">
  <defs>
    <radialGradient id="rind${u}" cx="35%" cy="28%" r="80%"><stop offset="0" stop-color="#5fd77a"/><stop offset=".45" stop-color="#2a9a46"/><stop offset="1" stop-color="#0f4a22"/></radialGradient>
    <radialGradient id="face${u}" gradientUnits="userSpaceOnUse" cx="268" cy="362" r="215"><stop offset="0" stop-color="#ff9aa3"/><stop offset=".6" stop-color="#f2606f"/><stop offset="1" stop-color="#c8394b"/></radialGradient>
    <radialGradient id="eyeW${u}" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#d9dde6"/></radialGradient>
    <linearGradient id="cap${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff5a63"/><stop offset="1" stop-color="#b8182a"/></linearGradient>
    <filter id="tex${u}"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .22 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
    <filter id="soft${u}"><feGaussianBlur stdDeviation="3"/></filter>
    <clipPath id="body${u}"><ellipse cx="300" cy="400" rx="250" ry="250"/></clipPath>
  </defs>
  <ellipse cx="300" cy="400" rx="250" ry="250" fill="url(#rind${u})" ${st(9)}/>
  <g clip-path="url(#body${u})">
    ${[-170, -100, -35, 30, 95, 165].map(dx => `<path d="M${300 + dx * .25} 150 C ${300 + dx * 1.3} 300 ${300 + dx * 1.35} 500 ${300 + dx * .25} 650" fill="none" stroke="#0f5226" stroke-width="${34 - Math.abs(dx) * .06}" stroke-linecap="round" opacity=".92"/><path d="M${300 + dx * .25 + 14} 150 C ${300 + dx * 1.3 + 14} 300 ${300 + dx * 1.35 + 14} 500 ${300 + dx * .25 + 14} 650" fill="none" stroke="#7be08f" stroke-width="5" opacity=".28"/>`).join("")}
    <path d="M470 220 Q 560 400 470 600" fill="none" stroke="${rim}" stroke-width="22" opacity=".5" filter="url(#soft${u})"/>
    <ellipse cx="300" cy="640" rx="260" ry="120" fill="#062a12" opacity=".45" filter="url(#soft${u})"/>
    <ellipse cx="200" cy="250" rx="90" ry="50" fill="#fff" opacity=".22" transform="rotate(-30 200 250)" filter="url(#soft${u})"/>
  </g>
  <path d="M120 250 Q 140 100 300 92 Q 460 100 480 250 Q 300 214 120 250 Z" fill="url(#cap${u})" ${st(8)}/>
  <path d="M420 214 Q 520 200 566 240 Q 520 262 452 252" fill="#a31424" ${st(8)}/>
  <path d="M170 200 Q 220 130 300 124" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".35"/>
  <circle cx="300" cy="96" r="14" fill="#a31424" ${st(6)}/>
  <ellipse cx="300" cy="410" rx="170" ry="138" fill="url(#face${u})" ${st(8)}/>
  ${[[-95, -50], [-30, -95], [55, -80], [110, -30], [-118, 30], [105, 50], [-60, 80]].map(([x, y]) => `<ellipse cx="${300 + x}" cy="${410 + y}" rx="7" ry="12" fill="#3a1414" opacity=".6" transform="rotate(${x / 3} ${300 + x} ${410 + y})"/>`).join("")}
  <ellipse cx="190" cy="452" rx="26" ry="14" fill="#ff3d5a" opacity=".45" filter="url(#soft${u})"/><ellipse cx="410" cy="452" rx="26" ry="14" fill="#ff3d5a" opacity=".45" filter="url(#soft${u})"/>
  ${eye(248)}${eye(352)}${brows}${mouth}
  </svg>`;
}

(typeof window !== "undefined" ? window : globalThis).ArbuzHD = { svg: arbuzHD };
})();
