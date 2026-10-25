@echo off
rem Файл в кодировке CP866: так русский текст виден в консоли любой русской Windows, включая 7.
cd /d "%~dp0"
title Kwork-bot
python --version >nul 2>nul
if errorlevel 1 goto nopython
python -c "import sys; sys.exit(0 if sys.version_info >= (3, 10) else 1)"
if errorlevel 1 goto oldpython
echo Проверяю и ставлю нужные библиотеки (первый раз - пара минут)...
python -m pip install -q --disable-pip-version-check -r requirements.txt || python -m pip install -q --user --disable-pip-version-check -r requirements.txt
python -m kwork_bot %*
pause
exit /b 0

:nopython
echo Не найден Python.
echo Установите его с https://www.python.org/downloads/
echo При установке поставьте галочку "Add python.exe to PATH" и запустите этот файл снова.
echo Нужна Windows 10 или 11: на Windows 7 и 8 новые версии Python не работают.
pause
exit /b 1

:oldpython
echo Нужен Python 3.10 или новее, а у вас:
python --version
echo Новые версии Python работают только на Windows 10 и 11.
pause
exit /b 1
