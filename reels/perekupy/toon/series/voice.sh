#!/bin/bash
# ./voice.sh ep04 — озвучка серии по сценарию: Толян (Algenib) и Лис (Charon) → vo/<id>/tolyan.wav, lis.wav
set -e
ID=$1; D=vo/$ID; mkdir -p $D; MODEL=${MODEL:-gemini-3.1-flash-tts-preview}
J=$ID.json
TT=$(python3 -c "import json;print('\n\n'.join(json.load(open('$J'))['tolyan']))")
TN=$(python3 -c "import json;print(json.load(open('$J'))['tolyan_notes'])")
LT=$(python3 -c "import json;print('\n\n'.join(json.load(open('$J'))['lis']))")
TSTYLE="# AUDIO PROFILE: Tolyan — a cocky Russian used-car flipper (perekup) in his 30s, street swagger, deep raspy voice, slow confident delivery, show-off, calls everyone \"брат\". Adult street comedy, not for kids.
## DIRECTOR NOTES
Four separate lines with a clear 1-second pause between them. Keep a full, loud, clear voice to the very last word of every line — never whisper, mumble or trail off. Wherever the word \"блин\" appears, say it sharply and clearly as an angry curse (it will be bleeped).
$TN
Speak ONLY the transcript, in Russian.
## TRANSCRIPT"
LSTYLE="# AUDIO PROFILE: Lis — a cool, deadpan, ironic street narrator of an adult comedy show about used-car flippers. Low calm voice, dry humor, confident, a bit menacing.
## DIRECTOR NOTES
Separate lines with a clear 0.8-second pause between them. \"В объявлении — …\" lines: quoting the ad with dry sarcasm. \"На деле —\" lines: short, heavy, dramatic reveal. Last line: dry, cocky advice.
Speak ONLY the transcript, in Russian.
## TRANSCRIPT"
[ -s $D/tolyan.wav ] || python3 ../../gtts/tts.py $MODEL Algenib $D/tolyan.wav "$TSTYLE" "$TT"
sleep 10
[ -s $D/lis.wav ] || python3 ../../gtts/tts.py $MODEL Charon $D/lis.wav "$LSTYLE" "$LT"
