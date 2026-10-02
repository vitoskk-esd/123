// Рендер видео с озвучкой и фоновым битом: node render-video.js [red|dark|chat ...]
// Перед первым запуском: ./setup-tts.sh
const { chromium } = require("playwright");
const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const VARIANTS = require("./voiceover");
const { synthLine, PIPER } = require("./voice");

const FPS = 30;
const OUT_DIR = path.join(__dirname, "..", "output");
const LEAD = 0.2; // пауза от начала сцены до голоса
const GAP = 0.3; // пауза после фразы до следующей сцены
const TAIL = 1.6; // финальный кадр после последней фразы

// Простой бит 112 BPM: бочка, хэт на слабую долю, бас и пэд (Am — F)
function musicExpr() {
  const B = (60 / 112).toFixed(4), x = `mod(t,${B})`, h = `mod(t+${B}/2,${B})`;
  const A = `lt(mod(t,8*${B}),4*${B})`;
  const kick = `0.8*sin(2*PI*(45*${x}+3*(1-exp(-35*${x}))))*exp(-8*${x})`;
  const hat = `0.07*(2*random(0)-1)*exp(-55*${h})`;
  const bass = `0.18*sin(2*PI*if(${A},110,87.31)*t)*exp(-3*${x})`;
  const pad = `0.03*(1+0.2*sin(2*PI*0.5*t))*(sin(2*PI*if(${A},220,174.61)*t)+sin(2*PI*261.63*t)+sin(2*PI*if(${A},329.63,349.23)*t))`;
  return `${kick}+${hat}+${bass}+${pad}`;
}

async function renderVariant(name, browser) {
  const v = VARIANTS[name];
  const work = fs.mkdtempSync(path.join(os.tmpdir(), `${name}-`));

  // 1. Озвучка → тайминги сцен
  const starts = [], voices = [];
  let cursor = 0;
  v.lines.forEach((line, i) => {
    const wav = path.join(work, `v${i}.wav`);
    // Вдох перед 2-й и 4-й репликой: так звучит как живая начитка, а не склейка
    const d = synthLine(line, wav, { voice: v.voice, breath: i === 1 || i === 3 });
    starts.push(cursor);
    voices.push({ wav, at: cursor + LEAD });
    cursor += LEAD + d + GAP;
  });
  const total = cursor - GAP + TAIL;

  // 2. Кадры
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto("file://" + path.join(__dirname, v.page));
  await page.evaluate(([s, d]) => window.setTimeline(s, d), [starts, total]);
  const frames = Math.round(total * FPS);
  for (let i = 0; i < frames; i++) {
    await page.evaluate((t) => window.render(t), i / FPS);
    await page.screenshot({ path: path.join(work, `f${String(i).padStart(4, "0")}.jpg`), type: "jpeg", quality: 92 });
  }
  await page.close();

  // 3. Сведение: голос + тихий бит, громкость под соцсети
  const voiceTrack = path.join(OUT_DIR, `voiceover-${name}.m4a`);
  const inputs = voices.flatMap((x) => ["-i", x.wav]);
  const delays = voices.map((x, i) => `[${i + 2}:a]adelay=${Math.round(x.at * 1000)}:all=1,aresample=44100[v${i}]`).join(";");
  const mixV = voices.map((_, i) => `[v${i}]`).join("") + `amix=inputs=${voices.length}:normalize=0[vo]`;
  const music = `[1:a]volume=0.22,afade=t=in:d=0.5,afade=t=out:st=${(total - 1.2).toFixed(2)}:d=1.2[mu]`;
  // Фон комнаты под голосом: без него паузы звучат «цифровой» тишиной
  const room = `anoisesrc=color=brown:a=0.004:r=44100:d=${total.toFixed(2)}:seed=3,lowpass=f=900[rt]`;
  const out = path.join(OUT_DIR, `video-${name}-1080x1920.mp4`);
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error",
    "-framerate", String(FPS), "-i", path.join(work, "f%04d.jpg"),
    "-f", "lavfi", "-i", `aevalsrc='${musicExpr()}':s=44100:d=${total.toFixed(2)}`,
    ...inputs,
    "-filter_complex", `${delays};${room};${mixV.replace("[vo]", "")}[vraw];[vraw][rt]amix=inputs=2:normalize=0:duration=longest[vo];${music};[vo]asplit[vo1][vo2];[vo1][mu]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5[a];[vo2]loudnorm=I=-14:TP=-1.5[vonly]`,
    "-map", "0:v", "-map", "[a]", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20", "-preset", "medium",
    "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", out,
    "-map", "[vonly]", "-c:a", "aac", "-b:a", "128k", voiceTrack,
  ]);
  fs.rmSync(work, { recursive: true });
  console.log("ok", path.basename(out), total.toFixed(1) + "s", "scenes:", starts.map((s) => s.toFixed(2)).join(" "));
}

(async () => {
  if (!fs.existsSync(PIPER)) throw new Error("Нет синтезатора речи: запустите ./setup-tts.sh");
  const names = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(VARIANTS);
  const browser = await chromium.launch();
  for (const n of names) await renderVariant(n, browser);
  await browser.close();
})();
