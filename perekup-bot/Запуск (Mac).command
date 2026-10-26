#!/bin/bash
# Двойной клик — и бот запускается. Python ставить не нужно: при первом запуске всё нужное
# скачается в папку tools рядом с ботом (около 100 МБ, пара минут). Ничего не устанавливается в систему.
cd "$(dirname "$0")"
pause() { read -p "Нажмите Enter, чтобы закрыть"; }
export UV_PYTHON_INSTALL_DIR="$PWD/tools/python" UV_CACHE_DIR="$PWD/tools/cache"
if [ ! -x tools/uv ]; then
    echo "Первый запуск: скачиваю всё нужное (пара минут)..."
    curl -LsSf https://astral.sh/uv/install.sh | env UV_INSTALL_DIR="$PWD/tools" UV_NO_MODIFY_PATH=1 sh >/dev/null \
        || { echo "Не получилось скачать — проверьте интернет и запустите файл снова."; pause; exit 1; }
fi
if [ ! -x venv/bin/python ]; then
    tools/uv venv venv --python 3.12 --python-preference only-managed -q \
        || { echo "Не получилось скачать Python — проверьте интернет и запустите файл снова."; rm -rf venv; pause; exit 1; }
fi
tools/uv pip install -q -p venv/bin/python -r requirements.txt \
    || { echo "Не поставились библиотеки — проверьте интернет и запустите файл снова."; pause; exit 1; }
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
