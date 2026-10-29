import subprocess, sys, numpy as np
from faster_whisper import WhisperModel
_m = None
def load(path):
    raw = subprocess.run(["ffmpeg", "-v", "quiet", "-i", path, "-f", "s16le", "-ac", "1", "-ar", "16000", "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768
def words(path, size="small"):
    global _m
    _m = _m or WhisperModel(size, device="cpu", compute_type="int8")
    segs, _ = _m.transcribe(load(path), language="ru", word_timestamps=True)
    return [(w.word.strip(), w.start, w.end) for s in segs for w in s.words]
if __name__ == "__main__":
    for f in sys.argv[1:]:
        print(f, "|", " ".join(w for w, _, _ in words(f)))
