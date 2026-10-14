#!/usr/bin/env bash
# Собирает рилсы 16–19 по очереди (переживает перезапуск контейнера: make_reel продолжает рендер с места).
cd "$(dirname "$0")"
for r in arb-tax-16 arb-3years-17 arb-cashback-18 arb-nobonus-19; do
  [ -f $r/out/.done ] && continue
  bash arb-kit/make_reel.sh $r >> arb_build.log 2>&1 && touch $r/out/.done
done
echo "ALL REELS DONE" >> arb_build.log
