#!/usr/bin/env bash
# Голос Арбузова №7 для рилсов 15–19 по очереди (переживает перезапуск: готовые фразы в кеше phrases.json).
PY=/tmp/claude-0/-home-user-123/8ca4fbe8-9858-5867-9610-cc1983112730/scratchpad/cbx/bin/python
cd "$(dirname "$0")"
for r in arb-newbie-15 arb-tax-16 arb-3years-17 arb-cashback-18 arb-savings-19; do
  [ -f $r/out/voice/voice.wav ] && [ $r/out/voice/voice.wav -nt $r/phrases.txt ] && continue
  mkdir -p $r/out/voice; $PY ../youtube/characters/voice/arbuzov_voice.py $r/phrases.txt $r/out/voice >> $r/out/voice_log.txt 2>&1 && echo "$(date +%H:%M) $r готов" >> arb_voices.log
done
echo "$(date +%H:%M) ALL DONE" >> arb_voices.log
