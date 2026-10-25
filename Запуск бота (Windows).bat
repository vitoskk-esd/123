@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Kwork-бот
where python >nul 2>nul
if errorlevel 1 (
    echo Не найден Python. Установите его с https://www.python.org/downloads/
    echo При установке поставьте галочку "Add python.exe to PATH", затем запустите этот файл снова.
    pause
    exit /b 1
)
echo Проверяю и ставлю нужные библиотеки (первый раз — пара минут)...
python -m pip install -q --disable-pip-version-check -r requirements.txt || python -m pip install -q --user --disable-pip-version-check -r requirements.txt
python -m kwork_bot %*
pause
