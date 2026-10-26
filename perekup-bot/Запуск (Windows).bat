@echo off
rem Файл в кодировке CP866: так русский текст виден в консоли на русской Windows.
rem Двойной клик - и бот запускается. Python ставить не нужно: при первом запуске всё нужное
rem скачается в папку tools рядом с ботом (около 100 МБ, пара минут). Ничего не устанавливается в систему.
cd /d "%~dp0"
title Perekhvat
set "UV_PYTHON_INSTALL_DIR=%~dp0tools\python"
set "UV_CACHE_DIR=%~dp0tools\cache"
if not exist "tools\uv.exe" (
    echo Первый запуск: скачиваю всё нужное ^(пара минут^)...
    powershell -NoProfile -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; $env:UV_INSTALL_DIR='%~dp0tools'; $env:UV_NO_MODIFY_PATH='1'; irm https://astral.sh/uv/install.ps1 | iex" >nul
    if not exist "tools\uv.exe" goto fail
)
if not exist "venv\Scripts\python.exe" (
    tools\uv.exe venv venv --python 3.12 --python-preference only-managed -q
    if errorlevel 1 goto fail
)
tools\uv.exe pip install -q -p venv\Scripts\python.exe -r requirements.txt
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
    venv\Scripts\python.exe -m bot login
    if errorlevel 1 goto fail
)
echo.
echo Запускаю бота. Чтобы остановить - закройте это окно.
venv\Scripts\python.exe -m bot
pause
exit /b 0

:fail
echo Что-то пошло не так - сообщение об ошибке выше. Проверьте интернет и запустите файл снова.
pause
exit /b 1
