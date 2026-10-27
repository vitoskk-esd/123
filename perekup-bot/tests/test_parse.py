"""Разбор постов и фильтров, совпадение, рынок — без Telegram и базы."""
from pathlib import Path

import pytest

from parse import car_key, fingerprint, parse_post
from query import Filter, describe, matches, parse_filter
from words import load_dictionary
from tests.samples import POSTS

D = load_dictionary(Path(__file__).resolve().parents[1] / "cars.yaml")


@pytest.mark.parametrize("text,expected", POSTS)
def test_posts(text, expected):
    L = parse_post(text, D)
    assert (L.make, L.model, L.year, L.price, L.mileage, L.region) == expected


def test_markers_and_negation():
    L = parse_post("СРОЧНО продаю гранту 2018, торг, после дтп, не требует вложений. 450к", D)
    assert L.markers == ["urgent", "haggle", "damaged"]          # «не требует вложений» — не маркер
    assert parse_post("Камри 2015 без дтп 1.6 млн", D).markers == []
    scam = parse_post("Toyota RAV4 2019 всего 900 000 ₽! Дистанционное оформление, доставка в любой регион, предоплата", D)
    assert {"remote", "prepay"} <= set(scam.markers)


def test_mixed_scripts_and_declension():
    assert parse_post("Прoдaм Ниву 4х4 2010, 300 тыс", D).model == "Niva"     # латинские о и а в «Прoдaм»
    L = parse_post("Лады Весты 2020 года 1 100 000, в Москве", D)
    assert (L.model, L.region) == ("Vesta", "msk")


def test_price_traps():
    assert parse_post("Камри 2012, пробег 150 000 км, звонить 8 999 123 45 67", D).price is None   # пробег и телефон — не цена
    assert parse_post("Solaris 2016 цена 650", D).price == 650_000
    assert parse_post("Porsche Cayenne 2015 цена 25.000.000 тг", D).price is None                    # тенге — не РФ
    assert parse_post("УАЗ Патриот 2017 за 452 000 руб", D).model == "Patriot"                       # «452» из цены — не «Буханка»


def test_duplicates_keys():
    a = "🔥 Toyota Camry 2012\nЦена 1 250 000 ₽\nпробег 180 000 км\n@seller_one 8 916 111-22-33"
    b = "Toyota Camry 2012\nЦена 1 250 000 ₽\nпробег 180 000 км\n@other_channel 8 926 444-55-66"
    assert fingerprint(a) == fingerprint(b)                 # ссылки, ники и телефоны не мешают узнать тот же текст
    c = "Продаю камри 2012 года! пробег 180 тыс, отдам за 1 250 000"
    assert car_key(parse_post(a, D)) == car_key(parse_post(c, D))   # другие слова, та же машина


def test_filter_parse_and_card():
    f = parse_filter("камри или солярис от 2010, до 1,2 млн, Москва, пробег до 200 тыс, без битых и такси", D)
    assert f.cars == [["toyota", "Camry"], ["hyundai", "Solaris"]]
    assert (f.year_min, f.price_max, f.mileage_max, f.regions) == (2010, 1_200_000, 200_000, ["msk"])
    assert f.exclude_markers == ["damaged", "taxi"]
    assert "Toyota Camry, Hyundai Solaris" in describe(f, D)
    g = parse_filter("любая тойота 2012-2016 от 800 до 1.5 млн спб", D)
    assert (g.cars, g.year_min, g.year_max, g.price_min, g.price_max) == ([["toyota", None]], 2012, 2016, 800_000, 1_500_000)
    assert parse_filter("веста, без слова гбо", D).exclude_words == ["гбо"]
    assert parse_filter("до 500 тысяч ниже рынка на 15%", D).min_discount == 15
    assert parse_filter("привет", D).empty
    assert Filter.loads(f.dumps()) == f


def test_matching():
    f = parse_filter("камри до 1,3 млн, от 2010, Москва, без битых, без слова гбо", D)
    ok = parse_post("Toyota Camry 2012, 1 250 000 ₽, Москва", D)
    assert matches(f, ok, None)
    assert not matches(f, parse_post("Toyota Camry 2012, 1 450 000 ₽, Москва", D), None)          # дороже
    assert not matches(f, parse_post("Toyota Camry 2008, 900 000 ₽, Москва", D), None)            # старше
    assert not matches(f, parse_post("Toyota Camry 2012, 1 250 000 ₽, Казань", D), None)          # другой город
    assert matches(f, parse_post("Toyota Camry 2012, 1 250 000 ₽", D), None)                      # город не указан — шлём
    assert not matches(f, parse_post("Toyota Camry 2012, 1 250 000 ₽, после ДТП", D), None)       # битая
    assert not matches(f, parse_post("Toyota Camry 2012, 1 250 000 ₽, стоит ГБО", D), None)       # своё слово
    assert not matches(f, parse_post("Toyota Camry 2012, Москва", D), None)                        # без цены — не шлём
    cheap = parse_filter("камри ниже рынка на 15%", D)
    assert matches(cheap, ok, 18) and not matches(cheap, ok, 10) and not matches(cheap, ok, None)


def test_picks_the_car_for_sale_not_the_comparison():
    """Пост из канала SSA: «по цене плохой приоры» — сравнение, продаётся Citroen C4 из заголовка."""
    text = ("📢 По цене плохой приоры нужно кому:\n\n🚘 Citroen C4\n2012 год\n1.6 | MT\n5 регистраций\n"
            "Мотор и коробка в полном порядке 👌\nБез жести по кузову\nНе продавался на Авито 📦\n"
            "Документов комплект\nБез запретов / залогов ✅\nЦена: 210 000 ₽")
    L = parse_post(text, D)
    assert (L.make, L.model, L.year, L.price) == ("citroen", "C4", 2012, 210_000)
    assert "credit" not in L.markers                                    # «без запретов / залогов» — не залог
    assert parse_post("Дешевле камри! Тойота Королла 2014, 800 000", D).model == "Corolla"
    assert parse_post("Продам солярис 2015 790к, рассмотрю обмен на камри", D).model == "Solaris"
    assert parse_post("Камри 2012 900к, вместо солярис", D).model == "Camry"


def test_negation_only_inside_its_phrase():
    assert "credit" in parse_post("Не бит, не крашен, в кредите. Камри 2012, 900к", D).markers
    assert "damaged" not in parse_post("Камри 2012, без дтп и вложений, 900к", D).markers
