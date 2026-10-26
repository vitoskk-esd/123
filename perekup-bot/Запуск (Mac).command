#!/bin/bash
# Двойной клик — и бот запускается. Первый раз: поставит библиотеки, откроет .env для настроек,
# попросит войти в служебный аккаунт Telegram. Дальше — сразу запуск.
cd "$(dirname "$0")"
pause() { read -p "Нажмите Enter, чтобы закрыть"; }
if ! command -v python3 >/dev/null 2>&1 || ! python3 -c "import sys; sys.exit(0 if sys.version_info >= (3, 10) else 1)"; then
    echo "Нужен Python 3.10 или новее. Установите его с https://www.python.org/downloads/ и запустите этот файл снова."
    pause; exit 1
fi
if [ ! -d venv ]; then
    echo "Первый запуск: готовлю окружение..."
    python3 -m venv venv || { echo "Не получилось создать окружение Python."; pause; exit 1; }
fi
echo "Проверяю и ставлю нужные библиотеки (первый раз — пара минут)..."
venv/bin/python -m pip install -q --disable-pip-version-check -r requirements.txt || { echo "Не поставились библиотеки — проверьте интернет."; pause; exit 1; }
if [ ! -f .env ]; then
    cp .env.example .env
    echo
    echo "Создал файл настроек .env и открываю его. Впишите туда BOT_TOKEN, TG_API_ID и TG_API_HASH,"
    echo "сохраните (Cmd+S) и запустите этот файл снова."
    open -e .env
    pause; exit 0
fi
if [ ! -f sessions/main.session ]; then
    echo
    echo "Вход в служебный аккаунт Telegram (один раз)."
    echo "Введите номер телефона этого аккаунта в формате +79991234567, потом код, который придёт в Telegram."
    venv/bin/python -m bot login || { pause; exit 1; }
fi
echo
echo "Запускаю бота. Чтобы остановить — закройте это окно или нажмите Ctrl+C."
venv/bin/python -m bot
pause
