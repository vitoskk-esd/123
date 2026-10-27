"""ИИ-проверка: Google перегружен (503) — сразу спрашиваем запасную модель; другие ошибки — работаем на правилах."""
import urllib.error
from pathlib import Path

import ai
from words import load_dictionary

D = load_dictionary(Path(__file__).resolve().parents[1] / "cars.yaml")


def busy(code):
    return urllib.error.HTTPError("u", code, "Service Unavailable", {}, None)


async def test_busy_model_falls_back(monkeypatch):
    calls = []

    def fake_post(key, model, body):
        calls.append(model)
        if model == "main":
            raise busy(503)
        return {"is_car_sale": True}

    monkeypatch.setattr(ai, "_post", fake_post)
    assert await ai.ask(D, "Камри 2012, 900к", "", "main") == {"is_car_sale": True}
    assert calls == ["main", ai.FALLBACK]


async def test_other_errors_give_up(monkeypatch):
    calls = []

    def fake_post(key, model, body):
        calls.append(model)
        raise busy(400)                 # неверный запрос — запасная модель не поможет

    monkeypatch.setattr(ai, "_post", fake_post)
    assert await ai.ask(D, "Камри 2012, 900к", "", "main") is None
    assert calls == ["main"]
