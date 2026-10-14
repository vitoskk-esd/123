#!/usr/bin/env bash
# Собирает рилсы 16–19, как только готов голос (переживает перезапуск: готовые пропускает).
cd "$(dirname "$0")"
for r in arb-tax-16 arb-3years-17 arb-cashback-18 arb-nobonus-19; do
  until [ -f $r/out/voice/voice.wav ]; do sleep 20; done
  [ -f $r/reel_final.mp4 ] && [ $r/reel_final.mp4 -nt $r/out/voice/voice.wav ] && continue
  bash arb-kit/make_reel.sh $r >> arb_build.log 2>&1
done
echo "ALL REELS DONE" >> arb_build.log
