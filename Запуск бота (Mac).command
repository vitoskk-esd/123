#!/bin/bash
cd "$(dirname "$0")"
if ! command -v python3 >/dev/null 2>&1; then
    echo "Не найден Python. Установите его с https://www.python.org/downloads/ и запустите этот файл снова."
    read -p "Нажмите Enter, чтобы закрыть"
    exit 1
fi
echo "Проверяю и ставлю нужные библиотеки (первый раз — пара минут)..."
python3 -m pip install -q --disable-pip-version-check -r requirements.txt \
    || python3 -m pip install -q --user --disable-pip-version-check -r requirements.txt
python3 -m kwork_bot "$@"
read -p "Нажмите Enter, чтобы закрыть"
