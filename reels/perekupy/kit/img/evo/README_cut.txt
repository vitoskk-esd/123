Вырезка заново (12.11, владелец: «видно, что вырезана плохо»):
python ../_tools/cut_sheet.py . evo --shadow-l=46 --defringe --white-holes
python fix_under.py evo_side.png "[(141,189,66,64),(624,189,66,64)]" "[(0,229),(766,229)]"      → evo_side_fix.png → evo_side.png
python fix_under.py evo_side_r.png "[(138,182,66,63),(604,182,66,63)]" "[(0,222),(707,222)]"   → evo_side_r_fix.png → evo_side_r.png
(fix_under: ниже линии порога оставляем только колёса — убирает тень и белую щель под порогом)
