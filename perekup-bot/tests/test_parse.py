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


@pytest.mark.parametrize("text,expected", [
    ("Porsche Cayenne 2008, 990 000 ₽. Никаких вложений не требует! Москва", []),   # пост из Brichcar-sale
    ("Камри 2012, вложений не требует, 900к", []),
    ("Камри 2012, вложения не нужны, 900к", []),
    ("Камри 2012, в ДТП не была, 900к", []),
    ("Камри 2012, ДТП нет, 900к", []),
    ("Камри 2012, залогов и ограничений нет, 900к", []),
    ("Камри 2012, не бита не крашена, 900к", []),
    ("Камри 2012, торга нет, 900к", []),
    ("Камри 2012, требует вложений, 900к", ["invest"]),
    ("Камри 2012, битая, не на ходу, 900к", ["damaged", "notrun"]),
    ("Камри 2012, после дтп, требует вложений 900к", ["damaged", "invest"]),
    ("Камри 2012, документы чистые, в кредите, 900к", ["credit"]),
    ("Камри 2012 900к, удар в бампер не крашен", ["damaged"]),
    ("Камри 2012, торг, срочно, 900к", ["haggle", "urgent"]),
])
def test_markers_understand_negation(text, expected):
    assert sorted(parse_post(text, D).markers) == sorted(expected)


@pytest.mark.parametrize("text,expected", [
    ("ДТП: 2", 2), ("2 мелких дтп", 2), ("было одно дтп", 1), ("ДТП - 1 (крыло)", 1), ("2 аварии", 2),
    ("дтп 3 раза", 3), ("2 владельца, 1 дтп", 1), ("Без ДТП", 0), ("дтп нет", 0), ("ДТП не было", 0),
    ("в дтп не была", 0), ("не участвовала в дтп", 0), ("по дтп чистая", 0), ("ДТП: 0", 0),
    ("после дтп", None), ("2012 год, 150 000 км", None),
])
def test_accidents_count(text, expected):
    from parse import parse_accidents
    assert parse_accidents(text) == expected


@pytest.mark.parametrize("text,teaser", [
    ("СКОРО В ПРОДАЖЕ 🔥 Камри 2012", True), ("Через 5 минут в продаже!", True), ("через 10 мин в продаже", True),
    ("В продаже через 10 минут", True), ("скоро продажа", True), ("Скоро выставим камри", True),
    ("Анонс: Toyota Camry", True), ("через пару минут будет в продаже", True),
    ("В ПРОДАЖЕ! Камри 2012, 900к", False), ("Камри 2012, продам срочно, скоро уезжаю", False),
    ("Продаю, через неделю переезд", False), ("Через час буду на месте, звоните", False), ("ТОРГ. В продаже до пятницы", False),
])
def test_teaser(text, teaser):
    from parse import is_teaser
    assert is_teaser(text) is teaser


@pytest.mark.parametrize("text", [
    "Друзья, наше обучение будет стоить всего 35.000₽🔥\nЗа 2 месяца выйдешь на доход х3. Старт требует вложений. Пиши в лс",
    "Курс по перекупу авто: от 0 до первой машины. Цена 35 000 руб, научим находить BMW X5 ниже рынка",
    "Наставничество по перепродаже авто — 50 000 ₽. Разберём камри, солярис, поло",
    "Розыгрыш! Разыгрываем 10 000 ₽ среди подписчиков, условия в закрепе. Тойота Камри в подарок не дарим 😄",
    "Увеличь доход х3 за месяц, всего 15 000 ₽",
])
def test_promo_is_not_a_car(text):
    assert not parse_post(text, D).is_car


@pytest.mark.parametrize("text,model", [
    ("BMW X3 2012, 1 150 000 ₽, пробег 160 000 км\n\nНаше обучение по перекупу — @lex_school", "X3"),
    ("Х5 2008 3.0 дизель\n1 200 000 ₽", "X5"),                  # «х5» с годом — это BMW X5
    ("Продаю бмв х3, 950 000 ₽", "X3"),
    ("Лексус RX 2010, 1 600 000", "RX"),
])
def test_real_cars_with_short_models_and_footer(text, model):
    assert parse_post(text, D).model == model


def test_currency_course_is_not_promo():
    from parse import is_promo
    assert not is_promo("Авто из Кореи, цена по курсу ЦБ, Kia Rio 2019 1 100 000 ₽")


@pytest.mark.parametrize("text,km", [
    ("Li Auto L6, батарея 51 кВт·ч — до 300 км на чистом электричестве, цена 2 900 000", None),
    ("Солярис 2015, 2000 км назад было ТО, цена 790 000", None),
    ("Камри 2012, машина в 20 км от Казани, 1 100 000", None),
    ("Камри 2012, 180 тыс км, 1 100 000", 180_000),
    ("Пробег 95 000 км, Поло 2018", 95_000),
])
def test_mileage_traps(text, km):
    assert parse_post(text, D).mileage == km


@pytest.mark.parametrize("text", [
    "Ловите Е92 на полном приводе! Наш прайс 850.000 рубликов\n\nПродажа на 18:30",
    "Новый выкуп✅ Audi Q5 2012 год. Сейчас помоем и опубликуем фото. Цена будет до подготовки, дешевле 1.250.000₽",
])
def test_teaser_with_time(text):
    assert parse_post(text, D).teaser


def test_full_number_with_thousand_suffix_and_more_teasers():
    assert parse_post("Калину хэтчбек надо? 2007г. 55.000т 📲+79022150881", D).price == 55_000
    assert parse_post("Приора 2010, цена 250т", D).price == 250_000
    assert parse_post("Еще одна позиция скоро поступит в продажу KIA CEED 2019г. 1 530 000", D).teaser
    assert parse_post("Через пару дней поступит в продажу еще одна позиция FORD FOCUS 2015г. 1.6", D).teaser


@pytest.mark.parametrize("text", [
    "Добрый вечер✌️отсняли небольшой обзор на Nissan Teana J32 2011г. Если остались вопросы, пишите в комментариях! Обзор на BMW 3 делаем? 🔥",
    "Tesla представила Cybercab: без руля и педалей. Серийное производство запущено, первый экземпляр сошёл с конвейера. Цена — около 2 200 000 ₽",
    "Россияне приобрели 24,4 тысячи новых автомобилей Toyota за первые два месяца 2026 года, средняя цена 2 900 000 ₽",
    "⛔️ПРОДАН⛔️\n\n🚘 KIA CERATO, 2009 за 301 777 ₽",
    "ПРОДАН #Hyundai #Solaris 2016 г. 1,4 АТ, пробег 116 т. км, цена 750 000 ₽",
    "Автомобиль продан 💵❌❌❌ 🚘 Lada Kalina (2005 г.) — отличная рабочая лошадка, 150 000 ₽",
    "Завтра ожидайте гранту 2012 года, эур, газ. По цене будет до 165.000₽!!!",
    "В течении часа будет двенашка за 40.000₽",
])
def test_not_a_sale(text):
    from parse import sale_verdict
    L = parse_post(text, D)
    assert sale_verdict(text, L) in ("not_sale", "check_not_sale")


@pytest.mark.parametrize("text", [
    "Toyota Camry 2014, 980 000 ₽, Москва",
    "Kia Cerato 🖤 💰 329.000₽ 🤙🏻 звони +7(904)353-00-00 2005 год ✅ Двигатель 1.6 Автомат. Автокредит без первого взноса!",
    "Audi A7 3.0 diesel, 3 собственника, 2014 год\n🎁Цена: 1560,000🎁\n89777920000 Александр\nВыкупим Ваш авто по хорошей цене: @perekup16",
    "#Mitsubishi #Colt хорошее авто для начинающих водителей\n1997 г.\n\nЦена для подписчиков 130.000₽\n\n#с_пробегом #купитьавто #продажаавто",
    "🚗 Nissan Tiida · 2011\nПробег: 110 000 км\nПродаю автомобиль, резина нордман (шипы 90%)\n💰 Цена: 700 000 ₽",
    "Реализуется на торгах по банкротству:\n\n🚘 Kaiyi E5 2023\n\nVIN: XUUJA2G2XP0010775\n\nНачальная цена 220.000",
])
def test_is_a_sale(text):
    from parse import sale_verdict
    L = parse_post(text, D)
    assert sale_verdict(text, L) in ("sale", "check_sale"), sale_verdict(text, L)
