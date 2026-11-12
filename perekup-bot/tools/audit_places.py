# python tools/audit_places.py > weak_places.yaml — какие названия городов и регионов — ещё и обычные слова, имена или фамилии
# («пересвет приборной панели», «продаёт Владимир», «курган», «шахты», «орёл»). Такие названия бот считает городом, только если
# из текста видно, что это место: «г. Пересвет», «в Пересвете», «Город: Пересвет», отдельной строкой/фразой (words.find_place).
# Нужен pymorphy3 + pymorphy3-dicts-ru (только для этой проверки, боту не нужен). Владелец 12.11: «сделай полную проверку, чтобы такое
# не повторялось никогда».
import sys, yaml
import pymorphy3

m = pymorphy3.MorphAnalyzer()
EXTRA = {"мо", "ло"}                    # двухбуквенные алиасы — бывают сокращением чего угодно
# сокращения и прозвища, которые в объявлении значат только город (словарь знает «Питер» как имя, «челны» — как лодки)
NEVER = set("мск спб питер крд хмао владик челны камчатка приморье пермь чита".split())


def word_too(name: str) -> bool:
    w = name.lower().replace("ё", "е")
    if " " in w or "-" in w:
        return False                                  # «Сергиев Посад», «Ростов-на-Дону» — составные названия словом не бывают
    if w in NEVER:
        return False
    if w in EXTRA:
        return True
    return any(p.is_known and "Geox" not in p.tag and p.score > .05 for p in m.parse(w))


def main():
    names = set()
    for rid, cs in (yaml.safe_load(open("cities.yaml", encoding="utf-8")) or {}).items():
        names |= {str(c) for c in cs or []}
    for rid, r in yaml.safe_load(open("cars.yaml", encoding="utf-8"))["regions"].items():
        names |= {str(a) for a in r.get("aliases") or [] if not str(a).isascii()}
    weak = sorted({n.lower().replace("ё", "е") for n in names if word_too(n)})
    print("# Названия мест, которые бывают и обычным словом/именем/фамилией (tools/audit_places.py, словарь pymorphy3).")
    print("# Город по такому слову — только если видно, что это место: «г. …», «в …е», «Город: …», отдельной строкой или фразой.")
    print("weak: [" + ", ".join(weak) + "]")
    print(len(weak), file=sys.stderr)


if __name__ == "__main__":
    main()
