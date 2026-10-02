// Озвучка, похожая на живую запись: синтез по предложениям с вариативной подачей,
// паузы разной длины, тихие вдохи и «студийная» обработка (EQ, компрессия, комната).
const { execFileSync } = require("child_process");
const path = require("path");

const TTS = path.join(__dirname, "..", ".tts");
const PIPER = path.join(TTS, "piper", "piper");
const VOICES = {
  ruslan: path.join(TTS, "vits-piper-ru_RU-ruslan-medium", "ru_RU-ruslan-medium.ir8.onnx"),
  denis: path.join(TTS, "vits-piper-ru_RU-denis-medium", "ru_RU-denis-medium.ir8.onnx"),
  dmitri: path.join(TTS, "vits-piper-ru_RU-dmitri-medium", "ru_RU-dmitri-medium.ir8.onnx"),
  irina: path.join(TTS, "ru", "ru-irinia-medium.onnx"),
};

// Детерминированный генератор: одинаковый текст → одинаковый результат при перерендере
function rng(seed) {
  let s = 0;
  for (const ch of seed) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

function duration(file) {
  return +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).toString();
}

// Цепочка обработки голоса: срез гула, тепло, убрать «коробку», присутствие, де-эссер,
// компрессия, лёгкий отзвук небольшой комнаты
const MASTER = [
  "highpass=f=75",
  "equalizer=f=120:t=q:w=0.9:g=2.5",
  "equalizer=f=380:t=q:w=1.2:g=-2",
  "equalizer=f=3200:t=q:w=1.0:g=2",
  "aexciter=amount=1.2:drive=5:freq=6500:blend=0",
  "deesser=i=0.35",
  "acompressor=threshold=-20dB:ratio=3:attack=6:release=90:makeup=2",
  "aecho=0.92:0.55:17|29:0.06|0.04",
].join(",");

/**
 * Синтезирует одну реплику (одна или несколько фраз) в обработанный wav 44.1 кГц.
 * breath — добавить тихий вдох перед репликой. Возвращает длительность в секундах.
 */
function synthLine(text, out, { voice = "ruslan", breath = false, tempo = 0.9 } = {}) {
  const rand = rng(text);
  const parts = text.split(/(?<=[.!?…:])\s+/).filter(Boolean);
  const raw = parts.map((p, i) => {
    const f = out.replace(/\.wav$/, `.p${i}.wav`);
    const len = tempo * (0.96 + rand() * 0.08); // темп немного «плавает»
    execFileSync(PIPER, [
      "-m", VOICES[voice], "-f", f, "-q",
      "--length_scale", len.toFixed(3),
      "--noise_scale", (0.7 + rand() * 0.08).toFixed(3), // экспрессия
      "--noise_w", (0.85 + rand() * 0.1).toFixed(3), // вариативность длительностей
      "--sentence_silence", "0",
    ], { input: p });
    return f;
  });

  const inputs = [], chain = [];
  let n = 0;
  if (breath) {
    // Вдох: розовый шум в полосе дыхания с мягкой огибающей
    inputs.push("-f", "lavfi", "-i", "anoisesrc=color=pink:d=0.34:a=0.5:r=44100:seed=7");
    chain.push(`[${n}:a]bandpass=f=1400:w=2200,afade=t=in:d=0.2,afade=t=out:st=0.2:d=0.14,volume=0.045[b]`);
    n++;
  }
  const seq = breath ? ["[b]"] : [];
  raw.forEach((f, i) => {
    inputs.push("-i", f);
    const pitch = 1 + (rand() - 0.5) * 0.03; // ±1,5% высоты тона между фразами
    const trim = "silenceremove=start_periods=1:start_threshold=-50dB"; // срезаем тишину Piper по краям
    chain.push(`[${n}:a]${trim},areverse,${trim},areverse,aresample=44100:resampler=soxr,rubberband=pitch=${pitch.toFixed(4)}:formant=preserved[s${i}]`);
    seq.push(`[s${i}]`);
    n++;
    if (i < raw.length - 1) {
      const gap = 0.16 + rand() * 0.18; // живые паузы между предложениями
      chain.push(`aevalsrc=0:s=44100:d=${gap.toFixed(3)}[g${i}]`);
      seq.push(`[g${i}]`);
    }
  });
  chain.push(`${seq.join("")}concat=n=${seq.length}:v=0:a=1,${MASTER}[out]`);
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...inputs, "-filter_complex", chain.join(";"), "-map", "[out]", "-ac", "1", "-ar", "44100", out]);
  return duration(out);
}

module.exports = { synthLine, VOICES, PIPER };
