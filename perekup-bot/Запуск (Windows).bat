@echo off
rem Файл в кодировке CP866: так русский текст виден в консоли на русской Windows.
rem Двойной клик - и бот запускается. Первый раз: поставит библиотеки, откроет .env для настроек,
rem попросит войти в служебный аккаунт Telegram. Дальше - сразу запуск.
cd /d "%~dp0"
title Perekhvat
python --version >nul 2>nul
if errorlevel 1 goto nopython
python -c "import sys; sys.exit(0 if sys.version_info >= (3, 10) else 1)"
if errorlevel 1 goto nopython
if not exist venv (
    echo Первый запуск: готовлю окружение...
    python -m venv venv
    if errorlevel 1 goto fail
)
echo Проверяю и ставлю нужные библиотеки (первый раз - пара минут)...
venv\Scripts\python -m pip install -q --disable-pip-version-check -r requirements.txt
if errorlevel 1 goto fail
if not exist .env (
    copy .env.example .env >nul
    echo.
    echo Создал файл настроек .env и открываю его. Впишите туда BOT_TOKEN, TG_API_ID и TG_API_HASH,
    echo сохраните ^(Ctrl+S^) и запустите этот файл снова.
    start notepad .env
    pause
    exit /b 0
)
if not exist "sessions\main.session" (
    echo.
    echo Вход в служебный аккаунт Telegram ^(один раз^).
    echo Введите номер телефона этого аккаунта в формате +79991234567, потом код, который придет в Telegram.
    venv\Scripts\python -m bot login
    if errorlevel 1 goto fail
)
echo.
echo Запускаю бота. Чтобы остановить - закройте это окно.
venv\Scripts\python -m bot
pause
exit /b 0

:nopython
echo Нужен Python 3.10 или новее.
echo Установите его с https://www.python.org/downloads/
echo При установке поставьте галочку "Add python.exe to PATH" и запустите этот файл снова.
pause
exit /b 1

:fail
echo Что-то пошло не так - сообщение об ошибке выше. Проверьте интернет и запустите файл снова.
pause
exit /b 1
